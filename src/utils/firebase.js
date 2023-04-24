import { initializeApp } from 'firebase/app'
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, query, where, getDocs, orderBy, startAt, endAt, updateDoc, getCountFromServer } from 'firebase/firestore'
 
const firebaseConfig = {
  apiKey: "AIzaSyA2Yl1je99CEph89RPlehb99anz3gCrxkE",
  authDomain: "dole-tupad.firebaseapp.com",
  projectId: "dole-tupad",
  storageBucket: "dole-tupad.appspot.com",
  messagingSenderId: "61338235125",
  appId: "1:61338235125:web:b1d345c3c4d8b78dcd55bc"
};
  
  const app = initializeApp(firebaseConfig);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: "select_account"
  });

  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);
  
  export const db = getFirestore();

  export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
  }

  export const signInUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
  }

  export const signOutUser = async () => await signOut(auth);

  export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

  export const createUserDocument = async (userAuth, additionalInformation = {}) => {
    if (!userAuth) return;
    
    const userDocRef = doc(db, 'Users', userAuth.uid);
    const userSnapshot = await getDoc(userDocRef);
    var data = userSnapshot.data();

    if (!userSnapshot.exists()) {
        const created = new Date();
        data =  {
          created,
          ...additionalInformation
       };

        try {
            await setDoc(userDocRef, data)
        } catch (error) {
            console.log("error", error.message);
        }
    }

    userAuth["data"] = data;

    return userDocRef;
  }

  export const checkExistingBeneficiary = async (birthDate, lastName, firstName) => {
    const documentRef = collection(db, "Beneficiaries");
    const userDocs = [];
    var q = query(documentRef, where("uid", "==", lastName.toLowerCase() + firstName.toLowerCase() + birthDate.replaceAll("-", "")));

    try {
      const docs = await getDocs(q);

      docs.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          userDocs.push(data);
      });

    } catch (error) {
      console.log("error", error.message);
    }

    return userDocs.length > 0;
  }

  export const createBeneficiaryDocument = async (additionalInformation = {}) => {
    const ref = collection(db, 'Beneficiaries');
    var response;

    try {
      const created = new Date();
      const uid = additionalInformation.lastName.toLowerCase() + additionalInformation.firstName.toLowerCase() + additionalInformation.birthDate.replaceAll("-", "");
      const doc = await addDoc(ref, {
        uid,
        created,
          ...additionalInformation
      });
      response = doc.id;
    } catch (error) {
      response = "error: " + error.message;
    }

    return response;
  }

  export const createProjectDocument = async (additionalInformation = {}) => {
    const ref = collection(db, 'Projects');
    var response;

    try {
      const created = new Date();
      const doc = await addDoc(ref, {
        created,
          ...additionalInformation
      });
      response = doc.id;
    } catch (error) {
      response = "error: " + error.message;
    }

    return response;
  }

  export const getBeneficiaryDocuments = async (municipality, barangay) => {
    const docRef = collection(db, "Beneficiaries");
    const docs = [];
    var q = query(docRef, orderBy("created", "desc"));
    if (municipality !== "All") {
      q = query(docRef, where("municipality", "==", municipality), orderBy("created", "desc"));
      
      if (barangay !== "All") {
        q = query(docRef, where("municipality", "==", municipality), where("barangay", "==", barangay), orderBy("created", "desc"));
  
      }
    }

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          docs.push(data);
      });

    } catch (error) {
      console.log("error", error.message);
    }

    return docs;
  }

  export const getAccountDocuments = async () => {
    const docRef = collection(db, "Users");
    const docs = [];
    var q = query(docRef, where("type", "==", "admin"), orderBy("lastName", "asc"), orderBy("firstName", "asc"));

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          docs.push(data);
      });

    } catch (error) {
      console.log("error", error.message);
    }

    return docs;
  }

  export const getProjectDocuments = async (status, municipality, barangay) => {
    const docRef = collection(db, "Projects");
    const docs = [];
    var q = query(docRef, where("status", "==", status), orderBy("created", "desc"));
    if (municipality !== "All") {
      q = query(docRef, where("status", "==", status), where("municipality", "==", municipality), orderBy("created", "desc"));
      
      if (barangay !== "All") {
        q = query(docRef, where("status", "==", status), where("municipality", "==", municipality), where("barangay", "==", barangay), orderBy("created", "desc"));
  
      }
    }

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          docs.push(data);
      });

    } catch (error) {
      console.log("error", error.message);
    }

    return docs;
  }

  export const getProjectDocument = async (id) => {
    const documentRef = doc(db, "Projects", id);
    var docRef = null;

    try {
      const doc = await getDoc(documentRef);
      docRef = doc.data();
      docRef["id"] = id;
    } catch (error) {
      console.log("error", error.message);
    }

    return docRef;
  }

  export const getBeneficiaryDocument = async (id) => {
    const documentRef = doc(db, "Beneficiaries", id);
    var docRef = null;

    try {
      const doc = await getDoc(documentRef);
      docRef = doc.data();
      docRef["id"] = id;
    } catch (error) {
      console.log("error", error.message);
    }

    return docRef;
  }

  export const getUserDocument = async (id) => {
    const documentRef = doc(db, "Users", id);
    var docRef = null;

    try {
      const doc = await getDoc(documentRef);
      docRef = doc.data();
      docRef["id"] = id;
    } catch (error) {
      console.log("error", error.message);
    }

    return docRef;
  }

  export const getBeneficiaryProjectDocuments = async (id) => {
    const docRef = collection(db, "Projects");
    const docs = [];
    var q = query(docRef, where("selected", "array-contains", id), orderBy("created", "desc"));

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          docs.push(data);
      });

    } catch (error) {
      console.log("error", error.message);
    }

    return docs;
  }

  export const updateProjectDocument = async (id, additionalInformation = {}) => {
    const userDocRef = doc(db, 'Projects', id);
    var response;

    try {
      await updateDoc(userDocRef, {...additionalInformation});
      response = "success";
    } catch (error) {
      response = "error: " + error.message;
    }

    return response;
  }
  
  export const updateBeneficiaryDocument = async (id, additionalInformation = {}) => {
    const userDocRef = doc(db, 'Beneficiaries', id);
    var response;

    try {
      await updateDoc(userDocRef, {...additionalInformation});
      response = "success";
    } catch (error) {
      response = "error: " + error.message;
    }

    return response;
  }

  export const updateUserDocument = async (id, additionalInformation = {}) => {
    const userDocRef = doc(db, 'Users', id);
    var response;

    try {
      await updateDoc(userDocRef, {...additionalInformation});
      response = "success";
    } catch (error) {
      response = "error: " + error.message;
    }

    return response;
  }