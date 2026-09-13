import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

type TVariant = "success" | "fail" | "cancel";

const VARIANTS: Record<
  TVariant,
  {
    title: string;
    body: string;
    action: string;
    ring: string;
    icon: React.ReactNode;
  }
> = {
  success: {
    title: "Payment successful",
    body: "Your booking is paid and the technician has been notified. The receipt is on your payments page.",
    action: "View booking",
    ring: "border-chart-3/40 bg-chart-3/10 text-foreground",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="size-7"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  fail: {
    title: "Payment didn't go through",
    body: "Nothing was charged. The booking is still yours — you can try paying again whenever you are ready.",
    action: "Try again",
    ring: "border-destructive/40 bg-destructive/10 text-destructive",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="size-7"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
  },
  cancel: {
    title: "Payment cancelled",
    body: "You backed out at the gateway, so nothing was charged. The booking is still waiting to be paid.",
    action: "Back to booking",
    ring: "border-border bg-muted text-muted-foreground",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="size-7"
      >
        <path d="M9 14 5 10l4-4" />
        <path d="M5 10h9a5 5 0 0 1 0 10h-1" />
      </svg>
    ),
  },
};

interface IPaymentResultProps {
  variant: TVariant;
  bookingId: string;
}

const PaymentResult = ({ variant, bookingId }: IPaymentResultProps) => {
  const { title, body, action, ring, icon } = VARIANTS[variant];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
      <span
        className={`flex size-14 items-center justify-center rounded-full border ${ring}`}
      >
        {icon}
      </span>

      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-balance">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/dashboard/bookings/${bookingId}`}
          className={buttonVariants()}
        >
          {action}
        </Link>
        <Link
          href="/dashboard/payments"
          className={buttonVariants({ variant: "outline" })}
        >
          My payments
        </Link>
      </div>

      <p className="mt-6 font-mono text-xs text-muted-foreground">
        Booking {bookingId}
      </p>
    </div>
  );
};

export default PaymentResult;
