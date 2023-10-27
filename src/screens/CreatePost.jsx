import { View, Text, TextInput } from 'react-native';
import MyBtn from '../components/MyBtn';
import { auth, db } from '../utils/firebase';
import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore"

export default function CreatePostScreen({ navigation }) {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const createPost = async () => {
        try {
            const docRef = await addDoc(collection(db, "posts"), {
                title: title,
                content: content,
                author: auth.currentUser.uid,
                createdAt: new Date()
            });
            console.log("Document written with ID: ", docRef.id);
            navigation.goBack();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%', marginBottom: 20, borderRadius: 6 }}
            onChangeText={text => setTitle(text)}
            value={title}
            placeholder="Title"
        />
        <TextInput
            style={{ height: 100, borderColor: 'gray', borderWidth: 1, width: '80%', marginBottom: 20, borderRadius: 6 }}
            onChangeText={text => setContent(text)}
            value={content}
            placeholder="Content"
            multiline={true}
        />
        <MyBtn text={"Create Post"}
            onPress={() =>{
                createPost();
            }}/>
      </View>
    );
  }