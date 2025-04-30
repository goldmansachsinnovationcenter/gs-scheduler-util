import React from "react";

interface BackdropProps {
  isOpen: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function Backdrop({ isOpen, children, className = "" }: BackdropProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}

export function LoadingBackdrop({ isOpen }: { isOpen: boolean }) {
  return (
    <Backdrop isOpen={isOpen}>
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Processing...</p>
      </div>
    </Backdrop>
  );
}
