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
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ${className}`}>
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          {item.loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-medium text-gray-500 font-Inter">
                {item.title.toUpperCase()}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
