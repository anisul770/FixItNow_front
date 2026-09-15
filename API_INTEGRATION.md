# API Integration

Every backend call in this app goes through a server action or server component — never
the browser directly. Reads use plain `fetch` (public) or `authorizedFetch`/`authorizedRequest`
(signed-in); writes always go through `authorizedRequest` (`service/authorizedRequest.ts`),
which attaches the `accessToken` cookie as a Bearer header and silently refreshes it once on
a failed request. Base URL: `BACKEND_API_URL` (server-only env var, see `.env.example`).

## Auth

| Endpoint | Server action | Used by |
|---|---|---|
| `POST /api/auth/login` | `app/(auth)/_actions/authActions.ts` (`loginAction`) | `LoginForm.tsx` |
| `POST /api/users/register` | `app/(auth)/_actions/authActions.ts` (`registerAction`) | `RegisterForm.tsx` |
| `POST /api/auth/refresh-token` | `service/refreshAccessToken.ts` | internal — called by `authorizedRequest` and `getCurrentUser` when the access token is missing/expired |
| `GET /api/users/me` | `service/getCurrentUser.ts` (`cache`-wrapped) | nearly every dashboard page/layout, `Navbar.tsx`, `Footer.tsx` |
| *(none — cookies cleared locally)* | `service/logout.ts` | logout button |

## Services

| Endpoint | Server action | Used by |
|---|---|---|
| `GET /api/service/all` | `app/(public)/_actions/getAllServices.ts` | `app/(public)/page.tsx`, `services/page.tsx` + `ServiceFilters.tsx`, `technicians/[id]/page.tsx` |
| `GET /api/service/all` (fetched with `limit=1000`, filtered client-side) | `app/(public)/_actions/getServiceById.ts` | `services/[id]/page.tsx` — no by-id endpoint exists on the backend |
| `GET /api/technician/availability/:serviceId` | `app/(public)/_actions/getServiceSlots.ts` | `services/[id]/page.tsx` slot picker |
| `POST /api/technician/new_service` | `app/(dashboard)/_actions/(technician)/createService.ts` | `ServiceForm.tsx` |

## Technicians

| Endpoint | Server action | Used by |
|---|---|---|
| `GET /api/technician/all` | `app/(public)/_actions/getAllTechnicians.ts` (public) | `technicians/page.tsx`, and `getTechnicianById.ts` (filters client-side — no by-id endpoint) |
| `GET /api/technician/all` | `app/(dashboard)/_actions/(technician)/getAllTechnicians.ts` (authenticated) | admin technician/booking/user detail pages, `dashboard/bookings/[id]/page.tsx` |
| `GET /api/technician/profile` | `app/(dashboard)/_actions/(technician)/getTechnicianProfile.ts` | `technician-dashbaord/page.tsx`, `technician-dashbaord/services/page.tsx` |

## Slots

| Endpoint | Server action | Used by |
|---|---|---|
| `GET /api/technician/my_slots` | `app/(dashboard)/_actions/(technician)/getMySlots.ts` | `technician-dashbaord/page.tsx`, `technician-dashbaord/slots/page.tsx` |
| `POST /api/technician/new_slots` | `app/(dashboard)/_actions/(technician)/createSlots.ts` | `SlotForm.tsx` |
| `DELETE /api/technician/slots/:slotId` | `app/(dashboard)/_actions/(technician)/deleteSlot.ts` | `SlotDeleteButton.tsx` |

## Bookings

| Endpoint | Server action | Used by |
|---|---|---|
| `POST /api/booking/new_booking` | `app/(public)/_actions/createBooking.ts` | `BookingForm.tsx` |
| `GET /api/booking/:bookingId` | `app/(dashboard)/_actions/(user)/getBookingById.ts` | `dashboard/bookings/[id]/page.tsx` |
| `GET /api/booking/technician_bookings` | `app/(dashboard)/_actions/(technician)/getTechnicianBookings.ts` | `technician-dashbaord/page.tsx`, `technician-dashbaord/bookings/page.tsx` |
| `PATCH /api/booking/:bookingId/status` | `app/(dashboard)/_actions/(technician)/updateBookingStatus.ts` | `BookingStatusActions.tsx` (accept/decline/start/complete) |
| `PATCH /api/booking/:bookingId/cancel` | `app/(dashboard)/_actions/(user)/cancelBooking.ts` | `CancelBookingButton.tsx` |
| `GET /api/admin/bookings` | `app/(dashboard)/_actions/(admin)/getAllBookings.ts` | `admin-dashboard/page.tsx`, `admin-dashboard/bookings/page.tsx` + `[id]/page.tsx` |

