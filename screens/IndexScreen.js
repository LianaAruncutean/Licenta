import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const IndexScreen = () => {

    const display = "flex";

    const navigation = useNavigation();

    const handleIndexPress = () => {
        navigation.navigate("Acasă", { screen: "Home" });
    }

    const handlePhotoPress = () => {
        navigation.navigate("Dovadă", { screen: "Photo" });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
                <View style={styles.greetingView}>
                    <Text style={{color: '#6b0000', fontSize: 28, fontWeight: '600', marginBottom: 10}}>Transmitere index</Text>
                </View>
                <View style={styles.address}>
                    <Text style={{fontSize: 15}}>Transmiterea indexului este aferentă lunii:</Text>
                    <Text style={{fontSize: 15, fontWeight: "500", marginTop: 5, color: "crimson"}}>Noiembrie</Text>
                </View>
                <View style={styles.address}>
                    <View style={{marginBottom: 20}}>
                        <View style={styles.iconText}>
                            <MaterialIcons name="kitchen" size={20} color="black" />
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ RECE bucătărie:</Text>
                        </View>
                        <TextInput 
                            placeholder="313"
                            // value={email}
                            // onChangeText={text => setEmail(text)}
                            style={styles.input}
                        />
                    </View>
                    <View style={{marginBottom: 20, display: display}}>
                        <View style={styles.iconText}>
                            <MaterialIcons name="kitchen" size={20} color="black" />
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ CALDĂ bucătărie:</Text>
                        </View>
                        <TextInput 
                            placeholder="258"
                            // value={email}
                            // onChangeText={text => setEmail(text)}
                            style={styles.input}
                        />
                    </View>
                    <View style={{marginBottom: 20}}>
                        <View style={styles.iconText}>
                            <MaterialIcons name="bathtub" size={20} color="black" />
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ RECE baie:</Text>
                        </View>
                        <TextInput 
                            placeholder="357"
                            // value={email}
                            // onChangeText={text => setEmail(text)}
                            style={styles.input}
                        />
                    </View>
                    <View style={{display: display}}>
                        <View style={styles.iconText}>
                            <MaterialIcons name="bathtub" size={20} color="black" />
                            <Text style={{fontWeight: "400", fontSize: 15, marginLeft: 10}}>APĂ CALDA baie:</Text>
                        </View>
                        <TextInput 
                            placeholder="210"
                            // value={email}
                            // onChangeText={text => setEmail(text)}
                            style={styles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleIndexPress}
                >
                    <Text style={styles.buttonText}>Trimite Index</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonPhoto}
                    onPress={handlePhotoPress}
                >
                    <Text style={styles.buttonTextPhoto}>Încărcare Poză</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
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
