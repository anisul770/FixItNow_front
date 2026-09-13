// Shapes mirror the FixItNow API responses. Dates arrive as ISO strings, so
// they stay strings here — convert at the point of display.

/* -------------------------------------------------------------------------- */
/*                                   Enums                                    */
/* -------------------------------------------------------------------------- */

export type TUserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type TActiveStatus = "ACTIVE" | "BLOCKED";

// Mirrors prisma/schema/enums.prisma.
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
  // Included only on endpoints that expand them.
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
  // Included only on endpoints that expand them.
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
  // Expanded partially and inconsistently per endpoint — technician_bookings
  // returns only { title, duration } and { name, email }.
  service?: Partial<IService>;
  customer?: Partial<IUserSummary>;
  // GET /api/booking/:id nests only { userId, user: { name } }.
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
  // Included only on endpoints that expand it.
  customer?: { name: string };
}

/**
 * One payment row. `bookingId` is unique, so this is the single source of
 * truth for whether a booking has been paid for.
 *
 * The four settlement fields are written only by successPayment, so anything
 * that is not COMPLETED carries them as null.
 */
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

/** GET /api/payment/my_payments → data.payments — slim booking nesting. */
export interface IPaymentListItem extends IPayment {
  booking: { bookingDate: string; service: { title: string } };
}

/** GET /api/payment/:bookingId/details and /api/admin/payments → full nesting. */
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

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */

/** The trimmed user object nested inside technician/booking payloads. */
export type IUserSummary = Pick<
  IUser,
  "id" | "name" | "email" | "role" | "activeStatus"
>;

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

/**
 * Query keys sent to /api/service/all. Filtering happens on the backend —
 * rename these if the API expects different keys.
 */
export interface IServiceFilters {
  searchTerm?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
}
