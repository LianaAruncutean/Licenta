import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenAdmin from "../screens/HomeScreenAdmin";
import TenantsListScreen from "../screens/TenantsListScreen";
import TenantDetail from "../screens/TenantDetail";

const Stack = createNativeStackNavigator();

const HomeAdminTabStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={ {headerShown: false} } name="HomeAdmin" component={HomeScreenAdmin} />
            <Stack.Screen options={ {headerShown: false} } name="TenantsList" component={TenantsListScreen} />
        </Stack.Navigator>
    )
}

const ListTabStackNavigator = () => {
    return (
        <Stack.Navigator>
        <Stack.Screen options={ {headerShown: false} } name="TenantsList" component={TenantsListScreen} />
        <Stack.Screen options={ {headerShown: false} } name="HomeAdmin" component={HomeScreenAdmin} />
            <Stack.Screen options={ {headerShown: false} } name="TenantDetail" component={TenantDetail} />
        </Stack.Navigator>
    )
}

export { HomeAdminTabStackNavigator, ListTabStackNavigator };