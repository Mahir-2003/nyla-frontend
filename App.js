// // In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from "./src/screens/Home";
import LoginScreen from "./src/screens/Login";
import SignupScreen from "./src/screens/Signup";
import CreatePostScreen from "./src/screens/CreatePost";
import FeedScreen from "./src/screens/Feed";
import ChatAssistantScreen from "./src/screens/ChatAssistant";
import LearnScreen from "./src/screens/Learn";
import CourseScreen from "./src/screens/Course";
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Feed') {
            iconName = focused ? 'layers' : 'layers-outline';
          } else if (route.name === 'Assistant') {
            iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
          } else if (route.name === 'Learn') {
            iconName = focused ? 'library' : 'library-outline';
          }
          size = 20;
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Assistant" component={ChatAssistantScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
    </Tab.Navigator>
  );
}

// Tab Navigation
function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false}} headerMode="screen">
          <Stack.Screen name="Signup" component={SignupScreen}/>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Home" component={HomeTabs}/>
          <Stack.Screen name="CreatePost" component={CreatePostScreen}/>
          <Stack.Screen name="Course" component={CourseScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

// Stack navigation
// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false}} headerMode="screen">
//         <Stack.Screen name="Signup" component={SignupScreen}/>
//         <Stack.Screen name="Login" component={LoginScreen}/>
//         <Stack.Screen name="Home" component={HomeScreen}/>
//         <Stack.Screen name="CreatePost" component={CreatePostScreen}/>
//         <Stack.Screen name="Feed" component={FeedScreen}/>
//         <Stack.Screen name="ChatAssistant" component={ChatAssistantScreen}/>
//         <Stack.Screen name="Learn" component={LearnScreen}/>
//         <Stack.Screen name="Course" component={CourseScreen}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

export default App;
