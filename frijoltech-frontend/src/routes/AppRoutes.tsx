import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

import { LoginPage }           from '../pages/LoginPage';
import { RegisterPage }        from '../pages/RegisterPage';
import { DashboardPage }       from '../pages/DashboardPage';
import { PrediosPage }         from '../pages/PrediosPage';
import { NuevoPredioPage }     from '../pages/NuevoPredioPage';
import { PredioDetailPage }    from '../pages/PredioDetailPage';
import { EditarPredioPage }    from '../pages/EditarPredioPage';
import { CampañasPage }        from '../pages/CampanasPage';
import { NuevaCampañaPage }    from '../pages/NuevaCampanaPage';
import { CronogramaPage }      from '../pages/CronogramaPage';
import { RegistroAvancePage }  from '../pages/RegistroAvancePage';
import { IncidenciaPage }      from '../pages/IncidenciaPage';

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/"         element={<RootRedirect />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"                   element={<DashboardPage />} />
        <Route path="/predios"                     element={<PrediosPage />} />
        <Route path="/predios/nuevo"               element={<NuevoPredioPage />} />
        <Route path="/predios/:id"                 element={<PredioDetailPage />} />
        <Route path="/predios/:id/editar"          element={<EditarPredioPage />} />
        <Route path="/campañas"                    element={<CampañasPage />} />
        <Route path="/campañas/nueva"              element={<NuevaCampañaPage />} />
        <Route path="/campañas/:id/cronograma"     element={<CronogramaPage />} />
        <Route path="/etapas/:id/avance"           element={<RegistroAvancePage />} />
        <Route path="/incidencias/nueva"           element={<IncidenciaPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
