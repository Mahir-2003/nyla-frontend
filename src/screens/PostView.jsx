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
} from "firebase/firestore";

import { auth, db } from "../utils/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../styles/colors";
import { KeyboardAvoidingView, Platform } from "react-native";
import moment from "moment";
import { getAuthorByUID } from "../utils/firestore";

function Comment({ comment }) {
    const [authorName, setAuthorName] = useState('');

    useEffect(() => {
      async function fetchAuthorName() {
        const author = await getAuthorByUID(comment.authorId);
        if (author && author.name) {
          setAuthorName(author.name);
        }
      }
    
      fetchAuthorName();
    }, [comment.authorId]);

    if (authorName) {
        return (
            <View style={{borderRadius: 4, backgroundColor: colors.primary, padding: 10, marginVertical: 5}}>
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
                        {moment(comment.date.toDate()).fromNow()}
                    </Text>
                </Text>
                <Text>{comment.text}</Text>
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
            doc(db, "posts", postId),
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

    const handleAddComment = async () => {
        try {
            const commentData = {
                text: comment,
                postId: postId,
                date: new Date(),
                authorId: auth.currentUser.uid,
            };

            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, {
                comments: arrayUnion(commentData),
            });

            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, {
                comments: arrayUnion(postId),
            });

            setComment("");
        } catch (e) {
            console.error("Error adding comment: ", e);
        }
    };

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
                    <View style={{ ...styles.card, width: "100%", borderRadius: 0 }}>
                        {post.comments &&
                            post.comments.map((comment, index) => (
                                <Comment key={index} comment={comment} />
                            ))}
                    </View>
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
