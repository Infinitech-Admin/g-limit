'use client'

import { useEffect, useState, useCallback } from 'react'
import React from "react"
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Trash2, Eye, Upload, Video, X } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '@/components/admin/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface BlogVideo {
  id: number
  title: string
  description?: string
  video_path: string
  created_at: string
  updated_at: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const IMG_URL = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

export default function BlogVideosPage() {
  const [data, setData] = useState<BlogVideo[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BlogVideo | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(1)

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const getVideoUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${IMG_URL}/${cleanPath}`
  }

  // Helper function to get token from cookies
  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(c => c.trim().startsWith('admin_token='))
    return tokenCookie ? tokenCookie.split('=')[1].trim() : null
  }

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      query.append('page', (pageIndex + 1).toString())
      query.append('perPage', pageSize.toString())

      const response = await fetch(`${API_URL}/api/blog-videos?${query.toString()}`, {
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      const blogVideos = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []
      setData(blogVideos)
      setPageCount(json.last_page ?? 1)
    } catch (err) {
      console.error('Fetch error:', err)
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to fetch videos',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file')
        return
      }

      // Check file size (max 200MB to match Laravel validation)
      const maxSize = 200 * 1024 * 1024 // 200MB in bytes
      if (file.size > maxSize) {
        toast.error('Video file is too large. Maximum size is 200MB.')
        return
      }

      setSelectedFile(file)
      
      // Create preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl('')
  }

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!selectedFile) {
      toast.error('Please select a video')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('video', selectedFile)

      // Get token from cookie
      const token = getTokenFromCookie()

      if (!token) {
        throw new Error('No authentication token found. Please login again.')
      }

      // Upload DIRECTLY to Laravel backend (bypasses Next.js completely)
      const response = await fetch(`${API_URL}/api/blog-videos`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(errorData.error || errorData.message || 'Upload failed')
      }

      toast.success('Success', {
        description: 'Video uploaded successfully',
        position: 'top-right',
      })

      // Clean up
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setSelectedFile(null)
      setPreviewUrl('')
      setTitle('')
      setDescription('')
      setIsAddOpen(false)
      await fetchVideos()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to upload video',
        position: 'top-right',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)

      // Get token from cookie
      const token = getTokenFromCookie()

      if (!token) {
        throw new Error('No authentication token found. Please login again.')
      }

      // Delete DIRECTLY from Laravel backend
      const response = await fetch(`${API_URL}/api/blog-videos/${selectedItem.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || 'Delete failed')
      }

      setData(data.filter((item) => item.id !== selectedItem.id))
      setIsDeleteOpen(false)
      setSelectedItem(null)

      toast.success('Success', {
        description: 'Video deleted successfully.',
        position: 'top-right',
      })
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to delete video.',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnDef<BlogVideo>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] sm:max-w-[300px] truncate">
          {row.getValue('title')}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const desc = row.getValue('description') as string
        return (
          <div className="max-w-[150px] sm:max-w-[200px] truncate text-sm text-muted-foreground hidden md:block">
            {desc || 'No description'}
          </div>
        )
      },
    },
    {
      accessorKey: 'video_path',
      header: 'Video',
      cell: ({ row }) => {
        const videoPath = row.getValue('video_path') as string
        return videoPath ? (
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">Video file</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Video className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">No video</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm hidden lg:inline">
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original)
                setIsViewOpen(true)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original)
                setIsDeleteOpen(true)
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
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
    <div className="space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Blog Videos</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your blog video content.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={(pi, ps) => {
          setPageIndex(pi)
          setPageSize(ps)
        }}
        searchFields={['title' as keyof BlogVideo]}
        searchPlaceholder="Search videos..."
        search=""
        onSearchChange={() => {}}
        onSortingChange={() => {}}
      />

      {/* Upload Dialog - Fully Responsive */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-[#D4AF37]">Upload Video</DialogTitle>
            <DialogDescription className="text-sm text-[#D4AF37]/80">
              Add a new video to your blog content (Max 200MB)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-[#D4AF37]">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                className="bg-white text-gray-900 placeholder:text-gray-400 w-full border-[#D4AF37]/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-[#D4AF37]">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter video description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                rows={3}
                className="bg-white text-gray-900 placeholder:text-gray-400 w-full resize-none border-[#D4AF37]/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video" className="text-sm font-medium text-[#D4AF37]">
                Video * (Max 200MB)
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="video"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-[#D4AF37]/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-[#D4AF37]" />
                    <p className="mb-2 text-xs sm:text-sm text-[#D4AF37] text-center">
                      <span className="font-semibold">Click to select video</span>
                    </p>
                    <p className="text-xs text-[#D4AF37]/70 text-center">MP4, MOV, AVI, etc. (Max 200MB)</p>
                  </div>
                  <input
                    id="video"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {/* Video Preview - Responsive */}
            {selectedFile && previewUrl && (
              <div className="relative border rounded-lg p-3 sm:p-4 bg-gray-50 border-[#D4AF37]/30">
                <Button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-1 h-7 w-7 sm:h-8 sm:w-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition z-10"
                  disabled={uploading}
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <div className="space-y-2">
                  <video
                    src={previewUrl}
                    controls
                    className="w-full max-h-[200px] sm:max-h-[300px] rounded"
                  />
                  <p className="text-xs sm:text-sm text-[#D4AF37] font-medium truncate pr-8">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#D4AF37]/70">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-[#D4AF37]/20">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false)
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl)
                }
                setSelectedFile(null)
                setPreviewUrl('')
                setTitle('')
                setDescription('')
              }}
              disabled={uploading}
              className="bg-white border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !title.trim() || !selectedFile}
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog - Fully Responsive */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-gray-900">Video Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base text-gray-900">Title</h3>
                <p className="text-sm text-gray-700 break-words">{selectedItem.title}</p>
              </div>
              
              {selectedItem.description && (
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base text-gray-900">Description</h3>
                  <p className="text-sm text-gray-700 break-words">{selectedItem.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-900">Video</h3>
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={getVideoUrl(selectedItem.video_path)}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-1 text-gray-900">Created</h3>
                  <p className="text-gray-700">
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-900">Path</h3>
                  <p className="text-gray-700 truncate text-xs sm:text-sm" title={selectedItem.video_path}>
                    {selectedItem.video_path}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Responsive */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Delete Video</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this video? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={loading}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
