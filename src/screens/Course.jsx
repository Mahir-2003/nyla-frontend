import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { auth, db } from '../utils/firebase';
import { doc, collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../styles/colors";
import styles from "../styles/styles";

const CourseScreen = ({ route }) => {
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const { courseId } = route.params;
    const courseRef = doc(db, "courses", courseId);

    const fetchCourseAndUnits = async () => {
      setLoading(true);
      try {
        const courseSnapshot = await getDoc(courseRef);
        if (!courseSnapshot.exists()) {
          console.log("Course not found!");
          setLoading(false);
          return;
        }
        setCourse(courseSnapshot.data());

        const unitsSnapshot = await getDocs(collection(courseRef, "units"));
        const unitsDataPromises = unitsSnapshot.docs.map(async (unitDoc) => {
          const unitData = unitDoc.data();
          unitData.id = unitDoc.id;
          // Initialize lessons as an empty array to ensure it's never undefined
          unitData.lessons = [];

          try {
            const lessonsSnapshot = await getDocs(
              collection(unitDoc.ref, "lessons")
            );
            unitData.lessons = lessonsSnapshot.docs.map((lessonDoc) => ({
              ...lessonDoc.data(),
              id: lessonDoc.id,
              completed: (lessonDoc.data().completedBy?.includes(auth.currentUser.uid))
            }));
          } catch (error) {
            console.error("Error fetching lessons:", error);
            // You could handle the error here, e.g., by setting an error state
          }

          

          return unitData;
        });

        const unitsData = await Promise.all(unitsDataPromises);
        setUnits(unitsData);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchCourseAndUnits();
  }, [route.params]);

  const handleLessonPress = (courseId, unitId, lessonId) => {
    navigation.navigate("Lesson", { courseId, unitId, lessonId });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const q = query(
      collection(db, "users"),
      where("uid", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      setUserData(doc.data());
    });
  };

  countCompletedLessons = () => {
    return units.reduce((total, currentCourse) => {
        return total + currentCourse.lessons.filter(lesson => lesson.completed).length;
    }, 0);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!course || units.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No course or unit data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: colors.primary }}
    >
      <View
        style={{
          ...styles.card,
          width: "100%",
          borderRadius: 0,
          backgroundColor: colors.white,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={courseStyles.backbutton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-double-left" size={25} color={colors.alt} />
        </TouchableOpacity>

        {/* TOPIC */}
        <View style={courseStyles.pill}>
          <Text style={courseStyles.pillText}>{course.name}</Text>
        </View>

        {/* LEVEL */}
        <View style={courseStyles.pill}>
          <Text style={courseStyles.pillText}>✧ {userData.experience}</Text>
        </View>

        {/* PROGRESS */}
        <View style={courseStyles.pill}>
          <Text style={courseStyles.pillText}>{countCompletedLessons()} / {units.reduce((total, unit) => total + unit.lessons.length, 0)}</Text>
        </View>
      </View>

      <ScrollView>
        {units.map((unit) => (
          <View key={unit.id} style={courseStyles.unitContainer}>
            <Text style={courseStyles.unitTitle}>{unit.title}</Text>
            {unit.lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={{...courseStyles.button, backgroundColor: lesson.completed ? colors.secondaryPink : colors.primary}}
                onPress={() =>
                  handleLessonPress(route.params.courseId, unit.id, lesson.id)
                }
              >
                <Text style={courseStyles.buttonText}>{lesson.title}{lesson.completed ? "  ☑" : ""}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const courseStyles = StyleSheet.create({
  container: {
    padding: 10,
  },
  backbutton: {
    paddingHorizontal: 15,
  },
  pill: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.alt,
    paddingHorizontal: 7.5,
    backgroundColor: colors.secondaryPink,
    textAlign: "center",
  },
  pillText: {
    color: colors.alt,
    fontSize: 18,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.alt,
  },
  unitContainer: {
    marginBottom: 20,
  },
  unitTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.secondaryPink,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 2.5,
    borderColor: colors.alt,
  },
  buttonText: {
    color: colors.alt,
    textAlign: "center",
    fontSize: 18,
  },
});

export default CourseScreen;
