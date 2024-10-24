import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PoemList from './components/PoemList';
import AddPoemPage from './components/AddPoemPage';
import './styles/global.css';
import ProtectedRoute from './components/ProtectedRoute';
import Favorites from './components/FavoritesPage';
import { PoemsProvider } from './context/PoemsContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './components/HomePage';
import PoemPage from './components/PoemPage';

const App = () => {
  
  return (
    <ThemeProvider>
      <PoemsProvider>
        <Router>
          <div className="app flex flex-col min-h-screen">
            <Header />
            <div className="content flex-grow p-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/poems" element={<PoemList />} />
                <Route path="/poems/:id" element={<PoemPage />} />
                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                <Route path="/add-poem" element={<ProtectedRoute><AddPoemPage /></ProtectedRoute>} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </PoemsProvider>
    </ThemeProvider>
  );
};

export default App;