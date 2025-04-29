import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import * as yup from 'yup';
import { Formik } from 'formik';

const registerSchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.string().required('Please select your role'),
});

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const roles = [
    { id: 'student', label: 'Student', icon: 'school' },
    { id: 'teacher', label: 'Teacher', icon: 'teach' },
    { id: 'coordinator', label: 'Coordinator', icon: 'account-tie' },
  ];

  const handleRegister = (values) => {
    setLoading(true);
    // Simulate registration API call
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('EmailVerification', { email: values.email });
    }, 2000);
  };

  const nextStep = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(2);
      slideAnim.setValue(50);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const prevStep = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(1);
      slideAnim.setValue(-50);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      }}
      validationSchema={registerSchema}
      onSubmit={handleRegister}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Image 
                source={require('../../assets/images/icon.png')} 
                style={styles.logo} 
              />
              <Text style={[styles.title, { color: theme.colors.primary }]}>
                Create Account
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.text }]}>
                {step === 1 ? 'Personal Information' : 'Account Details'}
              </Text>
            </View>

            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                }
              ]}
            >
              {step === 1 ? (
                <>
                  <InputField
                    label="Full Name"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={touched.name && errors.name}
                    icon="account"
                    style={styles.input}
                  />

                  <InputField
                    label="Email Address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={touched.email && errors.email}
                    keyboardType="email-address"
                    icon="email"
                    style={styles.input}
                  />

                  <View style={styles.roleContainer}>
                    <Text style={[styles.roleLabel, { color: theme.colors.text }]}>
                      I am a:
                    </Text>
                    <View style={styles.roleButtons}>
                      {roles.map(role => (
                        <TouchableOpacity
                          key={role.id}
                          onPress={() => handleChange('role')(role.id)}
                          style={[
                            styles.roleButton,
                            { 
                              backgroundColor: values.role === role.id 
                                ? theme.colors.primary 
                                : theme.colors.surface,
                              borderColor: theme.colors.border,
                            }
                          ]}
                        >
                          <MaterialCommunityIcons 
                            name={role.icon} 
                            size={20} 
                            color={values.role === role.id ? theme.colors.onPrimary : theme.colors.text} 
                          />
                          <Text 
                            style={[
                              styles.roleButtonText,
                              { 
                                color: values.role === role.id 
                                  ? theme.colors.onPrimary 
                                  : theme.colors.text,
                              }
                            ]}
                          >
                            {role.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {touched.role && errors.role && (
                      <Text style={[styles.errorText, { color: theme.colors.error }]}>
                        {errors.role}
                      </Text>
                    )}
                  </View>

                  <Button 
                    title="Continue" 
                    onPress={nextStep} 
                    style={styles.button} 
                    disabled={!values.name || !values.email || !values.role || errors.name || errors.email}
                  />
                </>
              ) : (
                <>
                  <InputField
                    label="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={touched.password && errors.password}
                    secureTextEntry
                    icon="lock"
                    rightIcon="eye"
                    onRightIconPress={() => {}}
                    style={styles.input}
                  />

                  <InputField
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    error={touched.confirmPassword && errors.confirmPassword}
                    secureTextEntry
                    icon="lock-check"
                    style={styles.input}
                  />

                  <View style={styles.stepButtons}>
                    <Button 
                      title="Back" 
                      onPress={prevStep} 
                      type="outline" 
                      style={styles.stepButton} 
                    />
                    <Button 
                      title="Create Account" 
                      onPress={handleSubmit} 
                      style={styles.stepButton} 
                      disabled={!isValid || loading}
                    />
                  </View>
                </>
              )}
            </Animated.View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.colors.text }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.footerLink, { color: theme.colors.primary }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {loading && (
            <View style={styles.loader}>
              <Loader size={60} />
              <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                Creating your account...
              </Text>
            </View>
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  roleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    marginTop: 8,
  },
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
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

export default RegisterScreen;