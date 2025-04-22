# Hotel Booking App

A React Native mobile application for booking hotels and apartments, with integration capabilities for Booking.com and Agoda.

## Features

- User authentication (login/register)
- Browse hotels and apartments
- Search and filter functionality
- View hotel details
- Book rooms
- Manage bookings
- User profile management
- Integration with Booking.com and Agoda (placeholder for future implementation)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd hotel-booking-app
   npm install
   ```
   or
   ```
   cd hotel-booking-app
   yarn install
   ```

### Running the App

```
npm start
```
or
```
yarn start
```

This will start the Expo development server. You can then run the app on:
- iOS simulator (requires macOS and Xcode)
- Android emulator (requires Android Studio)
- Physical device using the Expo Go app

## Project Structure

```
hotel-booking-app/
├── assets/                # App assets (images, fonts, etc.)
├── src/
│   ├── api/               # API services
│   ├── components/        # Reusable components
│   ├── navigation/        # Navigation configuration
│   ├── redux/             # Redux store and slices
│   │   ├── slices/        # Redux slices
│   │   └── store.js       # Redux store configuration
│   ├── screens/           # App screens
│   └── utils/             # Utility functions
├── App.js                 # Main app component
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Required Assets

Before running the app, you need to add the following assets:

1. Create a splash.png image in the assets folder
   - This is used as the app's splash screen and logo
   - Recommended size: 1024x1024 pixels

2. Add hotel images (optional)
   - The app currently uses placeholder URLs for hotel images
   - You can add your own images in the assets/images folder

## Integration with Booking.com and Agoda

The app includes placeholder code for integration with Booking.com and Agoda. To implement actual integration:

1. Sign up for developer accounts with Booking.com and Agoda
2. Obtain API keys
3. Update the API service files with the appropriate endpoints and authentication

## License

This project is licensed under the MIT License.
