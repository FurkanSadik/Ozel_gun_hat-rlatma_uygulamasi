import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import UpcomingScreen from "../screens/UpcomingScreen";
import PastScreen from "../screens/PastScreen";
import AccountScreen from "../screens/AccountScreen";
import CalendarStack from "./CalendarStack";

import { useAppTheme } from "../contexts/ThemeContext";

const Tab = createBottomTabNavigator();

const TabLabel = ({ text, focused, mode }) => (
  <Text
    style={{
      fontSize: 11,
      lineHeight: 12,
      textAlign: "center",
      color: focused
        ? mode === "dark"
          ? "#ffffff"
          : "#000000"
        : mode === "dark"
        ? "#94a3b8"
        : "#777",
      marginTop: 2,
      fontWeight: focused ? "800" : "600"
    }}
  >
    {text}
  </Text>
);

export default function TabsNavigator() {
  const { navTheme, mode } = useAppTheme();
  const C = navTheme.colors;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",

        // ✅ Tab bar arka plan + border tema uyumlu
        tabBarStyle: {
          height: 68,
          paddingBottom: 6,
          paddingTop: 6,
          backgroundColor: C.card,
          borderTopColor: C.border
        },

        tabBarItemStyle: { justifyContent: "center" },

        tabBarIcon: ({ focused }) => {
          let iconName = "";
          let iconColor = "";

          if (route.name === "Upcoming") {
            iconName = focused ? "time" : "time-outline";
            iconColor = "#f39c12";
          }

          if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
            iconColor = "#3498db";
          }

          if (route.name === "Past") {
            iconName = focused ? "archive" : "archive-outline";
            iconColor = "#8e44ad";
          }

          if (route.name === "Account") {
            iconName = focused ? "settings" : "settings-outline";
            iconColor = "#2c3e50";
          }

          // ✅ Dark mode’da seçili tab anlaşılır olsun diye
          // ikonun arkasına "chip" gibi bir arka plan veriyoruz
          return (
            <View
              style={{
                padding: 6,
                borderRadius: 10,
                backgroundColor: focused
                  ? mode === "dark"
                    ? "#1f2937" // koyu temada seçili vurgusu
                    : "#e5e7eb" // açık temada seçili vurgusu
                  : "transparent"
              }}
            >
              <Ionicons name={iconName} size={22} color={iconColor} />
            </View>
          );
        }
      })}
    >
      <Tab.Screen
        name="Upcoming"
        component={UpcomingScreen}
        options={{
          title: "Yaklaşan Günler",
          tabBarLabel: ({ focused }) => (
            <TabLabel text={"Yaklaşan\nGünler"} focused={focused} mode={mode} />
          )
        }}
      />

      <Tab.Screen
        name="Calendar"
        component={CalendarStack}
        options={{
          headerShown: false,
          title: "Takvim",
          tabBarLabel: ({ focused }) => <TabLabel text={"Takvim"} focused={focused} mode={mode} />
        }}
      />

      <Tab.Screen
        name="Past"
        component={PastScreen}
        options={{
          title: "Geçmiş Günler",
          tabBarLabel: ({ focused }) => (
            <TabLabel text={"Geçmiş\nGünler"} focused={focused} mode={mode} />
          )
        }}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: "Hesap",
          tabBarLabel: ({ focused }) => <TabLabel text={"Hesap"} focused={focused} mode={mode} />
        }}
      />
    </Tab.Navigator>
  );
}
