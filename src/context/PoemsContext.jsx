import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { deleteDoc, setDoc, getDocs } from 'firebase/firestore';

export const PoemsContext = createContext();

export const PoemsProvider = ({ children }) => {
  const [poems, setPoems] = useState([]);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
      syncLocalFavorites(userId, favoriteIds);
    };

    const syncLocalFavorites = async (userId, favoriteIds) => {
      const localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      if (localFavorites.length === 0) return;
      
      const uniqueFavorites = [...new Set([...favoriteIds, ...localFavorites])];
      const newFavorites = uniqueFavorites.filter((poemId) => !favoriteIds.includes(poemId));
      
      for (const poemId of newFavorites) {
        const favoriteRef = doc(db, `users/${userId}/favorites`, poemId);
        await setDoc(favoriteRef, {poemId});
      }
      
      setFavorites(uniqueFavorites);
      localStorage.removeItem('favorites');
    };

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        loadFavorites(user.uid);
      }
      else {
        const localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(localFavorites);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const toggleFavorite = async (poemId) => {
    const user = auth.currentUser;

    if (user) {
      const favoriteRef = doc(db, `users/${user.uid}/favorites`, poemId);

      if (favorites.includes(poemId)) {
        await deleteDoc(favoriteRef);
        setFavorites(favorites.filter((id) => id !== poemId));
      }
      else {
        await setDoc(favoriteRef, { poemId });
        setFavorites([...favorites, poemId]);
      }
    }
    else {
      const localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const updatedFavorites = localFavorites.includes(poemId)
        ? localFavorites.filter((id) => id !== poemId)
        : [...localFavorites, poemId];

      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  };

  return (
    <PoemsContext.Provider value={{ user, setUser, poems, setPoems, loading, favorites, toggleFavorite }}>
      {children}
    </PoemsContext.Provider>
  );
};
