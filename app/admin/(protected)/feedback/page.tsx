// Place at: app/admin/feedback/page.tsx  (admin page, route: /admin/feedback)
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";

import { FeedbackFormDialog } from "@/components/admin/feedback/admin-add-edit-feedback";
import { FeedbackViewDialog } from "@/components/admin/feedback/admin-view-feedback";
import { FeedbackDeleteDialog } from "@/components/admin/feedback/admin-delete-feedback";
import { Feedback } from "@/lib/types/types";

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sorting, setSorting] = useState<SortingState>([]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        perPage: pageSize.toString(),
        search,
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/admin/feedback?${params.toString()}`);
      const json = await res.json();

      setFeedback(Array.isArray(json.data) ? json.data : []);
      setPageCount(json?.last_page ?? json?.data?.last_page ?? 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [pageIndex, search, sortBy, sortOrder, sorting]);

  const handleEdit = async (data: Feedback) => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/feedback/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to update feedback");
        return;
      }

      toast.success("Feedback updated");
      setIsEditOpen(false);
      setSelectedItem(null);
      fetchFeedback();
    } catch (err) {
      console.error(err);
      toast.error("Error updating feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/feedback/${selectedItem.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to delete feedback");
        return;
      }

      toast.success("Feedback deleted");
      setIsDeleteOpen(false);
      setSelectedItem(null);
      fetchFeedback();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting feedback");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "title", header: "Package" },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }: any) => {
        const rating = row.getValue("rating") || 0;
        return (
          <div className="flex space-x-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star
                key={i}
                fill="#facc15"
                className="w-4 h-4 text-yellow-400"
              />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "is_approved",
      header: "Status",
      cell: ({ row }: any) =>
        row.getValue("is_approved") ? (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Approved
          </span>
        ) : (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            Pending
          </span>
        ),
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }: any) => (
        <span
          className="block w-[300px] truncate"
          title={row.getValue("message")}
        >
          {row.getValue("message")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original);
                setIsViewOpen(true);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original);
                setIsEditOpen(true);
              }}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original);
                setIsDeleteOpen(true);
              }}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-accent text-2xl sm:text-3xl font-serif font-bold">
            Feedback
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer feedback.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={feedback}
        search={search}
        onSearchChange={setSearch}
        searchFields={["name", "title", "message"]}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onSortingChange={(newSorting: SortingState) => {
          setSorting(newSorting);

          if (newSorting.length > 0) {
            setSortBy(newSorting[0].id);
            setSortOrder(newSorting[0].desc ? "desc" : "asc");
          } else {
            setSortBy("");
            setSortOrder("asc");
          }
        }}
      />

      <FeedbackViewDialog
        open={isViewOpen}
        setOpen={setIsViewOpen}
        feedback={selectedItem}
      />

      <FeedbackFormDialog
        open={isEditOpen}
        setOpen={setIsEditOpen}
        initialData={selectedItem}
        onSubmit={handleEdit}
        loading={loading}
      />

      <FeedbackDeleteDialog
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
