import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import BottomTabNavigator from "./navigation/TabNavigator";
import FlashMessage from "react-native-flash-message";
import CameraScreen from './screens/CameraScreen';
import PreviewPhotoScreen from './screens/PreviewPhotoScreen';
import HomeScreenAdmin from './screens/HomeScreenAdmin';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={ {headerShown: false} } name="Login" component={LoginScreen} />
        {/* <Stack.Screen options={ {headerShown: false} } name="CameraScreen" component={CameraScreen}/>
        <Stack.Screen options={ {headerShown: false} } name="PreviewPhotoScreen" component={PreviewPhotoScreen}/>
        <Stack.Screen options={ {headerShown: false} } name="Tab" component={BottomTabNavigator} /> */}
        <Stack.Screen options={ {headerShown: false} } name="HomeAdmin" component={HomeScreenAdmin} />
      </Stack.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});