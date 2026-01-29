import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number | string;
  fullPage?: boolean;
}

export function CustomLoader({ className, size = 40, fullPage = false }: LoaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-center p-8",
      fullPage && "fixed inset-0 z-[100] bg-background/80 backdrop-blur-md min-h-screen",
      className
    )}>
      <div className="relative">
        <Loader size={size} className="text-primary animate-spin" />
        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
      </div>
    </div>
  );
}
