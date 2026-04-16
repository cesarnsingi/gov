import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LanguageProvider, useTranslation } from "./src/i18n/LanguageContext";
import HomeScreen from "./src/screens/HomeScreen";
import ReportScreen from "./src/screens/ReportScreen";
import {
  MapScreen,
  MyReportsScreen,
  ServicesScreen,
  ElectionsScreen,
  ProfileScreen,
} from "./src/screens/OtherScreens";
import { COLORS } from "./src/constants/colors";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain"    component={HomeScreen} />
      <Stack.Screen name="MyReports"   component={MyReportsScreen} />
      <Stack.Screen name="Elections"   component={ElectionsScreen} />
    </Stack.Navigator>
  );
}

function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServicesMain" component={ServicesScreen} />
      <Stack.Screen name="Elections"    component={ElectionsScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", marginTop: 1 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            HomeTab:     ["home",          "home-outline"],
            MapTab:      ["map",           "map-outline"],
            ReportTab:   ["add-circle",    "add-circle-outline"],
            ServicesTab: ["briefcase",     "briefcase-outline"],
            ProfileTab:  ["person",        "person-outline"],
          };
          const [active, inactive] = icons[route.name] ?? ["ellipse", "ellipse-outline"];
          return <Ionicons name={(focused ? active : inactive) as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab"     component={HomeStack}     options={{ tabBarLabel: t.tabHome }} />
      <Tab.Screen name="MapTab"      component={MapScreen}     options={{ tabBarLabel: t.tabMap }} />
      <Tab.Screen
        name="ReportTab"
        component={ReportScreen}
        options={{
          tabBarLabel: t.tabReport,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="add-circle"
              size={32}
              color={focused ? COLORS.primary : COLORS.textMuted}
              style={{ marginTop: -4 }}
            />
          ),
        }}
      />
      <Tab.Screen name="ServicesTab" component={ServicesStack} options={{ tabBarLabel: t.tabServices }} />
      <Tab.Screen name="ProfileTab"  component={ProfileScreen} options={{ tabBarLabel: t.tabProfile }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={COLORS.bg} />
          <TabNavigator />
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
