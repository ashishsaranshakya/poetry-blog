import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ExplorePage from './pages/ExplorePage';
import AddPoemPage from './pages/AddPoemPage';
import './styles/global.css';
import ProtectedRoute from './components/ProtectedRoute';
import Favorites from './pages/FavoritesPage';
import { PoemsProvider } from './context/PoemsContext';
import { SettingsProvider } from './context/SettingsContext';
import HomePage from './pages/HomePage';
import PoemPage from './pages/PoemPage';
import AdminPage from './pages/AdminPage';
import EditPage from './pages/EditPage';
import AboutAuthorPage from './pages/AboutAuthorPage';

const App = () => {
  
  return (
    <SettingsProvider>
      <PoemsProvider>
        <Router>
          <div className="app flex flex-col min-h-screen">
            <Header />
            <div className="content flex-grow p-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/poem/:id" element={<PoemPage />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/about-author" element={<AboutAuthorPage />} />
                <Route path="/add-poem" element={
                  <ProtectedRoute isAdmin message="You must be logged in to add poems.">
                    <AddPoemPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute isAdmin message="You must be logged in to edit poems.">
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/edit/:id" element={
                  <ProtectedRoute isAdmin message="You must be logged in to edit poems.">
                    <EditPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </PoemsProvider>
    </SettingsProvider>
  );
};

export default App;