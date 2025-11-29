import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import api from "../api";
import { RoomResponseWithGuestDTO } from "../api/dto";
import RoomCard from "../components/RoomCard";
import { useLoading } from "../context/loadingContext";

export default function Rooms() {
  const {withLoading, isLoading} = useLoading();
  const [entrada, setEntrada] = useState("");
  const [saida, setSaida] = useState("");
  const [rooms, setRooms] = useState<RoomResponseWithGuestDTO[]>([]);

  async function fetchRooms() {
    withLoading(async () => {
      await api.rooms.getRoomsWithGuests().then(data => {
        setRooms(data);
        console.log(data);
      });
    });
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Quartos</Text>

        {/* Filtros */}
        <View style={styles.filters}>
            <TextInput
                placeholder="Entrada (dd/mm/aaaa)"
                value={entrada}
                onChangeText={setEntrada}
                style={styles.input}
            />

            <TextInput
                placeholder="Saída (dd/mm/aaaa)"
                value={saida}
                onChangeText={setSaida}
                style={styles.input}
            />
        </View>

        <ScrollView contentContainerStyle={styles.list} scrollEventThrottle={16}>
            {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
            ))}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F5EF",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  list: {
    paddingBottom: 40,
  },
});