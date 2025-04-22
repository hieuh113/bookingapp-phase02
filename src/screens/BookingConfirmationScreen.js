import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  SafeAreaView,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import apiService from '../api/apiService';
import { clearCurrentBooking } from '../redux/slices/bookingsSlice';

const BookingConfirmationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { booking } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  
  // Generate a random booking reference number
  const bookingReference = `BK${Math.floor(100000 + Math.random() * 900000)}`;
  
  useEffect(() => {
    if (booking) {
      setLoading(false);
    } else {
      setError('No booking data available');
      setLoading(false);
    }
  }, [booking]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I've just booked a stay at ${booking?.hotelName}! Check-in: ${booking?.checkIn}, Check-out: ${booking?.checkOut}. Booking reference: ${bookingReference}`,
        title: 'My Hotel Booking',
      });
    } catch (error) {
      console.error('Error sharing booking:', error);
    }
  };
  
  const handleViewBookings = () => {
    navigation.navigate('Bookings');
  };
  
  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handleDone = () => {
    dispatch(clearCurrentBooking());
    navigation.navigate('Home');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading confirmation...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No booking data available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>Your booking has been successfully confirmed</Text>
        </View>

        <View style={styles.confirmationCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hotel Information</Text>
            <Text style={styles.hotelName}>{booking.hotelName}</Text>
            <Text style={styles.hotelLocation}>{booking.hotelLocation}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Booking ID:</Text>
              <Text style={styles.detailValue}>{booking.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-in:</Text>
              <Text style={styles.detailValue}>{booking.checkIn}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-out:</Text>
              <Text style={styles.detailValue}>{booking.checkOut}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Guests:</Text>
              <Text style={styles.detailValue}>{booking.guests}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Amount:</Text>
              <Text style={styles.totalPrice}>${booking.totalPrice || '0.00'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  confirmationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  hotelLocation: {
    fontSize: 16,
    color: '#666666',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  actions: {
    marginTop: 20,
  },
  doneButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingConfirmationScreen;
