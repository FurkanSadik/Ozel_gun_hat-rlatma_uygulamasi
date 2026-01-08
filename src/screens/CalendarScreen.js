import { useState } from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");

  const markedDates = selectedDate
    ? { [selectedDate]: { selected: true, selectedColor: "black" } }
    : {};

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: "black",
          arrowColor: "black"
        }}
      />

      <View style={{ paddingTop: 14, alignItems: "center" }}>
        <Text style={{ fontSize: 14, fontWeight: "700" }}>
          Seçili Gün: {selectedDate || "-"}
        </Text>
      </View>
    </View>
  );
}
