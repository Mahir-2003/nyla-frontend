import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import MyPassword from "../components/MyPassword";
import MyTextInput from "../components/MyTextInput";
import MyBtn from "../components/MyBtn";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../styles/colors";
import { Image } from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    // Set default credentials if fields are empty
    const defaultEmail = "test@test.com";
    const defaultPassword = "Test1234";
    const loginEmail = email || defaultEmail;
    const loginPassword = password || defaultPassword;

    await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("LOGIN: ", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle the error here
        console.error(errorCode, errorMessage);
      });
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
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <View
        style={{
          display: "flex",
          marginVertical: -40,
        }}
      >
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      </View>
      <MyTextInput
        placeholder={"Email"}
        autoCapitalize={"none"}
        value={email}
        onChangeText={(e) => {
          setEmail(e);
        }}
      />
      <View style={{ marginBottom: 30 }} />
      {/* <MyPassword
        placeholder={"Password"}
        autoCapitalize={"none"}
        value={password}
        secureTextEntry={true}
        onChangeText={(e) => {
          setPassword(e);
        }}
      /> */}
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          placeholder={"Password"}
          autoCapitalize={"none"}
          value={password}
          secureTextEntry={!isPasswordVisible}
          selectionColor={colors.alt}
          onChangeText={(e) => {
            setPassword(e);
          }}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={{ marginLeft: 1,
            marginTop: 6,
            alignItems: "center",
            justifyContent: "center" }}
        >
          {isPasswordVisible ? (
            <Ionicons name="eye-off-outline" size={20} />
          ) : (
            <Ionicons name="eye-outline" size={20} />
          )}
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 30 }} />
      <View style={{ flexDirection: "row", width: "80%" }}>
        <MyBtn
          text={"Log In"}
          style={{
            width: "25%",
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 0,
            backgroundColor: colors.alt,
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          }}
          textStyle={{ color: "white", fontWeight: "600" }}
          onPress={() => {
            handleLogin();
          }}
        />
        <TouchableOpacity
          style={{
            width: "75%",
            backgroundColor: colors.secondaryPink,
            alignItems: "center",
            justifyContent: "center",
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
          }}
          onPress={() => {
            navigation.navigate("Signup");
          }}
        >
          <Text style={{ fontWeight: "600" }}>Create a new account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
      height: 40,
      width: '80%',
      borderColor: colors.alt,
      borderBottomWidth: 1.5,
      backgroundColor: colors.secondaryPink,
      borderTopEndRadius: 10,
      borderTopStartRadius: 10,
      textDecorationColor: colors.alt,
      margin: 6,
      marginLeft: 25,
      padding: 10,
  },
});

