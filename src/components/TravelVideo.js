import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Video } from 'expo-av';
import { Icon } from '@rneui/themed';
import { mockApi } from '../api/apiService';

const { width } = Dimensions.get('window');

const TravelVideo = ({ hotelId }) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  React.useEffect(() => {
    loadVideo();
  }, [hotelId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const videoData = await mockApi.getHotelVideo(hotelId);
      setVideo(videoData);
    } catch (error) {
      setError('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      videoRef.current?.replayAsync();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" type="ionicon" size={40} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVideo}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!video) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="videocam-off" type="ionicon" size={40} color="#CCCCCC" />
        <Text style={styles.emptyText}>No video available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: video.url }}
        resizeMode="cover"
        shouldPlay
        isLooping
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.description}>{video.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width * 0.75,
    backgroundColor: '#000000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  loadingContainer: {
    width: width,
    height: width * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    width: width,
    height: width * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginTop: 10,
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    width: width,
    height: width * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
  },
});

export default TravelVideo; 