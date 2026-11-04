import { convertCurrency, getCurrencySymbol } from "@/lib/currency";

interface CurrencyConverterProps {
  amountJPY: number;
  note: string;
}

/** 海外のお客さま向けの外貨の目安（固定レート） */
export default function CurrencyConverter({ amountJPY, note }: CurrencyConverterProps) {
  if (!amountJPY) return null;
  const text = ["USD", "EUR", "GBP"]
    .map(
      (c) =>
        `${getCurrencySymbol(c)}${convertCurrency(amountJPY, c).toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })}`
    )
    .join(" / ");
  return (
    <span className="block text-[12px] text-ink-soft">
      {text}（{note}）
    </span>
  );
}
