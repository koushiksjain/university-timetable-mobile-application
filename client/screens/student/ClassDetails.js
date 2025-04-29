import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ClassDetails = ({ route, navigation }) => {
  const theme = useTheme();
  const { classInfo } = route.params;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.headerCard}>
        <Text style={[styles.classTitle, { color: theme.colors.primary }]}>
          {classInfo.course}
        </Text>
        <Text style={[styles.classType, { color: theme.colors.placeholder }]}>
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

        {classInfo.teacher && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons 
              name="teach" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              {classInfo.teacher}
            </Text>
          </View>
        )}
      </Card>

      <Card style={styles.actionsCard}>
        <Button 
          title="View Materials" 
          onPress={() => navigation.navigate('ClassMaterials', { classInfo })}
          icon="book"
          style={styles.actionButton}
        />
        <Button 
          title="Set Reminder" 
          onPress={() => navigation.navigate('SetReminder', { classInfo })}
          icon="bell"
          style={styles.actionButton}
          type="outline"
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    alignItems: 'center',
    padding: 20,
  },
  classTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  classType: {
    fontSize: 16,
  },
  detailsCard: {
    marginBottom: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 18,
    marginLeft: 12,
  },
  actionsCard: {
    padding: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
});

export default ClassDetails;