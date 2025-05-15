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
        <Text style={styles.classTitle}>
          {classInfo.course}
        </Text>
        <Text style={styles.classType}>
          {classInfo.type || 'Lecture'}
        </Text>
      </Card>

      <Card style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="clock" 
              size={24} 
              color="#000000" 
            />
          </View>
          <Text style={styles.detailText}>
            {classInfo.time}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="map-marker" 
              size={24} 
              color="#000000" 
            />
          </View>
          <Text style={styles.detailText}>
            {classInfo.room}
          </Text>
        </View>

        {classInfo.teacher && (
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="teach" 
                size={24} 
                color="#000000" 
              />
            </View>
            <Text style={styles.detailText}>
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
          textStyle={styles.buttonText}
        />
        <Button 
          title="Set Reminder" 
          onPress={() => navigation.navigate('SetReminder', { classInfo })}
          icon="bell"
          style={[styles.actionButton, styles.outlineButton]}
          textStyle={styles.buttonText}
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
    backgroundColor: '#F5F5F5',
  },
  headerCard: {
    marginBottom: 24,
    alignItems: 'center',
    padding: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -4 }, { translateY: -4 }],
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  classTitle: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    color: '#000000',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  classType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    textTransform: 'uppercase',
  },
  detailsCard: {
    marginBottom: 24,
    padding: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
  },
  detailText: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    color: '#000000',
    textTransform: 'uppercase',
  },
  actionsCard: {
    padding: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -4 }, { translateY: -4 }],
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
  outlineButton: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
  },
});

export default ClassDetails;