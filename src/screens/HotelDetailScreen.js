import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import apiService from '../api/apiService';
import TravelVideo from '../components/TravelVideo';

const { width } = Dimensions.get('window');

const HotelDetailScreen = ({ route, navigation }) => {
  const { hotelId } = route.params;
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
  });

  useEffect(() => {
    loadHotelDetails();
  }, [hotelId]);

  const loadHotelDetails = async () => {
    try {
      setLoading(true);
      const data = await apiService.getHotelDetails(hotelId);
      setHotel(data);
      setError(null);
    } catch (err) {
      setError('Failed to load hotel details. Please try again later.');
      console.error('Error loading hotel details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    try {
      // Here you would typically handle the payment processing
      const bookingData = {
        hotelId,
        roomId: selectedRoom.id,
        ...bookingDetails,
        paymentMethod,
      };
      
      // Call your booking API
      await apiService.createBooking(bookingData);
      
      // Show success message and navigate back
      navigation.navigate('Bookings');
    } catch (error) {
      console.error('Payment failed:', error);
      // Handle payment error
    }
  };

  const renderGalleryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.galleryItem}
      onPress={() => {
        setSelectedImage(item);
        setShowGallery(true);
      }}
    >
      <Image source={item} style={styles.galleryImage} />
    </TouchableOpacity>
  );

  const renderRoomItem = ({ item }) => (
    <View style={styles.roomCard}>
      <Image source={item.image} style={styles.roomImage} />
      <View style={styles.roomInfo}>
        <Text style={styles.roomType}>{item.type}</Text>
        <Text style={styles.roomPrice}>${item.price} per night</Text>
        <Text style={styles.roomDescription}>{item.description}</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handleBookNow(item)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadHotelDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Hotel Images Gallery */}
        <View style={styles.galleryContainer}>
          <FlatList
            data={hotel?.images || []}
            renderItem={renderGalleryItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />
        </View>

        {/* Hotel Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.hotelName}>{hotel?.name}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" type="ionicon" color="#FFD700" size={20} />
            <Text style={styles.rating}>{hotel?.rating}</Text>
            <Text style={styles.reviews}>({hotel?.reviews} reviews)</Text>
          </View>
          <Text style={styles.location}>
            <Icon name="location" type="ionicon" size={16} color="#666" />
            {hotel?.location}
          </Text>
          <Text style={styles.description}>{hotel?.description}</Text>
        </View>

        {/* Hotel Video */}
        <TravelVideo hotelId={hotelId} />

        {/* Available Rooms */}
        <View style={styles.roomsContainer}>
          <Text style={styles.sectionTitle}>Available Rooms</Text>
          <FlatList
            data={hotel?.rooms || []}
            renderItem={renderRoomItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Full Screen Gallery Modal */}
      <Modal
        visible={showGallery}
        transparent={true}
        onRequestClose={() => setShowGallery(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowGallery(false)}
          >
            <Icon name="close" type="ionicon" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={selectedImage}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={showPayment}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPayment(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.paymentModalContent}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentTitle}>Complete Your Booking</Text>
              <TouchableOpacity onPress={() => setShowPayment(false)}>
                <Icon name="close" type="ionicon" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.paymentForm}>
              {/* Room Details */}
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Room Details</Text>
                <Text style={styles.roomType}>{selectedRoom?.type}</Text>
                <Text style={styles.roomPrice}>${selectedRoom?.price} per night</Text>
              </View>

              {/* Booking Details */}
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Booking Details</Text>
                <TouchableOpacity style={styles.datePicker}>
                  <Text>Check-in: {bookingDetails.checkIn || 'Select date'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.datePicker}>
                  <Text>Check-out: {bookingDetails.checkOut || 'Select date'}</Text>
                </TouchableOpacity>
                <View style={styles.guestsPicker}>
                  <Text>Guests: {bookingDetails.guests}</Text>
                  <View style={styles.guestsControls}>
                    <TouchableOpacity onPress={() => setBookingDetails(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}>
                      <Icon name="remove-circle" type="ionicon" size={24} color="#007BFF" />
                    </TouchableOpacity>
                    <Text style={styles.guestsCount}>{bookingDetails.guests}</Text>
                    <TouchableOpacity onPress={() => setBookingDetails(prev => ({ ...prev, guests: prev.guests + 1 }))}>
                      <Icon name="add-circle" type="ionicon" size={24} color="#007BFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Payment Method */}
              <View style={styles.paymentSection}>
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

              {/* Total */}
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Total</Text>
                <Text style={styles.totalAmount}>${selectedRoom?.price}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryContainer: {
    height: 250,
  },
  galleryItem: {
    width: width,
    height: 250,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    marginLeft: 4,
    marginRight: 8,
  },
  reviews: {
    color: '#666',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  roomsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  roomInfo: {
    padding: 16,
  },
  roomType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roomPrice: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 8,
  },
  roomDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  paymentModalContent: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentForm: {
    flex: 1,
    padding: 16,
  },
  paymentSection: {
    marginBottom: 24,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  guestsPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  guestsControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestsCount: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: '45%',
  },
  selectedPayment: {
    borderColor: '#007BFF',
    backgroundColor: '#F0F8FF',
  },
  paymentMethodText: {
    marginLeft: 8,
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  payButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HotelDetailScreen; 