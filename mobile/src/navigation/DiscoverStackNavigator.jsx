// navigation/DiscoverStackNavigator.jsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DiscoverScreen from "../screens/customer/DiscoverScreen";
import ProfessionalDetailScreen from "../screens/customer/ProfessionalDetailScreen";
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
      {/* Discover listing */}
      <Stack.Screen name="DiscoverHome" component={DiscoverScreen} />

      {/* Professional profile/details */}
      <Stack.Screen
        name="ProfessionalDetail"
        component={ProfessionalDetailScreen}
      />

      {/* Review/confirm appointment before creating it */}
      <Stack.Screen name="Booking" component={BookingConfirmationScreen} />

      {/* Appointment successfully created */}
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
    </Stack.Navigator>
  );
}
