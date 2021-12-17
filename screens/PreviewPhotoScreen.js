import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import * as firebase from "firebase";
import { auth } from '../firebase';
import { showMessage } from "react-native-flash-message";

const PreviewPhotoScreen = () => {

    const uid = auth.getUid();
    const doc = (global.currentMonthIndex + 1) + '-' + new Date().getFullYear();

    const navigation = useNavigation();

    const backToCamera = () => {
        navigation.navigate("CameraScreen");
    }
    
    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child(imageName);
        return ref.put(blob);
    }

    const sendPhoto = () => {
        uploadImage(global.image.uri, uid + "_" + doc)
        .then(() => {
            showMessage({
                message: "Poza doveditoare a fost transmisă către administrator cu succes!",
                floating: true,
                position: "top",
                icon: "info",
                backgroundColor: "#6b0000",
                color: "white"
            });
        })
        .catch((error) => {
            console.log(error)
        });
        navigation.navigate("Dovadă", { screen: "Photo" });
    }


    return (
        <View style={styles.container}>
            <View style={styles.greetingView}>
                <Text style={{color: '#6b0000', fontSize: 28, fontWeight: '600', marginBottom: 10}}>Vizualizare poză doveditoare</Text>
            </View>
            <Image source={{uri: global.image.uri}} style={styles.image} />      
            <View style={{flexDirection: "row", marginRight: 20}}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={backToCamera}
                >
                    <Text style={styles.buttonTextSignOut}>Reîncearca</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonSend}
                    onPress={sendPhoto}
                >
                    <Text style={styles.buttonText}>Trimite</Text>
                </TouchableOpacity>
            </View>  
        </View>
    )
}

export default PreviewPhotoScreen

const styles = StyleSheet.create({
    greetingView: {
        marginRight: 5,
        marginTop: -50,
        marginBottom: 20,
    },
    container: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
      width: 250,
      height: 500,
      borderRadius: 20,
      borderWidth: 3,
    borderColor: "#6b0000"
    },
    button: {
        backgroundColor: "white",
        width: "40%",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 40,
        marginLeft: 30,
        borderWidth: 1,
        borderColor: "#6b0000"
    },
    buttonSend: {
        backgroundColor: "#6b0000",
        width: "40%",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 40,
        marginLeft: 30,
        borderWidth: 1,
        borderColor: "#6b0000"
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
  });