import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PoemList from './components/PoemList';
import AddPoemPage from './components/AddPoemPage';
import { fetchPoems } from './controllers/poemController';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/global.css';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoems = async () => {
      setLoading(true);
      const fetchedPoems = await fetchPoems();
      setPoems(fetchedPoems);
      setLoading(false);
    };

    loadPoems();
  }, []);

  return (
    <Router>
      <div className="app flex flex-col min-h-screen">
        <Header />
        <div className="content flex-grow p-4">
          <Routes>
            <Route path="/" element={loading ? <LoadingSpinner /> : <PoemList poems={poems} />} />
            <Route path="/add-poem" element={<ProtectedRoute><AddPoemPage /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
