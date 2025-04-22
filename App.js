import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSuccess } from './src/redux/slices/authSlice';
import apiService from './src/api/apiService';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // In a real app, you would validate the token with your backend
          // For now, we'll just simulate a user being logged in
          const user = {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
          };
          store.dispatch(loginSuccess(user));
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
    
    const preloadData = async () => {
      try {
        // Preload hotels data
        await apiService.getHotels();
        // Preload videos data
        await apiService.getShortVideos();
        setIsLoading(false);
      } catch (err) {
        console.error('Error preloading data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    preloadData();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (error) {
    return null; // Or an error screen component
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </Provider>
  );
}
