import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from '../../config/theme';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Card from '../../components/common/Card';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const PreferenceForm = ({ onSubmit, initialData, courses = [] }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState(initialData || {
    teacherName: '',
    preferredDays: [],
    preferredTimes: [],
    courses: [],
    constraints: '',
    unavailableSlots: [],
  });
  const [activeStep, setActiveStep] = useState(1);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '8-9 AM', '9-10 AM', '10-11 AM', '11-12 PM',
    '12-1 PM', '1-2 PM', '2-3 PM', '3-4 PM',
    '4-5 PM', '5-6 PM'
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setActiveStep(prev => prev + 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePrev = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setActiveStep(prev => prev - 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const toggleUnavailableSlot = (day, slot) => {
    const slotId = `${day}-${slot}`;
    setFormData(prev => {
      const exists = prev.unavailableSlots.some(s => s.id === slotId);
      return {
        ...prev,
        unavailableSlots: exists
          ? prev.unavailableSlots.filter(s => s.id !== slotId)
          : [...prev.unavailableSlots, { id: slotId, day, slot }]
      };
    });
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <InputField
              label="Teacher Name"
              value={formData.teacherName}
              onChangeText={(text) => handleChange('teacherName', text)}
              icon="person"
              required
            />
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Preferred Days
            </Text>
            <View style={styles.daysContainer}>
              {days.map(day => (
                <TouchableOpacity
                  key={day}
                  onPress={() => handleChange('preferredDays', 
                    formData.preferredDays.includes(day)
                      ? formData.preferredDays.filter(d => d !== day)
                      : [...formData.preferredDays, day]
                  )}
                  style={[
                    styles.dayButton,
                    { 
                      backgroundColor: formData.preferredDays.includes(day) 
                        ? theme.colors.primary 
                        : theme.colors.surface,
                      borderColor: theme.colors.border,
                    }
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    { 
                      color: formData.preferredDays.includes(day) 
                        ? theme.colors.onPrimary 
                        : theme.colors.text,
                    }
                  ]}>
                    {day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Preferred Time Slots
            </Text>
            <View style={styles.slotsContainer}>
              {timeSlots.map(slot => (
                <TouchableOpacity
                  key={slot}
                  onPress={() => handleChange('preferredTimes', 
                    formData.preferredTimes.includes(slot)
                      ? formData.preferredTimes.filter(s => s !== slot)
                      : [...formData.preferredTimes, slot]
                  )}
                  style={[
                    styles.slotButton,
                    { 
                      backgroundColor: formData.preferredTimes.includes(slot) 
                        ? theme.colors.primary 
                        : theme.colors.surface,
                      borderColor: theme.colors.border,
                    }
                  ]}
                >
                  <Text style={[
                    styles.slotText,
                    { 
                      color: formData.preferredTimes.includes(slot) 
                        ? theme.colors.onPrimary 
                        : theme.colors.text,
                    }
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>
              Mark Unavailable Slots
            </Text>
            <Button
              title="Set Unavailable Times"
              onPress={() => setShowUnavailableModal(true)}
              type="outline"
              icon="calendar-remove"
            />
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Course Assignments
            </Text>
            {courses.length > 0 ? (
              <View style={styles.coursesContainer}>
                {courses.map(course => (
                  <TouchableOpacity
                    key={course.id}
                    onPress={() => handleChange('courses', 
                      formData.courses.includes(course.id)
                        ? formData.courses.filter(c => c !== course.id)
                        : [...formData.courses, course.id]
                    )}
                    style={[
                      styles.courseButton,
                      { 
                        backgroundColor: formData.courses.includes(course.id)
                          ? theme.colors.primary
                          : theme.colors.surface,
                        borderColor: theme.colors.border,
                      }
                    ]}
                  >
                    <Text style={[
                      styles.courseText,
                      { 
                        color: formData.courses.includes(course.id)
                          ? theme.colors.onPrimary
                          : theme.colors.text,
                      }
                    ]}>
                      {course.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.noCourses, { color: theme.colors.placeholder }]}>
                No courses available for this department
              </Text>
            )}
            
            <InputField
              label="Special Constraints"
              value={formData.constraints}
              onChangeText={(text) => handleChange('constraints', text)}
              icon="alert"
              multiline
              placeholder="E.g., Can't teach back-to-back classes"
            />
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Teacher Preferences {activeStep}/4
      </Text>
      
      <View style={styles.progressBar}>
        <View style={[
          styles.progressFill, 
          { 
            width: `${(activeStep / 4) * 100}%`,
            backgroundColor: theme.colors.primary,
          }
        ]} />
      </View>

      <ScrollView contentContainerStyle={styles.formContent}>
        {renderStep()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {activeStep > 1 && (
          <Button 
            title="Back" 
            onPress={handlePrev} 
            type="outline" 
            style={styles.button} 
          />
        )}
        {activeStep < 4 ? (
          <Button 
            title="Next" 
            onPress={handleNext} 
            style={styles.button} 
            disabled={activeStep === 1 && !formData.teacherName}
          />
        ) : (
          <Button 
            title="Submit Preferences" 
            onPress={() => onSubmit(formData)} 
            style={styles.button} 
          />
        )}
      </View>

      {showUnavailableModal && (
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Mark Unavailable Times
              </Text>
              <TouchableOpacity onPress={() => setShowUnavailableModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {days.map(day => (
                <View key={day} style={styles.daySection}>
                  <Text style={[styles.dayTitle, { color: theme.colors.primary }]}>
                    {day}
                  </Text>
                  <View style={styles.timeGrid}>
                    {timeSlots.map(slot => {
                      const isUnavailable = formData.unavailableSlots.some(
                        s => s.day === day && s.slot === slot
                      );
                      return (
                        <TouchableOpacity
                          key={slot}
                          onPress={() => toggleUnavailableSlot(day, slot)}
                          style={[
                            styles.timeSlot,
                            {
                              backgroundColor: isUnavailable
                                ? theme.colors.error
                                : theme.colors.surface,
                              borderColor: theme.colors.border,
                            }
                          ]}
                        >
                          <Text style={[
                            styles.timeSlotText,
                            {
                              color: isUnavailable
                                ? theme.colors.onError
                                : theme.colors.text,
                            }
                          ]}>
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <Button
              title="Done"
              onPress={() => setShowUnavailableModal(false)}
              style={styles.modalButton}
            />
          </Card>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  formContent: {
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    width: '15%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotButton: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotText: {
    fontSize: 12,
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  courseButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    margin: 4,
  },
  courseText: {
    fontSize: 12,
  },
  noCourses: {
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  daySection: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    margin: 4,
  },
  timeSlotText: {
    fontSize: 10,
  },
  modalButton: {
    marginTop: 16,
  },
});

export default PreferenceForm;