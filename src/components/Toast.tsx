import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastInfo } from '../types';

interface ToastProps {
  toast: ToastInfo | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.tone) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-white" />;
      case 'info':
        return <Info className="w-4 h-4 text-[#A1A1A1]" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-white fill-white stroke-black" />;
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#121212] border border-[#2A2A2A] shadow-2xl text-xs sm:text-sm text-[#F5F5F5] select-none">
        {getIcon()}
        <span className="font-medium tracking-tight">{toast.message}</span>
        <button
          onClick={onDismiss}
          className="ml-2 p-1 text-[#5C5C5C] hover:text-white transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
