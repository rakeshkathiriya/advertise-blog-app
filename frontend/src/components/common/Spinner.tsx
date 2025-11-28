import { Loader } from 'lucide-react';

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm ${className}`}>
      <Loader className="h-7 w-7 animate-spin text-[#3a4b66]" />
    </div>
  );
};
