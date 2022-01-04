import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase";

const TenantsListScreen = () => {
  const [tenantsDetails, setTenantsDetails] = useState([]);

  useEffect(() => {
    db.collection("address")
      .doc(global.currentAddress)
      .collection("tenants")
      .get()
      .then((querySnapshot) => {
        const tenantsArray = [];
        querySnapshot.forEach((documentSnapshot) => {
          db.collection("users")
            .doc(documentSnapshot.id)
            .onSnapshot((documentSnapshotTenant) => {
              tenantsArray.push(documentSnapshotTenant.data());
              tenantsArray[tenantsArray.length - 1].id = documentSnapshotTenant.id;
              setTenantsDetails(tenantsArray);
            });
        });
      });
  }, [global.currentAddress]);

  const navigation = useNavigation();

  const Item = ({ item, onPress }) => {
    return (
      <View style={styles.container}>
        <View style={styles.iconText}>
          <View style={{ marginBottom: 5 }}>
            <Ionicons name="person" size={18} color="black" />
          </View>
          <TouchableOpacity onPress={onPress}>
            <Text
              style={{
                fontSize: 18,
                marginBottom: 15,
                marginTop: 10,
                marginLeft: 15,
              }}
            >
              {item.nume + " " + item.prenume}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        key={item.id}
        item={item}
        onPress={() => navigation.navigate("TenantDetail", {id: item.id})}
      />
    );
  };

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
          Listă locatari
        </Text>
      </View>
      <View style={styles.address}>
        <FlatList
          data={tenantsDetails}
          renderItem={renderItem}
          keyExtractor={(item) => item.apartament}
        />
      </View>
    </View>
  );
};

export default TenantsListScreen;

const styles = StyleSheet.create({
  greetingView: {
    padding: 30,
    marginTop: 50,
  },
  address: {
    paddingHorizontal: 15,
    paddingVertical: 5,
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
  container: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  iconText: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
