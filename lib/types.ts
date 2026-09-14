export type TUserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type TActiveStatus = "ACTIVE" | "BLOCKED";

export type IBookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type IPaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export type IPaymentProvider = "SSLCOMMERZ" | "STRIPE";

export interface IApiResponse<TData> {
  success: boolean;
  statusCode: number;
  message: string;
  data: TData;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IProfile {
  id: string;
  userId: string;
  profilePhoto: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ITechnicianProfile {
  id: string;
  userId: string;
  bio: string | null;
  skills: string[];
  location: string | null;
  experience: number;
  hourlyRate: number;
  averageRating: number;
  totalReviews: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: IUserSummary;
  services?: IService[];
}

export interface ICategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IService {
  id: string;
  technicianId: string;
  categoryId: string;
  title: string;
  description: string | null;
  price: number;
  duration: number;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ICategory;
  technician?: ITechnicianProfile;
}

export interface ISlot {
  id: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBooking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  address: string;
  problemDescription: string | null;
  totalPrice: number;
  status: IBookingStatus;
  createdAt: string;
  updatedAt: string;
  service?: Partial<IService>;
  customer?: Partial<IUserSummary>;
  technician?: Partial<ITechnicianProfile>;
}

export interface IReview {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  customer?: { name: string };
}

export interface IPayment {
  id: string;
  bookingId: string;
  provider: IPaymentProvider;
  amount: number;
  status: IPaymentStatus;
  paymentIntentId: string | null;
  transactionId: string | null;
  method: string | null;
  methodType: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentListItem extends IPayment {
  booking: { bookingDate: string; service: { title: string } };
}

export interface IPaymentDetails extends IPayment {
  booking: {
    id: string;
    customerId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    address: string;
    totalPrice: number;
    status: IBookingStatus;
    service: { title: string };
    customer: { name: string; email: string };
    technician: { user: { name: string } };
  };
}

export type IUserSummary = Pick<
  IUser,
  "id" | "name" | "email" | "role" | "activeStatus"
>;

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  activeStatus: TActiveStatus;
  createdAt: string;
  updatedAt: string;
  profile: IProfile | null;
  technicianProfile: ITechnicianProfile | null;
  customerBookings?: IBooking[];
  customerReviews?: IReview[];
}

export interface INavItem {
  label: string;
  href: string;
}

export interface IServiceFilters {
  searchTerm?: string;
  title?: string;
  price?: string;
  categoryId?: string;
  location?: string;
  rating?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}
