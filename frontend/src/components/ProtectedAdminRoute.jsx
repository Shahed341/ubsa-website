import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  /**
   * SECURITY LOGIC:
   * We use sessionStorage instead of localStorage. 
   * This ensures the token is destroyed as soon as the browser tab is closed.
   */
  const isAuthenticated = sessionStorage.getItem('adminToken') === 'true';

  // If not authenticated, redirect specifically to the admin login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;