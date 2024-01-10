import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useCallback } from "react";
import "firebase/firestore";
import { db } from "../utils/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import LearnIcon from "../components/Assets";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../styles/colors";


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

  const renderItem = useCallback(({ item }) => ( // Use useCallback here
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate("Course", { courseId: item.id })}
    >
      <View style={styles.imageContainer}>
        <LearnIcon style={styles.image} source={item.name} />
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.lessonText}>{item.name}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
      <LinearGradient
        colors={[colors.tertiaryPink, colors.secondaryPink, colors.primary]}
        style={styles.linearGradient}
        start={{ x: 0, y: 0 }} // coordinates for the start of the gradient
        end={{ x: 1, y: 1 }} // coordinates for the end of the gradient
      >
        <View style={styles.container}>
          <View style={styles.lessonContainer}>
            <FlatList
              data={courses}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </View>
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70, //size of heading
    alignItems: "center", // Center items horizontally
    justifyContent: "center", // Center items vertically
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  lessonContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
    width: "100%", // Make the lesson container full width
  },
  listContainer: {
    width: "100%", // Make the lesson container full width
    flex: 1,
  },
  listItem: {
    backgroundColor: "white",
    width: "100%", // Make the lesson container full width
    padding: 20,
    height: 100,
    marginBottom: 12.5,
    borderRadius: 15,
    flexDirection: "row",

    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 15,
  },
  imageContainer: {
    aspectRatio: 1,
  },
  subContainer: {
    marginLeft: 18,
  },
  lessonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  descriptionText: {
    color: "#505050",
  },
  image: {},
});
