import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HotelCard({ hotel }) {
  if (!hotel) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{hotel.name}</Text>
      <Text style={styles.location}>{hotel.location}</Text>
      {/* Add more hotel details as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 