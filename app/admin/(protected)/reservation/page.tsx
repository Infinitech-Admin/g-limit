"use client"
import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  ListIcon,
  X,
  Loader2,
  MapPin,
} from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/admin/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDisplayTime, formatMonthDayYear } from "@/lib/utils"
import { SortingState } from "@tanstack/react-table"

// Inline type definition
interface Reservation {
  id: number
  name: string
  email: string
  phone: string
  facebook?: string
  referred_by?: string | null
  preferred_date: string
  preferred_time: string
  package: string
  service_type: string[]
  shoot_type: string
  shoot_type_other?: string
  location?: string
  location_address?: string
  message?: string
  addons?: string[]
  addons_other?: string
  payment_method: string
  payment_proof: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  created_at: string
  updated_at: string
}

// ── Location helpers ────────────────────────────────────────────────────
const LOCATION_LABELS: Record<string, string> = {
  studio: "Studio",
  outdoor: "Outdoor",
  "clients-venue": "Client's Venue",
}

const formatLocation = (location?: string, locationAddress?: string): string => {
  if (!location) return "—"
  const label = LOCATION_LABELS[location] ?? location
  if ((location === "outdoor" || location === "clients-venue") && locationAddress) {
    return `${label} — ${locationAddress}`
  }
  return label
}

