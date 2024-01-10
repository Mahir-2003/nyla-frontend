import React, { useEffect, useState } from "react";
import { Post } from "../components/Post";
import { Text, View, TextInput } from "react-native";
import styles from "../styles/styles";
import {
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  arrayUnion,
  addDoc,
  collection,
  arrayRemove,
} from "firebase/firestore";

import { auth, db } from "../utils/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../styles/colors";
import { KeyboardAvoidingView, Platform } from "react-native";
import moment from "moment";
import { getAuthorByUID } from "../utils/firestore";
import { ScrollView } from "react-native";

async function fetchComment(id) {
  const commentDoc = await getDoc(doc(db, "comments", id));
  return commentDoc.data();
}

function Comment({ commentId, navigation }) {
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState(null);
  const [likes, setLikes] = useState(0);
  const [likedBy, setLikedBy] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    async function fetchCommentData() {
      const fetchedComment = await fetchComment(commentId);
      console.log("fetchedComment:", fetchedComment);
      setComment(fetchedComment);
      setLikes(fetchedComment.likes || 0);
      setLikedBy(fetchedComment.likedBy || []);
      setCommentCount(fetchedComment.commentIds ? fetchedComment.commentIds.length : 0);
    }

    fetchCommentData();
  }, [commentId]);

  useEffect(() => {
    async function fetchAuthorName() {
      if (comment) {
        const author = await getAuthorByUID(comment.author);
        if (author && author.name) {
          setAuthorName(author.name);
        }
      }
    }

    fetchAuthorName();
  }, [comment]);

  if (!comment) {
    return null; // or a loading spinner
  }

  const handleLike = async () => {
    const commentRef = doc(db, "comments", commentId);

    if (likedBy.includes(auth.currentUser.uid)) {
        // If they have, remove their like
        await updateDoc(commentRef, {
          likes: likes - 1,
          likedBy: arrayRemove(auth.currentUser.uid),
        });

        // Then update the local state
        setLikes(likes - 1);
        setLikedBy(likedBy.filter((id) => id !== auth.currentUser.uid));
    } else {
        // If they haven't, add their like
        await updateDoc(commentRef, {
          likes: likes + 1,
          likedBy: arrayUnion(auth.currentUser.uid),
        });

        // Then update the local state
        setLikes(likes + 1);
        setLikedBy([...likedBy, auth.currentUser.uid]);
    }
  };

  const handlePostClick = (commentId) => {
    navigation.navigate("PostView", { postId: commentId, isComment: true});
  };

  if (authorName) {
    return (
      <View
        style={{
          borderRadius: 4,
          backgroundColor: colors.primary,
          padding: 10,
          marginVertical: 5,
        }}
      >
        <Text
          style={{
            fontWeight: "normal",
            fontSize: 15,
            color: "#444444",
          }}
        >
          {`${authorName}  `}
          <Text
            style={{
              fontWeight: "normal",
              fontSize: 14,
              color: "#656565",
            }}
          >
            {moment(comment.createdAt.toDate()).fromNow()}
          </Text>
        </Text>
        <Text>{comment.title}</Text>
        <View
          style={{
            ...styles.pill,
            flexDirection: "row",
            justifyContent: "flex-start",
            borderWidth: 0,
            marginLeft: -10,
          }}
        >
          <TouchableOpacity
            style={styles.interaction}
            onPress={() => handleLike()}
          >
            <Icon
              name={
                likedBy.includes(auth.currentUser.uid) ? "heart" : "heart-o"
              }
              size={16}
              color={colors.alt}
            />
            <Text style={styles.interactionText}>{likes}</Text>
          </TouchableOpacity>
          <Text style={styles.divider}>|</Text>
          <TouchableOpacity style={styles.interaction} onPress={() => handlePostClick(commentId)}>
            <Icon name="comments-o" size={16} color={colors.alt} />
            <Text style={styles.interactionText}>{commentCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

export default function PostViewScreen({ route, navigation }) {
  const postId = route.params.postId;
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, route.params.isComment ? "comments" : "posts", postId),
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const postData = docSnapshot.data();

          // Fetch the author's data
          const authorSnapshot = await getDoc(
            doc(db, "users", postData.author)
          );
          const authorData = authorSnapshot.data();

          setPost({
            id: docSnapshot.id,
            date: postData.createdAt.toDate(),
            likes: postData.likes || 0,
            likedBy: postData.likedBy || [],
            commentCount: postData.comments ? postData.comments.length : 0, // Get the length of comments array if it exists, otherwise 0
            ...postData,
            author: authorData,
          });
        } else {
          setPost(null);
        }
      }
    );

    return () => unsubscribe(); // Clean up on unmount
  }, [postId]);

  async function handleAddComment() {
    const newComment = {
      author: auth.currentUser.uid,
      content: "",
      createdAt: new Date(),
      title: comment,
    };

    const commentRef = await addDoc(collection(db, "comments"), newComment);
    const commentId = commentRef.id;

    // Update the post with the new comment ID
    await updateDoc(doc(db, route.params.isComment ? "comments" : "posts", postId), {
      commentIds: arrayUnion(commentId),
    });
  }

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View style={{ ...styles.card, width: "100%", borderRadius: 0 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-double-left" size={25} color={colors.alt} />
        </TouchableOpacity>
      </View>
      {post ? (
        <>
          <Post item={post} styles={styles} />
          <ScrollView
            style={{ ...styles.card, width: "100%", borderRadius: 0 }}
          >
            {post.commentIds &&
              post.commentIds.map((id, index) => (
                <Comment key={index} commentId={id} navigation={navigation} />
              ))}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.text}></Text>
      )}
      <KeyboardAvoidingView
        style={{
          width: "100%",
          position: "absolute",
          bottom: 15,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            ...styles.card,
            paddingVertical: 10,
            paddingHorizontal: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            style={{ ...styles.textInput, flex: 1 }}
            placeholder="Add a comment"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity onPress={handleAddComment} disabled={!comment}>
            <Icon name="level-up" size={20} color={colors.alt} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
