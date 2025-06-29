import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-sm p-4 mt-auto">
      <div className="container mx-auto text-center space-y-2">
        <div className="flex flex-row justify-center items-center gap-2">
          <Link to="/about-author" className="text-blue-400 hover:underline">
            About Me
          </Link>
          <span>|</span>
          <a href="https://www.instagram.com/ashishsaranshakya" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">Instagram</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Ashish Saran Shakya. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
