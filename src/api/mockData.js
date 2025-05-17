// Mock data for hotels
export const mockHotels = [
  {
    id: 1,
    name: 'Grand Luxury Hotel',
    description: 'Experience unparalleled luxury at our beachfront resort. Enjoy stunning ocean views, world-class amenities, and exceptional service.',
    location: '123 Beach Road, Miami, FL',
    rating: 4.8,
    reviews: 1245,
    price: 299,
    images: [
      require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
      require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
      require('../assets/videos/a31859fbd0d15650c052a6bb17a42f44.mp4'),
      require('../assets/videos/c85b6e1ba051bfe56cf3ea0864928f09.mp4'),
    ],
    rooms: [
      {
        id: 1,
        type: 'Deluxe Ocean View',
        price: 299,
        description: 'Spacious room with private balcony and ocean view',
        image: require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
      },
      {
        id: 2,
        type: 'Executive Suite',
        price: 399,
        description: 'Luxurious suite with separate living area',
        image: require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
      },
    ],
  },
  {
    id: 2,
    name: 'Seaside Resort',
    description: 'A perfect blend of comfort and elegance. Our resort offers direct beach access and a variety of water activities.',
    location: '456 Coastal Highway, Malibu, CA',
    rating: 4.6,
    reviews: 892,
    price: 249,
    images: [
      require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
      require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
      require('../assets/videos/a31859fbd0d15650c052a6bb17a42f44.mp4'),
      require('../assets/videos/c85b6e1ba051bfe56cf3ea0864928f09.mp4'),
    ],
    rooms: [
      {
        id: 3,
        type: 'Beachfront Suite',
        price: 249,
        description: 'Direct beach access with private terrace',
        image: require('../assets/videos/a31859fbd0d15650c052a6bb17a42f44.mp4'),
      },
      {
        id: 4,
        type: 'Garden View Room',
        price: 199,
        description: 'Peaceful room overlooking our tropical gardens',
        image: require('../assets/videos/c85b6e1ba051bfe56cf3ea0864928f09.mp4'),
      },
    ],
  },
  {
    id: 3,
    name: 'Urban Boutique Hotel',
    description: 'Modern luxury in the heart of the city. Perfect for business travelers and urban explorers.',
    location: '789 Downtown Ave, New York, NY',
    rating: 4.7,
    reviews: 1567,
    price: 199,
    images: [
      require('../assets/videos/a31859fbd0d15650c052a6bb17a42f44.mp4'),
      require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
      require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
      require('../assets/videos/c85b6e1ba051bfe56cf3ea0864928f09.mp4'),
    ],
    rooms: [
      {
        id: 5,
        type: 'City View Suite',
        price: 199,
        description: 'Stunning city skyline views from your private balcony',
        image: require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
      },
      {
        id: 6,
        type: 'Business Room',
        price: 179,
        description: 'Designed for productivity with work desk and high-speed internet',
        image: require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
      },
    ],
  },
  {
    id: 4,
    name: 'Mountain View Lodge',
    description: 'Escape to nature in our cozy mountain retreat. Enjoy breathtaking views and outdoor activities.',
    location: '321 Mountain Road, Aspen, CO',
    rating: 4.9,
    reviews: 734,
    price: 279,
    images: [
      require('../assets/videos/c85b6e1ba051bfe56cf3ea0864928f09.mp4'),
      require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
      require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
      require('../assets/videos/a31859fbd0d15650c052a6bb17a42f44.mp4'),
    ],
    rooms: [
      {
        id: 7,
        type: 'Mountain Suite',
        price: 279,
        description: 'Panoramic mountain views with fireplace',
        image: require('../assets/videos/a31859fbd0d15650c052a6bb17a42f44.mp4'),
      },
      {
        id: 8,
        type: 'Forest Cabin',
        price: 229,
        description: 'Cozy cabin surrounded by pine trees',
        image: require('../assets/videos/c85b6e1ba051bfe56cf3ea0864928f09.mp4'),
      },
    ],
  },
  {
    id: 5,
    name: 'City Center Hotel',
    description: 'Contemporary comfort in the heart of downtown. Steps away from shopping, dining, and entertainment.',
    location: '567 Main Street, Chicago, IL',
    rating: 4.5,
    reviews: 1023,
    price: 189,
    images: [
      require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
      require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
      require('../assets/videos/a31859fbd0d15650c052a6bb17a42f44.mp4'),
      require('../assets/videos/c85b6e1ba051bfe56cf3ea0864928f09.mp4'),
    ],
    rooms: [
      {
        id: 9,
        type: 'Executive Suite',
        price: 189,
        description: 'Modern suite with city views and premium amenities',
        image: require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
      },
      {
        id: 10,
        type: 'Standard Room',
        price: 149,
        description: 'Comfortable room with all essential amenities',
        image: require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
      },
    ],
  },
];

