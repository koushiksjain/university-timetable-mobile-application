import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import ClassSchedule from '../../components/student/ClassSchedule';
import Loader from '../../components/common/Loader';

const Dashboard = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const upcomingClasses = [
    { id: '1', course: 'Data Structures', time: '10:00 AM', room: 'CS-202', teacher: 'Dr. Smith' },
    { id: '2', course: 'Algorithms', time: '2:00 PM', room: 'CS-205', teacher: 'Prof. Johnson' },
  ];

  const announcements = [
    { id: '1', title: 'Midterm Schedule', content: 'Midterm exams will be held next week', time: '2 hours ago' },
    { id: '2', title: 'Assignment Deadline', content: 'Assignment 2 submission extended to Friday', time: '1 day ago' },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Student Dashboard" 
        rightIcon="refresh"
        onRightPress={handleRefresh}
      />

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Welcome Card */}
          <Card style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <View>
                <Text style={[styles.welcomeText, { color: theme.colors.primary }]}>
                  Welcome back,
                </Text>
                <Text style={[styles.nameText, { color: theme.colors.primary }]}>
                  Alex Johnson
                </Text>
              </View>
              <MaterialCommunityIcons 
                name="school" 
                size={40} 
                color={theme.colors.primary} 
              />
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>5</Text>
                <Text style={[styles.statLabel, { color: theme.colors.primary }]}>Courses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>2</Text>
                <Text style={[styles.statLabel, { color: theme.colors.primary }]}>Upcoming</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>3.8</Text>
                <Text style={[styles.statLabel, { color: theme.colors.primary }]}>GPA</Text>
              </View>
            </View>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {/* <Text style={[styles.statLabel, { color: theme.colors.primary}]}> Hello </Text> */}
            <Button 
              title="Timetable" 
              onPress={() => navigation.navigate('Timetable')} 
              icon="calendar" 
              style={styles.quickAction} 
              type="outline"
            />
            <Button 
              title="Teachers" 
              onPress={() => navigation.navigate('FreeTeachers')} 
              icon="teach" 
              style={styles.quickAction} 
              type="outline"
            />
          </View>

          {/* Today's Classes */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Today's Schedule
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Timetable')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ClassSchedule scheduleData={upcomingClasses} />

          {/* Announcements */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Announcements
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          {announcements.map(announcement => (
            <Card key={announcement.id} style={styles.announcementCard}>
              <Text style={[styles.announcementTitle, { color: theme.colors.primary }]}>
                {announcement.title}
              </Text>
              <Text style={[styles.announcementContent, { color: theme.colors.primary }]}>
                {announcement.content}
              </Text>
              <Text style={[styles.announcementTime, { color: theme.colors.placeholder }]}>
                {announcement.time}
              </Text>
            </Card>
          ))}
        </ScrollView>
      </Animated.View>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
            Refreshing data...
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeCard: {
    padding: 20,
    marginBottom: 16,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickAction: {
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  announcementCard: {
    marginBottom: 12,
    padding: 16,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  announcementContent: {
    fontSize: 14,
    marginBottom: 4,
  },
  announcementTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
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

export default Dashboard;