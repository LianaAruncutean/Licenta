import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HomeTabStackNavigator, IndexTabStackNavigator, PhotoTabStackNavigator, InfoTabStackNavigator } from "./StackNavigator.js";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : '';
  
    if (routeName === "Login") {
      return false;
    }
    return true;
  }

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#6b0000",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Acasă") {
              iconName = "home"
            } else if (route.name === "Contoare") {
              iconName = "calculator"
            }
            else if (route.name === "Dovadă") {
                iconName = "camera"
            }
            else if (route.name === "Informații") {
                iconName = "help-circle"
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          }
      })}>
        <Tab.Screen options={({ route }) => ({tabBarVisible: this.getTabBarVisibility(route)
      }), {headerShown: false, tabBarVisible: false}} name="Acasă" component={HomeTabStackNavigator}/>
        <Tab.Screen options={ {headerShown: false} } name="Contoare" component={IndexTabStackNavigator} />
        <Tab.Screen options={ {headerShown: false} } name="Dovadă" component={PhotoTabStackNavigator} />
        <Tab.Screen options={ {headerShown: false} } name="Informații" component={InfoTabStackNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;