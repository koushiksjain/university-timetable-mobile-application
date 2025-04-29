import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../common/Card';
import Button from '../common/Button';

const { width } = Dimensions.get('window');
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ClassSchedule = ({ scheduleData }) => {
  const theme = useTheme();
  const [currentDay, setCurrentDay] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const classes = scheduleData?.find(day => day.name === days[currentDay])?.classes || [];

  const handleDayChange = (newIndex) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: newIndex > currentDay ? -width : width,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentDay(newIndex);
      slideAnim.setValue(newIndex > currentDay ? width : -width);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.daySelector}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={day}
            onPress={() => handleDayChange(index)}
            style={[
              styles.dayButton,
              {
                backgroundColor: currentDay === index ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
          >
            <Text
              style={[
                styles.dayText,
                {
                  color: currentDay === index ? theme.colors.onPrimary : theme.colors.text,
                }
              ]}
            >
              {day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View
        style={[
          styles.scheduleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }
        ]}
      >
        {classes.length > 0 ? (
          classes.map((classItem, index) => (
            <Card key={index} style={[styles.classCard, { borderLeftColor: getRandomColor() }]}>
              <View style={styles.classTime}>
                <MaterialCommunityIcons 
                  name="clock-outline" 
                  size={20} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.timeText, { color: theme.colors.text }]}>
                  {classItem.time}
                </Text>
              </View>
              <Text style={[styles.className, { color: theme.colors.text }]}>
                {classItem.course}
              </Text>
              <View style={styles.classDetails}>
                <Text style={[styles.detailText, { color: theme.colors.placeholder }]}>
                  {classItem.teacher}
                </Text>
                <Text style={[styles.detailText, { color: theme.colors.placeholder }]}>
                  Room: {classItem.room}
                </Text>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <MaterialCommunityIcons 
              name="emoticon-sad-outline" 
              size={48} 
              color={theme.colors.placeholder} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No classes scheduled for {days[currentDay]}
            </Text>
            <Button 
              title="View Full Timetable" 
              onPress={() => {}} 
              type="outline" 
              style={styles.emptyButton} 
            />
          </Card>
        )}
      </Animated.View>
    </View>
  );
};

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#A28DFF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 50,
  },
  dayText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  scheduleContainer: {
    flex: 1,
  },
  classCard: {
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 6,
  },
  classTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  emptyButton: {
    width: '100%',
  },
});

export default ClassSchedule;