import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

const fetchUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      return null;
    }
    return userDoc.data();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

const fetchUsersStacks = async (uid) => {
  try {
    const stacksRef = collection(db, "stacks");
    const stacksQuery = query(stacksRef, where("ownerUid", "==", uid));
    const querySnapshot = await getDocs(stacksQuery);
    const stacks = [];
    querySnapshot.forEach((doc) => {
      stacks.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return stacks;
  } catch (error) {
    console.error("Error fetching user stacks:", error);
    throw error;
  }
};

const fetchAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

const fetchAllStacks = async () => {
  try {
    const stacksRef = collection(db, "stacks");
    const querySnapshot = await getDocs(stacksRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all stacks:", error);
    throw error;
  }
};

const fetchAllIssues = async () => {
  try {
    const issuesRef = collection(db, "issues");
    const querySnapshot = await getDocs(issuesRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all issues:", error);
    throw error;
  }
};

export {
  fetchUserData,
  fetchUsersStacks,
  fetchAllUsers,
  fetchAllStacks,
  fetchAllIssues,
};
