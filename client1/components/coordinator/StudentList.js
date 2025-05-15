import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';

const StudentList = ({ students, onStudentPress }) => {
  const theme = useTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onStudentPress(item)}>
      <Card style={styles.studentCard}>
        <MaterialCommunityIcons 
          name="account" 
          size={24} 
          color={theme.colors.primary} 
          style={styles.studentIcon}
        />
        <View style={styles.studentInfo}>
          <Text style={[styles.studentName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.studentDetails, { color: theme.colors.placeholder }]}>
            {item.rollNo} • {item.semester.toUpperCase()} Semester
          </Text>
        </View>
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={24} 
          color={theme.colors.placeholder} 
        />
      </Card>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={students}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  studentIcon: {
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  studentDetails: {
    fontSize: 12,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default StudentList;