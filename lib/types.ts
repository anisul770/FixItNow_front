// Shapes mirror the FixItNow API responses. Dates arrive as ISO strings, so
// they stay strings here — convert at the point of display.

/* -------------------------------------------------------------------------- */
/*                                   Enums                                    */
/* -------------------------------------------------------------------------- */

export type TUserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type TActiveStatus = "ACTIVE" | "BLOCKED";

export type TBookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "CANCELLED"
  | "COMPLETED"
  | "PAID";

export type TPaymentStatus = "PENDING" | "PAID" | "FAILED";

/* -------------------------------------------------------------------------- */
/*                                API envelope                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                   Domain                                   */
/* -------------------------------------------------------------------------- */

/** Contact details hanging off a user — `user.profile` in the API. */
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
  // Included only on endpoints that expand them.
  category?: ICategory;
  technician?: ITechnicianProfile & { user?: IUserSummary };
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
  status: TBookingStatus;
  createdAt: string;
  updatedAt: string;
  // Included only on endpoints that expand them.
  service?: IService;
  customer?: IUserSummary;
  technician?: ITechnicianProfile & { user?: IUserSummary };
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
  // Included only on endpoints that expand it.
  customer?: { name: string };
}

export interface IPayment {
  id: string;
  bookingId: string;
  amount: number;
  status: TPaymentStatus;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: IBooking;
}

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */

/** The trimmed user object nested inside technician/booking payloads. */
export type IUserSummary = Pick<IUser, "id" | "name" | "email" | "role">;

/**
 * `GET /api/users/me` → `data.profile`.
 * The relation arrays are present on that endpoint but absent from the
 * summaries embedded elsewhere, so they are optional.
 */
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

/* -------------------------------------------------------------------------- */
/*                                     UI                                     */
/* -------------------------------------------------------------------------- */

export interface INavItem {
  label: string;
  href: string;
}
