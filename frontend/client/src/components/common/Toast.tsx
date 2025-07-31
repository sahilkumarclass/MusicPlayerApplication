import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts } = useToast();

  const getIcon = (variant: string) => {
    switch (variant) {
      case 'destructive':
        return <XCircle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getBgColor = (variant: string) => {
    switch (variant) {
      case 'destructive':
        return 'bg-music-error';
      case 'success':
        return 'bg-music-success';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-music-accent';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getBgColor(toast.variant || 'default')} text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300`}
        >
          <div className="flex items-center space-x-3">
            {getIcon(toast.variant || 'default')}
            <div>
              {toast.title && <div className="font-semibold">{toast.title}</div>}
              {toast.description && <div className="text-sm">{toast.description}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
