import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { showMessage } from "react-native-flash-message";
import { hasValue } from '../utils';

const IndexScreen = () => {

    const uid = auth.getUid();
    console.log(uid)

    const navigation = useNavigation();

    const [receBaie, setReceBaie] = useState(undefined);
    const [caldaBaie, setCaldaBaie] = useState(0);
    const [receBucatarie, setReceBucatarie] = useState(undefined);
    const [caldaBucatarie, setCaldaBucatarie] = useState(0);
    const [docExist, setDocExist] = useState(false);

    if (global.currentMonthIndex < 10) {
        global.currentMonthIndex = "0" + global.currentMonthIndex
    }
    if (global.currentMonthIndex.startsWith("00")) {
        global.currentMonthIndex = global.currentMonthIndex.substring(1)
    }
    const doc = (global.currentMonthIndex + 1) + '-' + new Date().getFullYear();

    if (global.user.hasCentrala === true) {
        global.displayCald = "none";
    } else {
        global.displayCald = "flex";
    }

    db.collection('index').doc(uid).collection('indexList').doc(doc)
    .get()
    .then(documentSnapshot => {
        if (documentSnapshot.exists) {
            setDocExist(true);
        }
    });
    if (docExist === true) {
        global.disabled = "none";
        global.messageExists = "flex";
        global.messageIndexOutOfBounds = "none";
        global.messageIndexOk = "none";
    } else {
        if (currentDay < 10 || currentDay > 15) {
            global.messageIndexOutOfBounds = "flex";
            global.messageIndexOk = "none";
            global.disabled = "none";
            global.messageExists = "none";
        }
        else {
            global.messageIndexOutOfBounds = "none";
            global.messageIndexOk = "flex";
            global.disabled = "flex";
            global.messageExists = "none";
        }
    }

    const handleIndexPress = () => {
        if (!hasValue(receBucatarie) || !hasValue(caldaBucatarie) || !hasValue(receBaie) || !hasValue(caldaBaie)) {
            showMessage({
                message: "Vă rugăm introduceți valorile tuturor contoarelor!",
                floating: true,
                position: "top",
                icon: "info",
                backgroundColor: "#6b0000",
                color: "white"
            });
            return ;
        }
        db
          .collection('index')
          .doc(uid)
          .collection('indexList')
          .doc(doc)
          .set({
              receBucatarie: receBucatarie,
              caldaBucatarie: hasValue(caldaBucatarie) ? caldaBucatarie : 0,
              receBaie: receBaie,
              caldaBaie: hasValue(caldaBaie) ? caldaBaie : 0
          });
        setReceBucatarie(undefined);
        setCaldaBucatarie(undefined);
        setReceBaie(undefined);
        setCaldaBaie(undefined);
        Keyboard.dismiss();
        navigation.navigate("Acasă", { screen: "Home" });
    }

    const handlePhotoPress = () => {
        navigation.navigate("Dovadă", { screen: "Photo" });
    }

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 5 : 0

    return (
        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
                <View style={styles.greetingView}>
                    <Text style={{color: '#6b0000', fontSize: 28, fontWeight: '600', marginBottom: 10}}>Transmitere index</Text>
                </View>
                <View style={styles.address}>
                    <Text style={{fontSize: 15, display: global.messageIndexOk}}>Transmiterea indexului este aferentă lunii:</Text>
                    <Text style={{fontSize: 15, fontWeight: "500", marginTop: 5, color: "crimson", display: global.messageIndexOk}}>{global.currentMonth}</Text>
                    <Text style={{fontSize: 15, display: global.messageIndexOutOfBounds, textAlign: "justify"}}>Perioada de transmitere a indexului nu a început.</Text>
                    <Text style={{fontSize: 15, display: global.messageIndexOutOfBounds, color: "crimson", marginTop: 7}}>Transmiterea indexului se poate face începând cu 10 {global.currentMonth}!</Text>
                    <Text style={{fontSize: 15, display: global.messageExists, color: "crimson"}}>Transmiterea indexului pentru luna {global.currentMonth} a fost deja efectuată!</Text>
                </View>
                    <View style={{display: global.disabled}}>
                <View style={styles.address}>
                        <View style={{marginBottom: 20}}>
                            <View style={styles.iconText}>
                                <MaterialIcons name="kitchen" size={20} color="black" />
                                <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ RECE bucătărie:</Text>
                            </View>
                            <TextInput 
                                placeholder="313"
                                value={receBucatarie}
                                onChangeText={text => setReceBucatarie(text)}
                                style={styles.input}
                                keyboardType='numeric'
                            />
                        </View>
                        <View style={{marginBottom: 20, display: global.displayCald}}>
                            <View style={styles.iconText}>
                                <MaterialIcons name="kitchen" size={20} color="black" />
                                <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ CALDĂ bucătărie:</Text>
                            </View>
                            <TextInput 
                                placeholder="258"
                                value={caldaBucatarie}
                                onChangeText={text => setCaldaBucatarie(text)}
                                style={styles.input}
                                keyboardType='numeric'
                            />
                        </View>
                        <View style={{marginBottom: 20}}>
                            <View style={styles.iconText}>
                                <MaterialIcons name="bathtub" size={20} color="black" />
                                <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ RECE baie:</Text>
                            </View>
                            <TextInput 
                                placeholder="357"
                                value={receBaie}
                                onChangeText={text => setReceBaie(text)}
                                style={styles.input}
                                keyboardType='numeric'
                            />
                        </View>
                        
                        <View style={{display: global.displayCald}}>
                            <View style={styles.iconText}>
                                <MaterialIcons name="bathtub" size={20} color="black" />
                                <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ CALDA baie:</Text>
                            </View>
                            <TextInput 
                                placeholder="210"
                                value={caldaBaie}
                                onChangeText={text => setCaldaBaie(text)}
                                style={styles.input}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>
                </View>
                <View style={{display: global.disabled}}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleIndexPress}
                >
                    <Text style={styles.buttonText}>Trimite Index</Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.buttonPhoto}
                    onPress={handlePhotoPress}
                >
                    <Text style={styles.buttonTextPhoto}>Încărcare Poză</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default IndexScreen

const styles = StyleSheet.create({
    greetingView: {
        padding: 30,
        marginTop: 50
    },
    iconText: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
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
            width: 1
        }
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
        marginLeft: 25
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
        borderColor: "#6b0000"
    },
    buttonTextPhoto: {
        color: "#6b0000",
        fontWeight: "500",
        textTransform: "uppercase"
    }
})