// Mock data for bookings
export const mockBookings = [
  {
    id: 1,
    userId: 'user123',
    hotelId: 1,
    hotelName: 'Grand Luxury Hotel',
    roomType: 'Deluxe Ocean View',
    checkIn: '2024-04-15',
    checkOut: '2024-04-20',
    guests: 2,
    totalPrice: 1495,
    status: 'Confirmed',
    bookingDate: '2024-03-10',
    specialRequests: 'Early check-in requested',
    contactName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+1234567890'
  },
  {
    id: 2,
    userId: 'user123',
    hotelId: 2,
    hotelName: 'Seaside Resort',
    roomType: 'Beachfront Suite',
    checkIn: '2024-05-01',
    checkOut: '2024-05-05',
    guests: 2,
    totalPrice: 996,
    status: 'Pending',
    bookingDate: '2024-03-12',
    specialRequests: 'Late check-out requested',
    contactName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+1234567890'
  },
  {
    id: 3,
    userId: 'user123',
    hotelId: 3,
    hotelName: 'Urban Boutique Hotel',
    roomType: 'City View Suite',
    checkIn: '2024-06-10',
    checkOut: '2024-06-15',
    guests: 1,
    totalPrice: 995,
    status: 'Confirmed',
    bookingDate: '2024-03-14',
    specialRequests: 'Extra pillows requested',
    contactName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+1234567890'
  },
  {
    id: 4,
    userId: 'user123',
    hotelId: 4,
    hotelName: 'Mountain View Lodge',
    roomType: 'Mountain Suite',
    checkIn: '2024-07-01',
    checkOut: '2024-07-07',
    guests: 4,
    totalPrice: 1253,
    status: 'Cancelled',
    bookingDate: '2024-03-15',
    specialRequests: 'Family room with connecting doors',
    contactName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+1234567890'
  },
  {
    id: 5,
    userId: 'user123',
    hotelId: 5,
    hotelName: 'City Center Hotel',
    roomType: 'Executive Suite',
    checkIn: '2024-08-15',
    checkOut: '2024-08-20',
    guests: 2,
    totalPrice: 1645,
    status: 'Confirmed',
    bookingDate: '2024-03-16',
    specialRequests: 'Business amenities requested',
    contactName: 'John Doe',
    contactEmail: 'john.doe@example.com',
    contactPhone: '+1234567890'
  }
];

// Mock data for short videos
export const mockShortVideos = [
  {
    id: 1,
    title: 'Luxury Beach Resort',
    description: 'Experience the ultimate beachfront luxury at our resort',
    url: require('../assets/videos/30c13e9725cb5e47513a00cf8fb55491.mp4'),
    likes: 1234,
    comments: [
      {
        id: 1,
        text: 'Amazing view!',
        userId: 'user1',
        timestamp: '2024-03-15T10:30:00Z'
      }
    ]
  },
  {
    id: 2,
    title: 'City View Suite',
    description: 'Stunning city views from our premium suites',
    url: require('../assets/videos/47d5526b6c9bbb4df880398837fdf086.mp4'),
    likes: 856,
    comments: []
  },
  {
    id: 3,
    title: 'Mountain Retreat',
    description: 'Escape to nature in our cozy mountain cabins',
    url: require('../assets/videos/a31859fbd0d15650c052a6bb17a42f44.mp4'),
    likes: 567,
    comments: []
  },
  {
    id: 4,
    title: 'Urban Oasis',
    description: 'Modern comfort in the heart of the city',
    url: require('../assets/videos/c85b6e1ba051bfe56cf3ea0864928f09.mp4'),
    likes: 432,
    comments: []
  }
]; 