import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = sessionStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}
