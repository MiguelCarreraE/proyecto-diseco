import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PublicRoute({ children }) {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard"/>;
  }
  
  return children;
}