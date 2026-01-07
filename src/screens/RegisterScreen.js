import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isBirthDateValid = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
  const isEmailValid = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  const handleRegister = () => {
    const n = name.trim();
    const b = birthDate.trim();
    const g = gender.trim();
    const e = email.trim();
    const p = password.trim();

    if (!n || !b || !g || !e || !p) {
      Alert.alert("Hata", "Tüm alanlar zorunludur.");
      return;
    }
    if (!isBirthDateValid(b)) {
      Alert.alert("Hata", "Doğum tarihi formatı YYYY-AA-GG olmalı. Örn: 2003-07-21");
      return;
    }
    if (!isEmailValid(e)) {
      Alert.alert("Hata", "Geçerli bir e-posta giriniz.");
      return;
    }
    if (p.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır.");
      return;
    }

    Alert.alert("Başarılı", "Kayıt ekranı hazır. Firebase adımında gerçek kayıt yapılacak.");
    navigation.navigate("Login");
  };

  const GenderButton = ({ value, label }) => {
    const selected = gender === value;
    return (
      <TouchableOpacity
        onPress={() => setGender(value)}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: selected ? "black" : "#ccc",
          backgroundColor: selected ? "black" : "white",
          alignItems: "center"
        }}
      >
        <Text style={{ fontWeight: "700", color: selected ? "white" : "black" }}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 16 }}>
        Kayıt Ol
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ad Soyad"
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
        value={birthDate}
        onChangeText={setBirthDate}
        placeholder="Doğum Tarihi (YYYY-AA-GG)"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 12
        }}
      />

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <GenderButton value="kiz" label="Kız" />
        <GenderButton value="erkek" label="Erkek" />
      </View>

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
        onPress={handleRegister}
        style={{
          backgroundColor: "black",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 12
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "600" }}>Zaten hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}
