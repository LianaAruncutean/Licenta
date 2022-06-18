import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import IndexScreen from '../screens/IndexScreen';
import PhotoScreen from '../screens/PhotoScreen';
import InfoScreen from '../screens/InfoScreen';
import TenantHistoryIndex from "../screens/TenantHistoryIndex";
import StripeAppScreen from "../screens/StripeAppScreen";

const Stack = createNativeStackNavigator();

const HomeTabStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={ {headerShown: false} } name="Home" component={HomeScreen} />
            <Stack.Screen options={ {headerShown: false} } name="Index" component={IndexScreen} />
            <Stack.Screen options={ {headerShown: false} } name="Photo" component={PhotoScreen} />
            <Stack.Screen options={ {headerShown: false} } name="Info" component={InfoScreen} />
            <Stack.Screen options={ {headerShown: false} } name="Payment" component={StripeAppScreen} />
        </Stack.Navigator>
    )
}

const IndexTabStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={ {headerShown: false} } name="Index" component={IndexScreen} />
            <Stack.Screen options={ {headerShown: false} } name="Home" component={HomeScreen} />
            <Stack.Screen options={ {headerShown: false} } name="Photo" component={PhotoScreen} />
            <Stack.Screen options={ {headerShown: false} } name="History" component={TenantHistoryIndex} />
        </Stack.Navigator>
    )
}

const PhotoTabStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={ {headerShown: false} } name="Photo" component={PhotoScreen} />
            <Stack.Screen options={ {headerShown: false} } name="Index" component={IndexScreen} />
        </Stack.Navigator>
    )
}

const InfoTabStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={ {headerShown: false} } name="Info" component={InfoScreen} />
            <Stack.Screen options={ {headerShown: false} } name="Home" component={HomeScreen} />
        </Stack.Navigator>
    )
}

export { HomeTabStackNavigator,IndexTabStackNavigator, PhotoTabStackNavigator, InfoTabStackNavigator };