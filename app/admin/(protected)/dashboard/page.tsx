"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Calendar, FileText, TrendingUp, Users, Clock } from "lucide-react"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts"

interface Booking {
  client: string
  service: string
  date: string
}

interface DashboardStats {
  totalTestimonials: number
  totalBookings: number
  totalBlogPosts: number
  recentBookings: Booking[]
  bookingsByMonth?: Array<{ month: string; bookings: number }>
  bookingsByService?: Array<{ service: string; count: number }>
  testimonialStatus?: Array<{ status: string; count: number }>
}

const COLORS = ["#D4AF37", "#C5A028", "#B69121", "#A8821A", "#997313"]

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTestimonials: 0,
    totalBookings: 0,
    totalBlogPosts: 0,
    recentBookings: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard")
        if (!res.ok) throw new Error("Failed to fetch dashboard")

        const data = await res.json()
        setStats({
          totalTestimonials: data.totalTestimonials,
          totalBookings: data.totalBookings,
          totalBlogPosts: data.totalBlogPosts,
          recentBookings: data.recentBookings,
          bookingsByMonth: data.bookingsByMonth || generateMockMonthlyData(data.totalBookings),
          bookingsByService: data.bookingsByService || generateMockServiceData(),
          testimonialStatus: data.testimonialStatus || generateMockTestimonialData(data.totalTestimonials),
        })
      } catch (err) {
        console.error(err)
        toast.error("Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  // Mock data generators (replace with real data from API)
  const generateMockMonthlyData = (total: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, index) => ({
      month,
      bookings: Math.floor(Math.random() * (total / 3)) + index * 2,
    }))
  }

  const generateMockServiceData = () => [
    { service: "Wedding", count: 45 },
    { service: "Portrait", count: 32 },
    { service: "Event", count: 28 },
    { service: "Commercial", count: 15 },
    { service: "Other", count: 10 },
  ]

  const generateMockTestimonialData = (total: number) => [
    { status: "Approved", count: Math.floor(total * 0.7) },
    { status: "Pending", count: Math.floor(total * 0.2) },
    { status: "Rejected", count: Math.floor(total * 0.1) },
  ]

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, outerRadius, percent, index } = props
    
    if (
      typeof cx !== 'number' ||
      typeof cy !== 'number' ||
      typeof midAngle !== 'number' ||
      typeof outerRadius !== 'number' ||
      typeof percent !== 'number' ||
      typeof index !== 'number'
    ) {
      return null
    }

    const radius = outerRadius + 25
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    const statusName = stats.testimonialStatus?.[index]?.status || 'Unknown'

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > (cx || 0) ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${statusName} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const statCards = [
    { name: "Total Testimonials", value: stats.totalTestimonials, icon: MessageSquare, trend: "+12%", color: "text-blue-600" },
    { name: "Total Bookings", value: stats.totalBookings, icon: Calendar, trend: "+23%", color: "text-green-600" },
    { name: "Blog Posts", value: stats.totalBlogPosts, icon: FileText, trend: "+5%", color: "text-purple-600" },
    { name: "Active Clients", value: stats.recentBookings?.length || 0, icon: Users, trend: "+8%", color: "text-orange-600" },
  ]

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-gold text-3xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-gold text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s an overview of your photography business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.name} className="border-border/50 bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings Chart */}
        <Card className="border-border/50 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              Bookings Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={{ fill: "#D4AF37", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bookings by Service Type */}
        <Card className="border-border/50 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Bookings by Service Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.bookingsByService}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="service" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="count" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Testimonial Status Pie Chart */}
        <Card className="border-border/50 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold" />
              Testimonials Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.testimonialStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {stats.testimonialStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="lg:col-span-2 bg-white border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" />
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentBookings && stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-border/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{booking.client}</p>
                        <p className="text-xs text-muted-foreground">{booking.service}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gold bg-gold/10 px-3 py-1 rounded-full">{booking.date}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming bookings</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
