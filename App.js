import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import BottomTabNavigator from "./navigation/TabNavigator";
import FlashMessage from "react-native-flash-message";
import CameraScreen from './screens/CameraScreen';
import PreviewPhotoScreen from './screens/PreviewPhotoScreen';
import LandingScreen from './screens/LandingScreen';
import AdminBottomTabNavigator from './navigation/AdminTabNavigator';
import {LogBox} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Text, View, Button, Platform } from 'react-native';
import { auth, db } from './firebase';

const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs(); 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={ {headerShown: false} } name="Landing" component={LandingScreen} />
        <Stack.Screen options={ {headerShown: false} } name="Login" component={LoginScreen} />
        <Stack.Screen options={ {headerShown: false} } name="CameraScreen" component={CameraScreen}/>
        <Stack.Screen options={ {headerShown: false} } name="PreviewPhotoScreen" component={PreviewPhotoScreen}/>
        <Stack.Screen options={ {headerShown: false} } name="Tab" component={BottomTabNavigator} />
        <Stack.Screen options={ {headerShown: false} } name="AdminTab" component={AdminBottomTabNavigator} />
      </Stack.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  const uid = auth.getUid();
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    if (uid && token) {
      db
        .collection('users')
        .doc(uid)
        .update({
            notificationToken: token
        });
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}