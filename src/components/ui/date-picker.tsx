"use client";

import * as React from "react";
import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatLocalDate, parseLocalDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

const DATE_FNS_LOCALES = {
  en: enUS,
  vi,
} as const;

type DatePickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Inclusive max date as YYYY-MM-DD */
  max?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function DatePicker({
  id,
  value,
  onChange,
  max,
  placeholder,
  className,
  disabled,
}: DatePickerProps) {
  const t = useTranslations("Session");
  const locale = useLocale();
  const dateFnsLocale =
    DATE_FNS_LOCALES[locale as keyof typeof DATE_FNS_LOCALES] ?? enUS;
  const [open, setOpen] = React.useState(false);
  const selected = value ? parseLocalDate(value) : undefined;
  const maxDate = max ? parseLocalDate(max) : undefined;
  const resolvedPlaceholder = placeholder ?? t("pickDate");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={!value}
          className={cn(
            "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon />
          {selected ? (
            format(selected, "PPP", { locale: dateFnsLocale })
          ) : (
            <span>{resolvedPlaceholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Calendar
          className="w-full"
          mode="single"
          selected={selected}
          defaultMonth={selected}
          locale={dateFnsLocale}
          disabled={maxDate ? { after: maxDate } : undefined}
          onSelect={(date) => {
            if (!date) return;
            onChange(formatLocalDate(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
