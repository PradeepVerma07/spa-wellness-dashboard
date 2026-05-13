export type Role = "Admin" | "Manager" | "Staff";

export type CollectionName =
  | "services"
  | "products"
  | "projects"
  | "packages"
  | "offers"
  | "testimonials"
  | "gallery"
  | "team"
  | "blogs"
  | "bookings"
  | "orders"
  | "leads";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered";
export type LeadStatus = "new" | "contacted" | "won" | "lost";

export type SEO = {
  title: string;
  description: string;
};

export type Review = {
  name: string;
  rating: number;
  quote: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  description: string;
  price: number;
  duration: string;
  benefits: string[];
  image: string;
  gallery: string[];
  featured: boolean;
  seo: SEO;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  popularity: number;
  ingredients: string[];
  benefits: string[];
  image: string;
  gallery: string[];
  reviews: Review[];
  featured: boolean;
  seo: SEO;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  client: string;
  excerpt: string;
  story: string;
  result: string;
  servicesUsed: string[];
  image: string;
  gallery: string[];
  featured: boolean;
  seo: SEO;
};

export type PackagePlan = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  price: number;
  cadence: string;
  inclusions: string[];
  image: string;
  featured: boolean;
};

export type Offer = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  discount: string;
  endsAt: string;
  image: string;
  targetLabel: string;
  targetHref: string;
  active: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  service: string;
  quote: string;
  rating: number;
  image: string;
  videoUrl?: string;
  featured: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  image: string;
  videoUrl?: string;
  relatedLabel: string;
  relatedHref: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  specialization: string;
  experience: string;
  bio: string;
  image: string;
  bookingHref: string;
};

export type Blog = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  relatedServices: string[];
  relatedProducts: string[];
  seo: SEO;
};

export type Booking = {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  payment: "pay_at_spa" | "online" | "deposit";
  notes?: string;
  total: number;
  status: BookingStatus;
  createdAt: string;
};

export type OrderItem = {
  productSlug: string;
  title: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  payment: "cod" | "card" | "upi";
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
};

export type NavLink = {
  id: string;
  label: string;
  href: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapEmbed: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  announcement: string;
  headerLinks: NavLink[];
  footerQuickLinks: NavLink[];
  footerServiceLinks: NavLink[];
  footerSupportLinks: NavLink[];
  socialLinks: NavLink[];
  homepageSections: {
    featuredServices: boolean;
    products: boolean;
    packages: boolean;
    projects: boolean;
    testimonials: boolean;
    blog: boolean;
    offers: boolean;
    contactCta: boolean;
  };
};

export type CMSData = {
  services: Service[];
  products: Product[];
  projects: Project[];
  packages: PackagePlan[];
  offers: Offer[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  team: TeamMember[];
  blogs: Blog[];
  bookings: Booking[];
  orders: Order[];
  leads: Lead[];
  settings: SiteSettings;
};

export type CMSItem =
  | Service
  | Product
  | Project
  | PackagePlan
  | Offer
  | Testimonial
  | GalleryItem
  | TeamMember
  | Blog
  | Booking
  | Order
  | Lead;
