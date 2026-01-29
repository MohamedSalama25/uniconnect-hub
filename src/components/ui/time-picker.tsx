import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover";

interface TimePickerProps {
    value?: string; // HH:MM format (24-hour)
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function TimePicker({
    value = "09:00",
    onChange,
    placeholder = "اختر الوقت",
    className,
    disabled = false
}: TimePickerProps) {
    const [open, setOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState(9);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

    const hourScrollRef = useRef<HTMLDivElement>(null);
    const minuteScrollRef = useRef<HTMLDivElement>(null);

    // Convert 24-hour format to 12-hour format
    const convert24To12 = (hour24: number): { hour12: number; period: "AM" | "PM" } => {
        if (hour24 === 0) return { hour12: 12, period: "AM" };
        if (hour24 < 12) return { hour12: hour24, period: "AM" };
        if (hour24 === 12) return { hour12: 12, period: "PM" };
        return { hour12: hour24 - 12, period: "PM" };
    };

    // Convert 12-hour format to 24-hour format
    const convert12To24 = (hour12: number, period: "AM" | "PM"): number => {
        if (period === "AM") {
            return hour12 === 12 ? 0 : hour12;
        } else {
            return hour12 === 12 ? 12 : hour12 + 12;
        }
    };

    // Parse initial value
    useEffect(() => {
        if (value) {
            const [hourStr, minuteStr] = value.split(":");
            const hour24 = parseInt(hourStr, 10);
            const minute = parseInt(minuteStr, 10);
            const { hour12, period } = convert24To12(hour24);
            setSelectedHour(hour12);
            setSelectedMinute(minute);
            setSelectedPeriod(period);
        }
    }, [value]);

    // Scroll to selected items when popover opens
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                const hourElement = hourScrollRef.current?.querySelector(`[data-hour="${selectedHour}"]`);
                const minuteElement = minuteScrollRef.current?.querySelector(`[data-minute="${selectedMinute}"]`);

                hourElement?.scrollIntoView({ block: "center", behavior: "smooth" });
                minuteElement?.scrollIntoView({ block: "center", behavior: "smooth" });
            }, 100);
        }
    }, [open, selectedHour, selectedMinute]);

    const handleTimeChange = (hour: number, minute: number, period: "AM" | "PM") => {
        const hour24 = convert12To24(hour, period);
        const timeString = `${hour24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        onChange?.(timeString);
    };

    const handleHourClick = (hour: number) => {
        setSelectedHour(hour);
        handleTimeChange(hour, selectedMinute, selectedPeriod);
    };

    const handleMinuteClick = (minute: number) => {
        setSelectedMinute(minute);
        handleTimeChange(selectedHour, minute, selectedPeriod);
    };

    const handlePeriodClick = (period: "AM" | "PM") => {
        setSelectedPeriod(period);
        handleTimeChange(selectedHour, selectedMinute, period);
    };

    const displayTime = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")} ${selectedPeriod}`;

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "h-12 w-full justify-start text-right font-normal bg-background",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-right">{value ? displayTime : placeholder}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start" dir="rtl">
                <div className="flex gap-0 bg-background divide-x divide-x-reverse divide-border">
                    {/* Period Column */}
                    <div className="flex flex-col w-[80px]">
                        <div className="sticky top-0 bg-muted/80 backdrop-blur-md px-2 py-3 text-center font-black text-xs uppercase tracking-wider border-b z-10 text-muted-foreground">
                            الفترة
                        </div>
                        <div className="flex flex-col p-2 gap-2">
                            {["AM", "PM"].map((period) => (
                                <button
                                    key={period}
                                    data-period={period}
                                    onClick={() => handlePeriodClick(period as "AM" | "PM")}
                                    className={cn(
                                        "w-full py-3 rounded-xl text-sm font-bold transition-all duration-200",
                                        selectedPeriod === period
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Minutes Column */}
                    <div className="flex flex-col w-[90px]">
                        <div className="sticky top-0 bg-muted/80 backdrop-blur-md px-2 py-3 text-center font-black text-xs uppercase tracking-wider border-b z-10 text-muted-foreground">
                            الدقائق
                        </div>
                        <div
                            ref={minuteScrollRef}
                            className="overflow-y-auto max-h-[280px] p-2 space-y-1.5 scrollbar-none"
                        >
                            {minutes.map((minute) => (
                                <button
                                    key={minute}
                                    data-minute={minute}
                                    onClick={() => handleMinuteClick(minute)}
                                    className={cn(
                                        "w-full py-2 rounded-xl text-sm font-bold transition-all duration-200",
                                        selectedMinute === minute
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {minute.toString().padStart(2, "0")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hours Column */}
                    <div className="flex flex-col w-[90px]">
                        <div className="sticky top-0 bg-muted/80 backdrop-blur-md px-2 py-3 text-center font-black text-xs uppercase tracking-wider border-b z-10 text-muted-foreground">
                            الساعة
                        </div>
                        <div
                            ref={hourScrollRef}
                            className="overflow-y-auto max-h-[280px] p-2 space-y-1.5 scrollbar-none"
                        >
                            {hours.map((hour) => (
                                <button
                                    key={hour}
                                    data-hour={hour}
                                    onClick={() => handleHourClick(hour)}
                                    className={cn(
                                        "w-full py-2 rounded-xl text-sm font-bold transition-all duration-200",
                                        selectedHour === hour
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {hour.toString().padStart(2, "0")}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
