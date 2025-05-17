import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import HotelDetailsScreen from '../screens/HotelDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import BookingHistoryScreen from '../screens/BookingHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import ShortVideosScreen from '../screens/ShortVideosScreen';
import ItineraryScreen from '../screens/ItineraryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Bookings') {
            iconName = 'calendar';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Videos') {
            iconName = 'videocam';
          }

          return <Icon name={iconName} type="ionicon" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Search" component={SearchStackNavigator} />
      <Tab.Screen name="Videos" component={ShortVideosScreen} />
      <Tab.Screen name="Bookings" component={BookingStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

// Home stack navigator
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Stack.Screen 
        name="HotelDetails" 
        component={HotelDetailsScreen} 
        options={{ title: 'Hotel Details' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{ title: 'Book Now' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: 'Payment' }}
      />
      <Stack.Screen 
        name="BookingConfirmation" 
        component={BookingConfirmationScreen} 
        options={{ title: 'Booking Confirmation' }}
      />
      <Stack.Screen 
        name="Itinerary" 
        component={ItineraryScreen} 
        options={{ title: 'Create Itinerary' }}
      />
    </Stack.Navigator>
  );
};

// Search stack navigator
const SearchStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SearchScreen" 
        component={SearchScreen} 
        options={{ title: 'Search' }}
      />
      <Stack.Screen 
        name="HotelDetails" 
        component={HotelDetailsScreen} 
        options={{ title: 'Hotel Details' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{ title: 'Book Now' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: 'Payment' }}
      />
      <Stack.Screen 
        name="BookingConfirmation" 
        component={BookingConfirmationScreen} 
        options={{ title: 'Booking Confirmation' }}
      />
    </Stack.Navigator>
  );
};

// Booking stack navigator
const BookingStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BookingHistory" 
        component={BookingHistoryScreen} 
        options={{ title: 'My Bookings' }}
      />
      <Stack.Screen 
        name="BookingDetails" 
        component={BookingConfirmationScreen} 
        options={{ title: 'Booking Details' }}
      />
    </Stack.Navigator>
  );
};

// Profile stack navigator
const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
    </Stack.Navigator>
  );
};

// Auth stack navigator
const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Root navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
