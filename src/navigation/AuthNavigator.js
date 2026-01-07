import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator({ onFakeLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="Login" options={{ title: "Giriş" }}>
        {(props) => <LoginScreen {...props} onFakeLogin={onFakeLogin} />}
      </Stack.Screen>

      <Stack.Screen name="Register" options={{ title: "Kayıt Ol" }}>
        {(props) => <RegisterScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
