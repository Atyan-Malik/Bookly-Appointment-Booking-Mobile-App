import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import { USER_ROLES } from '../constants';

import AuthNavigator from './AuthNavigator';
import CustomerTabNavigator from './CustomerTabNavigator';
import ProviderNavigator from './ProviderStackNavigator';

import NotificationsScreen from '../screens/customer/NotificationsScreen';

import LoadingState from '../components/ui/LoadingState';

const Stack = createNativeStackNavigator();
const CustomerStack = createNativeStackNavigator();

function CustomerNavigator() {
  return (
    <CustomerStack.Navigator
      id="CustomerNavigator"
      initialRouteName="CustomerTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <CustomerStack.Screen
        name="CustomerTabs"
        component={CustomerTabNavigator}
      />

      <CustomerStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </CustomerStack.Navigator>
  );
}

export default function RootNavigator() {
  const {
    isLoading,
    isAuthenticated,
    user,
  } = useAuthStore();

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
            component={ProviderNavigator}
          />
        ) : (
          <Stack.Screen
            name="CustomerApp"
            component={CustomerNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}