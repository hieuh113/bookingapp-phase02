import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@rneui/themed';
import { createBookingStart, createBookingSuccess, createBookingFailure } from '../redux/slices/bookingsSlice';
import apiService from '../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple date picker component (in a real app, you'd use a proper date picker library)
const DatePicker = ({ label, value, onChange }) => {
  return (
    <TouchableOpacity
      style={styles.datePickerContainer}
      onPress={() => {
        // In a real app, this would open a date picker
        // For now, we'll just set a random date
        const today = new Date();
        const randomDays = Math.floor(Math.random() * 30) + 1;
        const newDate = new Date(today);
        newDate.setDate(today.getDate() + randomDays);
        onChange(newDate.toISOString().split('T')[0]);
      }}
    >
      <Text style={styles.datePickerLabel}>{label}</Text>
      <View style={styles.datePickerValue}>
        <Text style={styles.dateText}>{value || 'Select date'}</Text>
        <Icon name="calendar" type="ionicon" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );
};

const BookingScreen = ({ navigation, route }) => {
  const { hotelId, hotelName, roomId, roomType, price } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.bookings);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [specialRequests, setSpecialRequests] = useState('');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  
  // Calculate total nights and price
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const nights = calculateNights();
  const totalPrice = nights * price;
  
  const validateForm = () => {
    if (!checkIn || !checkOut) {
      Alert.alert('Error', 'Please select check-in and check-out dates');
      return false;
    }
    
    if (nights <= 0) {
      Alert.alert('Error', 'Check-out date must be after check-in date');
      return false;
    }
    
    if (!contactName || !contactEmail || !contactPhone) {
      Alert.alert('Error', 'Please fill in all contact information');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const handleBooking = async () => {
    if (!checkIn || !checkOut || !guests) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      dispatch(createBookingStart());
      console.log('Attempting to create booking for hotel:', hotelId);
      
      const bookingData = {
        hotelId,
        checkIn,
        checkOut,
        guests: parseInt(guests),
        userId: 'user123', // This should be replaced with actual user ID
        status: 'pending',
      };

      const response = await apiService.createBooking(bookingData);
      console.log('Booking response:', response);
      
      if (!response || !response.id) {
        throw new Error('Invalid booking response');
      }
      
      dispatch(createBookingSuccess(response));
      navigation.navigate('BookingConfirmation', { booking: response });
    } catch (error) {
      console.error('Booking error:', error);
      dispatch(createBookingFailure(error.message || 'Failed to create booking'));
      Alert.alert('Error', error.message || 'Failed to create booking');
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" type="ionicon" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Your Stay</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.bookingDetails}>
          <Text style={styles.hotelName}>{hotelName}</Text>
          <Text style={styles.roomType}>{roomType} Room</Text>
          <Text style={styles.price}>${price} / night</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.datesContainer}>
            <DatePicker
              label="Check-in"
              value={checkIn}
              onChange={setCheckIn}
            />
            <DatePicker
              label="Check-out"
              value={checkOut}
              onChange={setCheckOut}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guests</Text>
          <View style={styles.guestsContainer}>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => setGuests(Math.max(1, parseInt(guests) - 1).toString())}
            >
              <Icon name="remove" type="ionicon" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.guestCount}>{guests}</Text>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => setGuests((parseInt(guests) + 1).toString())}
            >
              <Icon name="add" type="ionicon" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Requests</Text>
          <TextInput
            style={styles.specialRequestsInput}
            placeholder="Any special requests? (optional)"
            value={specialRequests}
            onChangeText={setSpecialRequests}
            multiline
            numberOfLines={3}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={contactName}
              onChangeText={setContactName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Room Price</Text>
            <Text style={styles.summaryValue}>${price} x {nights} nights</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Taxes & Fees</Text>
            <Text style={styles.summaryValue}>Included</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice}</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBooking}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.bookButtonText}>Processing...</Text>
            ) : (
              <Text style={styles.bookButtonText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            By confirming, you agree to our terms and conditions.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 24,
  },
  bookingDetails: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  roomType: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerContainer: {
    width: '48%',
  },
  datePickerLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  datePickerValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  guestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 20,
  },
  specialRequestsInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  bookButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default BookingScreen;
