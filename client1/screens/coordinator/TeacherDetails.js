import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

const TeacherDetails = ({ navigation, route }) => {
  const theme = useTheme();
  const { teacher } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Teacher Details" 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <MaterialCommunityIcons 
              name="account" 
              size={48} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.teacherName, { color: theme.colors.text }]}>
              {teacher.name}
            </Text>
            <Text style={[styles.teacherEmail, { color: theme.colors.placeholder }]}>
              {teacher.email}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons 
              name="office-building" 
              size={20} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              Department: {teacher.department || 'Not specified'}
            </Text>
          </View>

          {teacher.courses && teacher.courses.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                Assigned Courses
              </Text>
              {teacher.courses.map((course, index) => (
                <View key={index} style={styles.courseItem}>
                  <MaterialCommunityIcons 
                    name="book" 
                    size={16} 
                    color={theme.colors.primary} 
                  />
                  <Text style={[styles.courseText, { color: theme.colors.text }]}>
                    {course}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {teacher.preferences && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                Teaching Preferences
              </Text>
              <View style={styles.preferenceItem}>
                <MaterialCommunityIcons 
                  name="calendar" 
                  size={16} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.preferenceText, { color: theme.colors.text }]}>
                  Preferred Days: {teacher.preferences.preferredDays.join(', ')}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <MaterialCommunityIcons 
                  name="clock" 
                  size={16} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.preferenceText, { color: theme.colors.text }]}>
                  Preferred Times: {teacher.preferences.preferredTimes.join(', ')}
                </Text>
              </View>
              {teacher.preferences.constraints && (
                <View style={styles.preferenceItem}>
                  <MaterialCommunityIcons 
                    name="alert" 
                    size={16} 
                    color={theme.colors.primary} 
                  />
                  <Text style={[styles.preferenceText, { color: theme.colors.text }]}>
                    Constraints: {teacher.preferences.constraints}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card>

        <Button 
          title="Edit Preferences" 
          onPress={() => navigation.navigate('Preferences', { teacher })} 
          style={styles.actionButton}
          icon="pencil"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  profileCard: {
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  teacherName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  teacherEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  section: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
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
    fontSize: 14,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  preferenceText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  actionButton: {
    marginTop: 8,
  },
});

export default TeacherDetails;