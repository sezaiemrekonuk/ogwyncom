import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import CMSLogin from './CMSLogin';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#16161B] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <CMSLogin />;
  }

  return children;
};

export default ProtectedRoute;
