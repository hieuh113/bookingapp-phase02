import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockHotels, mockBookings, mockShortVideos } from './mockData';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://api.example.com', // This won't be used with mock data
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
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
      // Mock successful login
      return {
        token: 'mock-token',
        user: {
          id: 'user123',
          name: 'John Doe',
          email: credentials.email,
        },
      };
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  register: async (userData) => {
    try {
      // Mock successful registration
      return {
        token: 'mock-token',
        user: {
          id: 'user123',
          name: userData.name,
          email: userData.email,
        },
      };
    } catch (error) {
      throw new Error('Registration failed');
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
      // Return mock hotels data
      return [
        {
          id: 1,
          name: 'Grand Luxury Hotel',
          location: 'New York, NY',
          rating: 4.8,
          reviews: 1245,
          price: 299,
          images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
          ],
          description: 'Experience luxury at its finest in the heart of Manhattan. Our 5-star hotel offers stunning city views, world-class amenities, and exceptional service.',
          rooms: [
            {
              id: 1,
              type: 'Deluxe King Room',
              price: 299,
              description: 'Spacious room with king-size bed, city view, and luxury amenities',
              image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            },
            {
              id: 2,
              type: 'Executive Suite',
              price: 499,
              description: 'Luxurious suite with separate living area and premium amenities',
              image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            }
          ],
          amenities: ['breakfast', 'parking', 'wifi', 'pool'],
          features: ['beach', 'city-view']
        },
        {
          id: 2,
          name: 'Seaside Resort',
          location: 'Miami, FL',
          rating: 4.6,
          reviews: 892,
          price: 249,
          images: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
          ],
          description: 'Escape to paradise at our beachfront resort. Enjoy direct beach access, multiple pools, and breathtaking ocean views.',
          rooms: [
            {
              id: 1,
              type: 'Ocean View Room',
              price: 249,
              description: 'Comfortable room with ocean view and modern amenities',
              image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            },
            {
              id: 2,
              type: 'Beachfront Suite',
              price: 399,
              description: 'Luxurious suite with private balcony and direct beach access',
              image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            }
          ],
          amenities: ['breakfast', 'parking', 'wifi', 'spa'],
          features: ['beach', 'ocean-view']
        },
        {
          id: 3,
          name: 'Urban Boutique Hotel',
          location: 'Chicago, IL',
          rating: 4.7,
          reviews: 756,
          price: 199,
          images: [
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
          ],
          description: 'A stylish boutique hotel in the heart of Chicago. Perfect for business travelers and urban explorers.',
          rooms: [
            {
              id: 1,
              type: 'City View Room',
              price: 199,
              description: 'Modern room with city views and essential amenities',
              image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            },
            {
              id: 2,
              type: 'Business Suite',
              price: 299,
              description: 'Spacious suite with work area and premium amenities',
              image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
            }
          ],
          amenities: ['breakfast', 'wifi', 'gym'],
          features: ['city-view']
        }
      ];
    } catch (error) {
      throw new Error('Failed to fetch hotels');
    }
  },

  getHotelById: async (id) => {
    try {
      const hotels = await apiService.getHotels();
      const hotel = hotels.find(h => h.id === parseInt(id));
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
  getBookings: async (userId) => {
    try {
      return mockBookings.filter(booking => booking.userId === userId);
    } catch (error) {
      throw new Error('Failed to fetch bookings');
    }
  },

  getBookingById: async (id) => {
    try {
      const booking = mockBookings.find(b => b.id === parseInt(id));
      if (!booking) {
        throw new Error('Booking not found');
      }
      return booking;
    } catch (error) {
      throw new Error('Failed to fetch booking details');
    }
  },

  createBooking: async (bookingData) => {
    try {
      const newBooking = {
        id: mockBookings.length + 1,
        ...bookingData,
        status: 'Pending',
        bookingDate: new Date().toISOString().split('T')[0]
      };
      mockBookings.push(newBooking);
      return newBooking;
    } catch (error) {
      throw new Error('Failed to create booking');
    }
  },

  // Video methods
  getShortVideos: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        hotelId: 1,
        title: 'Grand Luxury Hotel Tour',
        description: 'Experience the luxury of our 5-star hotel in Manhattan',
        videoUrl: require('../assets/videos/17f96a276e6642139c883c58ba1e3f98.mp4'),
        thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        duration: '0:45',
        views: 1245,
        likes: 234,
        comments: 45
      },
      {
        id: 2,
        hotelId: 1,
        title: 'Luxury Suite Experience',
        description: 'Take a tour of our premium executive suites',
        videoUrl: require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
        thumbnail: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        duration: '0:30',
        views: 892,
        likes: 156,
        comments: 23
      },
      {
        id: 3,
        hotelId: 2,
        title: 'Seaside Resort Beach View',
        description: 'Enjoy the beautiful beachfront views at our resort',
        videoUrl: require('../assets/videos/459509f228787759adc0ec082a991cc5.mp4'),
        thumbnail: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        duration: '0:40',
        views: 1567,
        likes: 289,
        comments: 67
      },
      {
        id: 4,
        hotelId: 2,
        title: 'Ocean View Room Tour',
        description: 'Check out our stunning ocean view rooms',
        videoUrl: require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
        thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        duration: '0:35',
        views: 945,
        likes: 178,
        comments: 34
      },
      {
        id: 5,
        hotelId: 3,
        title: 'Urban Boutique Hotel Walkthrough',
        description: 'Explore our stylish boutique hotel in Chicago',
        videoUrl: require('../assets/videos/766faa90d784e59d89ad2c5177243078.mp4'),
        thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        duration: '0:50',
        views: 1123,
        likes: 245,
        comments: 56
      },
      {
        id: 6,
        hotelId: 3,
        title: 'Business Suite Features',
        description: 'Discover the features of our business-friendly suites',
        videoUrl: require('../assets/videos/a31859fbd0d15650c052a6bb17a42f44.mp4'),
        thumbnail: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        duration: '0:25',
        views: 756,
        likes: 134,
        comments: 28
      }
    ];
  },

  getHotelVideos: async (hotelId) => {
    try {
      const videos = await apiService.getShortVideos();
      return videos.filter(video => video.hotelId === parseInt(hotelId));
    } catch (error) {
      throw new Error('Failed to fetch hotel videos');
    }
  },

  getHotelVideo: async (hotelId) => {
    try {
      const videos = await apiService.getShortVideos();
      const video = videos.find(v => v.hotelId === parseInt(hotelId));
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
      const hotel = await apiService.getHotelById(hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }
      return [hotel.image]; // For now, just return the main image
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