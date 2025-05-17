import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import apiService from '../api/apiService';

const PaymentScreen = ({ route, navigation }) => {
  const { bookingDetails, hotel, room } = route.params;
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const calculateTotal = () => {
    const nights = Math.ceil(
      (new Date(bookingDetails.checkOut) - new Date(bookingDetails.checkIn)) / (1000 * 60 * 60 * 24)
    );
    const roomPrice = room.price;
    const subtotal = nights * roomPrice;
    const tax = subtotal * 0.1; // 10% tax
    const serviceFee = 20;
    return {
      subtotal,
      tax,
      serviceFee,
      total: subtotal + tax + serviceFee,
    };
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Validate card details
      if (paymentMethod === 'credit' && !validateCardDetails()) {
        Alert.alert('Error', 'Please fill in all card details correctly');
        return;
      }

      // Create booking
      const bookingData = {
        hotelId: hotel.id,
        roomId: room.id,
        ...bookingDetails,
        paymentMethod,
        totalAmount: calculateTotal().total,
        status: 'Confirmed',
      };

      const booking = await apiService.createBooking(bookingData);
      
      // Navigate to confirmation
      navigation.replace('BookingConfirmation', { bookingId: booking.id });
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateCardDetails = () => {
    const { number, name, expiry, cvv } = cardDetails;
    return (
      number.length === 16 &&
      name.length > 0 &&
      expiry.length === 5 &&
      cvv.length === 3
    );
  };

  const totals = calculateTotal();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" type="ionicon" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Booking Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.roomType}>{room.type}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Check-in:</Text>
              <Text style={styles.summaryValue}>{bookingDetails.checkIn}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Check-out:</Text>
              <Text style={styles.summaryValue}>{bookingDetails.checkOut}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Guests:</Text>
              <Text style={styles.summaryValue}>{bookingDetails.guests}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[styles.paymentMethod, paymentMethod === 'credit' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('credit')}
            >
              <Icon name="card" type="ionicon" size={24} color={paymentMethod === 'credit' ? '#007BFF' : '#666'} />
              <Text style={styles.paymentMethodText}>Credit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentMethod, paymentMethod === 'paypal' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('paypal')}
            >
              <Icon name="logo-paypal" type="ionicon" size={24} color={paymentMethod === 'paypal' ? '#007BFF' : '#666'} />
              <Text style={styles.paymentMethodText}>PayPal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Credit Card Details */}
        {paymentMethod === 'credit' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <View style={styles.cardForm}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                keyboardType="numeric"
                maxLength={16}
                value={cardDetails.number}
                onChangeText={(text) => setCardDetails(prev => ({ ...prev, number: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={cardDetails.name}
                onChangeText={(text) => setCardDetails(prev => ({ ...prev, name: text }))}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardDetails.expiry}
                  onChangeText={(text) => setCardDetails(prev => ({ ...prev, expiry: text }))}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="CVV"
                  keyboardType="numeric"
                  maxLength={3}
                  value={cardDetails.cvv}
                  onChangeText={(text) => setCardDetails(prev => ({ ...prev, cvv: text }))}
                />
              </View>
            </View>
          </View>
        )}

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>${totals.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax (10%)</Text>
              <Text style={styles.priceValue}>${totals.tax.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fee</Text>
              <Text style={styles.priceValue}>${totals.serviceFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totals.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay Now</Text>
              <Text style={styles.payButtonAmount}>${totals.total.toFixed(2)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roomType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#666',
  },
  summaryValue: {
    fontWeight: '500',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedPayment: {
    borderColor: '#007BFF',
    backgroundColor: '#F0F8FF',
  },
  paymentMethodText: {
    marginLeft: 8,
    fontSize: 16,
  },
  cardForm: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  priceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    color: '#666',
  },
  priceValue: {
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  payButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  payButtonAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen; 