import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import { USER_ROLES } from '../constants';

import AuthNavigator from './AuthNavigator';
import CustomerTabNavigator from './CustomerTabNavigator';
import ProviderTabNavigator from './ProviderTabNavigator';

import LoadingState from '../components/ui/LoadingState';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoading, isAuthenticated, user } = useAuthStore();

  // Restore/check authentication before rendering navigation.
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
          />
        ) : user?.role === USER_ROLES.PROVIDER ? (
          <Stack.Screen
            name="ProviderApp"
            component={ProviderTabNavigator}
          />
        ) : (
          <Stack.Screen
            name="CustomerApp"
            component={CustomerTabNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}