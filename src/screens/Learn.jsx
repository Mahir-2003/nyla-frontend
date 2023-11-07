import { View, Text, TouchableOpacity, FlatList } from "react-native";
import "firebase/firestore";
import { db } from "../utils/firebase";
import {
    collection,
    query,
    onSnapshot,
  } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function LearnScreen({ navigation }) {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch courses from Firebase
        const q = query(collection(db, "courses"))
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
            style={{ padding: 10 }}
            onPress={() => navigation.navigate("Course", { courseId: item.id })}
        >
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={courses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}
