import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Loader2 } from 'lucide-react';
import { JSX } from 'react';
import { Navigate } from 'react-router';

interface Props {
  element: JSX.Element;
}

export const PublicRoute = ({ element }: Props) => {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center text-gray-600">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!isError || user) {
    return <Navigate to="/" replace />;
  }

  return element;
};
