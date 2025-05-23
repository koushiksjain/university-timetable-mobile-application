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
    <View style={[styles.container, {}]}>
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
    padding: 24,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingBottom: 24,
  },
  studentCard: {
    marginBottom: 16,
    padding: 24,
    // borderWidth: 3,
    // borderColor: '#000000',
    // borderRadius: 0,
    backgroundColor: '#FFFFFF',
    // transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  studentName: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
    color: '#000000',
  },
  rollNo: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 16,
    color: '#000000',
  },
  profileButton: {
    marginTop: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 16,
  },
});

export default StudentList;