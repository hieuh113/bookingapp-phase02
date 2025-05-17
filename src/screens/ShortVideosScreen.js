import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import { Icon } from '@rneui/themed';
import apiService from '../api/apiService';

const { width, height } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 1.5; // 3:2 aspect ratio

const ShortVideosScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef([]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index);
    }
  }, []);

  useEffect(() => {
    loadVideos();
    // Cleanup function to stop all videos when leaving the screen
    return () => {
      videoRefs.current.forEach(ref => {
        if (ref) {
          ref.stopAsync();
        }
      });
    };
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await apiService.getShortVideos();
      setVideos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load videos. Please try again later.');
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = async () => {
    if (videoRefs.current[currentVideoIndex]) {
      if (isPaused) {
        await videoRefs.current[currentVideoIndex].playAsync();
      } else {
        await videoRefs.current[currentVideoIndex].pauseAsync();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleLike = (videoId) => {
    setLikedVideos(prev => {
      const newLikedVideos = new Set(prev);
      if (newLikedVideos.has(videoId)) {
        newLikedVideos.delete(videoId);
      } else {
        newLikedVideos.add(videoId);
      }
      return newLikedVideos;
    });
  };

  const handleShare = async (video) => {
    try {
      await Share.share({
        message: `Check out this amazing hotel video: ${video.title}\n${video.url}`,
        title: video.title,
      });
    } catch (error) {
      console.error('Error sharing video:', error);
    }
  };

  const handleComment = (video) => {
    setSelectedVideo(video);
    setShowComments(true);
  };

  const submitComment = async () => {
    if (!commentText.trim() || !selectedVideo) return;

    try {
      // In a real app, this would call an API to post the comment
      const newComment = {
        id: Date.now(),
        text: commentText,
        userId: 'currentUser', // Replace with actual user ID
        timestamp: new Date().toISOString(),
      };

      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === selectedVideo.id
            ? { ...video, comments: [...(video.comments || []), newComment] }
            : video
        )
      );

      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const renderVideo = ({ item, index }) => {
    const isCurrentVideo = index === currentVideoIndex;
    const isLiked = likedVideos.has(item.id);

    return (
      <View style={styles.videoContainer}>
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={handleVideoPress}
          style={styles.videoWrapper}
        >
          <Video
            ref={ref => videoRefs.current[index] = ref}
            source={item.videoUrl}
            style={styles.video}
            resizeMode="cover"
            shouldPlay={isCurrentVideo && !isPaused}
            isLooping
            useNativeControls={false}
            onError={(error) => {
              console.error('Video error:', error);
              setError('Failed to load video');
            }}
          />
          
          {/* Play/Pause Icon Overlay */}
          {isPaused && isCurrentVideo && (
            <View style={styles.playPauseOverlay}>
              <Icon 
                name={isPaused ? "play" : "pause"} 
                type="ionicon" 
                size={50} 
                color="white" 
              />
            </View>
          )}
        </TouchableOpacity>
        
        {/* Video Info Overlay */}
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription}>{item.description}</Text>
        </View>

        {/* Right Side Actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Icon 
              name={isLiked ? "heart" : "heart-outline"} 
              type="ionicon" 
              size={30} 
              color={isLiked ? "red" : "white"} 
            />
            <Text style={styles.actionText}>{item.likes + (isLiked ? 1 : 0)}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleComment(item)}
          >
            <Icon name="chatbubble-outline" type="ionicon" size={30} color="white" />
            <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleShare(item)}
          >
            <Icon name="share-social-outline" type="ionicon" size={30} color="white" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVideos}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
      />

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Icon name="close" type="ionicon" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedVideo?.comments || []}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentTime}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              style={styles.commentsList}
            />

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.commentInputContainer}
            >
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitComment}
              >
                <Text style={styles.submitButtonText}>Post</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoContainer: {
    width,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoDescription: {
    color: '#fff',
    fontSize: 14,
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5, // Half screen height
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentText: {
    fontSize: 16,
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  playPauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default ShortVideosScreen; 