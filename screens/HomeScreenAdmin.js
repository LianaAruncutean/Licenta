import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  FlatList,
} from "react-native";
import { auth, db } from "../firebase";
import { FontAwesome5 } from "@expo/vector-icons";
import Announcement from "./Announcement";
import DropDownPicker from "react-native-dropdown-picker";

const HomeScreenAdmin = () => {
  const [uid, setUid] = useState(auth.getUid());
  const [loggedUser, setLoggedUser] = useState();
  const [anunturi, setAnunturi] = useState([]);
  const [adrese, setAdrese] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (uid) {
      const subscriber = db
        .collection("users")
        .doc(uid)
        .onSnapshot((documentSnapshot) => {
          setLoggedUser(documentSnapshot.data());
          db.collection("address")
            .doc(global.user?.adresa)
            .collection("announcements")
            .get()
            .then((querySnapshot) => {
              const anunturiTotal = [];
              querySnapshot.forEach((documentSnapshot) => {
                const anunt = documentSnapshot.data();
                anunturiTotal.push(anunt);
              });
              setAnunturi(anunturiTotal);
            });
        });

      db.collection("address")
        .get()
        .then((querySnapshot) => {
          const totalAdrese = [];
          querySnapshot.forEach((documentSnapshot) => {
            const adresa = documentSnapshot.id;
            db.collection("address")
              .doc(adresa)
              .collection("admin")
              .get()
              .then((adminSnapshot) => {
                adminSnapshot.forEach((admin) => {
                  const adminId = admin.id;
                  if (adminId === uid) {
                    const adresaObiect = {
                      label: adresa,
                      value: adresa,
                    };
                    totalAdrese.push(adresaObiect);
                  }
                });
                setAdrese(totalAdrese);
                setSelectedAddress(totalAdrese[0].label);
              });
          });
        });
      return () => subscriber();
    }
  }, [uid, global.user?.adresa]);
  global.user = loggedUser;

  if (anunturi.length === 0) {
    global.displayTextAnn = "flex";
    global.displayAnn = "none";
  } else {
    global.displayTextAnn = "none";
    global.displayAnn = "flex";
  }

  global.currentAddress = selectedAddress;

  const navigation = useNavigation();

  const handleSignout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  const displayTenantList = () => {
      navigation.navigate("TenantsList");
  }

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
          Acasă
        </Text>
        <Text style={{ fontSize: 17, fontWeight: "500" }}>
          Bine ai venit, {global.user?.nume + " " + global.user?.prenume}!
        </Text>
      </View>
      <View style={styles.address}>
        <View style={styles.iconText}>
          <FontAwesome5
            name="building"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <DropDownPicker
              open={open}
              value={selectedAddress}
              items={adrese}
              setOpen={setOpen}
              setValue={setSelectedAddress}
              setItems={setAdrese}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.indexButton} onPress={displayTenantList}>
        <Text style={styles.buttonText}>Vezi Locatari</Text>
      </TouchableOpacity>
      <View style={styles.address}>
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
        <Text
          style={{
            fontSize: 15,
            textAlign: "justify",
            color: "#ddd",
            display: global.displayTextAnn,
          }}
        >
          Niciun anunț nu a fost postat încă!
        </Text>
        <FlatList
          data={anunturi}
          renderItem={({ item }) => <Announcement item={item}></Announcement>}
          keyExtractor={(item) => item.data}
        />
      </View>
      <TouchableOpacity
        style={styles.indexButton}
        onPress={()=> console.log("-fe")}
      >
        <Text style={styles.buttonText}>Adaugă anunț</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginRight: 20 }}>
        <TouchableOpacity style={styles.button} onPress={handleSignout}>
          <Text style={styles.buttonTextSignOut}>Deconectare</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreenAdmin;

const styles = StyleSheet.create({
  greetingView: {
    padding: 30,
    marginTop: 50,
  },
  iconText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  address: {
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
    zIndex: 99,
  },
  button: {
    backgroundColor: "white",
    width: "40%",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 40,
    marginLeft: 30,
    borderWidth: 1,
    borderColor: "#6b0000",
  },
  indexButton: {
    backgroundColor: "#6b0000",
    width: "40%",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    marginLeft: 203,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  buttonTextSignOut: {
    color: "#6b0000",
    fontWeight: "500",
    textTransform: "uppercase",
  },
});
