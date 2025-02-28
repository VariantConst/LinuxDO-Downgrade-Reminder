import { cn } from "@/lib/utils";

interface TrustLevelBadgeProps {
  level: number;
  className?: string;
}

export function TrustLevelBadge({ level, className }: TrustLevelBadgeProps) {
  const getBadgeColor = () => {
    switch (level) {
      case 3:
        return "bg-green-500/10 text-green-800/80 border-green-500/20";
      case 2:
        return "bg-yellow-500/10 text-yellow-800/80 border-yellow-500/20";
      case 1:
        return "bg-orange-500/10 text-orange-800/80 border-orange-500/20";
      case 0:
        return "bg-red-500/10 text-red-800/80 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-800/80 border-blue-500/20";
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full border",
        getBadgeColor(),
        className
      )}
    >
      {level == 5
        ? "五级"
        : level == 4
        ? "四级"
        : level == 3
        ? "三级"
        : level == 2
        ? "二级"
        : "一级"}
      佬
    </div>
  );
}
