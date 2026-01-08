import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function AddEventScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [note, setNote] = useState("");
  const [info, setInfo] = useState("");

  const TypeButton = ({ value, label }) => {
    const selected = type === value;
    return (
      <TouchableOpacity
        onPress={() => setType(value)}
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

  const handleSave = () => {
    const t = title.trim();
    const d = date.trim();
    const ty = type.trim();
    const n = note.trim();

    setInfo("");

    if (!t || !d || !ty) return setInfo("Başlık, tarih ve tür zorunludur.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return setInfo("Tarih YYYY-AA-GG formatında olmalı. Örn: 2026-01-08");

    setInfo("Kaydetme işlemi Aşama 6.2'de eklenecek.");
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 16 }}>
        Özel Gün Ekle
      </Text>

      {!!info && (
        <Text style={{ textAlign: "center", marginBottom: 10, fontWeight: "600" }}>
          {info}
        </Text>
      )}

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Başlık (örn: Annemin doğum günü)"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 }}
      />

      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="Tarih (YYYY-AA-GG)"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 }}
      />

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <TypeButton value="dogum_gunu" label="Doğum Günü" />
        <TypeButton value="yildonumu" label="Yıldönümü" />
        <TypeButton value="diger" label="Diğer" />
      </View>

      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Not (opsiyonel)"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14 }}
      />

      <TouchableOpacity
        onPress={handleSave}
        style={{ backgroundColor: "black", paddingVertical: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Kaydet</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "600" }}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}
