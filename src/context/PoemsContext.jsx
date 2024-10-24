import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export const PoemsContext = createContext();

export const PoemsProvider = ({ children }) => {
  const [poems, setPoems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'poems'), (snapshot) => {
      const fetchedPoems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPoems(fetchedPoems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPoem = (poem) => {
    setPoems((prevPoems) => [...prevPoems, poem]);
  };

  const toggleFavorite = (poemId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(poemId)) {
        return prevFavorites.filter(id => id !== poemId);
      } else {
        return [...prevFavorites, poemId];
      }
    });
  };

  return (
    <PoemsContext.Provider value={{ poems, loading, favorites, toggleFavorite, addPoem }}>
      {children}
    </PoemsContext.Provider>
  );
};
