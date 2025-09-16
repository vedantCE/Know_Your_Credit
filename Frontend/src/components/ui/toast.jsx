import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, ...toast };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback((options) => {
    if (typeof options === 'string') {
      return addToast({ title: options, type: 'info' });
    }
    return addToast(options);
  }, [addToast]);

  toast.success = useCallback((title, description) => {
    return addToast({ title, description, type: 'success' });
  }, [addToast]);

  toast.error = useCallback((title, description) => {
    return addToast({ title, description, type: 'error' });
  }, [addToast]);

  toast.warning = useCallback((title, description) => {
    return addToast({ title, description, type: 'warning' });
  }, [addToast]);

  toast.info = useCallback((title, description) => {
    return addToast({ title, description, type: 'info' });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[toast.type] || Info;

  const variants = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={cn(
      'min-w-80 max-w-md p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-full',
      variants[toast.type] || variants.info
    )}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-medium">{toast.title}</div>
          {toast.description && (
            <div className="text-sm opacity-90 mt-1">{toast.description}</div>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastClose = ({ onClick }) => (
  <button onClick={onClick} className="opacity-70 hover:opacity-100">
    <X className="w-4 h-4" />
  </button>
);

export const ToastTitle = ({ children }) => (
  <div className="font-medium">{children}</div>
);

export const ToastDescription = ({ children }) => (
  <div className="text-sm opacity-90 mt-1">{children}</div>
);

export const ToastViewport = () => null;