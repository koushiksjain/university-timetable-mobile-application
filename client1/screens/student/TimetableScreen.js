import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Header from '../../components/common/Header';
import TimetableDisplay from '../../components/student/TimetableDisplay';
import Loader from '../../components/common/Loader';

const { width } = Dimensions.get('window');

const TimetableScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const timetableData = [
    {
      day: 'Monday',
      classes: [
        { time: '08:00 - 09:00', course: 'Data Structures', teacher: 'Dr. Smith', room: 'CS-202' },
        { time: '09:00 - 10:00', course: 'Free' },
        { time: '10:00 - 11:00', course: 'Algorithms', teacher: 'Prof. Johnson', room: 'CS-205' },
        { time: '11:00 - 12:00', course: 'Free' },
        { time: '12:00 - 13:00', course: 'Free' },
        { time: '13:00 - 14:00', course: 'Free' },
        { time: '14:00 - 15:00', course: 'Database Systems', teacher: 'Dr. Lee', room: 'CS-210' },
        { time: '15:00 - 16:00', course: 'Free' },
        { time: '16:00 - 17:00', course: 'Free' },
        { time: '17:00 - 18:00', course: 'Free' },
      ]
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '08:00 - 09:00', course: 'Free' },
        { time: '09:00 - 10:00', course: 'Operating Systems', teacher: 'Dr. Brown', room: 'CS-215' },
        { time: '10:00 - 11:00', course: 'Free' },
        { time: '11:00 - 12:00', course: 'Free' },
        { time: '12:00 - 13:00', course: 'Free' },
        { time: '13:00 - 14:00', course: 'Computer Networks', teacher: 'Prof. Wilson', room: 'CS-201' },
        { time: '14:00 - 15:00', course: 'Free' },
        { time: '15:00 - 16:00', course: 'Free' },
        { time: '16:00 - 17:00', course: 'Free' },
        { time: '17:00 - 18:00', course: 'Free' },
      ]
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '08:00 - 09:00', course: 'Free' },
        { time: '09:00 - 10:00', course: 'Free' },
        { time: '10:00 - 11:00', course: 'Algorithms', teacher: 'Prof. Johnson', room: 'CS-205' },
        { time: '11:00 - 12:00', course: 'Free' },
        { time: '12:00 - 13:00', course: 'Free' },
        { time: '13:00 - 14:00', course: 'Free' },
        { time: '14:00 - 15:00', course: 'Software Engineering', teacher: 'Dr. Garcia', room: 'CS-220' },
        { time: '15:00 - 16:00', course: 'Free' },
        { time: '16:00 - 17:00', course: 'Free' },
        { time: '17:00 - 18:00', course: 'Free' },
      ]
    },
    {
      day: 'Thursday',
      classes: [
        { time: '08:00 - 09:00', course: 'Free' },
        { time: '09:00 - 10:00', course: 'Free' },
        { time: '10:00 - 11:00', course: 'Free' },
        { time: '11:00 - 12:00', course: 'AI Fundamentals', teacher: 'Dr. Chen', room: 'CS-230' },
        { time: '12:00 - 13:00', course: 'Free' },
        { time: '13:00 - 14:00', course: 'Free' },
        { time: '14:00 - 15:00', course: 'Free' },
        { time: '15:00 - 16:00', course: 'Free' },
        { time: '16:00 - 17:00', course: 'Free' },
        { time: '17:00 - 18:00', course: 'Free' },
      ]
    },
    {
      day: 'Friday',
      classes: [
        { time: '08:00 - 09:00', course: 'Free' },
        { time: '09:00 - 10:00', course: 'Web Development', teacher: 'Prof. Davis', room: 'CS-240' },
        { time: '10:00 - 11:00', course: 'Free' },
        { time: '11:00 - 12:00', course: 'Free' },
        { time: '12:00 - 13:00', course: 'Free' },
        { time: '13:00 - 14:00', course: 'Free' },
        { time: '14:00 - 15:00', course: 'Data Structures Lab', teacher: 'Dr. Smith', room: 'CS-202' },
        { time: '15:00 - 16:00', course: 'Free' },
        { time: '16:00 - 17:00', course: 'Free' },
        { time: '17:00 - 18:00', course: 'Free' },
      ]
    },
    {
      day: 'Saturday',
      classes: [
        { time: '08:00 - 09:00', course: 'Free' },
        { time: '09:00 - 10:00', course: 'Free' },
        { time: '10:00 - 11:00', course: 'Free' },
        { time: '11:00 - 12:00', course: 'Free' },
        { time: '12:00 - 13:00', course: 'Free' },
        { time: '13:00 - 14:00', course: 'Free' },
        { time: '14:00 - 15:00', course: 'Free' },
        { time: '15:00 - 16:00', course: 'Free' },
        { time: '16:00 - 17:00', course: 'Free' },
        { time: '17:00 - 18:00', course: 'Free' },
      ]
    },
    {
      day: 'Sunday',
      classes: [
        { time: '08:00 - 09:00', course: 'Free' },
        { time: '09:00 - 10:00', course: 'Free' },
        { time: '10:00 - 11:00', course: 'Free' },
        { time: '11:00 - 12:00', course: 'Linear Algebra', teacher: 'Prof. Williams', room: 'MA-101' },
        { time: '12:00 - 13:00', course: 'Free' },
        { time: '13:00 - 14:00', course: 'Calculus I', teacher: 'Dr. Jones', room: 'MA-102' },
        { time: '14:00 - 15:00', course: 'Free' },
        { time: '15:00 - 16:00', course: 'Free' },
        { time: '16:00 - 17:00', course: 'Free' },
        { time: '17:00 - 18:00', course: 'Free' },
      ]
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      <Header
        title="My Timetable"
        onBack={() => navigation.goBack()}
        rightIcon="refresh"
        onRightPress={handleRefresh}
        style={styles.header}
      />

      <TimetableDisplay
        timetableData={timetableData}
      />

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={styles.loadingText}>
            Updating timetable...
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
  header: {
    borderBottomWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    transform: [{ translateY: -4 }],
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
  },
});

export default TimetableScreen;