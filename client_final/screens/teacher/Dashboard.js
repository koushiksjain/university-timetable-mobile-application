import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Sample timetable data for today
  const todayTimetable = [
    { time: '8:00', subject: 'Math', room: 'B-201', section: 'CS-A' },
    { time: '9:00', subject: 'Physics', room: 'Lab-3', section: 'CS-A' },
    { time: '10:00', subject: 'Break', room: '', section: '' },
    { time: '11:00', subject: 'Algorithms', room: 'B-205', section: 'CS-A' },
    { time: '12:00', subject: 'Lunch', room: '', section: '' },
    { time: '1:00', subject: 'Data Structures', room: 'B-203', section: 'CS-A' },
    { time: '2:00', subject: 'Database', room: 'Lab-2', section: 'CS-A' },
    { time: '3:00', subject: 'Free', room: '', section: '' },
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
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const renderTimetableItem = (item, index) => {
    const isBreak = item.subject === 'Break' || item.subject === 'Lunch';
    const isFree = item.subject === 'Free';
    
    return (
      <View 
        key={index} 
        style={[
          styles.timetableItem,
          isBreak && styles.breakItem,
          isFree && styles.freeItem,
          { borderColor: theme.colors.border }
        ]}
      >
        <Text style={[styles.timeText, { color: theme.colors.primary }]}>
          {item.time}
        </Text>
        {!isBreak && !isFree ? (
          <>
            <Text style={[styles.subjectText, { color: theme.colors.primary }]}>
              {item.subject}
            </Text>
            <Text style={[styles.detailText, { color: theme.colors.placeholder }]}>
              {item.room} • {item.section}
            </Text>
          </>
        ) : (
          <Text style={[styles.subjectText, { color: theme.colors.primary }]}>
            {item.subject}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Dashboard" 
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
                  Prof Vani.Z
                </Text>
                <Text style={[styles.departmentText, { color: theme.colors.placeholder }]}>
                  AIML Department
                </Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.classes}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.primary }]}>Classes</Text>
              </View>
              {/* <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.students}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.primary }]}>Students</Text>
              </View> */}
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>7</Text>
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
            {/* <Button 
              title="ClassDetails" 
              onPress={() => navigation.navigate('ClassDetails')} 
              style={styles.quickAction} 
              type="outline"
            /> */}
            {/* <Button 
              title="Students" 
              onPress={() => navigation.navigate('StudentList')} 
              style={styles.quickAction} 
              type="outline"
            /> */}
          </View>

          {/* Today's Classes - Timetable */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Today's Schedule
            </Text>
            {/* <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity> */}
          </View>
          
          <Card style={styles.timetableCard}>
            {todayTimetable.map((item, index) => renderTimetableItem(item, index))}
          </Card>

          {/* Announcements */}
          {/* <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Announcements
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View> */}
          {/* {announcements.map(announcement => (
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
          ))} */}

          {/* Quick Grading */}
          {/* <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Pending Grading
            </Text>
          </View> */}
          {/* <Card style={styles.gradingCard}>
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
          </Card> */}
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
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 8,
    paddingBottom: 32,
  },
  welcomeCard: {
    padding: 24,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000000',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  departmentText: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000000',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000000',
  },
  quickActions: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
  quickAction: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  seeAll: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000000',
  },
  timetableCard: {
    padding: 0,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    overflow: 'hidden',
  },
  timetableItem: {
    padding: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  breakItem: {
    backgroundColor: '#FFFACD',
  },
  freeItem: {
    backgroundColor: '#F5F5F5',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 4,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  detailText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000000',
    marginTop: 4,
  },
  announcementCard: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  announcementTitle: {
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 12,
    color: '#000000',
  },
  announcementContent: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000000',
  },
  announcementTime: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    alignSelf: 'flex-end',
    color: '#000000',
  },
  gradingCard: {
    padding: 20,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  gradingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'white',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  gradingInfo: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
  },
  gradingTitle: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  gradingDue: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000000',
  },
  gradeButton: {
    padding: 0,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245,245,245,0.9)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
});

export default Dashboard;