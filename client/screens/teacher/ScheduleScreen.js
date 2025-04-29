import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import PersonalSchedule from '../../components/teacher/PersonalSchedule';
import AvailabilityManager from '../../components/teacher/AvailabilityManager';
import Loader from '../../components/common/Loader';

const ScheduleScreen = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('schedule');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const scheduleData = [
    {
      day: 'Monday',
      classes: [
        { time: '8:00-9:00', course: 'Data Structures', room: 'CS-202', type: 'Lecture' },
        { time: '10:00-11:00', course: 'Algorithms', room: 'CS-205', type: 'Lecture' },
        { time: '2:00-3:00', course: 'Office Hours', room: 'CS-301', type: 'Office' },
      ]
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '9:00-10:00', course: 'Data Structures Lab', room: 'CS-210', type: 'Lab' },
      ]
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '10:00-11:00', course: 'Algorithms', room: 'CS-205', type: 'Lecture' },
        { time: '3:00-4:00', course: 'Research Meeting', room: 'CS-401', type: 'Meeting' },
      ]
    },
    {
      day: 'Thursday',
      classes: [
        { time: '11:00-12:00', course: 'Department Meeting', room: 'CS-100', type: 'Meeting' },
      ]
    },
    {
      day: 'Friday',
      classes: [
        { time: '9:00-10:00', course: 'Data Structures', room: 'CS-202', type: 'Lecture' },
        { time: '2:00-3:00', course: 'Office Hours', room: 'CS-301', type: 'Office' },
      ]
    },
  ];

  const availabilityData = {
    'Monday': ['3:00-4:00', '4:00-5:00'],
    'Wednesday': ['1:00-2:00'],
    'Friday': ['3:00-4:00'],
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    Animated.spring(slideAnim, {
      toValue: editing ? 0 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="My Schedule" 
        onBack={() => navigation.goBack()} 
        rightIcon={editing ? 'check' : 'pencil'}
        onRightPress={handleEditToggle}
      />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            { 
              backgroundColor: activeTab === 'schedule' 
                ? theme.colors.primary 
                : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setActiveTab('schedule')}
        >
          <MaterialCommunityIcons 
            name="calendar" 
            size={20} 
            color={activeTab === 'schedule' ? theme.colors.onPrimary : theme.colors.primary} 
          />
          <Text 
            style={[
              styles.tabText,
              { 
                color: activeTab === 'schedule' 
                  ? theme.colors.onPrimary 
                  : theme.colors.primary,
              }
            ]}
          >
            Schedule
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            { 
              backgroundColor: activeTab === 'availability' 
                ? theme.colors.primary 
                : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setActiveTab('availability')}
        >
          <MaterialCommunityIcons 
            name="clock" 
            size={20} 
            color={activeTab === 'availability' ? theme.colors.onPrimary : theme.colors.primary} 
          />
          <Text 
            style={[
              styles.tabText,
              { 
                color: activeTab === 'availability' 
                  ? theme.colors.onPrimary 
                  : theme.colors.primary,
              }
            ]}
          >
            Availability
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[
          styles.content,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -50]
              })
            }]
          }
        ]}
      >
        {activeTab === 'schedule' ? (
          <PersonalSchedule 
            scheduleData={scheduleData} 
            editable={editing}
            onClassPress={(classInfo) => navigation.navigate('ClassDetails', { classInfo })}
          />
        ) : (
          <AvailabilityManager 
            initialAvailability={availabilityData}
            onSave={(availability) => console.log('Saved availability:', availability)}
            editable={editing}
          />
        )}
      </Animated.View>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
            Loading schedule...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
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

export default ScheduleScreen;