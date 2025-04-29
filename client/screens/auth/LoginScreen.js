import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../config/theme';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const dummyUsers = [
    { email: 'student@example.com', password: 'student123', role: 'student' },
    { email: 'teacher@example.com', password: 'teacher123', role: 'teacher' },
    { email: 'co@example.com', password: 'co123', role: 'coordinator' },
  ];

  const handleLogin = async () => {
    setLoading(true);
    
    try {
      const user = dummyUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        await login({
          email: user.email,
          role: user.role,
          name: user.role.charAt(0).toUpperCase() + user.role.slice(1)
        });
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid email or password',
          [{ text: 'OK', onPress: () => setLoading(false) }]
        );
        setLoading(false);
      }
    } catch (error) {
      Alert.alert(
        'Login Error',
        'An error occurred during login',
        [{ text: 'OK', onPress: () => setLoading(false) }]
      );
      setLoading(false);
    }
  };

  const fillTestCredentials = (role) => {
    const user = dummyUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/react-logo.png')}
      style={styles.container}
      blurRadius={2}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Card style={styles.card}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Welcome Back!
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Sign in to your account
          </Text>

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="email"
            style={styles.input}
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureEntry}
            icon="lock"
            rightIcon={secureEntry ? 'eye-off' : 'eye'}
            onRightIconPress={() => setSecureEntry(!secureEntry)}
            style={styles.input}
          />

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[styles.forgotText, { color: theme.colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button 
            title="Sign In" 
            onPress={handleLogin} 
            style={styles.button} 
            disabled={!email || !password}
          />

          <View style={styles.testButtons}>
            <Text style={[styles.testText, { color: theme.colors.primary }]}>
              Test Accounts:
            </Text>
            <View style={styles.testButtonRow}>
              <Button 
                title="Student" 
                onPress={() => fillTestCredentials('student')} 
                type="outline" 
                style={styles.testButton}
                textStyle={styles.testButtonText}
              />
              <Button 
                title="Teacher" 
                onPress={() => fillTestCredentials('teacher')} 
                type="outline" 
                style={styles.testButton}
                textStyle={styles.testButtonText}
              />
              <Button 
                title="Coordinator" 
                onPress={() => fillTestCredentials('coordinator')} 
                type="outline" 
                style={styles.testButton}
                textStyle={styles.testButtonText}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.onPrimary }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.footerLink, { color: theme.colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </Animated.View>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Signing you in...
          </Text>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    padding: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  forgotText: {
    textAlign: 'right',
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    marginTop: 8,
  },
  testButtons: {
    marginVertical: 16,
  },
  testText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
  testButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
  },
  testButtonText: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default LoginScreen;