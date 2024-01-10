import { FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import MyBtn from "../components/MyBtn";
import { db } from "../utils/firebase";
import { useState, useEffect } from "react";
import styles from "../styles/styles";
import { Post } from "../components/Post";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getAuthorByUID } from "../utils/firestore";
import colors from "../styles/colors";
import { View } from "react-native";

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
      <View style={{width: "100%"}}>

      <MyBtn
        text={"Create Post"}
        style={{ backgroundColor: colors.tertiaryPink, justifyContent: "flex-start", marginLeft: 10, marginBottom: 10, borderRadius: 15 }}
        textStyle={{ fontWeight: 600 }}
        onPress={() => {
          navigation.navigate("CreatePost");
        }}
      />
      </View>

    </SafeAreaView>
  );
}
