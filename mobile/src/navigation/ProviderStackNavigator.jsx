import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProviderTabNavigator from './ProviderTabNavigator';
import ProfileScreen from '../screens/provider/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function ProviderNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProviderTabs"
        component={ProviderTabNavigator}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Stack.Navigator>
  );
}