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
      <div>
        <p>You must be logged in to add poems.</p>
        <GoogleLogin />
      </div>
    );
  }

  if (user.uid !== import.meta.env.VITE_USER_ID) {
    return <div>You do not have permission to add poems.</div>;
  }

  return children;
};

export default ProtectedRoute;