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

// ... keep existing imports and component logic ...

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 32,
    backgroundColor: '#F5F5F5',
  },
  headerCard: {
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  classTitle: {
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#000000',
  },
  classType: {
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 12,
    textAlign: 'center',
    color: '#000000',
  },
  detailsCard: {
    padding: 24,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#F5F5F5',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  detailText: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginLeft: 16,
    color: '#000000',
  },
  actionsCard: {
    padding: 24,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  actionButton: {
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 16,
  },
  notesCard: {
    padding: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 16,
    color: '#000000',
  },
  notesText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 20,
    color: '#000000',
  },
  addNotesButton: {
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 16,
    alignItems: 'center',
  },
  addNotesText: {
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  errorText: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 32,
    color: '#000000',
  },
});

export default ClassDetails;