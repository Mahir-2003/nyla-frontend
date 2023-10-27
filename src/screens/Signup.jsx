import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MyTextInput from '../components/MyTextInput';
import MyBtn from '../components/MyBtn';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

export default function SignupScreen({ navigation }) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const docRef = await addDoc(collection(db, "users"), {
                email: email.toLowerCase().trim(),
                uid: user.uid,
                name: name.trim(),
            });
            console.log("User signed up successfully!");
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigation.reset({index: 0, routes: [{name: "Home"}]})
            } else {
                console.log("NO USER")
            }
        })
    }, [])

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Signup Sceen</Text>
        <MyTextInput placeholder={"Name"} autoCapitalize={"words"} value={name} onChangeText={(e)=>{
            setName(e)
        }}/>

        <MyTextInput placeholder={"Email"} autoCapitalize={"none"} value={email} onChangeText={(e)=>{
            setEmail(e)
        }}/>

        <MyTextInput placeholder={"Password"} autoCapitalize={"none"} value={password} onChangeText={(e)=>{
            setPassword(e)
        }}/>
        <View style={{marginBottom: 20}}/>
        <MyBtn text={"Signup"}
            onPress={() =>{
                handleSignup()
            }}/>
        <View style={{marginBottom: 10}}/>
        <TouchableOpacity style={{}} onPress={()=>{
            navigation.navigate("Login")
        }}>
            <Text>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    );
  }