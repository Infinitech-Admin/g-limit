'use client'
import { useEffect, useState, useCallback } from 'react'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Trash2, Eye, Upload, ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '@/components/admin/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Ambassador {
  id: number
  name: string
  image_paths: string[]   // now an array
  created_at: string
  updated_at: string
}

interface PreviewFile {
  file: File
  previewUrl: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

export default function AmbassadorsPage() {
  const [data, setData]                   = useState<Ambassador[]>([])
  const [isAddOpen, setIsAddOpen]         = useState(false)
  const [isDeleteOpen, setIsDeleteOpen]   = useState(false)
  const [isViewOpen, setIsViewOpen]       = useState(false)
  const [selectedItem, setSelectedItem]   = useState<Ambassador | null>(null)

  // Form state
  const [name, setName]                   = useState('')
  const [previewFiles, setPreviewFiles]   = useState<PreviewFile[]>([])

  const [loading, setLoading]             = useState(false)
  const [uploading, setUploading]         = useState(false)
  const [pageIndex, setPageIndex]         = useState(0)
  const [pageSize, setPageSize]           = useState(10)
  const [totalPages, setTotalPages]       = useState(1)
  const [search, setSearch]               = useState('')

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const clean = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${clean}`
  }

  const fetchAmbassadors = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page:    (pageIndex + 1).toString(),
        perPage: pageSize.toString(),
      })
      if (search.trim()) query.append('search', search.trim())

      const res = await fetch(`/api/ambassadors?${query.toString()}`, {
        headers: { 'Accept': 'application/json' },
      })
      if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`)

      const json = await res.json()
      setData(Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [])
      setTotalPages(json.last_page ?? 1)
    } catch (err) {
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to fetch ambassadors',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize, search])

  useEffect(() => { fetchAmbassadors() }, [fetchAmbassadors])

  // Cleanup all preview URLs on unmount
  useEffect(() => {
    return () => { previewFiles.forEach(pf => URL.revokeObjectURL(pf.previewUrl)) }
  }, [previewFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const newPreviews: PreviewFile[] = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setPreviewFiles(prev => [...prev, ...newPreviews])
    // Reset input so the same file can be re-added after removal
    e.target.value = ''
  }

  const removePreview = (index: number) => {
    setPreviewFiles(prev => {
      URL.revokeObjectURL(prev[index].previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const resetForm = () => {
    setName('')
    previewFiles.forEach(pf => URL.revokeObjectURL(pf.previewUrl))
    setPreviewFiles([])
  }

  const handleCreate = async () => {
    if (!name.trim())          { toast.error('Name is required');         return }
    if (!previewFiles.length)  { toast.error('Please select at least one image'); return }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      previewFiles.forEach(pf => formData.append('images[]', pf.file))

      const res = await fetch('/api/ambassadors', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || Object.values(err.errors ?? {}).flat().join(', '))
      }

      toast.success('Ambassador created successfully', { position: 'top-right' })
      resetForm()
      setIsAddOpen(false)
      await fetchAmbassadors()
    } catch (err) {
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to create ambassador',
        position: 'top-right',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    setLoading(true)
    try {
      const res = await fetch(`/api/ambassadors/${selectedItem.id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed')

      setData(prev => prev.filter(a => a.id !== selectedItem.id))
      setIsDeleteOpen(false)
      setSelectedItem(null)
      toast.success('Ambassador deleted successfully', { position: 'top-right' })
    } catch (err) {
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to delete ambassador',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnDef<Ambassador>[] = [
    {
      accessorKey: 'image_paths',
      header: 'Images',
      cell: ({ row }) => {
        const paths = (row.getValue('image_paths') as string[]) ?? []
        if (!paths.length) {
          return (
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-gray-400" />
            </div>
          )
        }
        return (
          <div className="flex gap-1 flex-wrap">
            {paths.slice(0, 3).map((path, i) => (
              <div key={i} className="relative w-12 h-12 rounded overflow-hidden border border-gray-200">
                <img
                  src={getImageUrl(path)}
                  alt={`${row.original.name} ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
                />
              </div>
            ))}
            {paths.length > 3 && (
              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 border border-gray-200">
                +{paths.length - 3}
              </div>
            )}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.getValue('name')}</span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.getValue('created_at') as string).toLocaleDateString()}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSelectedItem(row.original); setIsViewOpen(true) }}>
              <Eye className="w-4 h-4 mr-2" />View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => { setSelectedItem(row.original); setIsDeleteOpen(true) }}
            >
              <Trash2 className="w-4 h-4 mr-2" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-accent sm:text-3xl font-serif font-bold">Ambassadors</h1>
          <p className="text-muted-foreground mt-1">Manage studio ambassadors and their photos.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ambassador
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        pageCount={totalPages}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={(pi, ps) => { setPageIndex(pi); setPageSize(ps) }}
        searchFields={['name']}
        searchPlaceholder="Search ambassadors..."
        search={search}
        onSearchChange={setSearch}
        onSortingChange={() => {}}
      />

      {/* ── Create Dialog ── */}
      <Dialog open={isAddOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsAddOpen(open) }}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Add Ambassador</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter the ambassador's name and upload one or more photos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="amb-name" className="text-gray-700 font-medium">Name</Label>
              <Input
                id="amb-name"
                placeholder="e.g. Gherel Mae"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gold"
              />
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                Photos
                {previewFiles.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    {previewFiles.length} selected
                  </span>
                )}
              </Label>

              {/* Previews grid */}
              {previewFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previewFiles.map((pf, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200 aspect-square">
                      <img
                        src={pf.previewUrl}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(i)}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add more inline */}
                  <label
                    htmlFor="amb-image-input"
                    className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 hover:border-gold hover:bg-gold/5 transition-colors flex flex-col items-center justify-center aspect-square text-gray-400 hover:text-gold"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs mt-1">Add more</span>
                  </label>
                </div>
              )}

              {/* Initial drop zone — only shown when no files selected */}
              {previewFiles.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gold hover:bg-gold/5 transition-colors bg-white">
                  <label htmlFor="amb-image-input" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Click to select photos</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB each — multiple allowed</p>
                    </div>
                  </label>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="amb-image-input"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => { resetForm(); setIsAddOpen(false) }}
                disabled={uploading}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!name.trim() || !previewFiles.length || uploading}
                className="bg-gold hover:bg-gold/90 text-white font-medium disabled:opacity-50"
              >
                {uploading ? 'Saving...' : 'Add Ambassador'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Dialog ── */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Ambassador Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {/* Image gallery */}
              {(selectedItem.image_paths ?? []).length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedItem.image_paths.map((path, i) => (
                    <img
                      key={i}
                      src={getImageUrl(path)}
                      alt={`${selectedItem.name} ${i + 1}`}
                      className="w-full rounded-lg border border-gray-200 object-cover aspect-square"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Name</p>
                  <p className="font-semibold text-gray-900">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Created</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 font-medium mb-1">
                    Image Paths ({selectedItem.image_paths?.length ?? 0})
                  </p>
                  <div className="space-y-1">
                    {(selectedItem.image_paths ?? []).map((path, i) => (
                      <p key={i} className="font-mono text-xs text-gray-700 break-all bg-gray-50 p-2 rounded">
                        {path}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Delete Ambassador</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete <strong>{selectedItem?.name}</strong>? This will also remove all {selectedItem?.image_paths?.length ?? 0} photo(s). This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={loading}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
