import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { auth } from '../firebase';
import { FontAwesome5 } from '@expo/vector-icons';

const HomeScreen = () => {

    const navigation = useNavigation();

    const handleSignout = () => {
        auth
            .signOut()
            .then(() => {
                navigation.navigate("Login");
            })
            .catch(error => alert(error.message))
    }

    const handleIndexPress = () => {
        navigation.navigate("Contoare", { screen: "Index" });
    }

    const goToInfos = () => {
        navigation.navigate("Informații", { screen: "Info" });
    }

    return (
        <View>
            <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
            <View style={styles.greetingView}>
                <Text style={{color: '#6b0000', fontSize: 28, fontWeight: '600', marginBottom: 10}}>Acasă</Text>
                <Text style={{fontSize: 17, fontWeight: "500"}}>Bine ai venit, userEmail!</Text>
            </View>
            <View style={styles.address}>
                <View style={styles.iconText}>
                    <FontAwesome5 name="building" size={24} color="black" />
                    <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>Strada Constantin cel Mare, nr. 80. bl. A12, sc. B, ap. 2 </Text>
                </View>
            </View>
            <View style={styles.address}>
                <View style={{borderBottomColor: "#6b0000", borderBottomWidth: 2}}>
                    <View style={styles.paymentView}>
                        <Text style={{fontSize: 16, fontWeight:"500"}}>Total de plată:</Text>
                        <Text style={{fontSize: 16}}>238.13 lei</Text>
                    </View>
                </View>
                <View style={styles.iconText}>
                        <Text style={{fontSize: 16, fontWeight:"500", marginTop: 10}}>Dată scadentă:</Text>
                        <Text style={{fontSize: 16, marginTop: 10}}>27 Octombrie 2021</Text>
                </View>
            </View>
            <View style={styles.address}>
                <Text style={{fontSize: 16, fontWeight: "500", marginBottom: 10}}>Transmitere index:</Text>
                <Text style={{fontSize: 15}}>Indexul poate fi transmis în perioada 20 - 26 Noiembrie 2021.</Text>
                <TouchableOpacity
                    style={styles.indexButton}
                    onPress={handleIndexPress}
                >
                    <Text style={styles.buttonText}>Transmitere Index</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row", marginRight: 20}}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignout}
                >
                    <Text style={styles.buttonTextSignOut}>Deconectare</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={goToInfos}
                >
                    <Text style={styles.buttonTextSignOut}>Informații</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    greetingView: {
        padding: 30,
        marginTop: 50
    },
    iconText: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    paymentView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
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
    button: {
        backgroundColor: "white",
        width: "40%",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 60,
        marginLeft: 30,
        borderWidth: 1,
        borderColor: "#6b0000"
    },
    indexButton: {
        backgroundColor: "#6b0000",
        width: "60%",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 15,
        marginLeft: 120
    },
    buttonText: {
        color: "white",
        fontWeight: "500",
        textTransform: "uppercase"
    },
    buttonTextSignOut: {
        color: "#6b0000",
        fontWeight: "500",
        textTransform: "uppercase"
    }
})
