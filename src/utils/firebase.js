import { initializeApp } from 'firebase/app'
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updatePassword } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, query, where, getDocs, orderBy, startAt, endAt, updateDoc, getCountFromServer, writeBatch } from 'firebase/firestore'
 
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

  export const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  }

  export const updateUserPassword = async (password) => {
    var response = "success";
    try {
      await updatePassword(auth.currentUser, password);

      const userDocRef = doc(db, 'Users', auth.currentUser.uid);
      await updateDoc(userDocRef, {password});
    } catch (error) {
      response = error.message;
    }
  
    return response;
  }

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

  export const checkExistingBeneficiary = async (uid) => {
    const documentRef = collection(db, "Users");
    const userDocs = [];
        
    var q = query(documentRef, where("uid", "==", uid));

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

  export const createProjectDocument = async (additionalInformation = {}) => {
    const ref = collection(db, 'Projects');
    var response;

    try {
      const created = new Date();
      const year = parseInt(created.getFullYear());
      const doc = await addDoc(ref, {
        year,
        created,
          ...additionalInformation
      });
      response = doc.id;
    } catch (error) {
      response = "error: " + error.message;
    }

    return response;
  }

  export const getBeneficiaryDocuments = async (status, municipality, barangay) => {
    const docRef = collection(db, "Users");
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

  export const getBeneficiaries = async (status, municipality, barangay) => {
    const docRef = collection(db, "Users");
    const docs = [];
    var q = query(docRef, where("status", "==", status), orderBy("created", "desc"));
    if (municipality !== "All") {
      q = query(docRef, where("status", "==", status), where("municipality", "in", municipality), orderBy("created", "desc"));
      
      if (barangay !== "All") {
        q = query(docRef, where("status", "==", status), where("municipality", "in", municipality), where("barangay", "in", barangay), orderBy("created", "desc"));
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

  export const updateBeneficiariesLast = async (list) => {
    const batch = writeBatch(db);

    const last = new Date();
    list.forEach((item, index) => {
      const sfRef = doc(db, "Users", item);
      batch.update(sfRef, {last});
    });

    var response = "success";
    try {
      await batch.commit();
    } catch (error) {
      response = "error: " + error.message;
    }

    return response;
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
    var q = query(docRef, where("status", "!=", "deleted"), orderBy("status"), orderBy("created", "desc"));
    if (municipality !== "All") {
      q = query(docRef, where("status", "!=", "deleted"), orderBy("status"), where("municipality", "==", municipality), orderBy("created", "desc"));

      if (status !== "") {
        q = query(docRef, where("status", "==", status), where("municipality", "==", municipality), orderBy("created", "desc"));
      }

      if (barangay !== "All") {
        q = query(docRef,where("status", "!=", "deleted"),  orderBy("status"), where("municipality", "==", municipality), where("barangay", "==", barangay), orderBy("created", "desc"));

        if (status !== "") {
          q = query(docRef, where("status", "==", status), where("municipality", "==", municipality), where("barangay", "==", barangay), orderBy("created", "desc"));
        }
      }
    } else {
      if (status !== "") {
        q = query(docRef, where("status", "==", status), orderBy("created", "desc"));
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

  export const getFinishedProjects = async (year, status, municipality, barangay) => {
    const docRef = collection(db, "Projects");
    const docs = [];
    var q = query(docRef, where("status", "==", status), orderBy("created", "desc"));

    if (year !== "All") {
      q = query(docRef, where("year", "==", parseInt(year)), where("status", "==", status), orderBy("created", "desc"));

      if (municipality !== "All") {
        q = query(docRef, where("year", "==", parseInt(year)), where("status", "==", status), where("municipality", "==", municipality), orderBy("created", "desc"));
        if (barangay !== "All") {
          q = query(docRef, where("year", "==", parseInt(year)), where("status", "==", status), where("municipality", "==", municipality), where("barangay", "==", barangay), orderBy("created", "desc"));
        }
      }
    } else {
      if (municipality !== "All") {
        q = query(docRef, where("status", "==", status), where("municipality", "==", municipality), orderBy("created", "desc"));
        if (barangay !== "All") {
          q = query(docRef, where("status", "==", status), where("municipality", "==", municipality), where("barangay", "==", barangay), orderBy("created", "desc"));
        }
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

  export const getValues = async (id) => {
    const documentRef = doc(db, "Values", id);
    var value;

    try {
      const doc = await getDoc(documentRef);
      value = doc.data().value;
    } catch (error) {
      console.log("error", error.message);
    }

    return value;
  }

  export const getBeneficiaryDocument = async (id) => {
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

  export const updateValues = async (id, value) => {
    const documentRef = doc(db, "Values", id);
    var response;

    try {
      await updateDoc(documentRef, {value});
      response = "success";
    } catch (error) {
      response = "error: " + error.message;
    }

    return response;
  }
  
  export const updateBeneficiaryDocument = async (id, additionalInformation = {}) => {
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