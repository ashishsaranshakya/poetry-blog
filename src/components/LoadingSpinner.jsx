import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
      <style>{`
        .loader {
          border-width: 4px;
          border-radius: 50%;
          border-top-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
