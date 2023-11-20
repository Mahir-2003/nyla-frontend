import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';

const LessonDetailsScreen = ({ route }) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();

  useEffect(() => {
    const fetchLesson = async () => {
      const { lessonId } = route.params;
      const lessonRef = doc(db, 'lessons', lessonId);
      setLoading(true);

      try {
        const lessonSnapshot = await getDoc(lessonRef);
        if (!lessonSnapshot.exists()) {
          console.log('Lesson not found!');
          setLoading(false);
          return;
        }
        setLesson(lessonSnapshot.data());
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [route.params]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!lesson) {
    return (
      <View style={styles.centered}>
        <Text>No lesson data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.lessonTitle}>{lesson.title}</Text>
      <Text style={styles.lessonContent}>{lesson.content}</Text>
      {/* Add additional lesson details here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    topPadding: 56,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lessonContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  // Add additional styles here
});

export default LessonDetailsScreen;
