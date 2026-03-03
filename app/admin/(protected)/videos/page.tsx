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
const API_IMG_URL = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const getVideoUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG_URL}/${cleanPath}`
  }

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      query.append('page', (pageIndex + 1).toString())
      query.append('perPage', pageSize.toString())
      if (search.trim()) query.append('search', search.trim())

      const response = await fetch(`${API_URL}/blog-videos?${query.toString()}`, {
        headers: { 'Accept': 'application/json' },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      const json = await response.json()
      setData(Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [])
      setPageCount(json.last_page ?? 1)
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to fetch videos', position: 'top-right' })
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize, search])

  useEffect(() => { fetchVideos() }, [fetchVideos])

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    if (!file.type.startsWith('video/')) { toast.error('Please select a valid video file'); return }
    if (file.size > 100 * 1024 * 1024) { toast.error('File size must be less than 100MB'); return }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl('')
    setUploadProgress(0)
  }

  const resetUploadForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl('')
    setTitle('')
    setDescription('')
    setUploadProgress(0)
  }

  const handleUpload = async () => {
    if (!title.trim()) { toast.error('Please enter a title'); return }
    if (!selectedFile) { toast.error('Please select a video'); return }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('video', selectedFile)
      const token = localStorage.getItem('token')

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
        })
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else {
            try { reject(new Error(JSON.parse(xhr.responseText).error || 'Upload failed')) }
            catch { reject(new Error('Upload failed')) }
          }
        })
        xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))
        xhr.open('POST', `${API_URL}/blog-videos`)
        xhr.setRequestHeader('Accept', 'application/json')
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.send(formData)
      })

      toast.success('Success', { description: 'Video uploaded successfully', position: 'top-right' })
      resetUploadForm()
      setIsAddOpen(false)
      await fetchVideos()
    } catch (error) {
      toast.error('Error', { description: error instanceof Error ? error.message : 'Failed to upload video', position: 'top-right' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/blog-videos/${selectedItem.id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || 'Delete failed')
      }
      setData(data.filter((item) => item.id !== selectedItem.id))
      setIsDeleteOpen(false)
      setSelectedItem(null)
      toast.success('Success', { description: 'Video deleted successfully.', position: 'top-right' })
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to delete video.', position: 'top-right' })
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnDef<BlogVideo>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div className="font-medium max-w-[200px] sm:max-w-[300px] truncate">{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const desc = row.getValue('description') as string
        return <div className="max-w-[150px] sm:max-w-[200px] truncate text-sm text-muted-foreground hidden md:block">{desc || 'No description'}</div>
      },
    },
    {
      accessorKey: 'video_path',
      header: 'Video',
      cell: ({ row }) => row.getValue('video_path') ? (
        <div className="flex items-center gap-2"><Video className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground hidden sm:inline">Video file</span></div>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground"><Video className="h-4 w-4" /><span className="text-sm hidden sm:inline">No video</span></div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => <span className="text-sm hidden lg:inline">{new Date(row.getValue('created_at') as string).toLocaleDateString()}</span>,
      enableSorting: true,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSelectedItem(row.original); setIsViewOpen(true) }}>
              <Eye className="mr-2 h-4 w-4" />View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSelectedItem(row.original); setIsDeleteOpen(true) }} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />Delete
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
          <p className="text-sm sm:text-base text-muted-foreground">Manage your blog video content.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-gold hover:bg-gold/90 text-primary-foreground w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />Upload Video
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={(pi, ps) => { setPageIndex(pi); setPageSize(ps) }}
        searchFields={['title', 'description']}
        searchPlaceholder="Search videos..."
        search={search}
        onSearchChange={setSearch}
        onSortingChange={() => {}}
      />

      {/* ── Upload Dialog ── */}
      <Dialog open={isAddOpen} onOpenChange={(open) => { if (!open) resetUploadForm(); setIsAddOpen(open) }}>
        {/* ✅ flex-col layout so the footer sticks to bottom and content scrolls independently */}
        <DialogContent className="w-[95vw] max-w-[560px] h-auto max-h-[90vh] flex flex-col p-0 gap-0 bg-white overflow-hidden">
          {/* Header — fixed, never scrolls */}
          <div className="px-5 pt-5 pb-4 border-b border-[#D4AF37]/20 flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl text-[#D4AF37]">Upload Video</DialogTitle>
            <DialogDescription className="text-sm text-[#D4AF37]/80 mt-1">
              Add a new video to your blog content (Max 100MB)
            </DialogDescription>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-[#D4AF37]">Title *</Label>
              <Input
                id="title"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                className="bg-white text-gray-900 placeholder:text-gray-400 border-[#D4AF37]/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-[#D4AF37]">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter video description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                rows={3}
                className="bg-white text-gray-900 placeholder:text-gray-400 resize-none border-[#D4AF37]/30"
              />
            </div>

            {/* File picker — only show when no file selected */}
            {!selectedFile && (
              <div className="space-y-2">
                <Label htmlFor="video" className="text-sm font-medium text-[#D4AF37]">Video * (Max 100MB)</Label>
                <label
                  htmlFor="video"
                  className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-[#D4AF37]/50 transition-colors"
                >
                  <Upload className="w-6 h-6 mb-2 text-[#D4AF37]" />
                  <p className="text-xs sm:text-sm text-[#D4AF37] font-semibold">Click to select video</p>
                  <p className="text-xs text-[#D4AF37]/70 mt-1">MP4, MOV, AVI, etc.</p>
                  <input id="video" type="file" className="hidden" accept="video/*" onChange={handleFileSelect} disabled={uploading} />
                </label>
              </div>
            )}

            {/* Video preview */}
            {selectedFile && previewUrl && (
              <div className="relative border rounded-lg p-3 bg-gray-50 border-[#D4AF37]/30">
                <Button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-1 h-7 w-7 bg-red-500 hover:bg-red-600 text-white rounded-full z-10"
                  disabled={uploading}
                >
                  <X className="h-3 w-3" />
                </Button>
                {/* ✅ Video capped at 180px so it doesn't push everything out of view */}
                <video src={previewUrl} controls className="w-full rounded" style={{ maxHeight: 180 }} />
                <p className="text-xs text-[#D4AF37] font-medium truncate pr-8 mt-2">{selectedFile.name}</p>
                <p className="text-xs text-[#D4AF37]/70">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            {/* Progress bar */}
            {uploading && uploadProgress > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#D4AF37]">
                  <span>Uploading…</span><span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Footer — fixed at bottom, never scrolls */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 px-5 py-4 border-t border-[#D4AF37]/20 flex-shrink-0 bg-white">
            <Button
              variant="outline"
              onClick={() => { resetUploadForm(); setIsAddOpen(false) }}
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
              {uploading ? `Uploading… ${uploadProgress}%` : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Dialog ── */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="w-[95vw] max-w-[640px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl text-gray-900">Video Details</DialogTitle>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
            {selectedItem && (
              <>
                <div>
                  <h3 className="font-semibold mb-1 text-sm text-gray-900">Title</h3>
                  <p className="text-sm text-gray-700 break-words">{selectedItem.title}</p>
                </div>

                {selectedItem.description && (
                  <div>
                    <h3 className="font-semibold mb-1 text-sm text-gray-900">Description</h3>
                    <p className="text-sm text-gray-700 break-words">{selectedItem.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2 text-sm text-gray-900">Video</h3>
                  {/* ✅ aspect-video keeps ratio; max-h prevents it from dominating on small screens */}
                  <div className="w-full bg-black rounded-lg overflow-hidden" style={{ maxHeight: 320 }}>
                    <video
                      src={getVideoUrl(selectedItem.video_path)}
                      controls
                      className="w-full h-full object-contain"
                      style={{ maxHeight: 320 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900">Created</h3>
                    <p className="text-gray-700">{new Date(selectedItem.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900">Path</h3>
                    <p className="text-gray-700 truncate text-xs" title={selectedItem.video_path}>{selectedItem.video_path}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end px-5 py-4 border-t flex-shrink-0 bg-white">
            <Button variant="outline" onClick={() => setIsViewOpen(false)} className="w-full sm:w-auto">Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="w-[95vw] max-w-[400px] p-0 gap-0 bg-white overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b">
            <DialogTitle className="text-lg">Delete Video</DialogTitle>
            <DialogDescription className="text-sm mt-1">
              Are you sure you want to delete this video? This action cannot be undone.
            </DialogDescription>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 px-5 py-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
