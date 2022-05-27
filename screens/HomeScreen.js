import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { FontAwesome5 } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";

const HomeScreen = () => {
  const uid = auth.getUid();
  const [paymentTotal, setPaymentTotal] = useState();
  const [loggedUser, setLoggedUser] = useState();

  useEffect(() => {
    const subscriber = db
      .collection("users")
      .doc(uid)
      .onSnapshot((documentSnapshot) => {
        setLoggedUser(documentSnapshot.data());
      });
    return () => subscriber();
  }, [uid]);
  global.user = loggedUser;

  useFocusEffect(
    React.useCallback(() => {
      if (global.currentMonthIndex < 10) {
        global.currentMonthIndex = "0" + global.currentMonthIndex;
      }
      var docCurrent =
        global.currentMonthIndex + 1 + "-" + new Date().getFullYear();
      if (docCurrent.startsWith("00")) {
        docCurrent = docCurrent.substring(1);
      }
      var docPreviousYear, docPreviousMonth;
      if (global.currentMonthIndex == 0) {
        docPreviousYear = new Date().getFullYear() - 1;
        docPreviousMonth = 12;
      }
      var docPrevious = docPreviousMonth + "-" + docPreviousYear;
      console.log(docPrevious + "    " + docCurrent);
      db.collection("index")
        .doc(uid)
        .collection("indexList")
        .doc(docCurrent)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists && loggedUser.hadPayed === false) {
            db.collection("index")
              .doc(uid)
              .collection("indexList")
              .doc(docPrevious)
              .onSnapshot((documentSnapshotPrev) => {
                const prevIndex = documentSnapshotPrev.data();
                db.collection("index")
                  .doc(uid)
                  .collection("indexList")
                  .doc(docCurrent)
                  .onSnapshot((documentSnapshotCurrent) => {
                    const currIndex = documentSnapshotCurrent.data();
                    var paymentValue;
                    paymentValue =
                      (currIndex.receBaie - prevIndex.receBaie) * 2 +
                      (currIndex.receBucatarie - prevIndex.receBucatarie) * 2 +
                      (currIndex.caldaBaie - prevIndex.caldaBaie) * 2 +
                      (currIndex.caldaBucatarie - prevIndex.caldaBucatarie) * 2;
                    setPaymentTotal(paymentValue);
                  });
              });
          } else {
            setPaymentTotal("-");
          }
          console.log(paymentTotal);
        });
    }, [])
  );

  var monthArray = [
    "Ianuarie",
    "Februarie",
    "Martie",
    "Aprilie",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Noiembrie",
    "Decembrie",
  ];
  global.currentMonthIndex = new Date().getMonth();
  global.currentMonth = monthArray[currentMonthIndex];
  global.previousMonth =
    monthArray[currentMonthIndex === 0 ? 11 : currentMonthIndex - 1];

  const navigation = useNavigation();

  const handleSignout = () => {
    auth
      .signOut()
      .then(() => {
        // setLoggedUser(undefined)
        // console.log(user)
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  const handleIndexOutOfBounds = () => {
    showMessage({
      message: "Va rugam transmiteti indexul in perioada mentionata!",
      floating: true,
      position: "top",
      icon: "info",
      backgroundColor: "#6b0000",
      color: "white",
    });
  };

  const handleIndexPress = () => {
    navigation.navigate("Contoare", { screen: "Index" });
  };

  const goToInfos = () => {
    navigation.navigate("Informații", { screen: "Info" });
  };

  const goToPaymentScreen = () => {
    navigation.navigate("Acasă", {screen: "Payment"})
  }

  global.currentDay = new Date().getDate();
  if (currentDay < 24 || currentDay > 28) {
    global.indexFunction = handleIndexOutOfBounds;
  } else {
    global.indexFunction = handleIndexPress;
  }

  if (global.previousMonth == "Decembrie") {
    global.currentYear = new Date().getFullYear() - 1;
  } else {
    global.currentYear = new Date().getFullYear();
  }

  var today = new Date(
    new Date().getFullYear() + "-" + (currentMonthIndex + 1) + "-" + currentDay
  );
  var lastPayDate = new Date(
    new Date().getFullYear() + "-" + currentMonthIndex + "-" + "27"
  );
  if (today > lastPayDate && paymentTotal !== "-") {
    global.paymentColor = "crimson";
  } else {
    global.paymentColor = "black";
  }
  if (new Date().getDate() < 10) {
    if (global.currentMonthIndex == 0) {
      global.limitMonth = monthArray[11];
    }
  } else {
    global.limitMonth = monthArray[global.currentMonthIndex];
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
          Bine ai venit, {loggedUser?.nume + " " + loggedUser?.prenume}!
        </Text>
      </View>
      <View style={styles.address}>
        <View style={styles.iconText}>
          <FontAwesome5 name="building" size={24} color="black" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}>
              {loggedUser?.adresa + ", ap. " + loggedUser?.apartament}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.address}>
        <View style={{ borderBottomColor: "#6b0000", borderBottomWidth: 2 }}>
          <View style={styles.paymentView}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Total de plată:
            </Text>
            <Text style={{ fontSize: 16 }}>{paymentTotal} lei</Text>
          </View>
        </View>
        <View style={styles.iconText}>
          <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 10 }}>
            Dată scadentă:
          </Text>
          <Text
            style={{ fontSize: 16, marginTop: 10, color: global.paymentColor }}
          >
            29 {monthArray[currentMonthIndex]} {new Date().getFullYear()}
          </Text>
        </View>
        {paymentTotal !== '-' ? (
          <TouchableOpacity
          style={styles.indexButton}
          onPress={goToPaymentScreen}
          >
          <Text style={styles.buttonText}>Efectuează plata</Text>
          </TouchableOpacity>
          ) : null}
      </View>
      <View style={styles.address}>
        <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 10 }}>
          Transmitere index:
        </Text>
        <Text style={{ fontSize: 15 }}>
          Indexul poate fi transmis în perioada 24 - 28 {global.currentMonth}{" "}
          {new Date().getFullYear()}.
        </Text>
        <TouchableOpacity
          style={styles.indexButton}
          onPress={global.indexFunction}
        >
          <Text style={styles.buttonText}>Transmitere Index</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", marginRight: 20 }}>
        <TouchableOpacity style={styles.button} onPress={handleSignout}>
          <Text style={styles.buttonTextSignOut}>Deconectare</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToInfos}>
          <Text style={styles.buttonTextSignOut}>Informații</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

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
  paymentView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  },
  button: {
    backgroundColor: "white",
    width: "40%",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 60,
    marginLeft: 30,
    borderWidth: 1,
    borderColor: "#6b0000",
  },
  indexButton: {
    backgroundColor: "#6b0000",
    width: "60%",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 15,
    marginLeft: 120,
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
