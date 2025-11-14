import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { RoutesHolder } from '../routes/RoutesHolder';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
export const AppProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RoutesHolder />
      <ToastContainer />
    </QueryClientProvider>
  );
};
