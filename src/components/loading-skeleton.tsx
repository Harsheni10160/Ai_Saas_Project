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
    const baseClasses = "animate-pulse bg-gradient-to-r from-secondary via-secondary/50 to-secondary";

    const variantClasses = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded-2xl",
        card: "rounded-2xl border-2 border-black/5"
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
        <div className="hi-card p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-32 h-4" />
                    <Skeleton variant="text" className="w-24 h-3" />
                </div>
            </div>
            <Skeleton variant="text" className="w-full h-8" />
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="hi-card p-6">
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
        <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-black/5">
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
        <div className="hi-card p-6">
            <Skeleton variant="text" className="w-40 h-6 mb-6" />
            <div className="h-64 flex items-end gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="rectangular"
                        className="flex-1"
                        height={Math.random() * 200 + 50}
                    />
                ))}
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton variant="text" className="w-48 h-10" />
                <Skeleton variant="text" className="w-64 h-4" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );
}
