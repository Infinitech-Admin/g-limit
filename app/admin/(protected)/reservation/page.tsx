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
  hmu_avail: boolean
  hmu_package: string
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
      accessorKey: "hmu_package",
      header: "HMU Package",
      cell: ({ row }) => row.original.hmu_package || <span className="text-muted-foreground text-xs">—</span>,
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
      <div className="flex gap-4">
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
      </div>

      {/* Data Table */}
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

      {/* View Dialog - Inline with Fixed Styling */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="w-full max-w-3xl lg:max-w-5xl max-h-[85vh] overflow-y-auto bg-white border border-gray-200 p-0">

          {/* HEADER */}
          <DialogHeader className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="text-lg font-medium text-gray-900">
                  Reservation details
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-400 mt-1">
                  View complete reservation information
                </DialogDescription>
              </div>

              {selectedItem && (
                <span
                  className={`
              mt-1 shrink-0 text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full border
              ${selectedItem.status === "confirmed"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : selectedItem.status === "completed"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : selectedItem.status === "cancelled"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"}
            `}
                >
                  {selectedItem.status}
                </span>
              )}
            </div>
          </DialogHeader>

          {/* BODY */}
          {selectedItem && (
            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* CLIENT */}
              <div className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-lg p-5">
                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-4">
                  Client
                </p>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-600 shrink-0">
                    {selectedItem.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedItem.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {selectedItem.referred_by
                          ? `Referred by: ${selectedItem.referred_by}`
                          : "No referral"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-300 mb-1">Email</p>
                      <p className="text-sm text-gray-900 break-words">
                        {selectedItem.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-300 mb-1">Phone</p>
                      <p className="text-sm text-gray-900">
                        {selectedItem.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SERVICE */}
              <div className="bg-white border border-gray-100 rounded-lg p-5">
                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-4">
                  Service
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Package", value: selectedItem.package },
                    {
                      label: "Shoot type",
                      value:
                        selectedItem.shoot_type === "other" &&
                          selectedItem.shoot_type_other
                          ? selectedItem.shoot_type_other
                          : selectedItem.shoot_type,
                    },
                    {
                      label: "Services",
                      value: getServiceTypesDisplay(selectedItem.service_type),
                    },
                    { label: "HMU package", value: selectedItem.hmu_package },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className="text-sm font-medium text-gray-900 text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SCHEDULE */}
              <div className="bg-white border border-gray-100 rounded-lg p-5">
                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-4">
                  Schedule & location
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Date</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatMonthDayYear(selectedItem.preferred_date)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Time</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDisplayTime(selectedItem.preferred_time)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Location</span>
                      <span className="text-sm font-medium text-gray-900">
                        {LOCATION_LABELS[selectedItem.location ?? ""] ?? "—"}
                      </span>
                    </div>

                    {selectedItem.location_address && (
                      <p className="text-sm text-gray-900 mt-2 break-words">
                        {selectedItem.location_address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="bg-white border border-gray-100 rounded-lg p-5">
                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-4">
                  Payment
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Method</span>
                    <span className="text-sm font-medium text-gray-900 uppercase">
                      {selectedItem.payment_method}
                    </span>
                  </div>

                  {selectedItem.payment_proof && (
                    <img
                      src={getPaymentProofUrl(selectedItem.payment_proof)}
                      alt="Payment proof"
                      className="rounded border border-gray-200 mt-2"
                    />
                  )}
                </div>
              </div>

              {/* MESSAGE */}
              {selectedItem.message && (
                <div className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-lg p-5">
                  <p className="text-[11px] font-medium uppercase tracking-widest text-gray-300 mb-2">
                    Additional requests
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed break-words">
                    {selectedItem.message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FOOTER */}
          <DialogFooter className="border-t border-gray-100 px-6 py-4">
            <Button
              variant="outline"
              className="text-sm border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsViewOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog - Inline */}
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
