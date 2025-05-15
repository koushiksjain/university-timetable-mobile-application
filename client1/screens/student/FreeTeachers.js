import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import FreeTeachersList from '../../components/student/FreeTeachersList';
import InputField from '../../components/common/InputField';
import Loader from '../../components/common/Loader';

const FreeTeachers = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('Today');
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const teachers = [
    {
      id: '1',
      name: 'Dr. Smith',
      department: 'Computer Science',
      availability: {
        'Today': ['10:00-11:00', '3:00-4:00'],
        'Monday': ['9:00-10:00', '2:00-3:00'],
        'Wednesday': ['11:00-12:00']
      }
    },
    {
      id: '2',
      name: 'Dr. Williams',
      department: 'Electronics',
      availability: {
        'Today': [],
        'Friday': ['9:00-11:00']
      }
    },
    {
      id: '3',
      name: 'Prof. Johnson',
      department: 'Mathematics',
      availability: {
        'Today': ['1:00-2:00', '4:00-5:00'],
        'Tuesday': ['10:00-12:00'],
        'Thursday': ['2:00-4:00']
      }
    }
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBookAppointment = (teacher, slot) => {
    navigation.navigate('BookAppointment', { teacher, slot });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Header 
        title="Available Teachers" 
        onBack={() => navigation.goBack()} 
        rightIcon="refresh"
        onRightPress={handleRefresh}
        style={styles.header}
      />

      <View style={styles.searchContainer}>
        <InputField
          placeholder="Search by name or department"
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="magnify"
          style={styles.searchInput}
          containerStyle={styles.inputContainer}
          placeholderTextColor="#666"
        />
      </View>

      <FreeTeachersList 
        teachers={teachers} 
        onBookAppointment={handleBookAppointment}
        searchQuery={searchQuery}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
            Loading availability...
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Lighter, cleaner background
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FreeTeachers;