// Shared formatting helpers used across the Order Gas / payment flow.

export function formatCurrency(amount: number, withDecimals = false): string {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  })}`;
}

// Client-side display id, generated ahead of the real backend Order.id
// (backend/prisma schema.prisma: model Order) which isn't wired up yet.
export function generateOrderId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `#FLM-${num}`;
}

// Mirrors the shape of Transaction.reference (backend/prisma/schema.prisma)
// — unique per payment attempt, used as the bank transfer narration.
export function generatePaymentReference(date: Date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FLM-${yy}-${mm}-${dd}-${rand}`;
}

export function formatTransactionTime(date: Date = new Date()): string {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} ${month} ${year}, ${time}`;
}
