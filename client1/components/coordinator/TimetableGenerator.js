import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import SemesterSelector from '../../components/coordinator/SemesterSelector';

const { width } = Dimensions.get('window');

const TimetableGenerator = ({ preferences, onGenerate, department }) => {
  const theme = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [activeTab, setActiveTab] = useState('department');
  const [conflicts, setConflicts] = useState([]);
  const [activeSemester, setActiveSemester] = useState('spring');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;

  const semesters = [
    { id: 'spring', name: 'Spring' },
    { id: 'fall', name: 'Fall' },
    { id: 'summer', name: 'Summer' },
  ];

  const generateTimetable = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const demoData = generateDemoSchedule(preferences, activeSemester);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      
      setGeneratedTimetable(demoData);
      detectConflicts(demoData);
      setIsGenerating(false);
    }, 3000);
  };

  const detectConflicts = (timetable) => {
    const mockConflicts = [
      {
        id: '1',
        type: 'teacher',
        teacher: 'Dr. Smith',
        day: 'Mon',
        time: '10-11 AM',
        conflict: 'Double booking',
        resolution: {
          options: [
            { id: '1', label: 'Move to Tue 10-11 AM' },
            { id: '2', label: 'Assign different teacher' },
          ],
        },
      },
    ];
    setConflicts(mockConflicts);
  };

  const generateDemoSchedule = (prefs, semester) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const slots = Array(8).fill().map((_, i) => `${8 + i}-${9 + i} AM`);
    const rooms = ['Room 101', 'Room 102', 'Room 103', 'Lab 201', 'Lab 202'];
    
    const semesterCourses = {
      spring: ['Data Structures', 'Algorithms', 'Database Systems'],
      fall: ['Operating Systems', 'Computer Networks', 'Software Engineering'],
      summer: ['Web Development', 'Mobile App Development', 'Cloud Computing'],
    };

    const teacherSchedules = prefs.map(teacher => {
      const schedule = days.map(day => ({
        day,
        classes: slots.map(slot => {
          const isAvailable = 
            teacher.preferredDays.includes(day) && 
            teacher.preferredTimes.includes(slot) &&
            !teacher.unavailableSlots.some(s => s.day === day && s.slot === slot);
          
          if (isAvailable) {
            const availableCourses = teacher.courses.filter(c => 
              semesterCourses[semester].includes(c)
            );
            const course = availableCourses.length > 0 
              ? availableCourses[Math.floor(Math.random() * availableCourses.length)]
              : 'N/A';
            return {
              time: slot,
              course,
              room: rooms[Math.floor(Math.random() * rooms.length)],
              status: 'scheduled',
              semester,
            };
          }
          return {
            time: slot,
            course: 'Free',
            room: '',
            status: 'free',
            semester,
          };
        }),
      }));
      return {
        teacher: teacher.teacherName,
        schedule,
      };
    });
    
    const departmentView = days.map(day => ({
      day,
      classes: slots.map(slot => {
        const availableTeachers = prefs.filter(teacher => 
          teacher.preferredDays.includes(day) && 
          teacher.preferredTimes.includes(slot) &&
          !teacher.unavailableSlots.some(s => s.day === day && s.slot === slot)
        );
        
        if (availableTeachers.length > 0) {
          const teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
          const availableCourses = teacher.courses.filter(c => 
            semesterCourses[semester].includes(c)
          );
          const course = availableCourses.length > 0 
            ? availableCourses[Math.floor(Math.random() * availableCourses.length)]
            : 'N/A';
          return {
            time: slot,
            teacher: teacher.teacherName,
            course,
            room: rooms[Math.floor(Math.random() * rooms.length)],
            semester,
          };
        }
        return {
          time: slot,
          teacher: 'Not assigned',
          course: 'Free',
          room: '',
          semester,
        };
      }),
    }));
    
    return {
      status: 'success',
      teachers: prefs.length,
      days,
      slots,
      rooms,
      teacherSchedules,
      departmentView,
      semester,
      generatedAt: new Date().toISOString(),
    };
  };

  const handleRegenerate = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setGeneratedTimetable(null);
      setConflicts([]);
      generateTimetable();
    });
  };

  const handleSemesterChange = (semester) => {
    setActiveSemester(semester);
    if (generatedTimetable) {
      handleRegenerate();
    }
  };

  const renderConflict = (conflict) => (
    <Card key={conflict.id} style={styles.conflictCard}>
      <View style={styles.conflictHeader}>
        <MaterialIcons 
          name="error" 
          size={24} 
          color={theme.colors.error} 
        />
        <Text style={[styles.conflictTitle, { color: theme.colors.error }]}>
          {conflict.conflict}
        </Text>
      </View>
      <Text style={[styles.conflictDetail, { color: theme.colors.text }]}>
        {conflict.type === 'teacher' ? (
          `Teacher ${conflict.teacher} is double-booked on ${conflict.day} at ${conflict.time}`
        ) : (
          `Room ${conflict.room} has overlapping classes on ${conflict.day} at ${conflict.time}`
        )}
      </Text>
      
      <Text style={[styles.resolutionTitle, { color: theme.colors.text }]}>
        Resolution Options:
      </Text>
      {conflict.resolution.options.map(option => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.resolutionOption,
            { borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.optionText, { color: theme.colors.text }]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Card>
  );

  const renderTimetable = () => {
    if (!generatedTimetable) return null;

    return (
      <Animated.View style={[
        styles.timetableContainer, 
        { 
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        }
      ]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            {department.name} Timetable - {generatedTimetable.semester.toUpperCase()} Semester
          </Text>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons 
                name="account" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                {generatedTimetable.teachers} teachers
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons 
                name="calendar" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                {generatedTimetable.days.length} days
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons 
                name="error" 
                size={20} 
                color={conflicts.length > 0 ? theme.colors.error : theme.colors.primary} 
              />
              <Text style={[
                styles.statText, 
                { 
                  color: conflicts.length > 0 ? theme.colors.error : theme.colors.text,
                }
              ]}>
                {conflicts.length} conflicts
              </Text>
            </View>
          </View>
          <SemesterSelector
            semesters={semesters}
            selectedSemester={activeSemester}
            onSelect={handleSemesterChange}
          />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'department' && styles.activeTab,
              activeTab === 'department' && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setActiveTab('department')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'department' && { color: theme.colors.onPrimary },
            ]}>
              Department
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'teacher' && styles.activeTab,
              activeTab === 'teacher' && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setActiveTab('teacher')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'teacher' && { color: theme.colors.onPrimary },
            ]}>
              Teacher View
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'department' ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timetableGrid}>
              <View style={styles.gridRow}>
                <View style={[styles.gridCell, styles.headerCell]}>
                  <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
                    Time/Day
                  </Text>
                </View>
                {generatedTimetable.days.map(day => (
                  <View key={day} style={[styles.gridCell, styles.headerCell]}>
                    <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {generatedTimetable.slots.map((slot, slotIndex) => (
                <View key={slot} style={styles.gridRow}>
                  <View style={[styles.gridCell, styles.timeCell]}>
                    <Text style={[styles.timeText, { color: theme.colors.text }]}>
                      {slot}
                    </Text>
                  </View>
                  {generatedTimetable.days.map(day => {
                    const daySchedule = generatedTimetable.departmentView.find(d => d.day === day);
                    const classInfo = daySchedule.classes[slotIndex];
                    return (
                      <View 
                        key={`${day}-${slot}`} 
                        style={[
                          styles.gridCell,
                          { 
                            backgroundColor: classInfo.teacher === 'Not assigned' 
                              ? theme.colors.surface 
                              : theme.colors.secondary,
                          }
                        ]}
                      >
                        <Text 
                          style={[
                            styles.classText,
                            { 
                              color: classInfo.teacher === 'Not assigned' 
                                ? theme.colors.text 
                                : theme.colors.onSecondary,
                            }
                          ]}
                          numberOfLines={2}
                        >
                          {classInfo.course}
                        </Text>
                        <Text 
                          style={[
                            styles.teacherText,
                            { 
                              color: classInfo.teacher === 'Not assigned' 
                                ? theme.colors.placeholder 
                                : theme.colors.onSecondary,
                            }
                          ]}
                          numberOfLines={1}
                        >
                          {classInfo.teacher}
                        </Text>
                        {classInfo.room && (
                          <Text 
                            style={[
                              styles.roomText,
                              { 
                                color: classInfo.teacher === 'Not assigned' 
                                  ? theme.colors.placeholder 
                                  : theme.colors.onSecondary,
                              }
                            ]}
                            numberOfLines={1}
                          >
                            {classInfo.room}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView>
            {generatedTimetable.teacherSchedules.map(teacher => (
              <Card key={teacher.teacher} style={styles.teacherCard}>
                <Text style={[styles.teacherName, { color: theme.colors.primary }]}>
                  {teacher.teacher}'s Schedule
                </Text>
                {teacher.schedule.map(day => (
                  <View key={day.day} style={styles.teacherDay}>
                    <Text style={[styles.dayTitle, { color: theme.colors.text }]}>
                      {day.day}
                    </Text>
                    {day.classes.map(cls => (
                      <View 
                        key={`${day.day}-${cls.time}`} 
                        style={[
                          styles.teacherClass,
                          { 
                            backgroundColor: cls.status === 'scheduled'
                              ? theme.colors.secondary
                              : theme.colors.surface,
                          }
                        ]}
                      >
                        <Text style={[
                          styles.classTime,
                          { 
                            color: cls.status === 'scheduled'
                              ? theme.colors.onSecondary
                              : theme.colors.text,
                          }
                        ]}>
                          {cls.time}
                        </Text>
                        <Text style={[
                          styles.classCourse,
                          { 
                            color: cls.status === 'scheduled'
                              ? theme.colors.onSecondary
                              : theme.colors.text,
                          }
                        ]}>
                          {cls.course}
                        </Text>
                        {cls.room && (
                          <Text style={[
                            styles.classRoom,
                            { 
                              color: cls.status === 'scheduled'
                                ? theme.colors.onSecondary
                                : theme.colors.text,
                            }
                          ]}>
                            {cls.room}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </Card>
            ))}
          </ScrollView>
        )}

        {conflicts.length > 0 && (
          <View style={styles.conflictsSection}>
            <Text style={[styles.conflictsTitle, { color: theme.colors.error }]}>
              Schedule Conflicts
            </Text>
            {conflicts.map(renderConflict)}
          </View>
        )}

        <View style={styles.actions}>
          <Button 
            title="Regenerate" 
            onPress={handleRegenerate} 
            type="outline" 
            style={styles.actionButton} 
            icon="refresh"
          />
          <Button 
            title="Approve Timetable" 
            onPress={() => onGenerate(generatedTimetable)} 
            style={styles.actionButton} 
            disabled={conflicts.length > 0}
            icon="check"
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {isGenerating ? (
        <View style={styles.generatingContainer}>
          <Loader size={60} />
          <Text style={[styles.generatingText, { color: theme.colors.text }]}>
            Generating {semesters.find(s => s.id === activeSemester)?.name} Semester Timetable...
          </Text>
          <Text style={[styles.generatingSubtext, { color: theme.colors.placeholder }]}>
            Analyzing {preferences.length} teacher preferences
          </Text>
        </View>
      ) : generatedTimetable ? (
        renderTimetable()
      ) : (
        <Card style={styles.promptCard}>
          <MaterialCommunityIcons 
            name="timetable" 
            size={48} 
            color={theme.colors.primary} 
            style={styles.icon}
          />
          <Text style={[styles.promptTitle, { color: theme.colors.text }]}>
            Generate {semesters.find(s => s.id === activeSemester)?.name} Semester Timetable
          </Text>
          <SemesterSelector
            semesters={semesters}
            selectedSemester={activeSemester}
            onSelect={handleSemesterChange}
          />
          <Text style={[styles.promptText, { color: theme.colors.placeholder }]}>
            Based on {preferences.length} teacher preferences collected
          </Text>
          <Button 
            title="Generate Timetable" 
            onPress={generateTimetable} 
            style={styles.generateButton} 
            icon="rocket-launch"
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatingText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: '500',
  },
  generatingSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  promptCard: {
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  promptText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  generateButton: {
    width: '100%',
  },
  timetableContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontWeight: '600',
  },
  timetableGrid: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 140,
    minHeight: 80,
    padding: 8,
    borderWidth: 0.5,
    borderColor: '#EEE',
    justifyContent: 'center',
  },
  headerCell: {
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeCell: {
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  timeText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  classText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teacherText: {
    fontSize: 10,
    marginBottom: 2,
  },
  roomText: {
    fontSize: 9,
    fontStyle: 'italic',
  },
  teacherCard: {
    marginBottom: 16,
    padding: 16,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  teacherDay: {
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  teacherClass: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  classTime: {
    fontSize: 12,
    width: '25%',
  },
  classCourse: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '45%',
  },
  classRoom: {
    fontSize: 10,
    width: '30%',
    textAlign: 'right',
  },
  conflictsSection: {
    marginTop: 16,
  },
  conflictsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  conflictCard: {
    marginBottom: 12,
    padding: 12,
  },
  conflictHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  conflictTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  conflictDetail: {
    fontSize: 12,
    marginBottom: 8,
  },
  resolutionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  resolutionOption: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default TimetableGenerator;