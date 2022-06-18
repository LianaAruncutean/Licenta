import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

const CameraScreen = () => {

    const navigation = useNavigation();
    const doc = (global.currentMonthIndex + 1) + '-' + new Date().getFullYear();

    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);

    const takePicture = async () => {
        if(camera) {
            const data = await camera.takePictureAsync(null);
            global.image = data
            navigation.replace("PreviewPhotoScreen")
        }
    }

    const exitCamera = () => {
        navigation.navigate("Dovadă", { screen: "Photo" });
    }
    
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} ref={ref => setCamera(ref)} >
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={exitCamera}
                    >
                        <View style={styles.iconText}>
                            <MaterialIcons name="close" size={22} color="#6b0000" />
                            <Text style={styles.buttonText}> Închide </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={takePicture}                
                    >
                        <View style={styles.iconText}>
                            <MaterialIcons name="camera-alt" size={22} color="#6b0000" />
                            <Text style={styles.buttonText}> Fă poză </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

export default CameraScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
        flex: 1,
        alignItems: "center",
    },
    iconText: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    button: {
        backgroundColor: "white",
        width: "35%",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        borderWidth: 1,
        marginTop: 750,
        marginRight: 30,
        marginLeft: 30
    },
    buttonText: {
        color: "#6b0000",
        fontWeight: "500",
        textTransform: "uppercase",
        marginLeft: 5
    }
  });