import React, { useContext } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import { PoemsContext } from '../context/PoemsContext';

const GoogleLogin = () => {
  const { user, setUser } = useContext(PoemsContext);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user)
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div>
      {!user ? (
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login with Google
        </button>
      ) : (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button
            onClick={() => auth.signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
