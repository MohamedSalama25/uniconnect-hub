import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number | string;
}

export function CustomLoader({ className, size = 40 }: LoaderProps) {
  return (
    <div className={cn(
      "absolute inset-0 z-50 flex items-center justify-center bg-background min-h-[80vh]",
      className
    )}>
      <Loader size={size} className="text-primary animate-spin" />
    </div>
  );
}
