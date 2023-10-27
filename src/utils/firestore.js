import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

async function getAuthorByUID(uid) {
    const usersRef = collection(db, 'users');
    
    const q = query(usersRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log(`Author doesn't exist: ${uid}`);
        return null;
    } else {
        // Returning the first matched document, as UID should be unique
        return querySnapshot.docs[0].data();
    }
}

export { getAuthorByUID }