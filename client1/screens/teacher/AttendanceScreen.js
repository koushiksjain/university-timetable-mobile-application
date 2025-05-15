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
    <View style={[styles.container, { }]}>
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
                style={styles.checkbox}
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
    padding: 24,
    backgroundColor: '#F5F5F5',
  },
  headerCard: {
    marginBottom: 24,
    padding: 24,
    // borderWidth: 3,
    // borderColor: '#000000',
    // borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  date: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
    color: '#000000',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  studentCard: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  checkbox: {
    marginLeft: 10,
  },
  submitButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 20,
  },
});

export default AttendanceScreen;