import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import Announcement from "./Announcement";
import { db } from "../firebase";

const InfoScreen = () => {
  const navigation = useNavigation();

  const backToHome = () => {
    navigation.navigate("Acasă", { screen: "Home" });
  };

  const [anunturi, setAnunturi] = useState([]);

  useEffect(() => {
    db.collection("address")
      .doc(global.user.adresa)
      .collection("announcements")
      .get()
      .then((querySnapshot) => {
        const anunturiTotal = [];
        querySnapshot.forEach((documentSnapshot) => {
          const anunt = documentSnapshot.data();
          anunturiTotal.push(anunt)
        });
        setAnunturi(anunturiTotal);
      });
  }, []);

  return (
    <View>
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <View style={styles.greetingView}>
        <Text
          style={{
            color: "#6b0000",
            fontSize: 28,
            fontWeight: "600",
            marginBottom: 10,
          }}
        >
          Informații
        </Text>
      </View>
      <View style={styles.address}>
        <Text
          style={{
            fontSize: 15,
            marginBottom: 10,
            textAlign: "justify",
            color: "crimson",
          }}
        >
          Contact administrator bloc:
        </Text>
        <Text style={{ fontSize: 15, textAlign: "justify" }}>
          Tel: 0755 123 856
        </Text>
        <Text style={{ fontSize: 15, textAlign: "justify" }}>
          E-mail: admin.bloc@exemplu.ro
        </Text>
        <Text
          style={{
            fontSize: 15,
            marginTop: 10,
            marginBottom: 10,
            textAlign: "justify",
            color: "crimson",
          }}
        >
          Contact administrator aplicație:
        </Text>
        <Text style={{ fontSize: 15, textAlign: "justify" }}>
          Tel: 0755 123 098
        </Text>
        <Text style={{ fontSize: 15, textAlign: "justify" }}>
          E-mail: admin.aplic@exemplu.ro
        </Text>
      </View>
      <View style={styles.address}>
        <Text
          style={{
            fontSize: 15,
            textAlign: "justify",
            color: "crimson",
            marginBottom: 5,
          }}
        >
          Dată plată întreținere pentru luna curentă:
        </Text>
        <Text style={{ fontSize: 15, textAlign: "justify" }}>
          27 Noiembrie 2021
        </Text>
        <Text
          style={{
            fontSize: 15,
            textAlign: "justify",
            color: "crimson",
            marginBottom: 5,
            marginTop: 10,
          }}
        >
          Cont bancar al asociației de locatari pentru plata întreținerii:
        </Text>
        <Text style={{ fontSize: 15, textAlign: "justify" }}>
          RO49 AAAA 1B31 0075 9384 0000
        </Text>
      </View>
      <View style={styles.addressFix}>
        <Text
          style={{
            fontSize: 15,
            textAlign: "justify",
            color: "crimson",
            marginBottom: 10,
          }}
        >
          Anunțuri de interes general:
        </Text>
        {/* <Text style={{fontSize: 15, textAlign: "justify", color: "#ddd"}}>Niciun anunț nu a fost postat încă!</Text> */}
        <FlatList
          data={anunturi}
          renderItem={({ item }) => <Announcement item={item}></Announcement>}
        />
      </View>
      <TouchableOpacity style={styles.buttonPhoto} onPress={backToHome}>
        <Text style={styles.buttonTextPhoto}>Înapoi Acasă</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InfoScreen;

const styles = StyleSheet.create({
  greetingView: {
    padding: 30,
    marginTop: 50,
  },
  address: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 1,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  addressFix: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    height: 200,
  },
  buttonPhoto: {
    backgroundColor: "white",
    width: "50%",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 15,
    marginLeft: 165,
    borderWidth: 1,
    borderColor: "#6b0000",
  },
  buttonTextPhoto: {
    color: "#6b0000",
    fontWeight: "500",
    textTransform: "uppercase",
  },
});
