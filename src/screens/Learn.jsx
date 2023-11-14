import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import "firebase/firestore";
import { db } from "../utils/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function LearnScreen({ navigation }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch courses from Firebase
    const q = query(collection(db, "courses"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coursesData = [];
      querySnapshot.forEach((document) => {
        coursesData.push({
          id: document.id,
          ...document.data(),
        });
      });
      setCourses(coursesData);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate("Course", { courseId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Text>Image</Text>
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.lessonText}>{item.name}</Text>
        <Text>Add Description</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>Learn Screen</Text>
      <View style={styles.lessonContainer}>
        <FlatList
          data={courses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#666", // Use a light background
    alignItems: "center", // Center items horizontally
    justifyContent: "center", // Center items vertically
  },
  lessonContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
    backgroundColor: "#fff", // Use a light background
    width: "100%", // Make the lesson container full width
  },
  listContainer: {
    width: "100%", // Make the lesson container full width
    flex: 1,
    backgroundColor: "red",
  },
  listItem: {
    backgroundColor: "lightblue",
    width: "100%", // Make the lesson container full width
    padding: 15,
    height: 100,
    marginBottom: 10,
    borderRadius: 15,
    flexDirection: "row",
  },
  imageContainer: {
    backgroundColor: "lightgreen",
    aspectRatio: 1,
  },
  subContainer: {

  },
  lessonText: {
    fontSize: 20,
    fontWeight: "bold",
  }
});
