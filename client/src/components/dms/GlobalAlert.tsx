import { useAlertStore } from '@/store/useAlertStore';
import { CircleCheck, CircleX, Info } from 'lucide-react';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const GlobalAlert = () => {
  const { alert, clearAlert } = useAlertStore(); // Acceder al estado y acciones del store

  // Efecto para limpiar la alerta después de 5 segundos
  useEffect(() => {
    // Solo configurar el temporizador si hay una alerta activa
    if (alert) {
      // Configurar el temporizador para limpiar la alerta
      const timer = setTimeout(() => clearAlert(), 5000);
      // Limpiar el temporizador si el componente se desmonta o la alerta cambia
      return () => clearTimeout(timer);
    }
  }, [alert, clearAlert]);

  // Si no hay alerta, no renderizar nada
  if (!alert) return null;

  return (
    <div className="fixed flex justify-center w-full gap-4 bottom-8 z-[100]">
      <Alert
        className={`w-fit max-w-xl h-auto 
        ${alert?.type === 'success' ? 'text-green-500 border-green-300' : ''}
        ${alert?.type === 'error' ? 'text-red-500 border-red-300' : ''}`}
      >
        {alert?.type === 'info' ? (
          <Info />
        ) : alert?.type === 'success' ? (
          <CircleCheck />
        ) : (
          <CircleX />
        )}
        <AlertDescription>{alert?.message}</AlertDescription>
      </Alert>
    </div>
  );
};
