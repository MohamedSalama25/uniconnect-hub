import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    variant?: "primary" | "amber" | "green" | "red" | "blue" | "orange";
    className?: string;
    isLoading?: boolean;
}

const variantStyles = {
    primary: "from-primary/10 to-primary/5 text-primary",
    amber: "from-amber-500/10 to-amber-500/5 text-amber-500",
    green: "from-green-500/10 to-green-500/5 text-green-500",
    red: "from-red-500/10 to-red-500/5 text-red-500",
    blue: "from-blue-500/10 to-blue-500/5 text-blue-500",
    orange: "from-orange-500/10 to-orange-500/5 text-orange-500",
};

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    description,
    variant = "primary",
    className,
    isLoading = false
}) => {
    return (
        <Card className={cn("border-none shadow-lg bg-gradient-to-br", variantStyles[variant], className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-80">{title}</CardTitle>
                <Icon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                ) : (
                    <>
                        <div className="text-2xl font-bold text-foreground">{value}</div>
                        {description && (
                            <p className={cn("text-xs mt-1 font-medium", variant === "primary" ? "text-primary/70" : `text-${variant}-600`)}>
                                {description}
                            </p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsCard;
