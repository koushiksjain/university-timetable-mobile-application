import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const StudentList = ({ navigation }) => {
  const theme = useTheme();
  
  // Mock student data
  const students = [
    { id: '1', name: 'Alex Johnson', rollNo: 'CS2021001' },
    { id: '2', name: 'Sam Wilson', rollNo: 'CS2021002' },
    { id: '3', name: 'Taylor Swift', rollNo: 'CS2021003' },
    { id: '4', name: 'John Doe', rollNo: 'CS2021004' },
  ];

  const renderStudent = ({ item }) => (
    <Card style={styles.studentCard}>
      <Text style={[styles.studentName, { color: theme.colors.primary }]}>
        {item.name}
      </Text>
      <Text style={[styles.rollNo, { color: theme.colors.placeholder }]}>
        {item.rollNo}
      </Text>
      <Button 
        title="Take Attendance" 
        onPress={() => navigation.navigate('Attendance', { studentId: item.id })}
        type="outline"
        style={styles.profileButton}
      />
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  studentCard: {
    marginBottom: 12,
    padding: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rollNo: {
    fontSize: 14,
    marginBottom: 8,
  },
  profileButton: {
    marginTop: 8,
  },
});

export default StudentList;