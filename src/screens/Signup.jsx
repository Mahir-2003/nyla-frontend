import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import MyPassword from "../components/MyPassword";
import MyTextInput from "../components/MyTextInput";
import MyBtn from "../components/MyBtn";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { collection, addDoc, getFirestore, setDoc, doc } from "firebase/firestore";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Initialize the experience to 0
      const experience = 0;

      // Initialize courseProgress as an empty object.
      // This will be updated as the user progresses through courses.
      const courseProgress = {};

      // Use `setDoc` with `doc` to specify the document ID
      await setDoc(doc(db, "users", user.uid), {
        email: email.toLowerCase().trim(),
        uid: user.uid,
        name: name.trim(),
        experience: experience,
        courseProgress: courseProgress, // Empty object for now
      });
      console.log("User document created with UID as document ID!");

      // Rest of your code to handle post-signup logic
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
      } else {
        console.log("NO USER");
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Signup Sceen</Text>
      <MyTextInput
        placeholder={"Name"}
        autoCapitalize={"words"}
        value={name}
        onChangeText={(e) => {
          setName(e);
        }}
      />

      <MyTextInput
        placeholder={"Email"}
        autoCapitalize={"none"}
        value={email}
        onChangeText={(e) => {
          setEmail(e);
        }}
      />

      <MyPassword
        placeholder={"Password"}
        autoCapitalize={"none"}
        value={password}
        secureTextEntry={true} // Add this line to hide the password text
        onChangeText={(e) => {
          setPassword(e);
        }}
      />
      <View style={{ marginBottom: 20 }} />
      <MyBtn
        text={"Signup"}
        onPress={() => {
          handleSignup();
        }}
      />
      <View style={{ marginBottom: 10 }} />
      <TouchableOpacity
        style={{}}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
