import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MyBtn from "../components/MyBtn";
import { auth, db } from "../utils/firebase";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { headerPadding } from "../styles/styles";
import colors from "../styles/colors";

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  const signOut = async () => {
    auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: "Signup" }] });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const q = query(
      collection(db, "users"),
      where("uid", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      setUserData(doc.data());
    });
  };

  return (
    <SafeAreaView style={headerPadding.container}>
      <Text>Welcome {userData?.name}</Text>
      <View style={{ marginBottom: 10 }} />

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => handleProfileSelection("Child 1")}
        >
          <Text style={styles.profileButtonText}>Profile 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => handleProfileSelection("Child 2")}
        >
          <Text style={styles.profileButtonText}>Haroldas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => handleProfileSelection("Child 3")}
        >
          <Text style={styles.profileButtonText}>Profile 3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddProfile()}
        >
          <Text style={styles.addButtonText}>Add Profile</Text>
        </TouchableOpacity>
      </View>
      {/* <MyBtn style={{ backgroundColor: colors.secondaryPink }}
        text={"Log out"}
        onPress={() => {
          signOut();
        }}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center", // Updated to vertically center the items
    verticalAlign: "middle",
    backgroundColor: colors.primary,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileButton: {
    width: "40%",
    aspectRatio: 1,
    backgroundColor: colors.secondaryPink,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  profileButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    width: "40%",
    aspectRatio: 1,
    backgroundColor: "#333",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
