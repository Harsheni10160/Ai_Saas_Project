import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular" | "card";
    width?: string | number;
    height?: string | number;
    count?: number;
}

export function Skeleton({
    className = "",
    variant = "rectangular",
    width,
    height,
    count = 1
}: SkeletonProps) {
    const baseClasses = "animate-pulse bg-zinc-100";

    const variantClasses = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg",
        card: "rounded-xl border border-zinc-200"
    };

    const style = {
        width: width || undefined,
        height: height || undefined,
    };

    if (count > 1) {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
                        style={style}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
}

// Specialized skeleton components
export function CardSkeleton() {
    return (
        <div className="p-6 rounded-xl border border-zinc-200 space-y-4 bg-white shadow-sm">
            <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-32 h-4" />
                    <Skeleton variant="text" className="w-24 h-3" />
                </div>
            </div>
            <Skeleton variant="text" className="w-full h-12" />
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="p-5 rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <Skeleton variant="rectangular" width={40} height={40} />
                <Skeleton variant="text" className="w-24 h-4" />
            </div>
            <Skeleton variant="text" className="w-20 h-10" />
        </div>
    );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-100 bg-white">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    className={i === 0 ? "w-32" : "flex-1"}
                />
            ))}
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="p-8 rounded-xl border border-zinc-200 bg-white shadow-sm h-[500px] flex flex-col">
            <Skeleton variant="text" className="w-40 h-6 mb-8" />
            <div className="flex-1 flex items-end gap-3">
                {Array.from({ length: 15 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="rectangular"
                        className="flex-1"
                        height={Math.random() * 80 + 20 + "%"}
                    />
                ))}
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div className="space-y-3">
                    <Skeleton variant="text" className="w-48 h-10" />
                    <Skeleton variant="text" className="w-64 h-4" />
                </div>
                <div className="flex gap-2">
                    <Skeleton variant="rectangular" width={120} height={36} />
                    <Skeleton variant="rectangular" width={120} height={36} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CardSkeleton />
                </div>
                <div>
                    <CardSkeleton />
                </div>
            </div>
        </div>
    );
}
