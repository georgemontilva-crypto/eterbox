import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconWithBackgroundProps {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  variant?: "purple" | "pink" | "blue" | "green" | "orange" | "red";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  purple: "bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-purple-400",
  pink: "bg-gradient-to-br from-pink-500/20 to-pink-600/20 text-pink-400",
  blue: "bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-400",
  green: "bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-400",
  orange: "bg-gradient-to-br from-orange-500/20 to-orange-600/20 text-orange-400",
  red: "bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-400",
};

const sizeStyles = {
  sm: "w-8 h-8 rounded-lg",
  md: "w-12 h-12 rounded-xl",
  lg: "w-16 h-16 rounded-2xl",
};

const iconSizeStyles = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function IconWithBackground({
  icon: Icon,
  className,
  iconClassName,
  variant = "blue",
  size = "md",
}: IconWithBackgroundProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <Icon className={cn(iconSizeStyles[size], iconClassName)} />
    </div>
  );
}
