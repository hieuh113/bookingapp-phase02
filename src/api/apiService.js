import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // For iOS simulator
  // baseURL: 'http://10.0.2.2:3000/api', // For Android emulator
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      return Promise.reject(new Error(error.response.data.message || 'Request failed'));
    } else if (error.request) {
      console.error('Network error:', error.request);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      console.error('Error:', error.message);
      return Promise.reject(new Error('An unexpected error occurred.'));
    }
  }
);

// Mock data
const mockHotels = [
  {
    id: '1',
    name: 'Luxury Grand Hotel',
    location: 'New York, USA',
    description: 'Experience luxury at its finest in the heart of Manhattan. Our hotel offers stunning views of Central Park and world-class amenities.',
    rating: 4.8,
    price: 299,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Fitness Center'],
    rooms: [
      { id: '1-1', type: 'Deluxe Room', price: 299, capacity: 2 },
      { id: '1-2', type: 'Executive Suite', price: 499, capacity: 2 },
      { id: '1-3', type: 'Presidential Suite', price: 999, capacity: 4 },
    ],
  },
  {
    id: '2',
    name: 'Beachfront Paradise Resort',
    location: 'Miami, USA',
    description: 'Wake up to the sound of waves at our beachfront resort. Enjoy direct beach access and tropical paradise views.',
    rating: 4.7,
    price: 249,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Beach Access', 'Pool', 'Restaurant', 'Bar', 'Spa'],
    rooms: [
      { id: '2-1', type: 'Ocean View Room', price: 249, capacity: 2 },
      { id: '2-2', type: 'Beachfront Suite', price: 399, capacity: 2 },
      { id: '2-3', type: 'Family Suite', price: 599, capacity: 4 },
    ],
  },
  {
    id: '3',
    name: 'Mountain View Lodge',
    location: 'Aspen, USA',
    description: 'Nestled in the heart of the Rocky Mountains, our lodge offers breathtaking views and cozy accommodations.',
    rating: 4.9,
    price: 349,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Mountain View', 'Ski Access', 'Fireplace', 'Restaurant', 'Spa'],
    rooms: [
      { id: '3-1', type: 'Mountain View Room', price: 349, capacity: 2 },
      { id: '3-2', type: 'Ski-in/Ski-out Suite', price: 499, capacity: 2 },
      { id: '3-3', type: 'Family Lodge', price: 799, capacity: 6 },
    ],
  },
  {
    id: '4',
    name: 'Urban Boutique Hotel',
    location: 'San Francisco, USA',
    description: 'A modern boutique hotel in the heart of San Francisco, offering stylish accommodations and city views.',
    rating: 4.6,
    price: 279,
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['City View', 'Rooftop Bar', 'Fitness Center', 'Restaurant', 'Free WiFi'],
    rooms: [
      { id: '4-1', type: 'City View Room', price: 279, capacity: 2 },
      { id: '4-2', type: 'Executive Suite', price: 399, capacity: 2 },
      { id: '4-3', type: 'Penthouse Suite', price: 699, capacity: 4 },
    ],
  },
];

const mockVideos = [
  {
    id: '1',
    title: 'Luxury Grand Hotel Tour',
    description: 'Take a virtual tour of our luxurious hotel in New York',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    hotelId: '1',
    likes: 1234,
    comments: 56,
    shares: 78,
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Beachfront Paradise Resort',
    description: 'Experience the beauty of our beachfront resort',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    hotelId: '2',
    likes: 2345,
    comments: 89,
    shares: 123,
    createdAt: '2024-03-20T15:30:00Z',
  },
];

// Mock user accounts
const mockUsers = [
  {
    id: '1',
    email: 'john.doe@example.com',
    password: 'password123', // In a real app, this would be hashed
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: 'user',
    createdAt: '2024-01-01T00:00:00Z',
    bookings: ['1', '2'],
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    password: 'password456',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1987654321',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z',
    bookings: ['3'],
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1122334455',
    role: 'admin',
    createdAt: '2024-01-03T00:00:00Z',
    bookings: [],
  }
];

const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const user = mockUsers.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create a mock token
      const token = `mock-jwt-token-${user.id}`;
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      // Check if email already exists
      if (mockUsers.some(u => u.email === userData.email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: String(mockUsers.length + 1),
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString(),
        bookings: []
      };

      // Add to mock users
      mockUsers.push(newUser);

      // Create mock token
      const token = `mock-jwt-token-${newUser.id}`;
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('userToken', token);

      // Return user data without password
      const { password, ...userWithoutPassword } = newUser;
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new Error('Logout failed');
    }
  },

  getCurrentUser: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No user logged in');
      }

      // Extract user ID from mock token
      const userId = token.split('-').pop();
      const user = mockUsers.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(error.message || 'Failed to get current user');
    }
  },

  // Hotel methods
  getHotels: async () => {
    try {
      return mockHotels;
    } catch (error) {
      throw new Error('Failed to fetch hotels');
    }
  },

  getHotelById: async (id) => {
    try {
      const hotel = mockHotels.find(h => h.id === id);
      if (!hotel) {
        throw new Error('Hotel not found');
      }
      return hotel;
    } catch (error) {
      throw new Error('Failed to fetch hotel details');
    }
  },

  searchHotels: async (query) => {
    try {
      const searchTerm = query.toLowerCase();
      return mockHotels.filter(hotel => 
        hotel.name.toLowerCase().includes(searchTerm) ||
        hotel.location.toLowerCase().includes(searchTerm) ||
        hotel.description.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      throw new Error('Failed to search hotels');
    }
  },

  // Booking methods
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  getBookings: async (userId) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking details');
    }
  },

  // Video methods
  getShortVideos: async () => {
    try {
      return mockVideos;
    } catch (error) {
      throw new Error('Failed to fetch videos');
    }
  },

  getHotelVideos: async (hotelId) => {
    try {
      return mockVideos.filter(video => video.hotelId === hotelId);
    } catch (error) {
      throw new Error('Failed to fetch hotel videos');
    }
  },

  getHotelVideo: async (hotelId) => {
    try {
      const video = mockVideos.find(v => v.hotelId === hotelId);
      if (!video) {
        throw new Error('Video not found');
      }
      return video;
    } catch (error) {
      throw new Error('Failed to fetch hotel video');
    }
  },

  // Image methods
  getHotelImages: async (hotelId) => {
    try {
      const hotel = mockHotels.find(h => h.id === hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }
      return hotel.images;
    } catch (error) {
      throw new Error('Failed to fetch hotel images');
    }
  },

  // Travel Assistant
  getTravelAssistantResponse: async (message) => {
    try {
      const responses = {
        'hello': 'Hello! How can I help you with your travel plans today?',
        'recommend': 'I can recommend some great hotels based on your preferences. What type of accommodation are you looking for?',
        'price': 'I can help you find the best deals. What\'s your budget range?',
        'location': 'I can suggest hotels in specific locations. Where would you like to stay?',
        'amenities': 'I can help you find hotels with specific amenities. What are you looking for?',
        'booking': 'I can help you with your booking. Do you have any specific dates in mind?',
      };

      const defaultResponse = 'I\'m here to help with your travel plans. You can ask me about hotel recommendations, prices, locations, amenities, or booking assistance.';

      const lowerMessage = message.toLowerCase();
      for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          return { message: response };
        }
      }

      return { message: defaultResponse };
    } catch (error) {
      throw new Error('Failed to get assistant response');
    }
  },
};

export default apiService; 