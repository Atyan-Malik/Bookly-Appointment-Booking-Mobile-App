import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutGrid,
  Calendar,
  ClipboardList,
  Briefcase,
  User,
} from 'lucide-react-native';

import DashboardScreen from '../screens/provider/DashboardScreen';
import CalendarScreen from '../screens/provider/CalendarScreen';
import AppointmentsScreen from '../screens/provider/AppointmentsScreen';
import ServicesScreen from '../screens/provider/ServicesScreen';
import ProfileScreen from '../screens/provider/ProfileScreen';

import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: LayoutGrid,
  Calendar: Calendar,
  Appointments: ClipboardList,
  Services: Briefcase,
  Profile: User,
};

export default function ProviderTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textMuted,

        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },

        tabBarIcon: ({ color, size }) => {
          const Icon = ICONS[route.name];

          if (!Icon) {
            return null;
          }

          return (
            <Icon
              color={color}
              size={size ?? 22}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
      />

      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
      />

      <Tab.Screen
        name="Services"
        component={ServicesScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}