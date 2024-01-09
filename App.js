// // In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "./src/screens/Home";
import LoginScreen from "./src/screens/Login";
import SignupScreen from "./src/screens/Signup";
import CreatePostScreen from "./src/screens/CreatePost";
import FeedScreen from "./src/screens/Feed";
import ChatAssistantScreen from "./src/screens/ChatAssistant";
import LearnScreen from "./src/screens/Learn";
import CourseScreen from "./src/screens/Course";
import AccountScreen from "./src/screens/Account";
import { Ionicons } from "@expo/vector-icons";
import LessonScreen from "./src/screens/Lesson";
import colors from "./src/styles/colors";
import { useTheme } from 'react-native-paper';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeTabs() {
  const theme = useTheme();
  theme.colors.secondaryContainer = colors.secondaryPink;

  return (
    <Tab.Navigator
    
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home-outline" : "home";
          } else if (route.name === "Feed") {
            iconName = focused ? "layers-outline" : "layers";
          } else if (route.name === "Assistant") {
            iconName = focused
              ? "chatbox-ellipses-outline"
              : "chatbox-ellipses";
          } else if (route.name === "Learn") {
            iconName = focused ? "library-outline" : "library";
          }
          size = 20;
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      barStyle={{
        backgroundColor: colors.primary,
        marginBottom: -20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
    >
      <Tab.Screen name="Learn" component={LearnScreen} theme={{ colors: { secondaryContainer: "red" } }}/>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

// Tab Navigation
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        headerMode="screen"
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={HomeTabs} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="ChatAssistant" component={ChatAssistantScreen} />
        <Stack.Screen name="Course" component={CourseScreen} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        {/* <Stack.Screen name="Account" component={AccountScreen} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
