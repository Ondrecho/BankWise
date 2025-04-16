import React from "react";

interface LoadingSpinnerProps {
    className?: string; // Добавляем опциональное свойство className
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
    return (
        <div className={`flex items-center justify-center h-64 ${className}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
}