## Payments

| Endpoint | Server action | Used by |
|---|---|---|
| `GET /api/payment/:bookingId/init` | `app/(dashboard)/_actions/(user)/initPayment.ts` | `PayButton.tsx` — redirects to the returned SSLCommerz gateway URL |
| `GET /api/payment/:bookingId/details` | `app/(dashboard)/_actions/(user)/getPaymentDetails.ts` | `dashboard/bookings/[id]/page.tsx`, admin booking/payment detail pages |
| `GET /api/payment/:bookingId/details` | `app/(public)/_actions/getPaymentStatus.ts` | payment gateway return page (`app/(public)/api/booking/[bookingId]/page.tsx` → `PaymentResult.tsx`) |
| `GET /api/payment/my_payments` | `app/(dashboard)/_actions/(user)/getMyPayments.ts` | `dashboard/payments/page.tsx` |
| `GET /api/admin/payments` | `app/(dashboard)/_actions/(admin)/getAllPayments.ts` | `admin-dashboard/page.tsx`, `admin-dashboard/payments/page.tsx` |

The SSLCommerz success/fail/cancel callback is handled entirely on the backend; the frontend's
`/payment/[bookingId]/success|fail|cancel` pages only render a confirmation after the gateway
redirects the browser back, by polling the `details` endpoint above.

## Reviews

| Endpoint | Server action | Used by |
|---|---|---|
| `GET /api/review/service/:serviceId` | `app/(public)/_actions/getServiceReviews.ts` | `services/[id]/page.tsx` |
| `GET /api/review/technician/:technicianId` | `app/(public)/_actions/getTechnicianReviews.ts` | `technicians/[id]/page.tsx` |
| `POST /api/review/:bookingId` | `app/(dashboard)/_actions/(user)/createReview.ts` | `ReviewForm.tsx` (via `ReviewPrompt.tsx`) |
| `PATCH /api/review/:reviewId` | `app/(dashboard)/_actions/(user)/updateReview.ts` | `ReviewForm.tsx` (via `ReviewCard.tsx`) |

## Categories

| Endpoint | Server action | Used by |
|---|---|---|
| `GET /api/category/all` | `service/getCategories.ts` | homepage, `services/page.tsx`, `ServiceForm.tsx`, `admin-dashboard/categories/page.tsx` |
| `POST /api/admin/new_category` | `app/(dashboard)/_actions/(admin)/createCategory.ts` | `CategoryForm.tsx` |

## Admin & profile

| Endpoint | Server action | Used by |
|---|---|---|
| `GET /api/admin/users` | `app/(dashboard)/_actions/(admin)/getAllUsers.ts` | `admin-dashboard/page.tsx`, `admin-dashboard/users/page.tsx` + `[id]/page.tsx` |
| `PATCH /api/admin/:userId/status` | `app/(dashboard)/_actions/(admin)/updateUserStatus.ts` | `TechnicianActions.tsx`, `UserStatusActions.tsx` |
| `PUT /api/admin/:technicianId/verify_technician` | `app/(dashboard)/_actions/(admin)/verifyTechnician.ts` | `TechnicianActions.tsx` |
| `PUT /api/users/my-profile` | `app/(dashboard)/_actions/(user)/updateProfile.ts` | `ProfileEditor.tsx` |

## Known gaps

- **No by-id endpoints for services or technicians.** `getServiceById.ts` and `getTechnicianById.ts`
  both fetch the entire list (`limit=1000`) and `.find()` the record client-side, rather than
  hitting a dedicated `GET /api/service/:id` / `GET /api/technician/:id` route.
- **Duplicate technician-list actions.** A public, unauthenticated `getAllTechnicians.ts`
  (`app/(public)/_actions/`) and an authenticated one (`app/(dashboard)/_actions/(technician)/`)
  both call the same `GET /api/technician/all`.
