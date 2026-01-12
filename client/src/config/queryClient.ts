import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    // Peticiones GET, consultas de datos
    queries: {
      retry: 1, // Reintentar una vez en caso de fallo
      refetchOnWindowFocus: true, // Refrescar al volver a la ventana
      staleTime: 1000 * 60 * 1, // Datos Frescos por 1 minuto (reutiliza desde cache durante 1 minuto hasta vencimiento)
    },
    // POST, PUT y DELETE, mutaciones de datos
    mutations: {
      retry: 0, // Si falta evita reintentos (evitar registros duplicados)
    },
  },
});
