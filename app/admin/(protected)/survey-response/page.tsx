'use client'
import { useEffect, useState, useCallback } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Trash2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '@/components/admin/data-table'
import { SurveyResponseViewDialog } from '@/components/admin/survey-responses/view-dialog'
import { SurveyResponseDeleteDialog } from '@/components/admin/survey-responses/delete-dialog'
import { SortingState } from '@tanstack/react-table'

interface SurveyResponse {
  id: number
  name: string | null
  service: string[]
  ease_of_booking: number
  communication: number
  studio_cleanliness: number
  staff_professionalism: number
  comfort_during_shoot: number
  quality_of_work: number
  editing_style: number
  timeliness_of_delivery: number
  overall_satisfaction: number
  would_recommend: 'Yes' | 'Maybe' | 'No'
  additional_comments: string | null
  created_at: string
  updated_at: string
}

const AdminSurveyResponses = () => {
  const [data, setData] = useState<SurveyResponse[]>([])
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SurveyResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [recommendFilter, setRecommendFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [totalPages, setTotalPages] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const [statistics, setStatistics] = useState<any>(null)

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken')
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      query.append('page', (pageIndex + 1).toString())
      query.append('perPage', pageSize.toString())
      if (search) query.append('search', search)
      if (recommendFilter) query.append('would_recommend', recommendFilter)
      query.append('sortBy', sortBy)
      query.append('sortOrder', sortOrder)

      console.log('Fetching from:', `/api/survey-form?${query.toString()}`)

      const res = await fetch(`/api/survey-form?${query.toString()}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      })

      console.log('Response status:', res.status)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
      }

      const json = await res.json()
      console.log('Response data:', json)
      
      const surveys = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []
      setData(surveys)
      setTotalPages(json.last_page ?? 1)
    } catch (err) {
      console.error('Fetch error:', err)
      toast.error('Error', { 
        description: err instanceof Error ? err.message : 'Failed to fetch survey responses',
        position: 'top-right'
      })
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize, search, recommendFilter, sortBy, sortOrder])

  const fetchStatistics = useCallback(async () => {
    try {
      const res = await fetch('/api/survey-form/statistics', {
        credentials: 'include',
        headers: getAuthHeaders(),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch statistics')
      }

      const json = await res.json()
      setStatistics(json.data || json)
    } catch (err) {
      console.error('Statistics fetch error:', err)
    }
  }, [])

  useEffect(() => {
    fetchData()
    fetchStatistics()
  }, [fetchData, fetchStatistics])

  useEffect(() => {
    if (!sorting.length) return
    setSortBy(sorting[0].id)
    setSortOrder(sorting[0].desc ? 'desc' : 'asc')
  }, [sorting])

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)

      console.log('Deleting survey response:', selectedItem.id)

      const res = await fetch(`/api/survey-form/${selectedItem.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders(),
      })

      console.log('Delete response status:', res.status)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        toast.error('Error', { 
          description: errorData.message || 'Something went wrong',
          position: 'top-right'
        })
        return
      }

      setData(data.filter((item) => item.id !== selectedItem.id))
      setIsDeleteOpen(false)
      setSelectedItem(null)

      toast.success('Success', { 
        description: 'Survey response deleted successfully.',
        position: 'top-right'
      })

      // Refresh statistics
      fetchStatistics()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Error', { 
        description: 'Failed to delete survey response.',
        position: 'top-right'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      setLoading(true)
      
      const res = await fetch('/api/survey-form/export', {
        credentials: 'include',
        headers: getAuthHeaders(),
      })

      if (!res.ok) {
        throw new Error('Failed to export data')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Success', { 
        description: 'Survey responses exported successfully.',
        position: 'top-right'
      })
    } catch (err) {
      console.error('Export error:', err)
      toast.error('Error', { 
        description: 'Failed to export survey responses.',
        position: 'top-right'
      })
    } finally {
      setLoading(false)
    }
  }

  const getAverageRating = (response: SurveyResponse) => {
    const ratings = [
      response.ease_of_booking,
      response.communication,
      response.studio_cleanliness,
      response.staff_professionalism,
      response.comfort_during_shoot,
      response.quality_of_work,
      response.editing_style,
      response.timeliness_of_delivery,
    ]
    const sum = ratings.reduce((acc, rating) => acc + rating, 0)
    return (sum / ratings.length).toFixed(1)
  }

  const columns: ColumnDef<SurveyResponse>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name || <span className="text-muted-foreground italic">Anonymous</span>}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'service',
      header: 'Services',
      cell: ({ row }) => {
        const services = row.original.service || []
        return (
          <div className="flex flex-wrap gap-1">
            {services.length > 0 ? (
              services.slice(0, 2).map((service, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">N/A</span>
            )}
            {services.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{services.length - 2}
              </Badge>
            )}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'overall_satisfaction',
      header: 'Overall',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="font-semibold">{row.original.overall_satisfaction}</span>
          <span className="text-muted-foreground text-sm">/5</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'average_rating',
      header: 'Avg Rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="font-semibold">{getAverageRating(row.original)}</span>
          <span className="text-muted-foreground text-sm">/5</span>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'would_recommend',
      header: 'Recommend',
      cell: ({ row }) => {
        const recommend = row.original.would_recommend
        return (
          <Badge
            className={
              recommend === 'Yes'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : recommend === 'Maybe'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
            }
          >
            {recommend}
          </Badge>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'created_at',
      header: 'Submitted',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString()}
        </div>
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
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original)
                setIsViewOpen(true)
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-accent sm:text-3xl font-serif font-bold">Survey Responses</h1>
          <p className="text-muted-foreground mt-1">View and manage client satisfaction surveys.</p>
        </div>
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="w-full sm:w-auto"
          disabled={loading || data.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Responses</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {statistics.total_responses || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Satisfaction</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {statistics.average_overall_satisfaction?.toFixed(1) || '0.0'}/5
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Would Recommend</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">
              {statistics.recommendation_stats?.Yes || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Maybe/No</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">
              {(statistics.recommendation_stats?.Maybe || 0) + (statistics.recommendation_stats?.No || 0)}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={recommendFilter}
          onChange={(e) => setRecommendFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Recommendations</option>
          <option value="Yes">Yes</option>
          <option value="Maybe">Maybe</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="flex w-full flex-col gap-6">
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
          searchFields={[]}
          searchPlaceholder="Search by name..."
          search={search}
          onSearchChange={setSearch}
          onSortingChange={setSorting}
        />
      </div>

      <SurveyResponseViewDialog open={isViewOpen} setOpen={setIsViewOpen} surveyResponse={selectedItem} />
      <SurveyResponseDeleteDialog open={isDeleteOpen} setOpen={setIsDeleteOpen} onDelete={handleDelete} />
    </div>
  )
}

export default AdminSurveyResponses
