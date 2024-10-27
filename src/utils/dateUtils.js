export const formatFirebaseTimestamp = (firebaseTimestamp) => {
	const jsDate = firebaseTimestamp.toDate();
  
	const day = jsDate.getDate().toString().padStart(2, '0');
	const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
	const year = jsDate.getFullYear();
  
	return `${day}/${month}/${year}`;
};