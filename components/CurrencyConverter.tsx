import { convertCurrency, getCurrencySymbol } from "@/lib/currency";

interface CurrencyConverterProps {
  amountJPY: number;
  label: string;
  note: string;
}

/** 海外のお客さま向けに、外貨での目安を並べて出す（固定レート） */
export default function CurrencyConverter({ amountJPY, label, note }: CurrencyConverterProps) {
  if (!amountJPY) return null;
  const currencies = ["USD", "EUR", "GBP"];
  return (
    <div className="text-[14px]">
      <p className="font-bold text-ink-soft">{label}</p>
      <p className="mt-0.5 font-bold">
        {currencies
          .map(
            (c) =>
              `${getCurrencySymbol(c)}${convertCurrency(amountJPY, c).toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}`
          )
          .join("　")}
      </p>
      <p className="mt-0.5 text-[12px] text-ink-soft">{note}</p>
    </div>
  );
}
