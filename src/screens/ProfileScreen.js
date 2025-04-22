import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@rneui/themed';
import { logout } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  
  const toggleNotifications = () => setNotifications(previousState => !previousState);
  const toggleDarkMode = () => setDarkMode(previousState => !previousState);
  const toggleEmailNotifications = () => setEmailNotifications(previousState => !previousState);
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('refreshToken');
              dispatch(logout());
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  const openEditModal = (field, value) => {
    setEditField(field);
    setEditValue(value);
    setShowEditModal(true);
  };
  
  const handleSaveEdit = () => {
    // In a real app, this would update the user's profile
    // For now, we'll just close the modal
    setShowEditModal(false);
  };
  
  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Icon name="close" type="ionicon" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.modalInput}
            value={editValue}
            onChangeText={setEditValue}
            autoCapitalize="none"
            keyboardType={editField === 'Email' ? 'email-address' : 'default'}
          />
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveEdit}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'guest@example.com'}</Text>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => openEditModal('Name', user?.name || 'Guest User')}
        >
          <View style={styles.infoItemLeft}>
            <Icon name="person" type="ionicon" size={20} color="#666" />
            <Text style={styles.infoItemLabel}>Name</Text>
          </View>
          <View style={styles.infoItemRight}>
            <Text style={styles.infoItemValue}>{user?.name || 'Guest User'}</Text>
            <Icon name="chevron-forward" type="ionicon" size={20} color="#CCC" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => openEditModal('Email', user?.email || 'guest@example.com')}
        >
          <View style={styles.infoItemLeft}>
            <Icon name="mail" type="ionicon" size={20} color="#666" />
            <Text style={styles.infoItemLabel}>Email</Text>
          </View>
          <View style={styles.infoItemRight}>
            <Text style={styles.infoItemValue}>{user?.email || 'guest@example.com'}</Text>
            <Icon name="chevron-forward" type="ionicon" size={20} color="#CCC" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoItem}>
          <View style={styles.infoItemLeft}>
            <Icon name="call" type="ionicon" size={20} color="#666" />
            <Text style={styles.infoItemLabel}>Phone</Text>
          </View>
          <View style={styles.infoItemRight}>
            <Text style={styles.infoItemValue}>+1 (555) 123-4567</Text>
            <Icon name="chevron-forward" type="ionicon" size={20} color="#CCC" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoItem}>
          <View style={styles.infoItemLeft}>
            <Icon name="lock-closed" type="ionicon" size={20} color="#666" />
            <Text style={styles.infoItemLabel}>Password</Text>
          </View>
          <View style={styles.infoItemRight}>
            <Text style={styles.infoItemValue}>••••••••</Text>
            <Icon name="chevron-forward" type="ionicon" size={20} color="#CCC" />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Icon name="notifications" type="ionicon" size={20} color="#666" />
            <Text style={styles.settingItemLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#CCC', true: '#007BFF' }}
            thumbColor="#FFF"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Icon name="mail" type="ionicon" size={20} color="#666" />
            <Text style={styles.settingItemLabel}>Email Notifications</Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={toggleEmailNotifications}
            trackColor={{ false: '#CCC', true: '#007BFF' }}
            thumbColor="#FFF"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Icon name="moon" type="ionicon" size={20} color="#666" />
            <Text style={styles.settingItemLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#CCC', true: '#007BFF' }}
            thumbColor="#FFF"
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportItemLeft}>
            <Icon name="help-circle" type="ionicon" size={20} color="#666" />
            <Text style={styles.supportItemLabel}>Help Center</Text>
          </View>
          <Icon name="chevron-forward" type="ionicon" size={20} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportItemLeft}>
            <Icon name="chatbubble-ellipses" type="ionicon" size={20} color="#666" />
            <Text style={styles.supportItemLabel}>Contact Support</Text>
          </View>
          <Icon name="chevron-forward" type="ionicon" size={20} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportItemLeft}>
            <Icon name="document-text" type="ionicon" size={20} color="#666" />
            <Text style={styles.supportItemLabel}>Terms & Conditions</Text>
          </View>
          <Icon name="chevron-forward" type="ionicon" size={20} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportItemLeft}>
            <Icon name="shield-checkmark" type="ionicon" size={20} color="#666" />
            <Text style={styles.supportItemLabel}>Privacy Policy</Text>
          </View>
          <Icon name="chevron-forward" type="ionicon" size={20} color="#CCC" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" type="ionicon" size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
      
      {renderEditModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 15,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  editProfileText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItemLabel: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 15,
  },
  infoItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItemValue: {
    fontSize: 16,
    color: '#666666',
    marginRight: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemLabel: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 15,
  },
  supportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  supportItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportItemLabel: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
