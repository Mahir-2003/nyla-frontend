import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

async function getAuthorByUID(uid) {
  const usersRef = collection(db, "users");

  const q = query(usersRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log(`Author doesn't exist: ${uid}`);
    return null;
  } else {
    // Returning the first matched document, as UID should be unique
    return querySnapshot.docs[0].data();
  }
}

// A function to update progress when a lesson is started
function startLesson(userUid, courseId, unitId, lessonId) {
  const userProgressRef = db
    .collection("users")
    .doc(userUid)
    .collection("progress")
    .doc(courseId);

  const lessonProgress = {
    status: "in progress",
    startedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  userProgressRef.set(
    {
      unitsProgress: {
        [unitId]: {
          lessonsProgress: {
            [lessonId]: lessonProgress,
          },
          status: "in progress", // Update the unit status if necessary
        },
      },
    },
    { merge: true }
  );
}

// A function to update progress when a lesson is completed
function completeLesson(userUid, courseId, unitId, lessonId, score) {
  const userProgressRef = db
    .collection("users")
    .doc(userUid)
    .collection("progress")
    .doc(courseId);

  const lessonProgress = {
    status: "completed",
    score: score,
    completedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  // Update the lesson progress
  userProgressRef.set(
    {
      unitsProgress: {
        [unitId]: {
          lessonsProgress: {
            [lessonId]: lessonProgress,
          },
          // Update the unit status and score if necessary
        },
      },
    },
    { merge: true }
  );
}

export { getAuthorByUID };
