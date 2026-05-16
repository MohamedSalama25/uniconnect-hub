"use client";

import * as React from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    value?: string; // YYYY-MM-DD format
    onChange?: (date: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "اختر التاريخ",
    className,
    disabled = false,
}: DatePickerProps) {
    const dateValue = value ? new Date(value) : undefined;

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            // Format as YYYY-MM-DD for consistency with input[type="date"]
            const formattedDate = format(date, "yyyy-MM-dd");
            onChange?.(formattedDate);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    disabled={disabled}
                    className={cn(
                        "h-12 w-full justify-start text-right font-normal bg-background",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-right">
                        {dateValue ? (
                            format(dateValue, "PPP", { locale: ar })
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start" dir="rtl">
                <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={handleSelect}
                    initialFocus
                    locale={ar}
                    className="bg-background"
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={2100}
                />
            </PopoverContent>
        </Popover>
    );
}
