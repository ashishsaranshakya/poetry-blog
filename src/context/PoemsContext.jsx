import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { deleteDoc, setDoc, getDocs } from 'firebase/firestore';

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

  useEffect(() => {
    const loadFavorites = async (userId) => {
      const favoritesRef = collection(db, `users/${userId}/favorites`);
      const favoriteDocs = await getDocs(favoritesRef);
      const favoriteIds = favoriteDocs.docs.map((doc) => doc.id);
      setFavorites(favoriteIds);      
    };

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        loadFavorites(user.uid);
      } else {
        setFavorites([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const toggleFavorite = async (poemId) => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to favorite a poem.');
      return;
    }

    const favoriteRef = doc(db, `users/${user.uid}/favorites`, poemId);

    if (favorites.includes(poemId)) {
      await deleteDoc(favoriteRef);
      setFavorites(favorites.filter((id) => id !== poemId));
      setPoems((prevPoems) =>
        prevPoems.map((poem) =>
          poem.id === poemId ? { ...poem, isFavorite: false } : poem
        )
      );
    }
    else {
      await setDoc(favoriteRef, { poemId });
      setFavorites([...favorites, poemId]);
      setPoems((prevPoems) =>
        prevPoems.map((poem) =>
          poem.id === poemId ? { ...poem, isFavorite: true } : poem
        )
      );
    }
  };

  return (
    <PoemsContext.Provider value={{ poems, loading, favorites, toggleFavorite }}>
      {children}
    </PoemsContext.Provider>
  );
};
