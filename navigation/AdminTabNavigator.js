import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HomeAdminTabStackNavigator, ListTabStackNavigator} from './AdminStackNavigator.js'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : '';
  
    if (routeName === "Login" || routeName === "Landing") {
      return false;
    }
    return true;
  }

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AdminBottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#6b0000",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Acasă") {
              iconName = "home"
            } else if (route.name === "Listă") {
              iconName = "calculator"
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          }
      })}>
        <Tab.Screen options={({ route }) => ({tabBarVisible: this.getTabBarVisibility(route)
      }), {headerShown: false, tabBarVisible: false}} name="Acasă" component={HomeAdminTabStackNavigator}/>
        <Tab.Screen options={ {headerShown: false} } name="Listă" component={ListTabStackNavigator} />
    </Tab.Navigator>
  );
};

export default AdminBottomTabNavigator;