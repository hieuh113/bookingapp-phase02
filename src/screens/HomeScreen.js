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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@rneui/themed';
import { fetchHotelsStart, fetchHotelsSuccess, fetchHotelsFailure, selectHotel } from '../redux/slices/hotelsSlice';
import apiService from '../api/apiService';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { hotels, loading, error } = useSelector((state) => state.hotels);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  
  // Popular destinations data
  const destinations = [
    { id: '1', name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9' },
    { id: '2', name: 'Miami', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9' },
    { id: '3', name: 'Chicago', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f' },
    { id: '4', name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da' },
    { id: '5', name: 'San Francisco', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29' },
  ];

  useEffect(() => {
    console.log('HomeScreen mounted, loading hotels...');
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      dispatch(fetchHotelsStart());
      console.log('Fetching hotels...');
      const data = await apiService.getHotels();
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

  const renderFeaturedHotel = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.featuredHotelCard}
      onPress={() => handleHotelPress(item)}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
        style={styles.hotelImage}
      />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" type="ionicon" size={16} color="#FFD700" />
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
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <View style={styles.hotelRating}>
          <Text style={styles.ratingText}>{item.rating}</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" type="ionicon" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for hotels, cities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="options" type="ionicon" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

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
            data={hotels}
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
