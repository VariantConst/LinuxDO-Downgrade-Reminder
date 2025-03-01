import { cn } from "@/lib/utils";

interface TrustLevelBadgeProps {
  level: number;
  className?: string;
}

export function TrustLevelBadge({ level, className }: TrustLevelBadgeProps) {
  const getBadgeColor = () => {
    switch (level) {
      case 3:
        return "bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20 dark:border-green-500/30";
      case 2:
        return "bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 dark:border-yellow-500/30";
      case 1:
        return "bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/20 dark:border-orange-500/30";
      case 0:
        return "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-500/30";
      default:
        return "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30";
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
