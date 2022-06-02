import { StyleSheet, TextInput, View, Button, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, {useState} from 'react'
import { StripeProvider, CardField, useConfirmPayment } from '@stripe/stripe-react-native'
import { showMessage } from "react-native-flash-message";
import { db, auth } from '../firebase';

const API_URL = "http://192.168.100.10:3000";

const StripeAppScreen = () => {
  const uid = auth.getUid()

  const [email, setEmail] = useState()
  const [cardDetails, setCardDetails] = useState()
  const { confirmPayment, loading } = useConfirmPayment()

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  }

  const handlePayPress = async () => {
    if (!cardDetails?.complete || !email) {
      showMessage({
        message: "Vă rugăm completați toate câmpurile de pe ecran!",
        floating: true,
        position: "top",
        icon: "info",
        backgroundColor: "#6b0000",
        color: "white",
      });
      return;
    } 
    const billingDetails = {
      email: email
    }
    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      if (error) {
        console.log("The payment could not be processed!")
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, { type: "Card", billingDetails: billingDetails });
        if (error) {
          showMessage({
            message: "Plata nu a fost realizată cu success!",
            floating: true,
            position: "top",
            icon: "info",
            backgroundColor: "#6b0000",
            color: "white",
          });
        } else if (paymentIntent) {
          console.log("Payment successful ", paymentIntent)
          db.collection("users").doc(uid).update({hadPaid: true})
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
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <StripeProvider publishableKey='pk_test_51L27ZTJXUnAoewxpe5quuGzoKt3JOLtcDsJMzfupnOuGFma7tmX89ZLdlaVufC8fPt175jmCS2fmBZDMbJSkzCbY00b9EYDXIX'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <View style={styles.greetingView}>
        <Text
          style={{
            color: "#6b0000",
            fontSize: 28,
            fontWeight: "600",
            marginBottom: 10,
          }}
        >
          Plată cheltuieli întreținere
        </Text>
      </View>
        <TextInput 
          autoCapitalize = "none"
          placeholder = "E-mail"
          keyboardType = "email-address"
          value={email}
          onChange = {value => setEmail(value.nativeEvent.text)}
          style = {styles.input}
          placeholderTextColor = "#6e6e6e"
        />
        <CardField
          postalCodeEnabled = {false}
          placeholder = {{
            number: "4242 4242 4242 4242",
          }}
          placeholderTextColor = "#8e8e8e"
          cardStyle = {styles.card}
          style = {styles.cardContainer}
          onCardChange = {cardDetails => {
            setCardDetails(cardDetails);
        }}
        />
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayPress}
          >
          <Text style={styles.buttonTextSignOut}>Efectuează plata</Text>
        </TouchableOpacity>      
        </View>
        </TouchableWithoutFeedback>
    </StripeProvider>
  )
}

export default StripeAppScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 30
  }, 
  input: {
    backgroundColor: "#cecece",
    borderRadius: 20,
    fontSize: 17,
    fontWeight: "500",
    height: 50,
    padding: 10,
    color: "white",
    marginTop: 80
  },
  card: {
    backgroundColor: "#cecece",
    borderRadius: 20,
  },
  cardContainer: {
    height: 50,
    marginVertical: 20,
    color: "black",
  }, 
  payButton: {
    backgroundColor: "#6b0000",
    width: "50%",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 60,
    marginLeft: 85,
    borderWidth: 1,
    borderColor: "#6b0000",
  },
  buttonTextSignOut: {
    color: "white",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  greetingView: {
    marginBottom: 80,
    marginTop: -180
},
})