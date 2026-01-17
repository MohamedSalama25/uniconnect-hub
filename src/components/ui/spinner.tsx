import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: number | string;
}

export function Spinner({ className, size = 24 }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center p-2", className)}>
      <Loader2 
        className="animate-spin text-primary" 
        size={size} 
      />
    </div>
  );
}
