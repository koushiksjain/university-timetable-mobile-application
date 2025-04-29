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

// Define days and default schedule here
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);

const defaultSchedule = days.map(day => ({
  day,
  classes: timeSlots.map(() => ({ course: "Free" }))
}));
const Dashboard = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const upcomingClasses = [
    { id: '1', course: 'Data Structures', time: '10:00 AM', room: 'CS-202', type: 'Lecture' },
    { id: '2', course: 'Algorithms', time: '2:00 PM', room: 'CS-205', type: 'Lab' },
  ];

  const announcements = [
    { id: '1', title: 'Department Meeting', content: 'Monthly faculty meeting on Friday', time: '2 hours ago' },
    { id: '2', title: 'Grade Submission', content: 'Midterm grades due by end of week', time: '1 day ago' },
  ];

  const stats = {
    classes: 5,
    students: 142,
    officeHours: 8,
  };

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
        title="Faculty Dashboard" 
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
                  Dr. Smith
                </Text>
                <Text style={[styles.departmentText, { color: theme.colors.placeholder }]}>
                  Computer Science Department
                </Text>
              </View>
              <MaterialCommunityIcons 
                name="teach" 
                size={40} 
                color={theme.colors.primary} 
              />
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.classes}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.primary }]}>Classes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.students}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.primary }]}>Students</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.officeHours}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.primary }]}>Hours/Week</Text>
              </View>
            </View>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Button 
              title="Schedule" 
              onPress={() => navigation.navigate('Schedule')} 
              icon="calendar" 
              style={styles.quickAction} 
              type="outline"
            />
            <Button 
              title="ClassDetails" 
              onPress={() => navigation.navigate('ClassDetails')} 
              icon="clock" 
              style={styles.quickAction} 
              type="outline"
            />
            <Button 
              title="Students" 
              onPress={() => navigation.navigate('StudentList')} 
              icon="account-group" 
              style={styles.quickAction} 
              type="outline"
            />
          </View>

          {/* Today's Classes */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Today's Schedule
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <PersonalSchedule schedule={defaultSchedule} // Or your actual schedule data
compact 
/>

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

          {/* Quick Grading */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Pending Grading
            </Text>
          </View>
          <Card style={styles.gradingCard}>
            <View style={styles.gradingItem}>
              <MaterialCommunityIcons 
                name="file-document" 
                size={24} 
                color={theme.colors.primary} 
              />
              <View style={styles.gradingInfo}>
                <Text style={[styles.gradingTitle, { color: theme.colors.primary }]}>
                  Data Structures - Assignment 3
                </Text>
                <Text style={[styles.gradingDue, { color: theme.colors.placeholder }]}>
                  Due: Today, 5:00 PM
                </Text>
              </View>
              <Button 
                title="Grade" 
                onPress={() => navigation.navigate('Grading')} 
                style={styles.gradeButton} 
                compact
              />
            </View>
          </Card>
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
  departmentText: {
    fontSize: 14,
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickAction: {
    paddingVertical: 8,
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
  gradingCard: {
    padding: 16,
  },
  gradingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradingInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  gradingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  gradingDue: {
    fontSize: 12,
  },
  gradeButton: {
    width: 80,
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