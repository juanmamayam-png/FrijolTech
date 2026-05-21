import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#2A2417',
              color: '#fff',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#4A6B35', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#B3422F', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
