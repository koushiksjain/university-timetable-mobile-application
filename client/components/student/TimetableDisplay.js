import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../common/Card';
import Button from '../common/Button';

const { width } = Dimensions.get('window');
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = Array.from({ length: 10 }, (_, i) => `${8 + i}:00 - ${9 + i}:00`);

const TimetableDisplay = ({ timetableData }) => {
  const theme = useTheme();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentView, setCurrentView] = useState('week');
  const [selectedClass, setSelectedClass] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleZoomIn = () => {
    if (zoomLevel < 1.5) {
      setZoomLevel(zoomLevel + 0.1);
      Animated.spring(scaleAnim, {
        toValue: zoomLevel + 0.1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.8) {
      setZoomLevel(zoomLevel - 0.1);
      Animated.spring(scaleAnim, {
        toValue: zoomLevel - 0.1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleClassSelect = (classInfo) => {
    setSelectedClass(classInfo);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeClassDetails = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedClass(null));
  };

  const renderTimetable = () => {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.timetableContainer}>
            {/* Header row with days */}
            <View style={styles.headerRow}>
              <View style={[styles.timeHeader, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>Time/Day</Text>
              </View>
              {days.map(day => (
                <View 
                  key={day} 
                  style={[
                    styles.dayHeader, 
                    { backgroundColor: theme.colors.primary }
                  ]}
                >
                  <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Time slots */}
            {timeSlots.map((time, timeIndex) => (
              <View key={time} style={styles.timeRow}>
                <View style={[styles.timeLabel, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.timeText, { color: theme.colors.primary }]}>{time}</Text>
                </View>

                {days.map(day => {
                  const daySchedule = timetableData?.find(d => d.day === day);
                  const classInfo = daySchedule?.classes[timeIndex];
                  const isEmpty = !classInfo || classInfo.course === 'Free';

                  return (
                    <TouchableOpacity
                      key={`${day}-${time}`}
                      onPress={() => !isEmpty && handleClassSelect(classInfo)}
                      style={[
                        styles.classCell,
                        { 
                          backgroundColor: isEmpty ? theme.colors.surface : getRandomColor(),
                          borderColor: theme.colors.border,
                        }
                      ]}
                    >
                      {!isEmpty && (
                        <>
                          <Text 
                            style={[
                              styles.classText,
                              { color: theme.colors.onPrimary }
                            ]}
                            numberOfLines={2}
                          >
                            {classInfo.course}
                          </Text>
                          <Text 
                            style={[
                              styles.teacherText,
                              { color: theme.colors.onPrimary }
                            ]}
                            numberOfLines={1}
                          >
                            {classInfo.teacher}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={styles.viewToggle}>
          <Button 
            title="Week" 
            onPress={() => setCurrentView('week')} 
            type={currentView === 'week' ? 'primary' : 'outline'} 
            style={styles.toggleButton} 
          />
          <Button 
            title="Day" 
            onPress={() => setCurrentView('day')} 
            type={currentView === 'day' ? 'primary' : 'outline'} 
            style={styles.toggleButton} 
          />
        </View>

        <View style={styles.zoomControls}>
          <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
            <MaterialIcons name="zoom-out" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.zoomText, { color: theme.colors.primary }]}>
            {Math.round(zoomLevel * 100)}%
          </Text>
          <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
            <MaterialIcons name="zoom-in" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {renderTimetable()}

      {/* Class Details Modal */}
      {selectedClass && (
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Card style={styles.modalContent}>
            <TouchableOpacity 
              onPress={closeClassDetails} 
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>
              {selectedClass.course}
            </Text>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="account" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.detailText, { color: theme.colors.secondary }]}>
                {selectedClass.teacher}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="clock" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.detailText, { color: theme.colors.secondary }]}>
                {selectedClass.time}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.detailText, { color: theme.colors.secondary }]}>
                Room: {selectedClass.room || 'Not specified'}
              </Text>
            </View>

            <Button 
              title="Set Reminder" 
              onPress={() => {}} 
              style={styles.modalButton} 
              icon="bell"
            />
            <Button 
              title="View Materials" 
              onPress={() => {}} 
              type="outline" 
              style={styles.modalButton} 
              icon="file-document"
            />
          </Card>
        </Animated.View>
      )}
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
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: 'row',
  },
  toggleButton: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomButton: {
    padding: 8,
  },
  zoomText: {
    marginHorizontal: 8,
    fontSize: 14,
  },
  timetableContainer: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  timeHeader: {
    width: 100,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeader: {
    width: 120,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  timeRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  timeLabel: {
    width: 100,
    padding: 8,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EEE',
  },
  timeText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  classCell: {
    width: 120,
    minHeight: 80,
    padding: 8,
    justifyContent: 'center',
    borderWidth: 1,
  },
  classText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teacherText: {
    fontSize: 10,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default TimetableDisplay;