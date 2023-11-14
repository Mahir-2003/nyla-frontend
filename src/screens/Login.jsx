import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MyTextInput from '../components/MyTextInput';
import MyBtn from '../components/MyBtn';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        // Set default credentials if fields are empty
        const defaultEmail = 'test@test.com';
        const defaultPassword = 'Test1234';
        const loginEmail = email || defaultEmail;
        const loginPassword = password || defaultPassword;
    
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log("LOGIN: ", user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // Handle the error here
            console.error(errorCode, errorMessage);
        })
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
        <Text>Login Sceen</Text>
        <MyTextInput placeholder={"Email"} autoCapitalize={"none"} value={email} onChangeText={(e)=>{
            setEmail(e)
        }}/>

        <MyTextInput placeholder={"Password"} autoCapitalize={"none"} value={password} onChangeText={(e)=>{
            setPassword(e)
        }}/>
        <View style={{marginBottom: 20}}/>
        <MyBtn text={"Login"}
            onPress={() =>{
                handleLogin()
            }}/>
        <View style={{marginBottom: 10}}/>
        <TouchableOpacity style={{}} onPress={()=>{
            navigation.navigate("Signup")
        }}>
            <Text>Don't have an account yet? Signup</Text>
        </TouchableOpacity>
      </View>
    );
  }