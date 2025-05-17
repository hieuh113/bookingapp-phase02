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
  FlatList,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@rneui/themed';
import apiService from '../api/apiService';
import { selectHotel } from '../redux/slices/hotelsSlice';
import TravelVideo from '../components/TravelVideo';
import TravelAssistant from '../components/TravelAssistant';

const { width } = Dimensions.get('window');

const HotelDetailsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { hotelId } = route.params;
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleBookNow = (room) => {
    if (hotel) {
      navigation.navigate('Booking', { 
        hotelId: hotel.id,
        roomId: room?.id,
        roomType: room?.type,
        price: room?.price
      });
    }
  };

  const renderGalleryItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedImage(item);
      setShowGallery(true);
    }}>
      <Image 
        source={{ uri: item }} 
        style={styles.galleryImage} 
        resizeMode="cover" 
      />
    </TouchableOpacity>
  );

  const renderRoomItem = ({ item }) => (
    <View style={styles.roomCard}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.roomImage} 
        resizeMode="cover" 
      />
      <View style={styles.roomInfo}>
        <Text style={styles.roomType}>{item.type}</Text>
        <Text style={styles.roomPrice}>${item.price}/night</Text>
        <Text style={styles.roomDescription}>{item.description}</Text>
        <TouchableOpacity style={styles.bookButton} onPress={() => handleBookNow(item)}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        {/* Hotel Images Gallery */}
        <View style={styles.galleryContainer}>
          <FlatList
            data={hotel.images}
            renderItem={renderGalleryItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.ratingInfo}>
              <Icon name="star" type="ionicon" color="#FFD700" size={20} />
              <Text style={styles.ratingText}>{hotel.rating}</Text>
              <Text style={styles.reviewsText}>({hotel.reviews} reviews)</Text>
            </View>
            <Text style={styles.priceText}>${hotel.price}/night</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{hotel.description}</Text>

          <Text style={styles.sectionTitle}>Available Rooms</Text>
          <FlatList
            data={hotel.rooms}
            renderItem={renderRoomItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.assistantButton}
          onPress={() => setShowAssistant(true)}
        >
          <Text style={styles.assistantButtonText}>Ask Assistant</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={() => handleBookNow(hotel.rooms[0])}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Gallery Modal */}
      <Modal
        visible={showGallery}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGallery(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowGallery(false)}
          >
            <Icon name="close" type="ionicon" size={30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Travel Assistant Modal */}
      <Modal
        visible={showAssistant}
        animationType="slide"
        onRequestClose={() => setShowAssistant(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAssistant(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <TravelAssistant hotel={hotel} />
        </View>
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
  galleryContainer: {
    height: 250,
  },
  galleryImage: {
    width: width,
    height: 250,
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
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 5,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 5,
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
    color: '#666666',
    marginBottom: 16,
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
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalImage: {
    width: width,
    height: '100%',
  },
});

export default HotelDetailsScreen;
