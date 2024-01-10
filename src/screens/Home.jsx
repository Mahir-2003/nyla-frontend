import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { auth, db } from "../utils/firebase";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "../styles/styles";
import colors from "../styles/colors";

import * as Notifications from 'expo-notifications';

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);
  // Here, you might want to send the token to your backend to keep it for later use.
}


export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUserData();
    registerForPushNotificationsAsync();
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
    <SafeAreaView style={styles.container}>
      <Text>Welcome {userData?.name}</Text>
      <View style={{ marginBottom: 10 }} />

      <View style={homeStyle.outer}>
        <View style={homeStyle.container}>
          <TouchableOpacity
            style={homeStyle.profileButton}
            onPress={() => handleProfileSelection("Child 1")}
          >
            <Text style={homeStyle.profileButtonText}>Profile 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={homeStyle.profileButton}
            onPress={() => handleProfileSelection("Child 2")}
          >
            <Text style={homeStyle.profileButtonText}>Haroldas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={homeStyle.profileButton}
            onPress={() => handleProfileSelection("Child 3")}
          >
            <Text style={homeStyle.profileButtonText}>Profile 3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={homeStyle.addButton}
            onPress={() => handleAddProfile()}
          >
            <Text style={homeStyle.addButtonText}>Add Profile</Text>
          </TouchableOpacity>
        </View>
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

const homeStyle = StyleSheet.create({
  outer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.primary,
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
