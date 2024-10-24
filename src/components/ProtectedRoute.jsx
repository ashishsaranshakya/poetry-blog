import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import GoogleLogin from './GoogleLogin';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]"> 
        <p className="text-xl mb-4 text-center">You must be logged in to add poems.</p>
        <GoogleLogin />
      </div>
    );
  }

  if (user.uid !== import.meta.env.VITE_USER_ID) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <p className="text-xl text-center">You do not have permission to add poems.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;