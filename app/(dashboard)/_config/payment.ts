import type { IBookingStatus, IPaymentStatus } from "@/lib/types";

type TTone = "warning" | "success" | "danger" | "neutral";

export const TONE_CLASSES: Record<TTone, string> = {
  warning: "bg-primary/15 text-foreground",
  success: "bg-chart-3/15 text-foreground",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

export const PAYMENT_STATUS_UI: Record<
  IPaymentStatus,
  { label: string; tone: TTone; canRetry: boolean }
> = {
  PENDING: { label: "Payment in progress", tone: "warning", canRetry: true },
  COMPLETED: { label: "Paid", tone: "success", canRetry: false },
  FAILED: { label: "Payment failed", tone: "danger", canRetry: true },
  REFUNDED: { label: "Refunded", tone: "neutral", canRetry: false },
};

export const BOOKING_STATUS_UI: Record<
  IBookingStatus,
  { label: string; tone: TTone }
> = {
  REQUESTED: { label: "Requested", tone: "neutral" },
  ACCEPTED: { label: "Accepted", tone: "warning" },
  DECLINED: { label: "Declined", tone: "danger" },
  PAID: { label: "Paid", tone: "success" },
  IN_PROGRESS: { label: "In progress", tone: "warning" },
  COMPLETED: { label: "Completed", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "danger" },
};

export const canPayBooking = (
  bookingStatus: IBookingStatus,
  payment?: { status: IPaymentStatus } | null
) => bookingStatus === "ACCEPTED" && payment?.status !== "COMPLETED";

export const canCancelBooking = (bookingStatus: IBookingStatus) =>
  bookingStatus !== "COMPLETED" && bookingStatus !== "CANCELLED";
