// import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
// import { db } from './firebase.js';

// const COLLECTION_NAME = 'warranties';

// /** True if a warranty with this serial number already exists. */
// export async function serialExists(serial) {
//   const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where('serial', '==', serial)));
//   return !snapshot.empty;
// }

// /** Creates a new warranty registration document. Called from the admin page only. */
// export async function registerWarranty({ name, email, productId, productTitle, serial, purchaseDate, dealer }) {
//   // Calculate 1-year expiry
//   const pDate = new Date(purchaseDate);
//   pDate.setFullYear(pDate.getFullYear() + 1);
//   const calculatedExpiry = pDate.toISOString().split('T')[0];

//   return addDoc(collection(db, COLLECTION_NAME), {
//     name: name.trim(),
//     email: email.trim().toLowerCase(),
//     productId,
//     productTitle,
//     serial: serial.trim(),
//     purchaseDate, 
//     ExpiryDate: calculatedExpiry, 
//     dealer: (dealer || '').trim(),
//     registeredAt: serverTimestamp(),
//   });
// }

// /** Looks up a warranty by serial + email. Returns the record data or null. Called from the public lookup page. */
// export async function lookupWarranty(serial, email) {
//   const snapshot = await getDocs(
//     query(
//       collection(db, COLLECTION_NAME),
//       where('serial', '==', serial.trim()),
//       where('email', '==', email.trim().toLowerCase())
//     )
//   );
//   return snapshot.empty ? null : snapshot.docs[0].data();
// }

// /** --- ADMIN DASHBOARD FUNCTIONS --- */

// /** Fetches all registered warranties */
// export async function getAllWarranties() {
//   const snapshot = await getDocs(collection(db, COLLECTION_NAME));
//   return snapshot.docs.map(doc => doc.data());
// }

// /** Searches for a specific warranty by serial number */
// export async function searchWarrantyBySerial(serial) {
//   const snapshot = await getDocs(
//     query(collection(db, COLLECTION_NAME), where('serial', '==', serial.trim()))
//   );
//   return snapshot.docs.map(doc => doc.data());
// }


import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  doc,          // <-- Added for edit/delete
  deleteDoc,    // <-- Added for edit/delete
  updateDoc     // <-- Added for edit/delete
} from 'firebase/firestore';
import { db } from './firebase.js';

const COLLECTION_NAME = 'warranties';

/** True if a warranty with this serial number already exists. */
export async function serialExists(serial) {
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where('serial', '==', serial)));
  return !snapshot.empty;
}

/** Creates a new warranty registration document. Called from the admin page only. */
export async function registerWarranty({ name, email, productId, productTitle, serial, purchaseDate, dealer, carNumber }) {
  // Calculate 1-year expiry
  const pDate = new Date(purchaseDate);
  pDate.setFullYear(pDate.getFullYear() + 2);
  const calculatedExpiry = pDate.toISOString().split('T')[0];

  return addDoc(collection(db, COLLECTION_NAME), {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    productId,
    productTitle,
    serial: serial.trim(),
    purchaseDate, 
    ExpiryDate: calculatedExpiry, 
    dealer: (dealer || '').trim(),
    carNumber: (carNumber || '').trim(),
    registeredAt: serverTimestamp(),
  });
}

/** Looks up a warranty by car number + email. Returns the record data or null. Called from the public lookup page. */
export async function lookupWarranty(carNumber, email) {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where('carNumber', '==', carNumber.trim()), // <-- Changed from 'serial' to 'carNumber'
      where('email', '==', email.trim().toLowerCase())
    )
  );
  return snapshot.empty ? null : snapshot.docs[0].data();
}

/** --- ADMIN DASHBOARD FUNCTIONS --- */

/** Fetches all registered warranties */
export async function getAllWarranties() {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  // UPDATED: Now includes doc.id so the admin panel knows exactly which record to edit/delete
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/** Searches for a specific warranty by car number */
export async function searchWarrantyByCarNumber(carNumber) {
  const snapshot = await getDocs(
    query(collection(db, COLLECTION_NAME), where('carNumber', '==', carNumber.trim()))
  );
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/** --- NEW ADMIN EDIT/DELETE FUNCTIONS --- */

/** Deletes a warranty from the database using its document ID */
export async function deleteWarranty(docId) {
  const docRef = doc(db, COLLECTION_NAME, docId);
  await deleteDoc(docRef);
}

/** 
 * Updates an existing warranty. 
 * Pass the document ID, and an object with the fields you want to change.
 */
export async function updateWarranty(docId, updatedFields) {
  const docRef = doc(db, COLLECTION_NAME, docId);

  // If the admin is updating the purchase date, we must recalculate the 1-year expiry
  if (updatedFields.purchaseDate) {
    const pDate = new Date(updatedFields.purchaseDate);
    pDate.setFullYear(pDate.getFullYear() + 2);
    updatedFields.ExpiryDate = pDate.toISOString().split('T')[0];
  }

  // Clean up strings if they exist in the payload
  if (updatedFields.name) updatedFields.name = updatedFields.name.trim();
  if (updatedFields.email) updatedFields.email = updatedFields.email.trim().toLowerCase();
  if (updatedFields.serial) updatedFields.serial = updatedFields.serial.trim();

  await updateDoc(docRef, updatedFields);
}