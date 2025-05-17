import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchHotelsStart, fetchHotelsSuccess, fetchHotelsFailure, selectHotel } from '../redux/slices/hotelsSlice';
import apiService from '../api/apiService';
import { useNavigation } from '@react-navigation/native';
import FilterPanel from '../components/FilterPanel';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { hotels, loading, error } = useSelector((state) => state.hotels);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  
  // Popular destinations data with high-quality images
  const destinations = [
    { 
      id: '1', 
      name: 'New York', 
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' 
    },
    { 
      id: '2', 
      name: 'Miami', 
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' 
    },
    { 
      id: '3', 
      name: 'Chicago', 
      image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' 
    },
    { 
      id: '4', 
      name: 'Los Angeles', 
      image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' 
    },
    { 
      id: '5', 
      name: 'San Francisco', 
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' 
    },
  ];

  // Mock data for hotels
  const mockHotels = [
    {
      id: 1,
      name: 'Grand Luxury Hotel',
      location: 'New York, NY',
      rating: 4.8,
      price: 299,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amenities: ['breakfast', 'parking', 'wifi', 'pool'],
      features: ['beach', 'city-view']
    },
    {
      id: 2,
      name: 'Seaside Resort',
      location: 'Miami, FL',
      rating: 4.6,
      price: 249,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amenities: ['breakfast', 'parking', 'wifi', 'spa'],
      features: ['beach', 'ocean-view']
    },
    {
      id: 3,
      name: 'Urban Boutique Hotel',
      location: 'Chicago, IL',
      rating: 4.7,
      price: 199,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amenities: ['breakfast', 'wifi', 'gym'],
      features: ['city-view']
    },
    {
      id: 4,
      name: 'Mountain View Lodge',
      location: 'Denver, CO',
      rating: 4.5,
      price: 179,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amenities: ['breakfast', 'parking', 'wifi'],
      features: ['mountain-view']
    },
    {
      id: 5,
      name: 'City Center Hotel',
      location: 'San Francisco, CA',
      rating: 4.9,
      price: 329,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amenities: ['breakfast', 'parking', 'wifi', 'pool', 'spa'],
      features: ['city-view', 'bay-view']
    }
  ];

  useEffect(() => {
    console.log('HomeScreen mounted, loading hotels...');
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      dispatch(fetchHotelsStart());
      console.log('Fetching hotels...');
      // Use mock data instead of API call for now
      const data = mockHotels;
      console.log('Hotels data received:', data);
      if (!data) throw new Error('No hotels data received');
      dispatch(fetchHotelsSuccess(data));
      setFeaturedHotels(data.slice(0, 3)); // Get first 3 hotels as featured
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading hotels:', error);
      dispatch(fetchHotelsFailure(error.message));
      setRefreshing(false);
    }
  };

  const handleHotelPress = (hotel) => {
    dispatch(selectHotel(hotel));
    navigation.navigate('HotelDetails', { hotelId: hotel.id });
  };

  const handleSearch = () => {
    navigation.navigate('Search', { initialQuery: searchQuery });
    setSearchQuery('');
  };

  const handleDestinationPress = (destination) => {
    navigation.navigate('Search', { initialLocation: destination.name });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHotels();
  };

  // Filtering hotels based on search and selected filters
  const filteredHotels = hotels.filter(hotel => {
    // Search filter
    if (searchQuery && !hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) && !hotel.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Amenities filter
    if (selectedFilters.includes('breakfast') && !(hotel.amenities && hotel.amenities.includes('breakfast'))) {
      return false;
    }
    if (selectedFilters.includes('parking') && !(hotel.amenities && hotel.amenities.includes('parking'))) {
      return false;
    }
    if (selectedFilters.includes('nearBeach') && !(hotel.features && hotel.features.includes('beach'))) {
      return false;
    }
    if (selectedFilters.includes('noCreditCard') && !(hotel.features && hotel.features.includes('noCreditCard'))) {
      return false;
    }
    return true;
  });

  const renderFeaturedHotel = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.featuredHotelCard}
      onPress={() => handleHotelPress(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.hotelImage}
        resizeMode="cover"
      />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.price}>${item.price}/night</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() => handleHotelPress(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.hotelImage} 
        resizeMode="cover"
      />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <View style={styles.hotelRating}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.priceText}>${item.price}/night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDestinationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.destinationCard}
      onPress={() => handleDestinationPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.destinationImage} />
      <Text style={styles.destinationName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
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
        <TouchableOpacity style={styles.retryButton} onPress={loadHotels}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hello, {user?.name || 'Guest'}</Text>
            <Text style={styles.subTitle}>Find your perfect stay</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.itineraryButton}
              onPress={() => navigation.navigate('Itinerary')}
            >
              <MaterialIcons name="map" size={20} color="#FFF" />
              <Text style={styles.itineraryButtonText}>Create Itinerary</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for hotels, cities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <MaterialIcons name="tune" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Modal */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 20,
              width: '90%',
              maxHeight: '80%',
            }}>
              <FilterPanel
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={{
                  marginTop: 20,
                  backgroundColor: '#2979FF',
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <FlatList
            data={destinations}
            renderItem={renderDestinationItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Hotels</Text>
          <FlatList
            data={featuredHotels}
            renderItem={renderFeaturedHotel}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Hotels</Text>
          <FlatList
            data={filteredHotels}
            renderItem={renderHotelCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.offerCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa' }}
              style={styles.offerImage}
            />
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Summer Special</Text>
              <Text style={styles.offerDescription}>
                Get 20% off on all bookings this summer
              </Text>
              <TouchableOpacity style={styles.offerButton}>
                <Text style={styles.offerButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  subTitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  itineraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itineraryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#007BFF',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007BFF',
  },
  destinationList: {
    paddingVertical: 10,
  },
  destinationCard: {
    marginRight: 15,
    width: 120,
    borderRadius: 10,
    overflow: 'hidden',
  },
  destinationImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredHotelCard: {
    width: 300,
    marginRight: 15,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  hotelInfo: {
    padding: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  hotelCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hotelRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  offerImage: {
    width: '100%',
    height: 150,
  },
  offerContent: {
    padding: 15,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  offerButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  offerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;
