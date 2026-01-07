import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";

export default function LoginScreen({ navigation, onFakeLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const isEmailValid = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  const handleLogin = () => {
    const e = email.trim();
    const p = password.trim();

    if (!e || !p) {
      showAlert("Hata", "E-posta ve şifre zorunludur.");
      return;
    }
    if (!isEmailValid(e)) {
      showAlert("Hata", "Geçerli bir e-posta giriniz.");
      return;
    }
    if (p.length < 6) {
      showAlert("Hata", "Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (typeof onFakeLogin === "function") {
      onFakeLogin();
    } else {
      showAlert("Hata", "Giriş fonksiyonu bulunamadı. RootNavigator bağlantısını kontrol edin.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 16 }}>
        Hoş Geldin
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-posta"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 10
        }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 14
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "black",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "600" }}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}
