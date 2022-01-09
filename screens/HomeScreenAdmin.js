import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  FlatList, Modal, Pressable, TextInput, Keyboard, TouchableWithoutFeedback
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

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    if (uid) {
      if(selectedAddress) {
        db
        .collection("users")
        .doc(uid)
        .onSnapshot((documentSnapshot) => {
          setLoggedUser(documentSnapshot.data());
          db.collection("address")
            .doc(selectedAddress)
            .collection("announcements")
            .get()
            .then((querySnapshot) => {
              const anunturiTotal = [];
              querySnapshot.forEach((documentSnapshot) => {
                const anunt = documentSnapshot.data();
                anunturiTotal.push(anunt);
                anunturiTotal.sort((a, b) => (a.date > b.date) ? 1 : -1)
              });
              setAnunturi(anunturiTotal);
            });
        });}

      }
      
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
                if (selectedAddress === null) {
                  setSelectedAddress(totalAdrese[0].label)
                }
              });
          });
        });
  }, [uid, global.user?.adresa, selectedAddress]);
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
        console.log(auth.getUid())
      })
      .catch((error) => alert(error.message));
  };

  const displayTenantList = () => {
    navigation.navigate("Listă", { screen: "TenantsList", initial: false });
  }

  const addAnnouncement = () => {
      setModalVisible(true)
  }

  const addAnnouncementToDB = () => {
    console.log(title + " "  + description)
    const currentDate = new Date();
    var currentDay = null;
    if (currentDate.getDate() < 10) {
      currentDay = "0" + currentDate.getDate();
    } else {
      currentDay = currentDate.getDate();
    }
    var currentMonth = null;
    if (currentDate.getMonth() < 10) {
      currentMonth = "0" + (currentDate.getMonth() + 1);
    } else {
      currentMonth = currentDate.getMonth() + 1
    }
    const dateDB = currentDay + "/" + currentMonth + "/" + currentDate.getFullYear()
    console.log(dateDB)
    db.collection("address").doc(selectedAddress).collection("announcements")
    .add({
      data: dateDB,
      text: description,
      titlu: title
    })
    .then(() => console.log("Announcement added"))
    setTitle(null);
    setDescription(null);
    setModalVisible(!modalVisible)
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
          keyExtractor={(item) => item.data + Math.random(10000)}
        />
      </View>
      <TouchableOpacity
        style={styles.indexButton}
        onPress={addAnnouncement}
      >
        <Text style={styles.buttonText}>Adaugă anunț</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginRight: 20 }}>
        <TouchableOpacity style={styles.button} onPress={handleSignout}>
          <Text style={styles.buttonTextSignOut}>Deconectare</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("closed")
                    setModalVisible(!modalVisible);
                }}>
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={{fontSize: 18, fontWeight: "500", marginBottom: 15, color: "#6b0000"}}>Adăuagare anunț</Text>
                          <View style={{marginBottom: 10}}>
                              <View style={styles.iconText}>
                                  <Text style={styles.inputTitle}>Titlu: </Text>
                                  <TextInput 
                                      value={title}
                                      onChangeText={text => setTitle(text)}
                                      style={styles.inputTitleBox}
                                  />
                              </View>
                              <View style={styles.iconText}>
                                  <Text style={styles.inputTitle}>Descriere: </Text>
                                  <TextInput 
                                      multiline
                                      numberOfLines={12}
                                      value={description}
                                      onChangeText={text => setDescription(text)}
                                      style={styles.inputDescriptionBox}
                                  />
                              </View>
                            </View>
                            <View style={styles.iconText}>
                              <Pressable
                                style={[styles.buttonModal, styles.buttonAdd, {marginRight: 20}]}
                                onPress={() => setModalVisible(!modalVisible)}
                                >
                                <Text style={styles.buttonTextSignOut}>Închide</Text>
                              </Pressable>
                              <Pressable
                                style={[styles.buttonModal, styles.buttonClose]}
                                onPress={addAnnouncementToDB}
                                >
                                <Text style={styles.buttonText}>Adaugă anunț</Text>
                              </Pressable>
                            </View>
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
                </Modal>
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
    maxHeight: 200
  },
  button: {
    backgroundColor: "white",
    width: "40%",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
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
  modalView: {
    marginTop: 70,
    marginHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
    },
modalText: {
    marginBottom: 15,
    textAlign: "center"
},
buttonModal: {
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 15,
    elevation: 2,
    marginTop: 10
  },
buttonClose: {
    backgroundColor: "#6b0000",
},
buttonAdd: {
    backgroundColor: "white",
    borderColor: "#6b0000",
    borderWidth: 1
},
inputTitleBox: {
  backgroundColor: "white",
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderRadius: 10,
  marginTop: 10,
  borderColor: "#ddd",
  borderWidth: 1,
  width: "85%",
  height: "70%",
  marginLeft: 25,
},
inputTitle: {
  fontSize: 16,
  marginTop: 7,
  marginLeft: -14,
  fontWeight: "500",
  color: "black"
},
inputDescriptionBox: {
  backgroundColor: "white",
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderRadius: 10,
  marginTop: 10,
  borderColor: "#ddd",
  borderWidth: 1,
  width: "71%",
  marginLeft: 25
},
});
