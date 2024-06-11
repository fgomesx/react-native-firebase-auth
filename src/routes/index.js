import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SingIn from "../pages/SingIn";
import Register from "../pages/Register";
import Home from "../pages/Home"

const Stack = createNativeStackNavigator ();

export default function Routes () {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="SingIn"
                component={SingIn}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Home"
                component={Home}
                options={{ 
                        headerTitleAlign: 'center',
                 }}
            />

            <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}