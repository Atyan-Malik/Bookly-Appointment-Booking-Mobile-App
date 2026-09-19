import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable } from "react-native";

import {
  LayoutGrid,
  Calendar,
  ClipboardList,
  Briefcase,
  UserRound,
  User,
} from "lucide-react-native";

import DashboardScreen from "../screens/provider/DashboardScreen";
import CalendarScreen from "../screens/provider/CalendarScreen";
import AppointmentsScreen from "../screens/provider/AppointmentsScreen";
import ServicesScreen from "../screens/provider/ServicesScreen";
import ProfessionalScreen from "../screens/provider/ProfessionalScreen";

import { colors, spacing, radius } from "../theme";

const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: LayoutGrid,
  Professional: UserRound,
  Calendar: Calendar,
  Appointments: ClipboardList,
  Services: Briefcase,
};

export default function ProviderTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route, navigation }) => ({
        // --------------------------------
        // HEADER
        // --------------------------------
        headerShown: true,

        headerStyle: {
          backgroundColor: colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },

        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "700",
          color: colors.text,
        },

        // --------------------------------
        // PROFILE BUTTON
        // --------------------------------
        headerRight: () => (
          <Pressable
            onPress={() => navigation.getParent()?.navigate("Profile")}
            hitSlop={10}
            style={{
              marginRight: spacing.lg,
              padding: 6,
              borderRadius: 20,
            }}
          >
            <User size={22} color={colors.text} strokeWidth={2} />
          </Pressable>
        ),

        // --------------------------------
        // TAB COLORS
        // --------------------------------
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,

        // --------------------------------
        // TAB LABEL
        // --------------------------------
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },

        // --------------------------------
        // TAB ICON
        // --------------------------------
        tabBarIcon: ({ color, focused }) => {
          const Icon = ICONS[route.name];

          if (!Icon) return null;

          return (
            <Icon
              color={color}
              size={focused ? 22 : 21}
              strokeWidth={focused ? 2.5 : 2}
            />
          );
        },

        // --------------------------------
        // TAB ITEM
        // --------------------------------
        tabBarItemStyle: {
          flex: 1,
          borderRadius: radius.lg,
          marginHorizontal: 2,
        },
        // --------------------------------
        // TAB ICON
        // --------------------------------
        tabBarIcon: ({ color, focused }) => {
          const Icon = ICONS[route.name];

          if (!Icon) return null;

          return (
            <Icon
              color={color}
              size={focused ? 22 : 21}
              strokeWidth={focused ? 2.5 : 2}
            />
          );
        },

        // --------------------------------
        // TAB ITEM
        // --------------------------------
        tabBarItemStyle: {
          flex: 1,
          borderRadius: radius.lg,
          marginHorizontal: 2,
        },

        // --------------------------------
        // KEYBOARD
        // --------------------------------
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />

      <Tab.Screen name="Professional" component={ProfessionalScreen} />

      <Tab.Screen name="Calendar" component={CalendarScreen} />

      <Tab.Screen name="Appointments" component={AppointmentsScreen} />

      <Tab.Screen name="Services" component={ServicesScreen} />
    </Tab.Navigator>
  );
}
