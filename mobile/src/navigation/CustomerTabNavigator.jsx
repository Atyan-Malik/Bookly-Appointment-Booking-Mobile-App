// navigation/CustomerTabNavigator.jsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Search, CalendarCheck, Heart, User } from "lucide-react-native";

import HomeScreen from "../screens/customer/HomeScreen";
import CustomerAppointmentStackNavigator from './CustomerAppointmentStackNavigator';
import ProfileScreen from "../screens/customer/ProfileScreen";
import DiscoverStackNavigator from "./DiscoverStackNavigator";
import FavoritesScreen from "../screens/customer/FavoritesScreen";

// import PlaceholderScreen from '../components/ui/PlaceholderScreen';

import { colors } from "../theme";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home,
  Discover: Search,
  Appointments: CalendarCheck,
  Favorites: Heart,
  Profile: User,
};

export default function CustomerTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
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
          fontWeight: "500",
        },

        tabBarIcon: ({ color, size }) => {
          const Icon = ICONS[route.name];

          if (!Icon) {
            return null;
          }

          return <Icon color={color} size={size ?? 22} />;
        },
      })}
    >
      {/* Customer Home */}
      <Tab.Screen name="Home" component={HomeScreen} />

      {/* Discover + Professional + Booking flow */}
      <Tab.Screen name="Discover" component={DiscoverStackNavigator} />

      {/* Customer appointments */}
<Tab.Screen
  name="Appointments"
  component={CustomerAppointmentStackNavigator}
/>
      {/* Customer favorites */}
      <Tab.Screen name="Favorites" component={FavoritesScreen} />

      {/* Customer profile */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
