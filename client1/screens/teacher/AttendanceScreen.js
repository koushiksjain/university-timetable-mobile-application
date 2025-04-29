import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Checkbox from '../../components/common/Checkbox';

const AttendanceScreen = () => {
  const theme = useTheme();
  const [attendance, setAttendance] = useState({});

  // Mock student data
  const students = [
    { id: '1', name: 'Alex Johnson' },
    { id: '2', name: 'Sam Wilson' },
    { id: '3', name: 'Taylor Swift' },
    { id: '4', name: 'John Doe' },
  ];

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const submitAttendance = () => {
    // Submit logic would go here
    alert('Attendance submitted successfully!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.headerCard}>
        <Text style={[styles.title, { color: theme.colorsprimary }]}>
          Today's Attendance
        </Text>
        <Text style={[styles.date, { color: theme.colors.placeholder }]}>
          {new Date().toLocaleDateString()}
        </Text>
      </Card>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {students.map(student => (
          <Card key={student.id} style={styles.studentCard}>
            <View style={styles.studentRow}>
              <Text style={[styles.studentName, { color: theme.colorsprimary }]}>
                {student.name}
              </Text>
              <Checkbox
                value={!!attendance[student.id]}
                onValueChange={() => toggleAttendance(student.id)}
                label={attendance[student.id] ? 'Present' : 'Absent'}
              />
            </View>
          </Card>
        ))}
      </ScrollView>

      <Button 
        title="Submit Attendance" 
        onPress={submitAttendance} 
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  studentCard: {
    marginBottom: 8,
    padding: 12,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
  },
  submitButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
});

export default AttendanceScreen;