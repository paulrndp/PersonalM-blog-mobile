import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, BookOpen, FileText, Settings } from "lucide-react-native";

import HomeScreen from "./src/screens/HomeScreen";
import StoriesScreen from "./src/screens/StoriesScreen";
import StoryDetailScreen from "./src/screens/StoryDetailScreen";
import ReaderScreen from "./src/screens/ReaderScreen";
import BlogScreen from "./src/screens/BlogScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const StoriesStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTitleStyle: { fontFamily: "serif", fontWeight: "bold", color: "#0f172a" },
        headerTintColor: "#b45309",
        headerShadowVisible: false,
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "Hannah Montemayor" }}
      />
      <HomeStack.Screen
        name="StoryDetail"
        component={StoryDetailScreen}
        options={({ route }: any) => ({ title: route.params?.title || "Novel Details" })}
      />
      <HomeStack.Screen
        name="Reader"
        component={ReaderScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

function StoriesStackNavigator() {
  return (
    <StoriesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTitleStyle: { fontFamily: "serif", fontWeight: "bold", color: "#0f172a" },
        headerTintColor: "#b45309",
        headerShadowVisible: false,
      }}
    >
      <StoriesStack.Screen
        name="StoriesList"
        component={StoriesScreen}
        options={{ title: "Serialized Novels" }}
      />
      <StoriesStack.Screen
        name="StoryDetail"
        component={StoryDetailScreen}
        options={({ route }: any) => ({ title: route.params?.title || "Novel Details" })}
      />
      <StoriesStack.Screen
        name="Reader"
        component={ReaderScreen}
        options={{ headerShown: false }}
      />
    </StoriesStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#b45309",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: "#e2e8f0",
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
          headerStyle: { backgroundColor: "#ffffff" },
          headerTitleStyle: { fontFamily: "serif", fontWeight: "bold", color: "#0f172a" },
          headerShadowVisible: false,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="StoriesTab"
          component={StoriesStackNavigator}
          options={{
            title: "Novels",
            headerShown: false,
            tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="BlogTab"
          component={BlogScreen}
          options={{
            title: "Blog & Musings",
            tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
