import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const poemsCollectionRef = collection(db, 'poems');

// Fetch all poems
export const fetchPoems = async () => {
	const data = await getDocs(poemsCollectionRef);
	console.log(data.docs)
  return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

// Add a new poem
export const addPoem = async (poem) => {
  const result = await addDoc(poemsCollectionRef, poem);
  return result.id;
};
