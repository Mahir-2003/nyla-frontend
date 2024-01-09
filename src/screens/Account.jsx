import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { getAuth, updatePassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { headerPadding } from "../styles/styles";
import colors from "../styles/colors";

export default function AccountScreen({ navigation }) {
    const auth = getAuth();
    const [userData, setUserData] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changePasswordMode, setChangePasswordMode] = useState(false);

    const signOut = async () => {
        auth.signOut();
        navigation.reset({ index: 0, routes: [{ name: "Signup" }] });
    };

    const changePassword = async () => {
        
        if (newPassword === "" || confirmPassword === "") {
            Alert.alert("Error", "Please enter a new password and confirm it");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
        
        const user = auth.currentUser
        // await auth.currentUser.updatePassword(newPassword);
        updatePassword(user, newPassword).then(() => {
            Alert.alert("Success", "Password changed successfully");
            }).catch((error) => {
                Alert.alert("Error", error.message)
                });
        setNewPassword("");
        setConfirmPassword("");
        setChangePasswordMode(false);
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
            setUserData({
                email: doc.data().email,
                name: doc.data().name,
                experience: doc.data().experience,
            });
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centerContent}>
                <View style={styles.card}>
                    {userData && (
                        <View>
                            <Text style={styles.text}>Email: {userData.email}</Text>
                            <Text style={styles.text}>Name: {userData.name}</Text>
                            <Text style={styles.text}>Experience: {userData.experience}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.card}>
                    {!changePasswordMode ? (
                        <TouchableOpacity onPress={() => setChangePasswordMode(true)}>
                            <Text>Change Password</Text>
                        </TouchableOpacity>
                    ) : (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="New Password"
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm New Password"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={changePassword}>
                                <Text style={alignItems="center"}>Save Password</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={styles.card}>
                    <TouchableOpacity onPress={signOut}>
                        <Text>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 10,
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    text: {
        color: colors.black,
        fontSize: 20,
    },
    buttonText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
});
    
    


//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.centerContent}>
//                 <View style={styles.card}>
//                     {userData && (
//                         <View>
//                             <Text style={styles.text}> Email: {userData.email}</Text>
//                             <Text style={styles.text}> Name: {userData.name}</Text>
//                             <Text style={styles.text}> Experience: {userData.experience}</Text>
//                         </View>
//                     )}
//                 </View>
//                 <View style={styles.card}>
//                     <TouchableOpacity onPress={signOut}>
//                         <Text style={alignItems="center"}>Sign Out</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View> 
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.primary,
//         padding: 10,
//     },
//     centerContent: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     card: {
//         backgroundColor: "#fff", // white background for the card
//         borderRadius: 8, // rounded corners
//         padding: 16, // space inside the card
//         marginVertical: 8, // space between cards vertically
//         marginHorizontal: 16, // space on the sides
//         shadowOpacity: 0.1, // shadow to make the card "pop" a little
//         shadowRadius: 3, // how "spread out" the shadow should be
//         shadowColor: "#000", // black shadow
//         shadowOffset: { width: 0, height: 2 }, // where the shadow should fall
//         elevation: 3, // shadow for Android
//       },
//     text: {
//         color: colors.black,
//         fontSize: 20,
//     },
// });