import { FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import MyBtn from "../components/MyBtn";
import { db } from "../utils/firebase";
import { useState, useEffect } from "react";
import styles from "../styles/styles";
import { Post } from "../components/Post";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getAuthorByUID } from "../utils/firestore";

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      const fetchAuthors = [];

      querySnapshot.forEach((document) => {
        const authorUID = document.data().author;
        const postData = document.data();

        fetchAuthors.push(
          getAuthorByUID(authorUID).then((authorData) => {
            if (authorData) {
              postsData.push({
                id: document.id,
                date: postData.createdAt.toDate(),
                likes: postData.likes || 0, // Add likes
                likedBy: postData.likedBy || [], // Initialize likedBy as an empty array
                commentCount: postData.comments ? postData.comments.length : 0, // Get the length of comments array if it exists, otherwise 0
                ...postData,
                author: authorData,
              });
            } else {
              console.log("Author doesn't exist:", authorUID);
            }
          })
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

  const handlePostClick = (postId) => {
    navigation.navigate("PostView", { postId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePostClick(item.id)}>
            <Post
              item={item}
              styles={styles}
              posts={posts}
              setPosts={setPosts}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
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
