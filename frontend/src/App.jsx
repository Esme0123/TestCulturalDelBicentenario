import React from 'react';
import { Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages Públicas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TestListPage from './pages/TestListPage';
import RankingsPage from './pages/RankingsPage';
import ChallengeRoom from './pages/ChallengeRoom';
// Pages Protegidas (Requieren Login)
import TestPage from './pages/TestPage'; 
import ResultsPage from './pages/ResultsPage'; 
import ReviewPage from './pages/ReviewPage'; 
import HistoryPage from './pages/HistoryPage'; 
import ProfilePage from './pages/ProfilePage'; 
import DesafiosPage from './pages/DesafiosPage';

// Pages de Admin (Requieren Rol Admin)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminTestsPage from './pages/admin/AdminTestsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// UI Components
import LoadingSpinner from './components/ui/LoadingSpinner'; // Para el estado de carga global

// Componente nuevo para modo desafío


// Componente para rutas protegidas
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    // Muestra un spinner mientras se verifica el estado de autenticación
    return (
      <div className="loading-container full-screen-loader">
        <LoadingSpinner size="large" text="Verificando acceso..." />
      </div>
    );
  }
  // Si no está cargando y no está logueado, redirige a login
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// Componente para rutas de admin
function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-container full-screen-loader">
        <LoadingSpinner size="large" text="Verificando permisos de administrador..." />
      </div>
    );
  }
  // Si no está cargando, y está logueado Y es admin, permite acceso
  return isLoggedIn && isAdmin ? children : <Navigate to="/" replace />;
}

// Wrapper para ChallengeRoom que extrae roomId de la URL y userId del contexto
function ChallengeRoomWrapper() {
  const { roomId } = useParams();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container card">
        <p>Debes iniciar sesión para entrar al desafío.</p>
        <Link to="/login" className="button button-primary">Ir a Iniciar Sesión</Link>
      </div>
    );
  }

  return <ChallengeRoom roomId={roomId} userId={user.id} />;
}

function App() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="loading-container full-screen-loader">
        <LoadingSpinner size="large" text="Cargando aplicación..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="tests" element={<TestListPage />} />
        <Route path="rankings" element={<RankingsPage />} />

        <Route path="test/:id_test" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
        <Route path="resultados/:id_historial" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="revision/:id_historial" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
        <Route path="historial" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="desafios" element={<ProtectedRoute><DesafiosPage /></ProtectedRoute>} />

        {/* Nueva ruta para modo desafío */}
        <Route
          path="challenge/:roomId"
          element={
            <ProtectedRoute>
              <ChallengeRoom />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="preguntas" element={<AdminQuestionsPage />} />
        <Route path="tests" element={<AdminTestsPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="*" element={<NotFoundPage section="Admin" />} />
      </Route>
    </Routes>
  );
}

function NotFoundPage({ section = "General" }) {
  return (
    <div className="not-found-container container card">
      <h1>404 - Página No Encontrada</h1>
      <p>La página que buscas en la sección '{section}' no existe o fue movida.</p>
      <Link to="/" className="button button-primary">Volver al Inicio</Link>
    </div>
  );
}

export default App;
