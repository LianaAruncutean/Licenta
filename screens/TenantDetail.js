import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native'
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialIcons } from '@expo/vector-icons';
import { showMessage } from "react-native-flash-message";
import { db } from '../firebase';

const TenantDetail = ( {route} ) => {
    
    global.uid = route.params;

    const [tenant, setTenant] = useState(null);
    const [indexList, setIndexList] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [index, setIndex] = useState(null);

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

            var monthArray = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
            const listOfMonths = [];
            dateArray.forEach(dateIndex => {
                const monthObject = {
                    label: monthArray[dateIndex-1],
                    value: monthArray[dateIndex-1]
                }
                listOfMonths.push(monthObject);
            })
            
            setItems(listOfMonths)

            if (value) {
                console.log(value)
                const docMonth = monthArray.indexOf(value) + 1;
                console.log(docMonth)
                const docValue = docMonth + '-' + '2021'
                console.log(docValue)
                const indexToDelete = ((monthArray.indexOf(value)-12))
                console.log(listOfMonths[listOfMonths.length + indexToDelete])
                setValue(listOfMonths[listOfMonths.length + indexToDelete].label)
                if (docValue) {db.collection("index").doc(global.uid.id).collection("indexList").doc(docValue)
                .onSnapshot(documentSnapshot => {
                    console.log(documentSnapshot.data())
                    setIndex(documentSnapshot.data())
            })}
                
            }
            
    },[indexList, value])

    global.currentTenant = tenant;
    if (global.currentTenant) {
        if (global.currentTenant.hasCentrala === true) {
            global.displayCald = "none";
        } else {
            global.displayCald = "flex";
        }
    }
    
    const hasToTakePhoto = () => {
        if (global.uid.id) {
        db.collection("users").doc(global.uid.id).update({hasToPhoto: true})
        showMessage({
            message: "Solicitarea dumneavoastră a fost trimisă către locatar cu success!",
            floating: true,
            position: "top",
            icon: "info",
            backgroundColor: "#6b0000",
            color: "white"
        });
        }
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
                >Vizualizare informații</Text>
            </View>
            <View style={styles.address}>
                <View style={{marginTop: 10}}>
                    <View style={styles.iconText}>
                        <Text  style={{fontSize: 15, fontWeight: '500'}}>Nume: </Text>
                        <Text  style={{fontSize: 15, fontWeight: '500', color: "crimson"}}>{global.currentTenant?.nume}</Text>
                    </View>
                </View>
                <View style={{marginTop: 10, marginBottom: 10}}>
                    <View style={styles.iconText}>
                        <Text  style={{fontSize: 15, fontWeight: '500'}}>Apartament: </Text>
                        <Text  style={{fontSize: 15, fontWeight: '500', color: "crimson"}}>{global.currentTenant?.apartament}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.address}>
                <View style={styles.iconText}>
                    <Text style={{fontSize: 15, fontWeight: '500'}}>Luna:</Text>
                    {/* <Text style={{fontSize: 15, fontWeight: '500', marginLeft: 195, color: "crimson"}}>Octombrie</Text> */}
                    <View style={{width: "40%", marginLeft: 143}}>
                        <DropDownPicker
                            placeholder='Selectați o lună'
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
                    <View style={{marginBottom: 15, marginTop: 10}}>
                        <View style={styles.iconText}>
                            <MaterialIcons name="kitchen" size={20} color="black"/>
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ RECE bucătărie:</Text>
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 60, color: "#6b0000"}}>{index?.receBucatarie}</Text>
                        </View>
                    </View>
                    <View style={{marginBottom: 15, display: global.displayCald}}>
                        <View style={styles.iconText}>
                            <MaterialIcons name="kitchen" size={20} color="black"/>
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ CALDĂ bucătărie:</Text>
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 50, color: "#6b0000"}}>{index?.caldaBucatarie}</Text>
                        </View>
                    </View>
                    <View style={{marginBottom: 15}}>
                        <View style={styles.iconText}>
                            <MaterialIcons name="kitchen" size={20} color="black"/>
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ RECE baie:</Text>
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 93, color: "#6b0000"}}>{index?.receBaie}</Text>
                        </View>
                    </View>
                    <View style={{marginBottom: 15, display: global.displayCald}}>
                        <View style={styles.iconText}>
                            <MaterialIcons name="kitchen" size={20} color="black"/>
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ CALDĂ baie:</Text>
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 83, color: "#6b0000"}}>{index?.caldaBaie}</Text>
                        </View>
                    </View>
                    {/* <View style={{marginBottom: 15}}>
                        <View style={styles.iconText}>
                            <FontAwesome5 name="piggy-bank" size={20} color="black" />
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>Status plată</Text>
                            <Text style={{fontWeight: "600", fontSize: 15, marginLeft: 114, color: "green"}}>OK</Text>
                        </View>
                    </View> */}
            </View>
                    <TouchableOpacity
                    style={styles.indexButton}
                    onPress={hasToTakePhoto}
                >
                    <Text style={styles.buttonText}>Solicită Poză</Text>
                </TouchableOpacity>
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
        backgroundColor: "#6b0000",
        width: "40%",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 15,
        marginLeft: 200
    },
    buttonText: {
        color: "white",
        fontWeight: "500",
        textTransform: "uppercase"
    },
})
