import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Modal, Alert, Pressable } from 'react-native'
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialIcons } from '@expo/vector-icons';
import { showMessage } from "react-native-flash-message";
import { db } from '../firebase';
import * as firebase from "firebase";
import { sendPushNotification } from '../utils';

const TenantDetail = ({ route }) => {

    global.uid = route.params;

    const [tenant, setTenant] = useState(null);
    const [indexList, setIndexList] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [index, setIndex] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const [displayPhoto, setDisplayPhoto] = useState({
        displayRequestPhoto: "none",
        displayDisplayPhoto: "none"
    })

    const [modalVisible, setModalVisible] = useState(false);

    var monthArray = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
    var currentMonth = monthArray[new Date().getMonth()]

    useEffect(() => {
        db.collection("users").doc(global.uid.id)
            .onSnapshot(documentSnapshot => {
                setTenant(documentSnapshot.data())
            })
    }, [global.uid.id])

    const indexMonths = [];
    useEffect(() => {
        db.collection("index").doc(global.uid.id).collection("indexList").get()
            .then((querySnapshot) => {
                querySnapshot.forEach(documentSnapshot => {
                    indexMonths.push(documentSnapshot.id)
                })
                setIndexList(indexMonths)
            })

    }, [global.uid.id])

    useEffect(() => {
        const dateArray = []
        indexList.forEach(stringDate => {
            const splittedDate = stringDate.split("-")[0]
            dateArray.push(splittedDate)
        })

        global.monthArray = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
        const listOfMonths = [];
        dateArray.forEach(dateIndex => {
            const monthObject = {
                label: monthArray[dateIndex - 1],
                value: monthArray[dateIndex - 1]
            }
            listOfMonths.push(monthObject);
        })
        setItems(listOfMonths)

        if (value) {
            var docYear, docMonth;
            var docMonth = monthArray.indexOf(value) + 1;
            if (docMonth < 10) {
                docMonth = "0" + docMonth
            }
            if (monthArray.indexOf(value) > new Date().getMonth()) {
                docYear = new Date().getFullYear() - 1;
            } else {
                docYear = new Date().getFullYear();
            }
            const docValue = docMonth + '-' + docYear;
            const indexToDelete = ((monthArray.indexOf(value) - 12))
            // setValue(listOfMonths[listOfMonths.length + indexToDelete].label)
            if (docValue) {
                db.collection("index").doc(global.uid.id).collection("indexList").doc(docValue)
                    .onSnapshot(documentSnapshot => {
                        setIndex(documentSnapshot.data())
                    })
            }

        }

    }, [indexList, value])

    useEffect(async () => {
        var photoMonth = null
        if (monthArray.indexOf(value) < 9) {
            photoMonth = "0" + (monthArray.indexOf(value) + 1)
        } else {
            photoMonth = monthArray.indexOf(value) + 1
        }
        var photoYear = null;
        if (value > currentMonth) {
            photoYear = new Date().getFullYear() - 1
        } else {
            photoYear = new Date().getFullYear()
        }

        const photoDate = photoMonth + "-" + photoYear;
        const photoName = global.uid.id + "_" + photoDate;

        const fetchImageURL = async () => {
            const imageRef = await firebase.storage().ref(photoName);
            try {
                var url = await imageRef.getDownloadURL()
                setImageURL(url)
                return url
            } catch (e) {
                setImageURL(null)
                return null
            }
        }
        const url = await fetchImageURL()
        if (url) {
            setDisplayPhoto({ displayRequestPhoto: "none", displayDisplayPhoto: "flex" })
        } else {
            if (currentMonth !== value) {
                setDisplayPhoto({ displayRequestPhoto: "none", displayDisplayPhoto: "none" })
            } else {
                setDisplayPhoto({ displayRequestPhoto: "flex", displayDisplayPhoto: "none" })
            }
        }
    }, [value])

    global.currentTenant = tenant;
    
    if (global.currentTenant) {
        if (global.currentTenant.hasCentrala === true) {
            global.displayCald = "none";
        } else {
            global.displayCald = "flex";
        }
    }

    if (value) {
        global.displayButtonValue = "flex";
    } else {
        global.displayButtonValue = "none";
    }

    const hasToTakePhoto = async () => {
        if (global.uid.id) {
            db.collection("users").doc(global.uid.id).update({ hasToPhoto: true })
            await sendPushNotification(global.uid.id, "APPartement", "Administratorul a solicitat o poz?? a contoarelor!")
            showMessage({
                message: "Solicitarea dumneavoastr?? a fost trimis?? c??tre locatar cu success!",
                floating: true,
                position: "top",
                icon: "info",
                backgroundColor: "#6b0000",
                color: "white"
            });
        }
    }

    const viewPhoto = () => {
        if (imageURL) {
            setModalVisible(true)
        }
    }

    if (imageURL) {
        global.imageView = "flex";
    } else {
        global.imageView = "none";
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
                >Vizualizare informa??ii</Text>
            </View>
            <View style={styles.address}>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.iconText}>
                        <Text style={{ fontSize: 15, fontWeight: '500' }}>Nume: </Text>
                        <Text style={{ fontSize: 15, fontWeight: '500', color: "crimson" }}>{global.currentTenant?.nume + " " + global.currentTenant?.prenume}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <View style={styles.iconText}>
                        <Text style={{ fontSize: 15, fontWeight: '500' }}>Apartament: </Text>
                        <Text style={{ fontSize: 15, fontWeight: '500', color: "crimson" }}>{global.currentTenant?.apartament}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.address}>
                <View style={styles.iconText}>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>Luna:</Text>
                    {/* <Text style={{fontSize: 15, fontWeight: '500', marginLeft: 195, color: "crimson"}}>Octombrie</Text> */}
                    <View style={{ width: "40%", marginLeft: 143 }}>
                        <DropDownPicker
                            placeholder='Selecta??i o lun??'
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            dropDownDirection='TOP'
                            maxHeight={80}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 15, marginTop: 10 }}>
                    <View style={styles.iconText}>
                        <MaterialIcons name="kitchen" size={20} color="black" />
                        <Text style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}>AP?? RECE buc??t??rie:</Text>
                        <Text style={{ fontWeight: "400", fontSize: 15, marginLeft: 60, color: "#6b0000" }}>{index?.receBucatarie}</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 15, display: global.displayCald }}>
                    <View style={styles.iconText}>
                        <MaterialIcons name="kitchen" size={20} color="black" />
                        <Text style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}>AP?? CALD?? buc??t??rie:</Text>
                        <Text style={{ fontWeight: "400", fontSize: 15, marginLeft: 50, color: "#6b0000" }}>{index?.caldaBucatarie}</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 15 }}>
                    <View style={styles.iconText}>
                        <MaterialIcons name="kitchen" size={20} color="black" />
                        <Text style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}>AP?? RECE baie:</Text>
                        <Text style={{ fontWeight: "400", fontSize: 15, marginLeft: 93, color: "#6b0000" }}>{index?.receBaie}</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 15, display: global.displayCald }}>
                    <View style={styles.iconText}>
                        <MaterialIcons name="kitchen" size={20} color="black" />
                        <Text style={{ fontWeight: "400", fontSize: 15, marginLeft: 10 }}>AP?? CALD?? baie:</Text>
                        <Text style={{ fontWeight: "400", fontSize: 15, marginLeft: 83, color: "#6b0000" }}>{index?.caldaBaie}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: "row", marginRight: 20, display: global.displayButtonValue }}>
                <Pressable
                    style={styles.indexButton}
                    onPress={viewPhoto}
                    display={displayPhoto.displayDisplayPhoto}
                >
                    <Text style={styles.buttonText} display={displayPhoto.displayDisplayPhoto}>Vizualizare Poz??</Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={hasToTakePhoto}
                    display={displayPhoto.displayRequestPhoto}
                >
                    <Text style={styles.buttonTextSignOut} display={displayPhoto.displayRequestPhoto}>Solicit?? Poz??</Text>
                </Pressable>
            </View>
            <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("closed")
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Image source={{ uri: imageURL }} style={styles.image} display={global.imageView} />
                            <Pressable
                                style={[styles.buttonModal, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.buttonTextSignOut}>??nchide</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

export default TenantDetail

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
    iconText: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    indexButton: {
        backgroundColor: "white",
        width: "40%",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 20,
        marginLeft: 30,
        borderWidth: 1,
        borderColor: "#6b0000"
    },
    buttonText: {
        color: "#6b0000",
        fontWeight: "500",
        textTransform: "uppercase"
    },
    button: {
        backgroundColor: "#6b0000",
        width: "40%",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 20,
        marginLeft: 30,
        borderWidth: 1,
        borderColor: "#6b0000"
    },
    buttonTextSignOut: {
        color: "white",
        fontWeight: "500",
        textTransform: "uppercase"
    },
    image: {
        width: 250,
        height: 500,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: "#6b0000",
        marginBottom: 20
    },
    modalView: {
        marginTop: 70,
        marginHorizontal: 30,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#6b0000",
    },
})
