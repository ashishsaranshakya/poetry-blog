import React, { createContext, useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export const PoemsContext = createContext();

export const PoemsProvider = ({ children }) => {
  const [poems, setPoems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoems = async () => {
      const poemsCollectionRef = collection(db, 'poems');
      const unsubscribe = onSnapshot(poemsCollectionRef, (snapshot) => {
        const poemsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPoems(poemsList);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchPoems();
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      const fetchFavorites = async () => {
        const userFavoritesRef = collection(db, `users/${auth.currentUser.uid}/favorites`);
        const unsubscribe = onSnapshot(userFavoritesRef, (snapshot) => {
          const favoritesList = snapshot.docs.map((doc) => doc.id);
          setFavorites(favoritesList);
        });

        return () => unsubscribe();
      };

      fetchFavorites();
    }
  }, [auth.currentUser]);

  const toggleFavorite = async (poemId) => {
    const user = auth.currentUser;
    if (!user) return;

    const favoriteRef = doc(db, `users/${user.uid}/favorites`, poemId);

    if (favorites.includes(poemId)) {
      await deleteDoc(favoriteRef);
      setFavorites(favorites.filter((id) => id !== poemId));
    } else {
      await setDoc(favoriteRef, { poemId });
      setFavorites([...favorites, poemId]);
    }
  };

  return (
    <PoemsContext.Provider value={{ poems, favorites, toggleFavorite, loading }}>
      {children}
    </PoemsContext.Provider>
  );
};