import React, { useState, useEffect, use } from 'react';
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
import { logout, updateUser } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.0.105:3000'; // Replace with your actual API base URL

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
  
   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('--- KIỂM TRA TOKEN ---');
        console.log('Token lấy từ AsyncStorage:', token);
        console.log('--------------------');
        if (!token) {
          console.error('No token found in AsyncStorage');
          return 'NO TOKEN'}; 

        const response = await fetch(`${API_BASE_URL}/user`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          dispatch(updateUser(data));
        } else {
          console.error("Lỗi khi tải profile:", data.error);
        }
      } catch (error) {
        console.error("Lỗi mạng khi tải profile:", error);
      }
    };

    fetchProfile();
  }, [dispatch]);
  
  const handleSaveEdit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token){
        Alert.alert('Error', 'You must be logged in to save changes.');
        return;
      };

      const fieldToUpdate = editField.toLowerCase();
      const bodyPayload = {
        [fieldToUpdate]: editValue,}
      
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(updateUser(bodyPayload));
        Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật.');
      } else {
        throw new Error(data.error || 'Cập nhật thất bại');
      }
      } catch (error) {
        Alert.alert('Lỗi', error.message);
      } finally {
        setShowEditModal(false); 
      }
    };

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
    <ScrollView style={{ flex: 1, backgroundColor: darkMode ? '#222' : '#fff' }}>
      <View style={{ alignItems: 'center', padding: 30 }}>
        <Image
          source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
        />
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: darkMode ? '#fff' : '#333' }}>{user?.name || 'Guest'}</Text>
        <Text style={{ fontSize: 16, color: darkMode ? '#aaa' : '#666', marginTop: 5 }}>{user?.email || ''}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#333' }]}>Account Information</Text>
        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => openEditModal('Name', user?.name || 'Guest User')}
        >
          <View style={styles.infoItemLeft}>
            <Icon name="person" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.infoItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Name</Text>
          </View>
          <View style={styles.infoItemRight}>
            <Text style={[styles.infoItemValue, { color: darkMode ? '#fff' : '#666' }]}>{user?.name || 'Guest User'}</Text>
            <Icon name="chevron-forward" type="ionicon" size={20} color={darkMode ? '#fff' : '#CCC'} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.infoItem}>
        <View style={styles.infoItemLeft}>
          <Icon name="mail" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
          <Text style={[styles.infoItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Email</Text>
        </View>
        <View style={styles.infoItemRight}>
          <Text style={[styles.infoItemValue, { color: darkMode ? '#fff' : '#666' }]}>{user?.email || 'guest@example.com'}</Text>
        </View>
      </View>
        
        <TouchableOpacity
         style={styles.infoItem}
         onPress={() => openEditModal('Phone', user?.phoneNumber || '+1 (555) 123-4567')}>
          <View style={styles.infoItemLeft}>
            <Icon name="call" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.infoItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Phone</Text>
          </View>
          <View style={styles.infoItemRight}>
            <Text style={[styles.infoItemValue, { color: darkMode ? '#fff' : '#666' }]}>{user?.phoneNumber}</Text>
            <Icon name="chevron-forward" type="ionicon" size={20} color={darkMode ? '#fff' : '#CCC'} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoItem}>
          <View style={styles.infoItemLeft}>
            <Icon name="lock-closed" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.infoItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Password</Text>
          </View>
          <View style={styles.infoItemRight}>
            <Text style={[styles.infoItemValue, { color: darkMode ? '#fff' : '#666' }]}>••••••••</Text>
            <Icon name="chevron-forward" type="ionicon" size={20} color={darkMode ? '#fff' : '#CCC'} />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#333' }]}>App Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Icon name="notifications" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.settingItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Push Notifications</Text>
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
            <Icon name="mail" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.settingItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Email Notifications</Text>
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
            <Icon name="moon" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.settingItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Dark Mode</Text>
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
        <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#333' }]}>Support</Text>
        
        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportItemLeft}>
            <Icon name="help-circle" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.supportItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Help Center</Text>
          </View>
          <Icon name="chevron-forward" type="ionicon" size={20} color={darkMode ? '#fff' : '#CCC'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportItemLeft}>
            <Icon name="chatbubble-ellipses" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.supportItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Contact Support</Text>
          </View>
          <Icon name="chevron-forward" type="ionicon" size={20} color={darkMode ? '#fff' : '#CCC'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportItemLeft}>
            <Icon name="document-text" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.supportItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Terms & Conditions</Text>
          </View>
          <Icon name="chevron-forward" type="ionicon" size={20} color={darkMode ? '#fff' : '#CCC'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportItemLeft}>
            <Icon name="shield-checkmark" type="ionicon" size={20} color={darkMode ? '#fff' : '#666'} />
            <Text style={[styles.supportItemLabel, { color: darkMode ? '#fff' : '#333' }]}>Privacy Policy</Text>
          </View>
          <Icon name="chevron-forward" type="ionicon" size={20} color={darkMode ? '#fff' : '#CCC'} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" type="ionicon" size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: darkMode ? '#aaa' : '#999' }]}>Version 1.0.0</Text>
      </View>
      
      {renderEditModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
