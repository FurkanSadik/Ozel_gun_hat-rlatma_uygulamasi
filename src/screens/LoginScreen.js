import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  const mapAuthError = (code) => {
    if (code === "auth/invalid-email") return "E-posta formatı geçersiz.";
    if (code === "auth/user-not-found") return "Bu e-posta ile kayıtlı kullanıcı yok.";
    if (code === "auth/wrong-password") return "Şifre yanlış.";
    if (code === "auth/invalid-credential") return "E-posta veya şifre hatalı.";
    if (code === "auth/too-many-requests") return "Çok fazla deneme yapıldı. Daha sonra tekrar deneyin.";
    return "Giriş yapılamadı. Lütfen tekrar deneyin.";
  };

  const handleLogin = async () => {
    const e = email.trim();
    const p = password.trim();

    if (!e || !p) return Alert.alert("Hata", "E-posta ve şifre zorunludur.");
    if (!isEmailValid(e)) return Alert.alert("Hata", "Geçerli bir e-posta giriniz.");
    if (p.length < 6) return Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır.");

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, e, p);
    } catch (err) {
      Alert.alert("Hata", mapAuthError(err.code));
    } finally {
      setLoading(false);
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
        disabled={loading}
        style={{
          backgroundColor: loading ? "#444" : "black",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "600" }}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}
