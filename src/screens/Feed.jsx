import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView } from "react-native";
import MyBtn from "../components/MyBtn";
import { auth, db } from "../utils/firebase";
import { useState, useEffect } from "react";
import { headerPadding } from '../styles/styles';
import {
  collection,
  getDoc,
  doc as docRef,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuthorByUID } from "../utils/firestore";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      const fetchAuthors = [];

      querySnapshot.forEach((document) => {
        const authorUID = document.data().author;

        fetchAuthors.push(
          getAuthorByUID(authorUID)
            .then((authorData) => {
              if (authorData) {
                postsData.push({
                  id: document.id,
                  date: document.data().createdAt.toDate().toDateString(),
                  ...document.data(),
                  author: authorData,
                });
              } else {
                console.log("Author doesn't exist:", authorUID);
              }
            })
            .catch((error) => console.log("Error fetching user:", error))
        );
      });

      Promise.all(fetchAuthors)
        .then(() => {
          setPosts(postsData);
        })
        .catch((error) => console.log("Error with Promise.all:", error));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    // <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <SafeAreaView style={headerPadding.container}>
      <Text>Feed Screen</Text>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {item.title}
            </Text>
            <Text style={{fontWeight: "normal", fontSize: 15}}>{item.author.name}: {item.date}</Text>
            <View style={{ marginBottom: 5 }}/>
            <Text>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
      />
      <MyBtn
        text={"Create Post"}
        onPress={() => {
          navigation.navigate("CreatePost");
        }}
      />
    </SafeAreaView>
  );
}
