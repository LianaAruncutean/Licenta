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
import TenantsListScreen from './screens/TenantsListScreen';
import TenantDetail from './screens/TenantDetail';
import LandingScreen from './screens/LandingScreen';
import AdminBottomTabNavigator from './navigation/AdminTabNavigator';
import {LogBox} from 'react-native';

const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs(); 

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={ {headerShown: false} } name="Landing" component={LandingScreen} />
        <Stack.Screen options={ {headerShown: false} } name="Login" component={LoginScreen} />
        <Stack.Screen options={ {headerShown: false} } name="CameraScreen" component={CameraScreen}/>
        <Stack.Screen options={ {headerShown: false} } name="PreviewPhotoScreen" component={PreviewPhotoScreen}/>
        <Stack.Screen options={ {headerShown: false} } name="Tab" component={BottomTabNavigator} />
        <Stack.Screen options={ {headerShown: false} } name="AdminTab" component={AdminBottomTabNavigator} />
        {/* <Stack.Screen options={ {headerShown: false} } name="HomeAdmin" component={HomeScreenAdmin} />
        <Stack.Screen options={ {headerShown: false} } name="TenantsList" component={TenantsListScreen} />
        <Stack.Screen options={ {headerShown: false} } name="TenantDetail" component={TenantDetail} /> */}
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