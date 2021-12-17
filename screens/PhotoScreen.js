import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';

const PhotoScreen = () => {

    const navigation = useNavigation();

    const backToIndex = () => {
        navigation.navigate("Contoare", { screen: "Index" });
    }

    const handleTakePhoto = () => {
        navigation.navigate("CameraScreen");
    }

    return (
        <View>
            <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
            <View style={styles.greetingView}>
                <Text style={{color: '#6b0000', fontSize: 28, fontWeight: '600', marginBottom: 10}}>Încărcare poză doveditoare</Text>
            </View>
            <View style={styles.address}>
                <Text style={{fontSize: 15, marginBottom: 10, textAlign: "justify"}}>Se pare că administratorul blocului a solicitat o poză pentru validarea valorii contorului trimisă de tine!</Text>
                <Text style={{fontSize: 15, marginBottom: 10, textAlign: "justify"}}>Încarcă o poză în care se poate vedea clar valoarea contorului specificat sau ia legătura cu administratorul cât de curând posibil.</Text>
                <Text style={{fontSize: 15, textAlign: "justify"}}>Numărul de telefon al acestuia este disponibil în secțiunea Informații din cadrul aplicației.</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={handleTakePhoto}
            >
                <Text style={styles.buttonText}>Fă o poză!</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonPhoto}
                onPress={backToIndex}
            >
                <Text style={styles.buttonTextPhoto}>Înapoi la transmitere</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PhotoScreen

const styles = StyleSheet.create({
    greetingView: {
        padding: 30,
        marginTop: 50
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
        textTransform: "uppercase"
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
