import React, { useState, useEffect, useRef } from 'react';
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
import apiService from '../api/apiService';

const { width } = Dimensions.get('window');

const TravelVideo = ({ hotelId }) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    loadVideo();
  }, [hotelId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const data = await apiService.getHotelVideo(hotelId);
      console.log('Video data received:', data); // Debug log
      if (!data) throw new Error('No video data received');
      if (!data.videoUrl) throw new Error('No video URL in data');
      setVideo(data);
    } catch (error) {
      console.error('Error loading video:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (videoRef.current) {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handlePlaybackStatusUpdate = (status) => {
    console.log('Playback status:', status); // Debug log
    setStatus(status);
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
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVideo}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={video.videoUrl}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={(error) => {
            console.error('Video playback error:', error);
            setError('Error playing video');
          }}
        />
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
        >
          <Icon
            name={isPlaying ? 'pause' : 'play'}
            type="ionicon"
            size={40}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.description}>{video.description}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Icon name="eye" type="ionicon" size={16} color="#666666" />
            <Text style={styles.statText}>{video.views}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="heart" type="ionicon" size={16} color="#666666" />
            <Text style={styles.statText}>{video.likes}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="chatbubble" type="ionicon" size={16} color="#666666" />
            <Text style={styles.statText}>{video.comments}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  videoContainer: {
    position: 'relative',
    height: 200,
  },
  video: {
    width: width,
    height: 200,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 10,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
});

export default TravelVideo; 