const AdminReservations = () => {
  const [data, setData] = useState<Reservation[]>([])
  const [selectedItem, setSelectedItem] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [totalPages, setTotalPages] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])

  // Dialog states
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Get API URL for images
  const API_IMG_URL = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

  const fetchData = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      query.append("page", (pageIndex + 1).toString())
      query.append("per_page", pageSize.toString())
      if (search) query.append("search", search)
      if (statusFilter) query.append("status", statusFilter)

      // Call Next.js API route instead of Laravel directly
      const res = await fetch(`/api/admin-reservations?${query.toString()}`)

      if (!res.ok) {
        throw new Error('Failed to fetch reservations')
      }

      const json = await res.json()

      if (json.success && json.data) {
        const reservations = json.data.data || json.data
        setData(Array.isArray(reservations) ? reservations : [])
        setTotalPages(json.data.last_page || 1)
      } else {
        setData([])
        setTotalPages(1)
      }
    } catch (err) {
      console.error('Error fetching reservations:', err)
      toast.error("Error", { description: "Failed to fetch reservations" })
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pageIndex, pageSize, search, sorting, statusFilter])

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)

      // Call Next.js API route
      const res = await fetch(`/api/admin-reservations?id=${selectedItem.id}`, {
        method: "DELETE",
      })

      const responseData = await res.json()

      if (!res.ok || !responseData.success) {
        toast.error("Error", {
          description: responseData.message || "Failed to delete reservation"
        })
        return
      }

      setData(data.filter((item) => item.id !== selectedItem.id))
      setIsDeleteOpen(false)
      setSelectedItem(null)
      await fetchData()

      toast.success("Success", { description: "Reservation deleted successfully." })
    } catch (err) {
      console.error(err)
      toast.error("Error", { description: "Failed to delete reservation." })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (reservationId: number, newStatus: string) => {
    try {
      setLoading(true)

      // Call Next.js API route with sendEmail flag
      const res = await fetch(`/api/admin-reservations?id=${reservationId}&status=${newStatus}&sendEmail=true`, {
        method: "PATCH",
      })

      const responseData = await res.json()

      if (!res.ok || !responseData.success) {
        toast.error("Error", { description: responseData.message || "Failed to update status" })
        return
      }

      // Check email status
      if (responseData.emailSent) {
        toast.success("Success", {
          description: "Status updated and email notification sent to customer"
        })
      } else {
        toast.success("Success", {
          description: "Status updated successfully (email notification failed)"
        })
      }

      await fetchData()
    } catch (err) {
      console.error(err)
      toast.error("Error", { description: "Failed to update status" })
    } finally {
      setLoading(false)
    }
  }

  const getServiceTypesDisplay = (serviceTypes: string[]) => {
    if (!serviceTypes || serviceTypes.length === 0) return 'N/A'
    return serviceTypes.join(', ')
  }

  const getPaymentProofUrl = (filename: string) => {
    return `${API_IMG_URL}/${filename}`
  }

  const columns: ColumnDef<Reservation>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true
    },
    {
      accessorKey: "phone",
      header: "Phone"
    },
    {
      accessorKey: "package",
      header: "Package",
      enableSorting: true,
      cell: ({ row }) => {
        const pkg = row.getValue("package") as string
        return pkg.charAt(0).toUpperCase() + pkg.slice(1)
      }
    },
    {
      accessorKey: "service_type",
      header: "Services",
      cell: ({ row }) => {
        const services = row.getValue("service_type") as string[]
        return (
          <div className="max-w-[200px] truncate" title={getServiceTypesDisplay(services)}>
            {getServiceTypesDisplay(services)}
          </div>
        )
      },
    },
    {
      accessorKey: "shoot_type",
      header: "Shoot Type",
      cell: ({ row }) => {
        const shootType = row.getValue("shoot_type") as string
        const shootTypeOther = row.original.shoot_type_other
        return shootType === 'other' && shootTypeOther
          ? shootTypeOther
          : shootType.charAt(0).toUpperCase() + shootType.slice(1)
      },
    },
    // ── NEW: Location column ────────────────────────────────────────────
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const loc = row.original.location
        const addr = row.original.location_address
        if (!loc) return <span className="text-muted-foreground text-xs">—</span>
        return (
          <div className="flex items-center gap-1.5 max-w-[180px]">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate text-sm" title={formatLocation(loc, addr)}>
              {formatLocation(loc, addr)}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "preferred_date",
      header: "Date",
      enableSorting: true,
      cell: ({ row }) => {
        const value = row.getValue("preferred_date") as string
        return value ? formatMonthDayYear(value) : ""
      },
    },
    {
      accessorKey: "preferred_time",
      header: "Time",
      cell: ({ row }) => {
        const value = row.getValue("preferred_time") as string
        return value ? formatDisplayTime(value) : ""
      },
    },
    {
      accessorKey: "payment_method",
      header: "Payment",
      cell: ({ row }) => {
        const method = row.getValue("payment_method") as string
        return method ? method.toUpperCase() : "N/A"
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === "confirmed"
              ? "bg-green-100 text-green-800 border border-green-200"
              : row.original.status === "completed"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : row.original.status === "cancelled"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
          }
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original)
                setIsViewOpen(true)
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {row.original.status === "pending" && (
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row.original.id, "confirmed")}
              >
                Confirm Reservation
              </DropdownMenuItem>
            )}
            {row.original.status === "confirmed" && (
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row.original.id, "completed")}
              >
                Mark as Completed
              </DropdownMenuItem>
            )}
            {row.original.status !== "cancelled" && (
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row.original.id, "cancelled")}
              >
                Cancel Reservation
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original)
                setIsDeleteOpen(true)
              }}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
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
          <h1 className="text-2xl text-accent sm:text-3xl font-serif font-bold">
            Reservations
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage studio reservations and appointments.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Data Table */}
      <div className="relative">
        <DataTable
          columns={columns}
          data={data}
          pageCount={totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={(pi, ps) => {
            setPageIndex(pi)
            setPageSize(ps)
          }}
          searchFields={["name" as keyof Reservation, "email" as keyof Reservation]}
          searchPlaceholder="Search by name or email..."
          search={search}
          onSearchChange={setSearch}
          onSortingChange={setSorting}
        />
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[#e0dbd2] rounded-md shadow-lg">
              <Loader2 className="w-5 h-5 animate-spin text-[#a07c2e]" />
              <span className="text-sm text-[#5c5044] font-medium">Loading reservations...</span>
            </div>
          </div>
        )}
      </div>

    {/* View Dialog */}
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent className="text-gray-500 w-full max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border border-[#e0dbd2] bg-white">
        {/* Gold accent line top */}
        <div className="h-[3px] bg-gradient-to-r from-transparent via-[#c9a84c] via-[#e8c96a] via-[#c9a84c] to-transparent" />

        {selectedItem && (
          <div className="bg-white">
            {/* HEADER */}
            <DialogHeader className="px-8 pt-8 pb-6 border-b border-[#e0dbd2]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {/* Brand pill */}
                  <div className="inline-flex items-center px-3 py-1.5 bg-[rgba(201,168,76,0.08)] border border-[#c9a84c] rounded mb-4">
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#a07c2e]">
                      G-LIMIT STUDIO
                    </span>
                  </div>
                  <DialogTitle className="text-2xl font-normal text-[#1a1612] tracking-wide">
                    Reservation Details
                  </DialogTitle>
                  <DialogDescription className="text-sm text-[#7a6e5e] mt-2">
                    Reference: #{selectedItem.id?.toString().padStart(6, '0') || '000000'}
                  </DialogDescription>
                </div>

                <span
                  className={`
                    shrink-0 text-[11px] font-medium uppercase tracking-[0.15em] px-4 py-2 border rounded-sm
                    ${selectedItem.status === "confirmed"
                      ? "bg-[#edfaf4] text-[#1a7a4a] border-[#7ed9ae]"
                      : selectedItem.status === "completed"
                        ? "bg-[#eff6ff] text-[#1d4ed8] border-[#93c5fd]"
                        : selectedItem.status === "cancelled"
                          ? "bg-[#fef2f2] text-[#b91c1c] border-[#fca5a5]"
                          : "bg-[#fffbeb] text-[#a07c2e] border-[#c9a84c]"}
                  `}
                >
                  {selectedItem.status}
                </span>
              </div>
            </DialogHeader>

            {/* BODY */}
            <div className="px-8 py-8 bg-[#faf9f6]">
              {/* CLIENT SECTION - Full Width */}
              <div className="mb-6 bg-white border border-[#e0dbd2] rounded-sm shadow-sm">
                <div className="px-6 py-4 border-b border-[#e0dbd2] bg-[#faf9f6]">
                  <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#a07c2e]">
                    Client Information
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-sm bg-gradient-to-br from-[#c9a84c] to-[#a07c2e] flex items-center justify-center text-lg font-medium text-white shrink-0">
                      {selectedItem.name
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e] mb-1">Name</p>
                        <p className="text-base font-medium text-[#1a1612]">{selectedItem.name}</p>
                        {selectedItem.referred_by && (
                          <p className="text-xs text-[#b4a898] mt-1">
                            Referred by: {selectedItem.referred_by}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e] mb-1">Email</p>
                        <p className="text-sm text-[#1a1612] break-all">{selectedItem.email}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e] mb-1">Phone</p>
                        <p className="text-sm text-[#1a1612]">{selectedItem.phone}</p>
                        {selectedItem.facebook && (
                          <p className="text-xs text-[#9c8e7e] mt-1">FB: {selectedItem.facebook}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Column Grid for Service, Schedule, Payment */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                {/* SERVICE */}
                <div className="bg-white border border-[#e0dbd2] rounded-sm shadow-sm">
                  <div className="px-5 py-3 border-b border-[#e0dbd2] bg-[#faf9f6]">
                    <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#a07c2e]">
                      Service
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e] mb-1">Package</p>
                      <p className="text-sm font-medium text-[#1a1612] capitalize">{selectedItem.package?.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e] mb-1">Shoot Type</p>
                      <p className="text-sm text-[#1a1612] capitalize">
                        {selectedItem.shoot_type === "other" && selectedItem.shoot_type_other
                          ? selectedItem.shoot_type_other
                          : selectedItem.shoot_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e] mb-1">Services</p>
                      <p className="text-sm text-[#1a1612]">{getServiceTypesDisplay(selectedItem.service_type)}</p>
                    </div>
                  </div>
                </div>

                {/* SCHEDULE */}
                <div className="bg-white border border-[#e0dbd2] rounded-sm shadow-sm">
                  <div className="px-5 py-3 border-b border-[#e0dbd2] bg-[#faf9f6]">
                    <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#a07c2e]">
                      Schedule & Location
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-[rgba(201,168,76,0.15)] flex items-center justify-center">
                        <span className="text-[#a07c2e] text-xs">📅</span>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e]">Date</p>
                        <p className="text-sm font-medium text-[#a07c2e]">{formatMonthDayYear(selectedItem.preferred_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-[rgba(201,168,76,0.15)] flex items-center justify-center">
                        <span className="text-[#a07c2e] text-xs">🕐</span>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e]">Time</p>
                        <p className="text-sm font-medium text-[#a07c2e]">{formatDisplayTime(selectedItem.preferred_time)}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#e0dbd2]">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e] mb-1">Location</p>
                      <p className="text-sm text-[#1a1612]">
                        {LOCATION_LABELS[selectedItem.location ?? ""] ?? "—"}
                      </p>
                      {selectedItem.location_address && (
                        <p className="text-xs text-[#7a6e5e] mt-1 break-words">{selectedItem.location_address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* PAYMENT */}
                <div className="bg-white border border-[#e0dbd2] rounded-sm shadow-sm">
                  <div className="px-5 py-3 border-b border-[#e0dbd2] bg-[#faf9f6]">
                    <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#a07c2e]">
                      Payment
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e] mb-1">Method</p>
                      <p className="text-lg font-medium text-[#1a1612] uppercase tracking-wider">{selectedItem.payment_method}</p>
                    </div>
                    {selectedItem.payment_proof && (
                      <div className="mt-4">
                        <p className="text-[11px] uppercase tracking-[0.1em] text-[#9c8e7e] mb-2">Proof of Payment</p>
                        <a
                          href={getPaymentProofUrl(selectedItem.payment_proof)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative group"
                        >
                          <img
                            src={getPaymentProofUrl(selectedItem.payment_proof)}
                            alt="Payment proof"
                            className="w-full h-32 object-cover rounded-sm border border-[#e0dbd2] group-hover:border-[#c9a84c] transition-colors"
                          />
                          <div className="absolute inset-0 bg-[rgba(26,22,18,0.5)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                            <span className="text-white text-sm">Click to view full size</span>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ADD-ONS */}
              {selectedItem.addons && selectedItem.addons.length > 0 && (
                <div className="mb-6 bg-white border border-[#e0dbd2] rounded-sm shadow-sm">
                  <div className="px-5 py-3 border-b border-[#e0dbd2] bg-[#faf9f6]">
                    <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#a07c2e]">
                      Selected Add-ons
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.addons.map((addon) => (
                        <span
                          key={addon}
                          className="px-3 py-1.5 bg-[rgba(201,168,76,0.1)] border border-[#c9a84c] rounded-sm text-xs text-[#a07c2e] uppercase tracking-wider"
                        >
                          {addon.replace(/-/g, ' ')}
                        </span>
                      ))}
                      {selectedItem.addons_other && (
                        <span className="px-3 py-1.5 bg-[#f5f3ef] border border-[#e0dbd2] rounded-sm text-xs text-[#7a6e5e]">
                          Other: {selectedItem.addons_other}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MESSAGE */}
              {selectedItem.message && (
                <div className="bg-[rgba(201,168,76,0.08)] border-l-[3px] border-[#c9a84c] rounded-r-sm p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#a07c2e] mb-2">
                    Additional Requests
                  </p>
                  <p className="text-sm text-[#5c5044] leading-relaxed italic">
                    &ldquo;{selectedItem.message}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gold accent line bottom */}
        <div className="h-[3px] bg-gradient-to-r from-transparent via-[#c9a84c] via-[#e8c96a] via-[#c9a84c] to-transparent" />
      </DialogContent>
    </Dialog>

    {/* Delete Dialog */}
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent className="bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Delete Reservation
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this reservation? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {selectedItem && (
          <div className="py-4 space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Name:</strong> {selectedItem.name}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Email:</strong> {selectedItem.email}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Date:</strong> {formatMonthDayYear(selectedItem.preferred_date)}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default AdminReservations
