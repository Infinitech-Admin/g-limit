// bookings
export interface Booking {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  serviceType: string;
  date: string;
  time: string;
  guests: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  message?: string | null;
  approved?: boolean | null;
}
export interface Feedback {
  id?: number;
  name: string;
  title: string;
  rating: number;
  message: string;
  improvement?: string | null;
  consent?: boolean;
  is_approved?: boolean;
  created_at?: string;
}
// POSTs
export type Category =
  | "all"
  | "wedding"
  | "portrait"
  | "event"
  | "product"
  | "studio";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  label: string;
  category: Category;
  image: string | File | null;
  visible: boolean;
  featured: boolean;
}

// testimonials
export interface Testimonial {
  id?: number;
  name: string;
  title: string;
  message: string;
  rating: number;
  image?: string;
  approved?: boolean;
}
