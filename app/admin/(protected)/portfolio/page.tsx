"use client";

import React from "react"
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Plus, Upload, X, MoreHorizontal, Eye, Camera, Search, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  camera?: string;
  alt: string;
  image_path: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// One row in the table = one unique name/title
interface GroupedRow {
  title: string;
  category: string;
  camera?: string;
  coverImage: PortfolioItem;
  photos: PortfolioItem[];
  created_at: string;
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG;

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  portraits:  { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  weddings:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200" },
  events:     { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  family:     { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  products:   { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  default:    { bg: "bg-gold/10",   text: "text-gold",       border: "border-gold/30" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category?.toLowerCase()] ?? CATEGORY_COLORS.default;
}

export default function AdminPortfolio() {
  const { toast } = useToast();

  // Raw data from API (all photos, unpaginated for grouping)
  const [allData, setAllData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // For view: show all photos of a group
  const [selectedGroup, setSelectedGroup] = useState<GroupedRow | null>(null);
  // For delete: pick a specific photo within a group
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const [uploading, setUploading] = useState(false);

  // Pagination over grouped rows
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    camera: "",
    alt: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_IMG}/${cleanPath}`;
  };

  // ── Fetch categories ──────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await fetch(`/api/portfolio/categories`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const json = await response.json();
      // ✅ FIXED: reads json.data, not json directly
      const raw: unknown[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
      setCategories(raw.map((c) => typeof c === 'string' ? c : (c as { name: string }).name));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ── Fetch ALL photos (no pagination from server — we group client-side) ───
  // We fetch all so we can group by title and paginate the groups ourselves.
  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append('perPage', '9999'); // get all
      query.append('page', '1');
      if (search.trim()) query.append('search', search.trim());
      if (selectedCategories.length > 0) {
        selectedCategories.forEach((cat) => query.append('categories[]', cat));
      }
      const response = await fetch(`/api/portfolio?${query.toString()}`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      const portfolio: PortfolioItem[] = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
      setAllData(portfolio);
    } catch (err) {
      console.error('Fetch error:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to fetch portfolio items',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategories, toast]);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  // ── Group by title ────────────────────────────────────────────────────────
  const groupedRows: GroupedRow[] = useMemo(() => {
    const map = new Map<string, PortfolioItem[]>();
    for (const item of allData) {
      const key = item.title;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).map(([title, photos]) => ({
      title,
      category: photos[0].category,
      camera: photos[0].camera,
      coverImage: photos[0],
      photos,
      created_at: photos[0].created_at,
    }));
  }, [allData]);

  // ── Paginate grouped rows ─────────────────────────────────────────────────
  const totalGroups = groupedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalGroups / pageSize));
  const pagedRows = groupedRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalGroups);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setPageIndex(0);
  };

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast({ title: "Error", description: "Please enter a title", variant: "destructive" }); return; }
    if (!formData.category.trim()) { toast({ title: "Error", description: "Please enter a category", variant: "destructive" }); return; }
    if (!formData.alt.trim()) { toast({ title: "Error", description: "Please enter alt text", variant: "destructive" }); return; }
    if (!formData.image) { toast({ title: "Error", description: "Please select an image", variant: "destructive" }); return; }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("category", formData.category);
      fd.append("camera", formData.camera);
      fd.append("alt", formData.alt);
      fd.append("image", formData.image);

      const response = await fetch("/api/portfolio", { method: "POST", body: fd, credentials: 'include' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || "Failed to create portfolio item");
      }
      toast({ title: "Success", description: "Portfolio item created successfully" });
      handleRemoveImage();
      setFormData({ title: "", category: "", camera: "", alt: "", image: null });
      setIsAddOpen(false);
      await fetchCategories();
      await fetchPortfolio();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to create portfolio item", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/portfolio/${selectedItem.id}`, { method: "DELETE", credentials: 'include' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Delete failed');
      }
      setAllData((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setIsDeleteOpen(false);
      setSelectedItem(null);
      // Also close view if the group is now empty
      if (selectedGroup && selectedGroup.photos.length <= 1) setIsViewOpen(false);
      toast({ title: "Success", description: "Portfolio item deleted successfully" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete portfolio item", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-accent sm:text-3xl font-serif font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground mt-1">
            {totalGroups > 0
              ? `${totalGroups} ${totalGroups === 1 ? 'client' : 'clients'} · ${allData.length} photos total`
              : "Create and manage portfolio items"}
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, category, camera…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPageIndex(0); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPageIndex(0); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Filter by Category</p>
            {selectedCategories.length > 0 && (
              <button onClick={() => { setSelectedCategories([]); setPageIndex(0); }} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                Clear all
              </button>
            )}
          </div>
          {categoriesLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-7 w-20 rounded-full bg-muted animate-pulse" />)}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No categories found. Add a portfolio item first.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategories.includes(category);
                const style = getCategoryStyle(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={[
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border transition-all duration-150",
                      isActive
                        ? `${style.bg} ${style.text} ${style.border} shadow-sm`
                        : "bg-transparent text-muted-foreground border-border hover:border-gold hover:text-gold",
                    ].join(" ")}
                  >
                    {category}
                    {isActive && <X className="w-3 h-3 opacity-70" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm">

        {/* Table header */}
        <div className="grid grid-cols-[2.5rem_1fr_140px_110px_80px_100px_2.5rem] items-center gap-3 px-4 py-2.5 bg-muted/60 border-b border-border">
          <div />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client / Name</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Camera</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photos</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</span>
          <div />
        </div>

        {/* Rows */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        ) : pagedRows.length === 0 ? (
          <div className="py-16 text-center">
            <Camera className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No portfolio items found.</p>
            {(search || selectedCategories.length > 0) && (
              <button onClick={() => { setSearch(""); setSelectedCategories([]); }} className="mt-2 text-xs text-gold underline underline-offset-2">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {pagedRows.map((group) => {
              const style = getCategoryStyle(group.category);
              return (
                <div
                  key={group.title}
                  className="grid grid-cols-[2.5rem_1fr_140px_110px_80px_100px_2.5rem] items-center gap-3 px-4 py-2 hover:bg-muted/30 transition-colors group/row"
                >
                  {/* Cover thumbnail */}
                  <div className="relative w-9 h-9 rounded overflow-hidden bg-muted flex-shrink-0 border border-border">
                    <img
                      src={getImageUrl(group.coverImage.image_path)}
                      alt={group.coverImage.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                    />
                    {/* Stack indicator for multiple photos */}
                    {group.photos.length > 1 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Images className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate leading-tight">{group.title}</p>
                  </div>

                  {/* Category */}
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize border ${style.bg} ${style.text} ${style.border}`}>
                      {group.category}
                    </span>
                  </div>

                  {/* Camera */}
                  <p className="text-xs text-muted-foreground truncate">
                    {group.camera ?? <span className="opacity-40">—</span>}
                  </p>

                  {/* Photo count */}
                  <div>
                    {group.photos.length > 1 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs font-semibold text-muted-foreground border border-border">
                        <Images className="w-3 h-3" />
                        {group.photos.length}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">1</span>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {new Date(group.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </p>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-7 h-7 opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => { setSelectedGroup(group); setIsViewOpen(true); }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View {group.photos.length > 1 ? `(${group.photos.length})` : ""}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          // If multiple photos, open view first to pick which to delete
                          if (group.photos.length > 1) {
                            setSelectedGroup(group);
                            setIsViewOpen(true);
                          } else {
                            setSelectedItem(group.photos[0]);
                            setIsDeleteOpen(true);
                          }
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination footer ── */}
        {!loading && pagedRows.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              {startRow}–{endRow} of {totalGroups} clients
            </p>
            <div className="flex items-center gap-1">
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(0); }}
                className="text-xs border border-border rounded px-1.5 py-1 bg-background text-foreground mr-3 focus:outline-none focus:ring-1 focus:ring-gold/40"
              >
                {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
              </select>
              <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0}
                className="px-1.5 py-1 text-xs rounded border border-border disabled:opacity-30 hover:bg-muted transition-colors">«</button>
              <button onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={pageIndex === 0}
                className="p-1 rounded border border-border disabled:opacity-30 hover:bg-muted transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(0, Math.min(totalPages - 5, pageIndex - 2)) + i;
                return (
                  <button key={page} onClick={() => setPageIndex(page)}
                    className={`min-w-[28px] h-7 text-xs rounded border transition-colors ${page === pageIndex ? "bg-gold text-white border-gold font-semibold" : "border-border hover:bg-muted"}`}>
                    {page + 1}
                  </button>
                );
              })}
              <button onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))} disabled={pageIndex >= totalPages - 1}
                className="p-1 rounded border border-border disabled:opacity-30 hover:bg-muted transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex >= totalPages - 1}
                className="px-1.5 py-1 text-xs rounded border border-border disabled:opacity-30 hover:bg-muted transition-colors">»</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Dialog ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Add Portfolio Item</DialogTitle>
            <DialogDescription className="text-gray-600">Add a new portfolio item with image and details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Title / Client Name *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Abby"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900" />
              <p className="text-xs text-gray-400 mt-1">Use the same name to group multiple photos under one client.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Category *</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., Portraits"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Camera (Optional)</label>
              <input type="text" name="camera" value={formData.camera} onChange={handleInputChange} placeholder="e.g., Canon R5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Alt Text *</label>
              <input type="text" name="alt" value={formData.alt} onChange={handleInputChange} placeholder="Image description for accessibility"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-gray-900" />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gold hover:bg-gold/5 transition-colors bg-white">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="portfolio-image-input" />
              <label htmlFor="portfolio-image-input" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Click to select image</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </label>
            </div>
            {imagePreview && (
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-900">Preview:</p>
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button type="button" variant="outline"
                onClick={() => { setIsAddOpen(false); handleRemoveImage(); setFormData({ title: "", category: "", camera: "", alt: "", image: null }); }}
                disabled={uploading} className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
              <Button type="submit"
                disabled={uploading || !formData.image || !formData.title.trim() || !formData.category.trim() || !formData.alt.trim()}
                className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-white font-medium shadow-sm disabled:opacity-50">
                {uploading ? 'Creating...' : 'Create Item'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── View Dialog (shows all photos in a group) ── */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">
              {selectedGroup?.title}
              {selectedGroup && selectedGroup.photos.length > 1 && (
                <span className="ml-2 text-sm font-normal text-gray-400">· {selectedGroup.photos.length} photos</span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedGroup && (
            <div className="space-y-6">
              {/* Category + Camera info */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${getCategoryStyle(selectedGroup.category).bg} ${getCategoryStyle(selectedGroup.category).text} ${getCategoryStyle(selectedGroup.category).border}`}>
                  {selectedGroup.category}
                </span>
                {selectedGroup.camera && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> {selectedGroup.camera}
                  </span>
                )}
              </div>

              {/* Photo grid */}
              <div className={`grid gap-3 ${selectedGroup.photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {selectedGroup.photos.map((photo) => (
                  <div key={photo.id} className="relative group/photo rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={getImageUrl(photo.image_path)}
                      alt={photo.alt}
                      className="w-full aspect-square object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                    />
                    {/* Delete overlay per photo */}
                    <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover/photo:opacity-100">
                      <button
                        onClick={() => { setSelectedItem(photo); setIsDeleteOpen(true); }}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="px-2 py-1.5 border-t border-gray-100">
                      <p className="text-xs text-gray-500 truncate">{photo.alt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Delete Photo</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this photo from "{selectedItem?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="rounded-lg overflow-hidden border border-gray-200 my-2">
              <img src={getImageUrl(selectedItem.image_path)} alt={selectedItem.alt} className="w-full h-40 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
              {loading ? 'Deleting...' : 'Delete Photo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
