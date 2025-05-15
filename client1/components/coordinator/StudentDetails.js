import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';


const StudentDetails = ({ navigation, route }) => {
  const theme = useTheme();
  const { student } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <MaterialCommunityIcons 
            name="account" 
            size={48} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.studentName, { color: theme.colors.text }]}>
            {student.name}
          </Text>
          <Text style={[styles.studentRollNo, { color: theme.colors.primary }]}>
            {student.rollNo}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialCommunityIcons 
            name="calendar" 
            size={20} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            Semester: {student.semester.toUpperCase()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialCommunityIcons 
            name="office-building" 
            size={20} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            Department: Computer Science
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Current Courses
          </Text>
          <View style={styles.courseItem}>
            <MaterialCommunityIcons 
              name="book" 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.courseText, { color: theme.colors.text }]}>
              Data Structures
            </Text>
          </View>
          <View style={styles.courseItem}>
            <MaterialCommunityIcons 
              name="book" 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.courseText, { color: theme.colors.text }]}>
              Algorithms
            </Text>
          </View>
        </View>

        <Button 
          title="View Timetable" 
          onPress={() => navigation.navigate('StudentTimetable', { student })} 
          style={styles.actionButton}
          icon="timetable"
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  studentRollNo: {
    fontSize: 16,
    marginTop: 4,
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
  section: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseText: {
    marginLeft: 8,
    fontSize: 16,
  },
  actionButton: {
    marginTop: 16,
  },
});

export default StudentDetails;