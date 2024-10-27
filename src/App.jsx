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
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import PoemPage from './pages/PoemPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import EditPage from './pages/EditPage';

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
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/poems/:id" element={<PoemPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/favorites" element={<Favorites />} />
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
    </ThemeProvider>
  );
};

export default App;