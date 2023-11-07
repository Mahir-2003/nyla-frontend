import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../utils/firebase';
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const CourseScreen = ({ route }) => {
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const { courseId } = route.params;
    const courseRef = doc(db, 'courses', courseId);

    const fetchCourseAndUnits = async () => {
      setLoading(true);
      try {
        const courseSnapshot = await getDoc(courseRef);
        if (!courseSnapshot.exists()) {
          console.log('Course not found!');
          setLoading(false);
          return;
        }
        setCourse(courseSnapshot.data());

        const unitsSnapshot = await getDocs(collection(courseRef, 'units'));
        const unitsDataPromises = unitsSnapshot.docs.map(async (unitDoc) => {
            const unitData = unitDoc.data();
            unitData.id = unitDoc.id;
            // Initialize lessons as an empty array to ensure it's never undefined
            unitData.lessons = [];
      
            try {
              const lessonsSnapshot = await getDocs(collection(unitDoc.ref, 'lessons'));
              unitData.lessons = lessonsSnapshot.docs.map((lessonDoc) => ({
                ...lessonDoc.data(),
                id: lessonDoc.id,
              }));
            } catch (error) {
              console.error('Error fetching lessons:', error);
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

  const handleLessonPress = (lessonId) => {
    // Navigate to a new screen with the lessonId to display the lesson details
    navigation.navigate('LessonDetailsScreen', { lessonId });
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.courseTitle}>Course Name: {course.name}</Text>
      {units.map((unit) => (
        <View key={unit.id} style={styles.unitContainer}>
          <Text style={styles.unitTitle}>{unit.title}</Text>
          {unit.lessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.button}
              onPress={() => handleLessonPress(lesson.id)}
            >
              <Text style={styles.buttonText}>{lesson.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  unitContainer: {
    marginBottom: 20,
  },
  unitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default CourseScreen;
