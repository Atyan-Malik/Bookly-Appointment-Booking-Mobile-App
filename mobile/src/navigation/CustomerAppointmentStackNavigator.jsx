import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppointmentsScreen from '../screens/customer/AppointmentsScreen';
import AppointmentDetailScreen from '../screens/customer/AppointmentDetailScreen';

const Stack = createNativeStackNavigator();

export default function CustomerAppointmentStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppointmentsList"
        component={AppointmentsScreen}
        options={{ title: 'My Appointments' }}
      />

      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{ title: 'Appointment Details' }}
      />
    </Stack.Navigator>
  );
}