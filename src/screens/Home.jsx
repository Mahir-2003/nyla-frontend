import { View, Text } from 'react-native';
import MyBtn from '../components/MyBtn';
import { auth, db } from '../utils/firebase';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore"

export default function HomeScreen({ navigation }) {

    const [userData, setUserData] = useState(null);

    const signOut = async() => {
        auth.signOut()
        navigation.reset({index: 0, routes: [{name: "Signup"}]})
    }

    useEffect(() => {
        getUserData();
    }, [])

    const getUserData = async () => {
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            setUserData(doc.data());
        });
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Welcome {userData?.name}</Text>
        <View style={{marginBottom: 10}}/>
        <MyBtn text={"Log out"}
            onPress={() =>{
                signOut();
            }}/>
        <View style={{marginBottom: 10}}/>
        <MyBtn text={"Go to feed"}
            onPress={() =>{
                navigation.navigate("Feed");
            }}/>
        <View style={{marginBottom: 10}}/>
        <MyBtn text={"Go to Chat Assistant"}
            onPress={() =>{
                navigation.navigate("ChatAssistant");
            }}/>
        <View style={{marginBottom: 10}}/>
        <MyBtn text={"Go to Learn"}
            onPress={() =>{
                navigation.navigate("Learn");
            }}/>
      </View>
    );
  }