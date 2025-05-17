import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Image,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock data for different types of locations
const mockLocations = {
  museums: [
    { 
      name: 'National History Museum', 
      time: '10:00 AM - 12:00 PM', 
      description: 'Explore ancient artifacts and historical exhibits',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      name: 'Modern Art Gallery', 
      time: '2:00 PM - 4:00 PM', 
      description: 'Contemporary art exhibitions and installations',
      image: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
  entertainment: [
    { 
      name: 'City Theme Park', 
      time: '11:00 AM - 5:00 PM', 
      description: 'Thrilling rides and attractions',
      image: 'https://images.unsplash.com/photo-1560713781-d5a0d2d0c6e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      name: 'Evening Show', 
      time: '7:00 PM - 9:00 PM', 
      description: 'Local cultural performance',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
  restaurants: [
    { 
      name: 'Local Cuisine Restaurant', 
      time: '12:30 PM - 2:00 PM', 
      description: 'Traditional dishes and specialties',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      name: 'Fine Dining Experience', 
      time: '7:30 PM - 9:00 PM', 
      description: 'Gourmet dining with city views',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
  parks: [
    { 
      name: 'Central Park', 
      time: '9:00 AM - 11:00 AM', 
      description: 'Morning walk and nature exploration',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      name: 'Botanical Gardens', 
      time: '3:00 PM - 5:00 PM', 
      description: 'Beautiful gardens and plant collections',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ],
};

const ItineraryScreen = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState({
    museums: false,
    entertainment: false,
    restaurants: false,
    parks: false,
  });
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const toggleLocation = (location) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  const generateMockItinerary = () => {
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const itinerary = [];

    for (let i = 0; i < days; i++) {
      const dayActivities = [];
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      // Add activities based on selected locations
      Object.entries(selectedLocations).forEach(([locationType, isSelected]) => {
        if (isSelected && mockLocations[locationType]) {
          mockLocations[locationType].forEach(activity => {
            dayActivities.push({
              ...activity,
              type: locationType,
            });
          });
        }
      });

      // Sort activities by time
      dayActivities.sort((a, b) => {
        const timeA = a.time.split(' - ')[0];
        const timeB = b.time.split(' - ')[0];
        return timeA.localeCompare(timeB);
      });

      itinerary.push({
        date: currentDate.toLocaleDateString(),
        activities: dayActivities,
      });
    }

    return itinerary;
  };

  const handleSubmit = () => {
    if (!destination) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    const selectedCount = Object.values(selectedLocations).filter(Boolean).length;
    if (selectedCount === 0) {
      Alert.alert('Error', 'Please select at least one location type');
      return;
    }

    const itinerary = generateMockItinerary();
    setGeneratedItinerary(itinerary);
  };

  const renderLocationType = (type, label, icon) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <MaterialIcons name={icon} size={24} color="#007BFF" style={styles.settingIcon} />
        <Text style={styles.settingItemLabel}>{label}</Text>
      </View>
      <Switch
        value={selectedLocations[type]}
        onValueChange={() => toggleLocation(type)}
        trackColor={{ false: '#CCC', true: '#007BFF' }}
        thumbColor="#FFF"
      />
    </View>
  );

  const renderActivityCard = (activity, type) => (
    <View style={styles.activityCard}>
      <Image
        source={{ uri: activity.image }}
        style={styles.activityImage}
      />
      <View style={styles.activityOverlay} />
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityName}>{activity.name}</Text>
          <View style={styles.activityTypeContainer}>
            <Text style={styles.activityType}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
          </View>
        </View>
        <View style={styles.activityTimeContainer}>
          <MaterialIcons name="access-time" size={16} color="#fff" />
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>
        <Text style={styles.activityDescription}>{activity.description}</Text>
      </View>
    </View>
  );

  const renderItinerary = () => {
    if (!generatedItinerary) return null;

    return (
      <View style={styles.itineraryContainer}>
        <Text style={styles.itineraryTitle}>Your Suggested Itinerary</Text>
        {generatedItinerary.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayNumber}>Day {index + 1}</Text>
              <Text style={styles.dayDate}>{day.date}</Text>
            </View>
            {day.activities.map((activity, actIndex) => (
              <View key={actIndex} style={styles.activityWrapper}>
                {renderActivityCard(activity, activity.type)}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Itinerary</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="place" size={24} color="#007BFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
            placeholder="Enter your destination"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.dateSection}>
          <View style={styles.dateContainer}>
            <MaterialIcons name="event" size={24} color="#007BFF" style={styles.inputIcon} />
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>Start: {startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateContainer}>
            <MaterialIcons name="event" size={24} color="#007BFF" style={styles.inputIcon} />
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>End: {endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}

        <Text style={styles.sectionTitle}>Select Locations</Text>
        {renderLocationType('museums', 'Museums', 'museum')}
        {renderLocationType('entertainment', 'Entertainment', 'attractions')}
        {renderLocationType('restaurants', 'Restaurants', 'restaurant')}
        {renderLocationType('parks', 'Parks', 'park')}

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Generate Itinerary</Text>
        </TouchableOpacity>
      </View>

      {renderItinerary()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#007BFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginLeft: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 10,
  },
  settingItemLabel: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itineraryContainer: {
    padding: 15,
  },
  itineraryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  dayContainer: {
    marginBottom: 25,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginRight: 10,
  },
  dayDate: {
    fontSize: 16,
    color: '#666',
  },
  activityWrapper: {
    marginBottom: 15,
  },
  activityCard: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  activityOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  activityContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  activityTypeContainer: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityType: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTime: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  activityDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
});

export default ItineraryScreen; 