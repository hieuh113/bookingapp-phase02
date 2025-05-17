import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const filters = [
  { key: 'breakfast', label: 'Breakfast included' },
  { key: 'noCreditCard', label: 'No credit card needed' },
  { key: 'parking', label: 'Parking' },
  { key: 'nearBeach', label: 'Sea view' },
  // Add more filters as needed
];

export default function FilterPanel({ selectedFilters, setSelectedFilters }) {
  return (
    <ScrollView horizontal style={{ marginVertical: 10 }}>
      {filters.map(f => {
        const checked = selectedFilters.includes(f.key);
        return (
          <TouchableOpacity
            key={f.key}
            onPress={() => {
              setSelectedFilters(prev =>
                checked
                  ? prev.filter(k => k !== f.key)
                  : [...prev, f.key]
              );
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 16,
              padding: 4,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: '#333',
                backgroundColor: checked ? '#2196F3' : '#fff',
                marginRight: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {checked && (
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>
              )}
            </View>
            <Text>{f.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
} 