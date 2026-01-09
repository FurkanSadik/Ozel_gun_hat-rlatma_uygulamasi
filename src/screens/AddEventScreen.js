import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { auth } from "../services/firebase";
import { addEvent } from "../services/eventService";
import { useAppTheme } from "../contexts/ThemeContext";

export default function AddEventScreen({ navigation }) {
  const { navTheme, mode } = useAppTheme();
  const C = navTheme.colors;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("diger");
  const [note, setNote] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const placeholderTextColor = mode === "dark" ? "#94a3b8" : "#6b7280";

  // Soft bordo/rose panel (takvim altı gibi göz yormasın)
  const softPanelBg = mode === "dark" ? "#2a0f16" : "#fff1f2";
  const softPanelBorder = mode === "dark" ? "#7f1d1d" : "#fecdd3";

  const TypeButton = ({ value, label }) => {
    const selected = type === value;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setType(value)}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: selected ? C.primary : C.border,
          backgroundColor: selected ? C.primary : C.card,
          alignItems: "center"
        }}
      >
        <Text style={{ fontWeight: "900", color: selected ? C.background : C.text }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSave = async () => {
    const t = title.trim();
    const d = date.trim();
    const ty = (type || "").trim();
    const n = note.trim();

    setInfo("");

    if (!t || !d || !ty) return setInfo("Başlık, tarih ve tür zorunludur.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d))
      return setInfo("Tarih YYYY-AA-GG formatında olmalı. Örn: 2026-01-08");

    const user = auth.currentUser;
    if (!user) return setInfo("Oturum bulunamadı. Lütfen tekrar giriş yapın.");

    try {
      setLoading(true);
      await addEvent(user.uid, { title: t, date: d, type: ty, note: n });
      navigation.goBack();
    } catch (e) {
      setInfo("Kaydetme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", backgroundColor: C.background }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "900",
          textAlign: "center",
          marginBottom: 16,
          color: C.text
        }}
      >
        Özel Gün Ekle
      </Text>

      {!!info && (
        <View
          style={{
            borderWidth: 1,
            borderColor: softPanelBorder,
            backgroundColor: softPanelBg,
            borderRadius: 12,
            padding: 10,
            marginBottom: 10
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "900", color: C.text }}>
            {info}
          </Text>
        </View>
      )}

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Başlık (örn: Annemin doğum günü)"
        placeholderTextColor={placeholderTextColor}
        style={{
          borderWidth: 1,
          borderColor: C.border,
          backgroundColor: C.card,
          color: C.text,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 10
        }}
      />

      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="Tarih (YYYY-AA-GG)"
        placeholderTextColor={placeholderTextColor}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: C.border,
          backgroundColor: C.card,
          color: C.text,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 12
        }}
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
        placeholderTextColor={placeholderTextColor}
        style={{
          borderWidth: 1,
          borderColor: C.border,
          backgroundColor: C.card,
          color: C.text,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 14
        }}
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        activeOpacity={0.85}
        style={{
          backgroundColor: loading ? "#444" : "#000",
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 10
        }}
      >
        <Text style={{ color: "white", fontWeight: "900" }}>
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ alignItems: "center" }}
        activeOpacity={0.85}
      >
        <Text style={{ fontWeight: "800", color: C.text }}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}
