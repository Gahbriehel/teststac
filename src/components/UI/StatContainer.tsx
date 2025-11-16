import { ReactNode } from "react";

interface StatItem {
  title: string;
  value: string | number;
  loading?: boolean;
}

interface StatContainerProps {
  data: StatItem[];
  className?: string;
}

export function StatContainer({
  data,
  className = "",
}: StatContainerProps): ReactNode {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 ${className}`}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          {item.loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          ) : (
            <>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                {item.title.toUpperCase()}
              </h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                {item.value}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
