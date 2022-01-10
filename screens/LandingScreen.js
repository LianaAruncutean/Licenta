import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import { auth, db } from "../firebase";

const LandingScreen = () => {
  const navigation = useNavigation();
  var adminsDraft = [];

  auth.onAuthStateChanged((authState) => {
    const uid = auth.getUid();
    console.log(uid)
    if (uid) {
      db.collection("admins")
        .get()
        .then((querySnapshot) => {
          console.log("Total users: ", querySnapshot.size);

          querySnapshot.forEach((documentSnapshot) => {
            adminsDraft.push(documentSnapshot.id);
          });
          console.log(adminsDraft);
          if (adminsDraft.includes(uid)) {
            navigation.navigate("AdminTab");
          } else {
            navigation.navigate("Tab");
          }
        });
    } else {
      navigation.navigate("Login");
    }
  });

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/landingImage.jpg")}
        style={styles.image}
      />
      <ActivityIndicator
        size="large"
        color="#6b0000"
        style={{ marginTop: -10, marginBottom: 10 }}
      />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "500",
          color: "#6b0000",
          fontFamily: "System",
        }}
      >
        APPartment
      </Text>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  image: {
    width: 200,
    height: 400,
    borderRadius: 20,
    marginTop: -70,
    marginLeft: 10,
  },
});
