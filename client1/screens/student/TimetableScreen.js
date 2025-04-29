import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import TimetableDisplay from '../../components/student/TimetableDisplay';
import Loader from '../../components/common/Loader';

const { width } = Dimensions.get('window');

const TimetableScreen = ({ navigation }) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState('week');
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const timetableData = [
    {
      day: 'Monday',
      classes: [
        { time: '8:00-9:00', course: 'Data Structures', teacher: 'Dr. Smith', room: 'CS-202' },
        { time: '10:00-11:00', course: 'Algorithms', teacher: 'Prof. Johnson', room: 'CS-205' },
        { time: '2:00-3:00', course: 'Database Systems', teacher: 'Dr. Lee', room: 'CS-210' },
      ]
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '9:00-10:00', course: 'Operating Systems', teacher: 'Dr. Brown', room: 'CS-215' },
        { time: '1:00-2:00', course: 'Computer Networks', teacher: 'Prof. Wilson', room: 'CS-201' },
      ]
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '10:00-11:00', course: 'Algorithms', teacher: 'Prof. Johnson', room: 'CS-205' },
        { time: '3:00-4:00', course: 'Software Engineering', teacher: 'Dr. Garcia', room: 'CS-220' },
      ]
    },
    {
      day: 'Thursday',
      classes: [
        { time: '11:00-12:00', course: 'AI Fundamentals', teacher: 'Dr. Chen', room: 'CS-230' },
      ]
    },
    {
      day: 'Friday',
      classes: [
        { time: '9:00-10:00', course: 'Web Development', teacher: 'Prof. Davis', room: 'CS-240' },
        { time: '2:00-3:00', course: 'Data Structures Lab', teacher: 'Dr. Smith', room: 'CS-202' },
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

  const handleClassSelect = (classInfo) => {
    setSelectedClass(classInfo);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeClassDetails = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedClass(null));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="My Timetable" 
        onBack={() => navigation.goBack()} 
        rightIcon="refresh"
        onRightPress={handleRefresh}
      />

      <TimetableDisplay 
        timetableData={timetableData} 
        viewMode={viewMode}
        onClassSelect={handleClassSelect}
      />

      {selectedClass && (
        <Animated.View style={[styles.classDetails, { transform: [{ translateX: slideAnim }] }]}>
          <Card style={styles.detailsCard}>
            <TouchableOpacity 
              onPress={closeClassDetails} 
              style={styles.closeButton}
            >
              <MaterialCommunityIcons 
                name="close" 
                size={24} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>

            <Text style={[styles.classTitle, { color: theme.colors.primary }]}>
              {selectedClass.course}
            </Text>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="clock" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.detailText, { color: theme.colors.primary }]}>
                {selectedClass.time}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="teach" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.detailText, { color: theme.colors.primary }]}>
                {selectedClass.teacher}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.detailText, { color: theme.colors.primary }]}>
                {selectedClass.room}
              </Text>
            </View>

            <Button 
              title="View Materials" 
              onPress={() => navigation.navigate('ClassMaterials', { class: selectedClass })} 
              style={styles.actionButton}
              icon="book"
            />
            <Button 
              title="Set Reminder" 
              onPress={() => navigation.navigate('SetReminder', { class: selectedClass })} 
              style={styles.actionButton}
              type="outline"
              icon="bell"
            />
          </Card>
        </Animated.View>
      )}

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
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
  viewToggle: {
    flexDirection: 'row',
    margin: 16,
    marginBottom: 8,
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  classDetails: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  detailsCard: {
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
  },
  actionButton: {
    marginTop: 8,
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

export default TimetableScreen;