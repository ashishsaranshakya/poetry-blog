import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, getDoc, updateDoc, increment, deleteDoc, setDoc, getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

export const PoemsContext = createContext();

function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(array, seed) {
    let currentIndex = array.length, randomIndex;
    const random = mulberry32(seed);

    while (currentIndex !== 0) {
        randomIndex = Math.floor(random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

export const PoemsProvider = ({ children }) => {
  const [title, setTitle] = useState('My Writing Palace');
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
      let fetchedPoems = snapshot.docs.map(doc => ({
        id: doc.id,
        reads: doc.data().reads ?? 0,
        ...doc.data()
      }));

      const currentHour = new Date().getHours();
      fetchedPoems = seededShuffle([...fetchedPoems], currentHour);

      setPoems(fetchedPoems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const countPoemRead = async (poemId) => {
    const poemRef = doc(db, 'poems', poemId);

    try {
      const poemSnap = await getDoc(poemRef);
      if (poemSnap.exists()) {
        const poemData = poemSnap.data();
        if (typeof poemData.reads !== 'number') {
          await updateDoc(poemRef, { reads: 1 });
        } else {
          await updateDoc(poemRef, { reads: poemData.reads + 1 });
        }
      }
    } catch (error) {
      console.error("Error handling global read count:", error);
    }

    if (user) {
      const userPoemRef = doc(db, `users/${user.uid}/readPoems`, poemId);
      try {
        const userDocSnap = await getDoc(userPoemRef);
        if (userDocSnap.exists()) {
          await updateDoc(userPoemRef, {
            count: increment(1)
          });
        } else {
          await setDoc(userPoemRef, { count: 1 });
        }
      } catch (error) {
        console.error("Error updating user-specific read count:", error);
      }
    }
  };

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

      for (const poemId of localFavorites) {
        if (!favoriteIds.includes(poemId)) {
          const favoriteRef = doc(db, `users/${userId}/favorites`, poemId);
          await setDoc(favoriteRef, {poemId});
        }
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

  const deletePoem = async (poemId) => {
    try {
      await deleteDoc(doc(db, 'poems', poemId));
    } catch (error) {
      console.error("Error deleting poem:", error);
    }
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <PoemsContext.Provider value={{ user, setUser, poems, setPoems, loading, favorites, toggleFavorite, deletePoem, countPoemRead, title, setTitle }}>
      {children}
    </PoemsContext.Provider>
  );
};
