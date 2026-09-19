// navigation/DiscoverStackNavigator.jsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DiscoverScreen from "../screens/customer/DiscoverScreen";
import ProfessionalDetailScreen from "../screens/customer/ProfessionalDetailScreen";
import ServiceSelectionScreen from "../screens/customer/ServiceSelectionScreen";
import DateTimeSelectionScreen from "../screens/customer/DateTimeSelectionScreen";
import BookingConfirmationScreen from "../screens/customer/BookingConfirmationScreen";
import BookingSuccessScreen from "../screens/customer/BookingSuccessScreen";

const Stack = createNativeStackNavigator();

export default function DiscoverStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="DiscoverHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="DiscoverHome"
        component={DiscoverScreen}
      />

      <Stack.Screen
        name="ProfessionalDetail"
        component={ProfessionalDetailScreen}
      />

      <Stack.Screen
        name="ServiceSelection"
        component={ServiceSelectionScreen}
      />

      <Stack.Screen
        name="DateTimeSelection"
        component={DateTimeSelectionScreen}
      />

      <Stack.Screen
        name="Booking"
        component={BookingConfirmationScreen}
      />

      <Stack.Screen
        name="BookingSuccess"
        component={BookingSuccessScreen}
      />
    </Stack.Navigator>
  );
}