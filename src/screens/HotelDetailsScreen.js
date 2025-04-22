import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import apiService from '../api/apiService';
import { selectHotel } from '../redux/slices/hotelsSlice';
import TravelVideo from '../components/TravelVideo';
import TravelAssistant from '../components/TravelAssistant';

const HotelDetailsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { hotelId } = route.params;
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    loadHotelDetails();
  }, [hotelId]);

  const loadHotelDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching hotel details for ID:', hotelId);
      const data = await apiService.getHotelById(hotelId);
      console.log('Hotel details received:', data);
      if (!data) throw new Error('No hotel data received');
      setHotel(data);
      dispatch(selectHotel(data));
    } catch (error) {
      console.error('Error loading hotel details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (hotel) {
      navigation.navigate('Booking', { hotelId: hotel.id });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadHotelDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hotel) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Hotel not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TravelVideo hotelId={hotelId} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{hotel.rating}</Text>
            <Text style={styles.priceText}>${hotel.price}/night</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{hotel.description}</Text>

          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {hotel.amenities?.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.assistantButton}
          onPress={() => setShowAssistant(true)}
        >
          <Text style={styles.assistantButtonText}>Ask Assistant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showAssistant}
        animationType="slide"
        onRequestClose={() => setShowAssistant(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAssistant(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <TravelAssistant />
        </SafeAreaView>
      </Modal>
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
  },
  retryButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  hotelLocation: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingText: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 18,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  amenityItem: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  amenityText: {
    fontSize: 14,
    color: '#333333',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assistantButton: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  assistantButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HotelDetailsScreen;
