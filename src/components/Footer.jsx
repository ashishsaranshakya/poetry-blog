import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Ashish Saran Shakya. All rights reserved.</p>
        <p>
          Follow me on 
          <a href="https://instagram.com/ashishsaranshakya" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">Instagram</a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
