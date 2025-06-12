// file: LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { firebaseApp } from '../../config/firebaseconfig'; 

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const authClient = getAuth(firebaseApp);


  const handleLogin = async () => {
    try {
      
      const userCredential = await signInWithEmailAndPassword(authClient, email, password);

      
      const idToken = await userCredential.user.getIdToken();

      
      const response = await fetch('http://192.168.0.105:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: idToken }), // Chỉ gửi idToken
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login verification failed on server.');
      }

      
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      } else {
        throw new Error('Server did not return a session token.');
      }

      
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      
    } catch (error) {
      
      Alert.alert('Lỗi đăng nhập', error.message);
    }
  };

  
  const handleSocialLogin = async () => {
    Alert.alert("Tính năng đang phát triển", "Đăng nhập bằng mạng xã hội sẽ sớm được ra mắt.");
  };

  return (
       <SafeAreaView style={styles.container}>
         <KeyboardAvoidingView
           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
           style={styles.keyboardView}
         >
           <ScrollView contentContainerStyle={styles.scrollContent}>
             <View style={styles.header}>
               <View style={styles.logoContainer}>
                 <Icon name="bed" type="ionicon" size={60} color="#007BFF" />
                 <Text style={styles.logoText}>Hotel App</Text>
               </View>
               <Text style={styles.subtitle}>Sign in to continue</Text>
             </View>

             <View style={styles.form}>
               <View style={styles.inputContainer}>
                 <Icon name="mail" type="ionicon" size={20} color="#666" style={styles.inputIcon} />
                 <TextInput
                   style={styles.input}
                   placeholder="Email"
                   value={email}
                   onChangeText={setEmail}
                   keyboardType="email-address"
                   autoCapitalize="none"
                 />
               </View>

               <View style={styles.inputContainer}>
                 <Icon name="lock-closed" type="ionicon" size={20} color="#666" style={styles.inputIcon} />
                 <TextInput
                   style={styles.input}
                   placeholder="Password"
                   value={password}
                   onChangeText={setPassword}
                   secureTextEntry={!showPassword}
                 />
                 <TouchableOpacity
                   style={styles.eyeIcon}
                   onPress={() => setShowPassword(!showPassword)}
                 >
                   <Icon
                     name={showPassword ? 'eye-off' : 'eye'}
                     type="ionicon"
                     size={20}
                     color="#666"
                   />
                 </TouchableOpacity>
               </View>

               <TouchableOpacity
                 style={styles.forgotPassword}
                 onPress={() => navigation.navigate('ForgotPassword')}
               >
                 <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                 <Text style={styles.loginButtonText}>Sign In</Text>
               </TouchableOpacity>
             </View>

             <View style={styles.socialContainer}>
               <View style={styles.divider}>
                 <View style={styles.dividerLine} />
                 <Text style={styles.dividerText}>or continue with</Text>
                 <View style={styles.dividerLine} />
               </View>

               <View style={styles.socialButtons}>
                 <TouchableOpacity
                   style={styles.socialButton}
                   onPress={handleSocialLogin}
                 >
                   <Icon name="logo-google" type="ionicon" size={24} color="#DB4437" />
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.socialButton}
                   onPress={handleSocialLogin}
                 >
                   <Icon name="logo-facebook" type="ionicon" size={24} color="#4267B2" />
                 </TouchableOpacity>
               </View>
             </View>

             <View style={styles.registerContainer}>
               <Text style={styles.registerText}>Don't have an account? </Text>
               <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                 <Text style={styles.registerLink}>Sign Up</Text>
               </TouchableOpacity>
             </View>
           </ScrollView>
         </KeyboardAvoidingView>
       </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
       flex: 1,
       backgroundColor: '#fff',
     },
     keyboardView: {
       flex: 1,
     },
     scrollContent: {
       flexGrow: 1,
       padding: 24,
     },
     header: {
       alignItems: 'center',
       marginTop: 40,
       marginBottom: 40,
     },
     logoContainer: {
       alignItems: 'center',
       marginBottom: 20,
     },
     logoText: {
       fontSize: 24,
       fontWeight: 'bold',
       color: '#007BFF',
       marginTop: 8,
     },
     subtitle: {
       fontSize: 16,
       color: '#666',
     },
     form: {
       marginBottom: 24,
     },
     inputContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       borderWidth: 1,
       borderColor: '#ddd',
       borderRadius: 12,
       marginBottom: 16,
       paddingHorizontal: 16,
       height: 56,
     },
     inputIcon: {
       marginRight: 12,
     },
     input: {
       flex: 1,
       fontSize: 16,
       color: '#333',
     },
     eyeIcon: {
       padding: 8,
     },
     forgotPassword: {
       alignSelf: 'flex-end',
       marginBottom: 24,
     },
     forgotPasswordText: {
       color: '#007BFF',
       fontSize: 14,
     },
     loginButton: {
       backgroundColor: '#007BFF',
       borderRadius: 12,
       height: 56,
       justifyContent: 'center',
       alignItems: 'center',
     },
     loginButtonText: {
       color: '#fff',
       fontSize: 18,
       fontWeight: 'bold',
     },
     socialContainer: {
       marginBottom: 24,
     },
     divider: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 24,
     },
     dividerLine: {
       flex: 1,
       height: 1,
       backgroundColor: '#ddd',
     },
     dividerText: {
       marginHorizontal: 16,
       color: '#666',
       fontSize: 14,
     },
     socialButtons: {
       flexDirection: 'row',
       justifyContent: 'center',
       gap: 16,
     },
     socialButton: {
       width: 56,
       height: 56,
       borderRadius: 28,
       borderWidth: 1,
       borderColor: '#ddd',
       justifyContent: 'center',
       alignItems: 'center',
     },
     registerContainer: {
       flexDirection: 'row',
       justifyContent: 'center',
       marginTop: 'auto',
       paddingVertical: 24,
     },
     registerText: {
       color: '#666',
       fontSize: 14,
     },
     registerLink: {
       color: '#007BFF',
       fontSize: 14,
       fontWeight: 'bold',
     },
});
export default LoginScreen;