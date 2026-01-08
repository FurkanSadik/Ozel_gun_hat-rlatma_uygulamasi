import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "../screens/CalendarScreen";
import AddEventScreen from "../screens/AddEventScreen";

const Stack = createNativeStackNavigator();

export default function CalendarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CalendarHome"
        component={CalendarScreen}
        options={({ navigation }) => ({
          title: "Takvim",
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("AddEvent")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "black",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "800", marginTop: -1 }}>+</Text>
            </TouchableOpacity>
          )
        })}
      />
      <Stack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{ title: "Özel Gün Ekle", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
}
