// Simulated delay to mimic API calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data for hotels
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
    description: 'Nestled in the mountains, our lodge offers a perfect blend of rustic charm and modern comfort.',
    rating: 4.6,
    price: 199,
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Ski Access', 'Hot Tub', 'Restaurant', 'Bar', 'Spa'],
    rooms: [
      { id: '3-1', type: 'Standard Room', price: 199, capacity: 2 },
      { id: '3-2', type: 'Mountain View Suite', price: 349, capacity: 2 },
      { id: '3-3', type: 'Family Room', price: 449, capacity: 4 },
    ],
  },
];

// Mock data for bookings
const mockBookings = [
  {
    id: '1',
    hotelId: '1',
    hotelName: 'Luxury Grand Hotel',
    userId: 'user123',
    checkIn: '2024-04-15',
    checkOut: '2024-04-20',
    guests: 2,
    roomType: 'Deluxe Room',
    totalPrice: 1495,
    status: 'confirmed',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    hotelId: '2',
    hotelName: 'Beachfront Paradise Resort',
    userId: 'user123',
    checkIn: '2024-05-01',
    checkOut: '2024-05-07',
    guests: 2,
    roomType: 'Ocean View Room',
    totalPrice: 1494,
    status: 'pending',
    createdAt: '2024-03-20T15:30:00Z',
  },
];

// Mock data for short videos
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

const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      await delay(1000);
      return { token: 'mock-token', user: { id: 1, name: 'Test User' } };
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  register: async (userData) => {
    try {
      await delay(1000);
      return { token: 'mock-token', user: { id: 1, ...userData } };
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  // Hotel methods
  getHotels: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockHotels;
    } catch (error) {
      throw new Error('Failed to fetch hotels');
    }
  },

  getHotelById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
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
      await new Promise(resolve => setTimeout(resolve, 800));
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newBooking = {
        id: String(mockBookings.length + 1),
        ...bookingData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      mockBookings.push(newBooking);
      return newBooking;
    } catch (error) {
      throw new Error('Failed to create booking');
    }
  },

  getBookings: async (userId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockBookings.filter(booking => booking.userId === userId);
    } catch (error) {
      throw new Error('Failed to fetch bookings');
    }
  },

  getBookingById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const booking = mockBookings.find(b => b.id === id);
      if (!booking) {
        throw new Error('Booking not found');
      }
      return booking;
    } catch (error) {
      throw new Error('Failed to fetch booking details');
    }
  },

  // Video methods
  getShortVideos: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockVideos;
    } catch (error) {
      throw new Error('Failed to fetch videos');
    }
  },

  getHotelVideos: async (hotelId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockVideos.filter(video => video.hotelId === hotelId);
    } catch (error) {
      throw new Error('Failed to fetch hotel videos');
    }
  },

  // Image methods
  getHotelImages: async (hotelId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const hotel = mockHotels.find(h => h.id === hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }
      return hotel.images;
    } catch (error) {
      throw new Error('Failed to fetch hotel images');
    }
  },

  getTravelAssistantResponse: async (message) => {
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
  },

  getHotelVideo: async (hotelId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const videos = {
      '1': {
        url: 'https://example.com/videos/hotel1.mp4',
        title: 'Luxury Beach Resort',
        description: 'Experience the ultimate beachfront luxury',
      },
      '2': {
        url: 'https://example.com/videos/hotel2.mp4',
        title: 'Mountain View Hotel',
        description: 'Stunning mountain views and modern amenities',
      },
      '3': {
        url: 'https://example.com/videos/hotel3.mp4',
        title: 'City Center Hotel',
        description: 'Perfect location in the heart of the city',
      },
    };

    return videos[hotelId] || null;
  },
};

export default apiService; 