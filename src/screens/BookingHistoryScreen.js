import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { mockBookings } from '../data/mockBookings';

const API_BASE_URL = 'http://192.168.0.105:3000';

const BookingHistoryScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/my-booking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data  = await response.json();
      if (!response.ok){
        console.error('Failed to fetch bookings:', data);
        return;
      }
      setBookings(data);
    }catch(error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statuses = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

  const filteredBookings = bookings
    .filter(booking => {
      const hotelName = booking.hotelName || '';
      const roomType = booking.roomType || '';
      const matchesSearch = 
        hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roomType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.bookingDate) - new Date(a.bookingDate);
      if (sortBy === 'price') return b.totalPrice - a.totalPrice;
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return '#4CAF50';
      case 'Pending':
        return '#FFC107';
      case 'Completed':
        return '#2196F3';
      case 'Cancelled':
        return '#F44336';
      default:
        return '#666666';
    }
  };

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.hotelName}>{item.hotelName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Icon name="bed" type="ionicon" size={16} color="#666" />
          <Text style={styles.detailText}>{item.roomType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="calendar" type="ionicon" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.checkIn} - {item.checkOut}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="people" type="ionicon" size={16} color="#666" />
          <Text style={styles.detailText}>{item.guests} {item.guests === 1 ? 'Guest' : 'Guests'}</Text>
        </View>
      </View>

      <View style={styles.bookingFooter}>
        <Text style={styles.price}>${item.totalPrice}</Text>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" type="ionicon" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search bookings..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusFilter}
        contentContainerStyle={styles.statusFilterContent}
      >
        {statuses.map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              statusFilter === status && styles.statusButtonActive
            ]}
            onPress={() => setStatusFilter(status)}
          >
            <Text
              style={[
                styles.statusButtonText,
                statusFilter === status && styles.statusButtonTextActive
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
          onPress={() => setSortBy('date')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
            Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
          onPress={() => setSortBy('price')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'price' && styles.sortButtonTextActive]}>
            Price
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="calendar" type="ionicon" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No bookings found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  statusFilter: {
    maxHeight: 50,
  },
  statusFilterContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusButtonActive: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  statusButtonText: {
    color: '#666',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortButtonActive: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  sortButtonText: {
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  viewButtonText: {
    color: '#007BFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default BookingHistoryScreen;
