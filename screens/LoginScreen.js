import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StatusBar,
} from "react-native";
import { auth, db } from "../firebase";
import { schedulePushNotification } from '../utils'

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  if (initializing) return null;

  const navigation = useNavigation();

  const handleLogin = async () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        const uid = auth.getUid();
        if (uid) {
          db.collection("admins")
            .doc(uid)
            .get()
            .then(async (documentSnapshot) => {
              if (documentSnapshot.exists === true) {
                setIsAdmin(true);
                navigation.navigate("AdminTab");
              } else {
                navigation.navigate("Tab");
                await schedulePushNotification(uid);
              }
            });
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
        <View style={styles.inputContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcome}>Bine ai venit!</Text>
            <Text style={styles.continueMessage}>
              Autentifică-te pentru a continua
            </Text>
          </View>
          <TextInput
            placeholder="Utilizator"
            placeholderTextColor = "#6e6e6e"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Parola"
            placeholderTextColor = "#6e6e6e"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Intră în cont!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  inputContainer: {
    width: "80%",
  },
  welcomeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
  },
  welcome: {
    fontWeight: "700",
    fontSize: 22,
  },
  continueMessage: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonContainer: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  button: {
    backgroundColor: "#6b0000",
    width: "100%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
