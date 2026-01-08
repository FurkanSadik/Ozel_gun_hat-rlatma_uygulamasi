import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "../services/firebase";
import { getEvents, deleteEvent, updateEvent } from "../services/eventService";

const TYPE_COLORS = {
  dogum_gunu: "#9b59b6",
  yildonumu: "#3498db",
  diger: "#2ecc71"
};

const TYPE_LABELS = {
  dogum_gunu: "Doğum Günü",
  yildonumu: "Yıldönümü",
  diger: "Diğer"
};

const isValidDateString = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s))) return false;
  const [y, m, d] = String(s).split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", note: "", type: "diger", date: "" });

  const loadEvents = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const list = await getEvents(user.uid);
      setEvents(Array.isArray(list) ? list : []);
    } catch (e) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const markedDates = useMemo(() => {
    const marks = {};
    for (const ev of events) {
      const d = ev?.date;
      if (!d) continue;

      const color = TYPE_COLORS[ev?.type] || "#000";

      if (!marks[d]) {
        marks[d] = { selected: true, selectedColor: color };
      } else {
        marks[d] = { selected: true, selectedColor: "#111" };
      }
    }

    if (selectedDate) {
      const existing = marks[selectedDate] || {};
      marks[selectedDate] = {
        ...existing,
        selected: true,
        selectedColor: existing.selectedColor || "#000"
      };
    }

    return marks;
  }, [events, selectedDate]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((e) => e?.date === selectedDate);
  }, [events, selectedDate]);

  const toggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setEditingId(null);
  };

  const startEdit = (ev) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title || "",
      note: ev.note || "",
      type: ev.type || "diger",
      date: ev.date || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const showMsg = (msg) => {
    if (Platform.OS === "web") window.alert(msg);
    else Alert.alert("Uyarı", msg);
  };

  const saveEdit = async (ev) => {
    const user = auth.currentUser;
    if (!user) return;

    const title = String(form.title || "").trim();
    if (!title) return showMsg("Başlık boş olamaz.");

    const date = String(form.date || "").trim();
    if (!isValidDateString(date)) return showMsg("Tarih formatı geçersiz. Örn: 2026-01-08");

    await updateEvent(user.uid, ev.id, {
      title,
      date,
      note: String(form.note || "").trim(),
      type: form.type || "diger"
    });

    setEditingId(null);
    loadEvents();
  };

  const confirmDelete = (ev) => {
    const user = auth.currentUser;
    if (!user) return;

    const runDelete = async () => {
      await deleteEvent(user.uid, ev.id);
      setExpandedId(null);
      setEditingId(null);
      loadEvents();
    };

    if (Platform.OS === "web") {
      const ok = window.confirm(`"${ev.title || "-"}" kaydı silinsin mi?`);
      if (ok) runDelete();
      return;
    }

    Alert.alert(
      "Silinsin mi?",
      `"${ev.title || "-"}" kaydını silmek istediğine emin misin?`,
      [
        { text: "Vazgeç", style: "cancel" },
        { text: "Sil", style: "destructive", onPress: runDelete }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10, fontWeight: "600" }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setExpandedId(null);
          setEditingId(null);
        }}
        markedDates={markedDates}
        theme={{
          todayTextColor: "black",
          arrowColor: "black"
        }}
      />

      <View style={{ paddingTop: 14 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", marginBottom: 8 }}>
          Seçili Gün: {selectedDate || "-"}
        </Text>

        {!selectedDate ? (
          <Text style={{ fontWeight: "600" }}>Detay görmek için bir gün seç.</Text>
        ) : selectedDayEvents.length === 0 ? (
          <Text style={{ fontWeight: "600" }}>Bu güne ait özel gün yok.</Text>
        ) : (
          <View style={{ gap: 8 }}>
            {selectedDayEvents.map((ev) => {
              const open = expandedId === ev.id;
              const editing = editingId === ev.id;

              return (
                <View
                  key={ev.id}
                  style={{
                    borderWidth: 1,
                    borderColor: open ? "#000" : "#ddd",
                    borderRadius: 12,
                    padding: 12
                  }}
                >
                  <TouchableOpacity activeOpacity={0.85} onPress={() => toggle(ev.id)}>
                    <Text style={{ fontWeight: "800", marginBottom: 4 }}>{ev.title || "-"}</Text>
                    <Text>Tür: {TYPE_LABELS[ev.type] || "Diğer"}</Text>
                  </TouchableOpacity>

                  {open && (
                    <View style={{ marginTop: 10, gap: 8 }}>
                      {editing ? (
                        <>
                          <TextInput
                            value={form.title}
                            onChangeText={(t) => setForm((p) => ({ ...p, title: t }))}
                            placeholder="Başlık"
                            style={{
                              borderWidth: 1,
                              borderColor: "#ddd",
                              borderRadius: 10,
                              padding: 10
                            }}
                          />

                          <TextInput
                            value={form.date}
                            onChangeText={(t) => setForm((p) => ({ ...p, date: t }))}
                            placeholder="Tarih (YYYY-AA-GG)"
                            autoCapitalize="none"
                            style={{
                              borderWidth: 1,
                              borderColor: "#ddd",
                              borderRadius: 10,
                              padding: 10
                            }}
                          />

                          <TextInput
                            value={form.note}
                            onChangeText={(t) => setForm((p) => ({ ...p, note: t }))}
                            placeholder="Not"
                            style={{
                              borderWidth: 1,
                              borderColor: "#ddd",
                              borderRadius: 10,
                              padding: 10
                            }}
                          />

                          <View style={{ flexDirection: "row", gap: 8 }}>
                            {["dogum_gunu", "yildonumu", "diger"].map((t) => (
                              <TouchableOpacity
                                key={t}
                                onPress={() => setForm((p) => ({ ...p, type: t }))}
                                activeOpacity={0.85}
                                style={{
                                  flex: 1,
                                  borderWidth: 1,
                                  borderColor: form.type === t ? "#000" : "#ddd",
                                  borderRadius: 10,
                                  paddingVertical: 10,
                                  alignItems: "center"
                                }}
                              >
                                <Text style={{ fontWeight: "800" }}>{TYPE_LABELS[t]}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>

                          <TouchableOpacity
                            onPress={() => saveEdit(ev)}
                            activeOpacity={0.85}
                            style={{
                              backgroundColor: "#000",
                              paddingVertical: 10,
                              borderRadius: 10,
                              alignItems: "center"
                            }}
                          >
                            <Text style={{ color: "white", fontWeight: "800" }}>Kaydet</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={cancelEdit}
                            activeOpacity={0.85}
                            style={{
                              paddingVertical: 10,
                              borderRadius: 10,
                              alignItems: "center",
                              borderWidth: 1,
                              borderColor: "#ddd"
                            }}
                          >
                            <Text style={{ fontWeight: "800" }}>İptal</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <Text>Tarih: {ev.date}</Text>
                          {!!ev.note && <Text>Not: {ev.note}</Text>}

                          <View style={{ flexDirection: "row", gap: 8 }}>
                            <TouchableOpacity
                              onPress={() => startEdit(ev)}
                              activeOpacity={0.85}
                              style={{
                                flex: 1,
                                backgroundColor: "#444",
                                paddingVertical: 10,
                                borderRadius: 10,
                                alignItems: "center"
                              }}
                            >
                              <Text style={{ color: "white", fontWeight: "800" }}>Düzenle</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => confirmDelete(ev)}
                              activeOpacity={0.85}
                              style={{
                                flex: 1,
                                backgroundColor: "#d00000",
                                paddingVertical: 10,
                                borderRadius: 10,
                                alignItems: "center"
                              }}
                            >
                              <Text style={{ color: "white", fontWeight: "800" }}>Sil</Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
