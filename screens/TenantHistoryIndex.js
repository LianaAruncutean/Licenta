import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { auth, db } from "../firebase";
import DropDownPicker from "react-native-dropdown-picker";
import { PieChart } from "react-native-chart-kit";

const TenantHistoryIndex = () => {
  const uid = auth.getUid();

  const navigation = useNavigation();

  const [tenant, setTenant] = useState(null);
  const [indexList, setIndexList] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

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
  var currentMonth = monthArray[new Date().getMonth()];

  useEffect(() => {
    db.collection("users")
      .doc(uid)
      .onSnapshot((documentSnapshot) => {
        setTenant(documentSnapshot.data());
      });
  }, [uid]);

  const indexMonths = [];
  useEffect(() => {
    db.collection("index")
      .doc(uid)
      .collection("indexList")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          indexMonths.push(documentSnapshot.id);
        });
        setIndexList(indexMonths);
      });
  }, [uid]);

  useEffect(() => {
    const dateArray = [];
    indexList.forEach((stringDate) => {
      const splittedDate = stringDate.split("-")[0];
      dateArray.push(splittedDate);
    });

    global.monthArray = [
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
    const listOfMonths = [];
    dateArray.forEach((dateIndex) => {
      const monthObject = {
        label: monthArray[dateIndex - 1],
        value: monthArray[dateIndex - 1],
      };
      listOfMonths.push(monthObject);
    });
    setItems(listOfMonths);

    if (value) {
      var docYear, docMonth;
      var docMonth = monthArray.indexOf(value) + 1;
      if (docMonth < 10) {
        docMonth = "0" + docMonth;
      }
      if (monthArray.indexOf(value) > new Date().getMonth()) {
        docYear = new Date().getFullYear() - 1;
      } else {
        docYear = new Date().getFullYear();
      }
      const docValue = docMonth + "-" + docYear;
      const indexToDelete = monthArray.indexOf(value) - 12;
      // setValue(listOfMonths[listOfMonths.length + indexToDelete].label)
      if (docValue) {
        db.collection("index")
          .doc(uid)
          .collection("indexList")
          .doc(docValue)
          .onSnapshot((documentSnapshot) => {
            setIndex(documentSnapshot.data());
          });
      }
    }
  }, [indexList, value]);

  const keyboardVerticalOffset = Platform.OS === "ios" ? 5 : 0;

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              Istoric index
            </Text>
          </View>
          <View style={styles.address}>
            <View style={styles.iconText}>
              <Text style={{ fontSize: 15, fontWeight: "500" }}>Luna:</Text>
              <View style={{ width: "40%", marginLeft: 143 }}>
                <DropDownPicker
                  placeholder="Selectați o lună"
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  dropDownDirection="TOP"
                  maxHeight={80}
                />
              </View>
            </View>
            <View style={{ marginBottom: 15, marginTop: 10 }}>
              <View style={styles.iconText}>
                <MaterialIcons name="kitchen" size={20} color="black" />
                <Text
                  style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}
                >
                  APĂ RECE bucătărie:
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: 15,
                    marginLeft: 60,
                    color: "#6b0000",
                  }}
                >
                  {index?.receBucatarie}
                </Text>
              </View>
            </View>
            <View style={{ marginBottom: 15, display: global.displayCald }}>
              <View style={styles.iconText}>
                <MaterialIcons name="kitchen" size={20} color="black" />
                <Text
                  style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}
                >
                  APĂ CALDĂ bucătărie:
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: 15,
                    marginLeft: 50,
                    color: "#6b0000",
                  }}
                >
                  {index?.caldaBucatarie}
                </Text>
              </View>
            </View>
            <View style={{ marginBottom: 15 }}>
              <View style={styles.iconText}>
                <MaterialIcons name="kitchen" size={20} color="black" />
                <Text
                  style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}
                >
                  APĂ RECE baie:
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: 15,
                    marginLeft: 93,
                    color: "#6b0000",
                  }}
                >
                  {index?.receBaie}
                </Text>
              </View>
            </View>
            <View style={{ marginBottom: 15, display: global.displayCald }}>
              <View style={styles.iconText}>
                <MaterialIcons name="kitchen" size={20} color="black" />
                <Text
                  style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}
                >
                  APĂ CALDĂ baie:
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: 15,
                    marginLeft: 83,
                    color: "#6b0000",
                  }}
                >
                  {index?.caldaBaie}
                </Text>
              </View>
            </View>
            <View style={{ marginBottom: 15}}>
              <View style={styles.iconText}>
                <Feather name="trash-2" size={20} color="black" />
                <Text
                  style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}
                >
                  Gunoi:
                </Text>
                {index ? (
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: 15,
                    marginLeft: 151,
                    color: "#6b0000",
                  }}
                >
                  39
                </Text>): null}
              </View>
            </View>
          </View>
          {index ? (
            <PieChart
              data={[
                {
                  name: "APĂ RECE baie",
                  consumption: parseInt(index.receBaie),
                  color: "rgb(55, 0, 0)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                  name: "APĂ RECE bucătărie",
                  consumption: parseInt(index.receBucatarie),
                  color: "rgb(135, 0, 0)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                  name: "APĂ CALDĂ baie",
                  consumption: parseInt(index.caldaBaie),
                  color: "rgb(255,16,16)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                  name: "APĂ CALDĂ bucătărie",
                  consumption: parseInt(index.caldaBucatarie),
                  color: "rgb(255,133,133)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                    name: "Gunoi",
                    consumption: 39,
                    color: "rgb(255,192,192)",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12,
                  },
              ]}
              width={Dimensions.get("window").width - 40}
              height={150}
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#efefef",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                  marginLeft: 10
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              accessor="consumption"
              backgroundColor="transparent"
              center={[20, 0]}
              paddingLeft="-20"
              absolute
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default TenantHistoryIndex;

const styles = StyleSheet.create({
  greetingView: {
    padding: 30,
    marginTop: 50,
  },
  iconText: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    width: "30%",
    marginLeft: 25,
  },
  button: {
    backgroundColor: "#6b0000",
    width: "50%",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 15,
    marginLeft: 165,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    textTransform: "uppercase",
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
  buttonHistory: {
    backgroundColor: "#6b0000",
    width: "40%",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 60,
    marginLeft: 30,
    borderWidth: 1,
    borderColor: "#6b0000",
  },
});
