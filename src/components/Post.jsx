// Post.jsx
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { View, Text, TouchableOpacity, Share } from "react-native";
import { auth, db } from "../utils/firebase";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import colors from "../styles/colors";

export const Post = ({ item, styles, posts, setPosts }) => {
  const handleLike = async (post) => {
    // Create a reference to the document to update
    const postRef = doc(db, "posts", post.id);

    try {
      // Check if the user has already liked the post
      if (post.likedBy.includes(auth.currentUser.uid)) {
        // If they have, remove their like
        await updateDoc(postRef, {
          likes: post.likes - 1,
          likedBy: arrayRemove(auth.currentUser.uid),
        });

        // Then update the local state
        const updatedPosts = posts.map((p) => {
          if (p.id === post.id) {
            return {
              ...p,
              likes: p.likes - 1,
              likedBy: p.likedBy.filter((id) => id !== auth.currentUser.uid),
            };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        // If they haven't, add their like
        await updateDoc(postRef, {
          likes: post.likes + 1,
          likedBy: arrayUnion(auth.currentUser.uid),
        });

        // Then update the local state
        const updatedPosts = posts.map((p) => {
          if (p.id === post.id) {
            return {
              ...p,
              likes: p.likes + 1,
              likedBy: [...p.likedBy, auth.currentUser.uid],
            };
          }
          return p;
        });
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const onShare = async (item) => {
    try {
      const result = await Share.share({
        message: `Check out this post: ${item.title} by ${item.author.name} on Nyla!`,
        // You can also include a URL or image etc. in the share content
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={{ fontWeight: "normal", fontSize: 15, color: "#444444" }}>
        {`${item.author.name}  `}
        <Text style={{ fontWeight: "normal", fontSize: 14, color: "#656565" }}>
          {moment(item.date).fromNow()}
        </Text>
      </Text>
      <View style={{ marginBottom: 5 }} />
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.title}</Text>
      <View style={{ marginBottom: 5 }} />
      <Text>{item.content}</Text>
      <View style={{ marginBottom: 10 }} />
      <View style={styles.interactionContainer}>
        <View style={styles.pill}>
          <TouchableOpacity
            style={styles.interaction}
            onPress={() => handleLike(item)}
          >
            <Icon
              name={
                item.likedBy.includes(auth.currentUser.uid)
                  ? "heart"
                  : "heart-o"
              }
              size={18}
              color={colors.alt}
            />
            <Text style={styles.interactionText}>{item.likes}</Text>
          </TouchableOpacity>
          <Text style={styles.divider}>|</Text>
          <View style={styles.interaction}>
            <Icon name="comments-o" size={18} color={colors.alt} />
            <Text style={styles.interactionText}>{item.commentCount}</Text>
          </View>
          <Text style={styles.divider}>|</Text>
          <View style={styles.interaction}>
            <Icon
              name="sign-in"
              size={20}
              color={colors.alt}
              onPress={() => onShare(item)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
