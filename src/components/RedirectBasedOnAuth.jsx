import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RedirectBasedOnAuth() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}