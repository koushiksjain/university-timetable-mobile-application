import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ClassDetails = ({ navigation, route }) => {
  const theme = useTheme();
  const { classInfo } = route.params || {};
  
  if (!classInfo) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          No class information provided
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.headerCard}>
        <Text style={[styles.classTitle, { color: theme.colors.text }]}>
          {classInfo.course}
        </Text>
        <Text style={[styles.classType, { color: theme.colors.primary }]}>
          {classInfo.type || 'Lecture'}
        </Text>
      </Card>

      <Card style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons 
            name="clock" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {classInfo.time}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialCommunityIcons 
            name="map-marker" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {classInfo.room}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialCommunityIcons 
            name="calendar" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {classInfo.day}
          </Text>
        </View>
      </Card>

      <Card style={styles.actionsCard}>
        <Button 
          title="Take Attendance" 
          onPress={() => navigation.navigate('Attendance', { classInfo })} 
          icon="account-check" 
          style={styles.actionButton}
        />
        <Button 
          title="View Students" 
          onPress={() => navigation.navigate('StudentList', { classInfo })} 
          icon="account-group" 
          style={styles.actionButton}
          type="outline"
        />
        <Button 
          title="Upload Materials" 
          onPress={() => navigation.navigate('UploadMaterials', { classInfo })} 
          icon="upload" 
          style={styles.actionButton}
          type="outline"
        />
      </Card>

      <Card style={styles.notesCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Class Notes
        </Text>
        <Text style={[styles.notesText, { color: theme.colors.text }]}>
          {classInfo.notes || 'No notes available for this class.'}
        </Text>
        <TouchableOpacity 
          style={[styles.addNotesButton, { borderColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('AddNotes', { classInfo })}
        >
          <Text style={[styles.addNotesText, { color: theme.colors.primary }]}>
            {classInfo.notes ? 'Edit Notes' : 'Add Notes'}
          </Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  classTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  classType: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  detailsCard: {
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 12,
  },
  actionsCard: {
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  notesCard: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  addNotesButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addNotesText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default ClassDetails;