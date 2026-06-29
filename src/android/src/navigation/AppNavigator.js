import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import RestaurantScreen from '../screens/RestaurantScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AccountScreen from '../screens/AccountScreen';
import AddRestaurantScreen from '../screens/AddRestaurantScreen';
import MyRestaurantsScreen from '../screens/MyRestaurantsScreen';
import ManageRestaurantScreen from '../screens/ManageRestaurantScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BLUE = '#009de0';

function TabIcon({ label, focused }) {
  const icons = { Home: '🏠', Orders: '📦', Account: '👤' };
  return (
    <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.5 }}>
      {icons[label] ?? '•'}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: '#7a7d82',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e9ecef' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Restaurant"
        component={RestaurantScreen}
        options={{ title: '', headerBackTitle: 'Back', headerTintColor: BLUE }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ presentation: 'modal', title: '', headerTintColor: BLUE }}
      />
      <Stack.Screen
        name="AddRestaurant"
        component={AddRestaurantScreen}
        options={{ title: 'Add Restaurant', headerTintColor: BLUE }}
      />
      <Stack.Screen
        name="MyRestaurants"
        component={MyRestaurantsScreen}
        options={{ title: 'My Restaurants', headerTintColor: BLUE }}
      />
      <Stack.Screen
        name="ManageRestaurant"
        component={ManageRestaurantScreen}
        options={{ title: 'Manage Restaurant', headerTintColor: BLUE }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoading, token } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={BLUE} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
