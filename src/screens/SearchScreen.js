import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@rneui/themed';
import { updateFilters, applyFilters, selectHotel, fetchHotelsStart, fetchHotelsSuccess, fetchHotelsFailure } from '../redux/slices/hotelsSlice';
import { mockApi } from '../api/apiService';

const SearchScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { hotels, loading, error } = useSelector((state) => state.hotels);
  const [searchQuery, setSearchQuery] = useState(route.params?.initialQuery || '');
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    location: route.params?.initialLocation || '',
    priceRange: [0, 1000],
    amenities: [],
    guests: 1,
  });
  
  // Amenities options
  const amenitiesOptions = [
    'WiFi',
    'Pool',
    'Spa',
    'Gym',
    'Restaurant',
    'Beach Access',
    'Free Parking',
    'Air Conditioning',
    'Pet Friendly',
  ];

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      filterHotels();
    }
  }, [searchQuery, hotels]);

  const loadHotels = async () => {
    try {
      dispatch(fetchHotelsStart());
      const data = await mockApi.getHotels();
      dispatch(fetchHotelsSuccess(data));
    } catch (error) {
      dispatch(fetchHotelsFailure(error.message));
    }
  };

  const filterHotels = () => {
    if (!searchQuery.trim()) {
      setFilteredHotels(hotels);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(query) ||
        hotel.location.toLowerCase().includes(query)
    );
    setFilteredHotels(filtered);
  };

  const handleHotelPress = (hotel) => {
    dispatch(selectHotel(hotel));
    navigation.navigate('HotelDetails', { hotelId: hotel.id });
  };

  const toggleAmenity = (amenity) => {
    setLocalFilters((prev) => {
      const amenities = [...prev.amenities];
      if (amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: amenities.filter((item) => item !== amenity),
        };
      } else {
        return {
          ...prev,
          amenities: [...amenities, amenity],
        };
      }
    });
  };

  const applyLocalFilters = () => {
    dispatch(updateFilters(localFilters));
    dispatch(applyFilters());
    setShowFilters(false);
  };

  const resetFilters = () => {
    setLocalFilters({
      location: searchQuery,
      priceRange: [0, 1000],
      amenities: [],
      guests: 1,
    });
  };

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
        <TouchableOpacity style={styles.retryButton} onPress={loadHotels}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" type="ionicon" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" type="ionicon" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for hotels, cities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => filterHotels()}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="options" type="ionicon" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHotels}
        renderItem={renderHotelCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hotels found</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="close" type="ionicon" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Price Range</Text>
                <View style={styles.priceRangeContainer}>
                  <Text style={styles.priceRangeText}>
                    ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                  </Text>
                  {/* Here you would typically add a slider component */}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Guests</Text>
                <View style={styles.guestsContainer}>
                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => setLocalFilters(prev => ({
                      ...prev,
                      guests: Math.max(1, prev.guests - 1)
                    }))}
                  >
                    <Icon name="remove" type="ionicon" size={20} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.guestCount}>{localFilters.guests}</Text>
                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => setLocalFilters(prev => ({
                      ...prev,
                      guests: prev.guests + 1
                    }))}
                  >
                    <Icon name="add" type="ionicon" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Amenities</Text>
                <View style={styles.amenitiesContainer}>
                  {amenitiesOptions.map((amenity, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.amenityOption,
                        localFilters.amenities.includes(amenity) && styles.amenitySelected,
                      ]}
                      onPress={() => toggleAmenity(amenity)}
                    >
                      <Text
                        style={[
                          styles.amenityOptionText,
                          localFilters.amenities.includes(amenity) && styles.amenitySelectedText,
                        ]}
                      >
                        {amenity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyLocalFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#007BFF',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
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
  hotelImage: {
    width: 120,
    height: 120,
  },
  hotelInfo: {
    flex: 1,
    padding: 15,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterSection: {
    marginTop: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  priceRangeContainer: {
    marginVertical: 10,
  },
  priceRangeText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
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
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityOption: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  amenitySelected: {
    backgroundColor: '#007BFF',
  },
  amenityOptionText: {
    fontSize: 14,
    color: '#333333',
  },
  amenitySelectedText: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  retryButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default SearchScreen;
