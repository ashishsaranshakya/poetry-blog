import { useContext } from 'react';
import GoogleLogin from './GoogleLogin';
import { PoemsContext } from '../context/PoemsContext';

const ProtectedRoute = ({ children, message, isAdmin = false }) => {
  const { user } = useContext(PoemsContext);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]"> 
        <p className="text-xl mb-4 text-center">{message || "You must be logged in to access this content."}</p>
        <GoogleLogin />
      </div>
    );
  }

  if (isAdmin && user.uid !== import.meta.env.VITE_USER_ID) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <p className="text-xl text-center">You do not have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
