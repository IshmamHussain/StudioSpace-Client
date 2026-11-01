export type StudioCategory = 
  | "Photo Studio" 
  | "Film Stage" 
  | "Podcast Lounge" 
  | "Music Suite" 
  | "Art Workshop";

export interface IStudio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  rating: number;
  reviewCount: number;
  ownerEmail: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface IBooking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  renterEmail: string;
  renterName: string;
  ownerEmail: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  hourlyRate: number;
  subtotal: number;
  securityDeposit: number;
  serviceFee: number;
  totalAmount: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  role: "creator" | "host" | "admin";
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: IUser;
  token?: string;
}

