import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../../config/theme';
import Card from '../common/Card';
import Button from '../common/Button';
import InputField from '../common/InputField';

const timeSlots = [
  '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
  '16:00-17:00', '17:00-18:00'
];

const AvailabilityManager = ({ initialAvailability, onSave }) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState(initialAvailability);
  const [editing, setEditing] = useState(false);
  const [newSlot, setNewSlot] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const markedDates = {
    ...Object.keys(availability).reduce((acc, date) => {
      acc[date] = { marked: true, dotColor: theme.colors.primary };
      return acc;
    }, {}),
    [selectedDate]: {
      selected: true,
      selectedColor: theme.colors.primary,
    }
  };

  const handleSlotToggle = (slot) => {
    const newAvailability = { ...availability };
    if (!newAvailability[selectedDate]) {
      newAvailability[selectedDate] = [];
    }

    const slotIndex = newAvailability[selectedDate].indexOf(slot);
    if (slotIndex >= 0) {
      newAvailability[selectedDate].splice(slotIndex, 1);
      if (newAvailability[selectedDate].length === 0) {
        delete newAvailability[selectedDate];
      }
    } else {
      newAvailability[selectedDate].push(slot);
    }

    setAvailability(newAvailability);
  };

  const handleAddCustomSlot = () => {
    if (newSlot && !availability[selectedDate]?.includes(newSlot)) {
      const newAvailability = { ...availability };
      if (!newAvailability[selectedDate]) {
        newAvailability[selectedDate] = [];
      }
      newAvailability[selectedDate].push(newSlot);
      setAvailability(newAvailability);
      setNewSlot('');
    }
  };

  const handleSave = () => {
    onSave(availability);
    setEditing(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.saveConfirmation, { opacity: fadeAnim }]}>
        <Card style={styles.confirmationCard}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={32} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.confirmationText, { color: theme.colors.text }]}>
            Availability saved successfully!
          </Text>
        </Card>
      </Animated.View>

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Manage Availability
        </Text>
        {editing ? (
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            icon="content-save" 
          />
        ) : (
          <Button 
            title="Edit" 
            onPress={() => setEditing(true)} 
            icon="pencil" 
            type="outline" 
          />
        )}
      </View>

      <Card style={styles.calendarCard}>
        <Calendar
          current={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            calendarBackground: theme.colors.surface,
            textSectionTitleColor: theme.colors.text,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.onPrimary,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.text,
            textDisabledColor: theme.colors.placeholder,
            arrowColor: theme.colors.primary,
            monthTextColor: theme.colors.text,
            indicatorColor: theme.colors.primary,
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
          }}
        />
      </Card>

      <Card style={styles.slotsCard}>
        <Text style={[styles.slotsTitle, { color: theme.colors.text }]}>
          Available Time Slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>

        <View style={styles.slotsGrid}>
          {timeSlots.map(slot => (
            <TouchableOpacity
              key={slot}
              onPress={() => editing && handleSlotToggle(slot)}
              style={[
                styles.slotButton,
                { 
                  backgroundColor: availability[selectedDate]?.includes(slot) 
                    ? theme.colors.primary 
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                  opacity: editing ? 1 : 0.7,
                }
              ]}
              disabled={!editing}
            >
              <Text style={[
                styles.slotText,
                { 
                  color: availability[selectedDate]?.includes(slot) 
                    ? theme.colors.onPrimary 
                    : theme.colors.text,
                }
              ]}>
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {editing && (
          <View style={styles.customSlot}>
            <InputField
              label="Add custom time slot"
              value={newSlot}
              onChangeText={setNewSlot}
              placeholder="e.g. 18:00-19:00"
              style={styles.slotInput}
            />
            <Button 
              title="Add" 
              onPress={handleAddCustomSlot} 
              style={styles.addButton} 
              disabled={!newSlot}
            />
          </View>
        )}

        {availability[selectedDate]?.some(slot => !timeSlots.includes(slot)) && (
          <View style={styles.customSlots}>
            <Text style={[styles.customTitle, { color: theme.colors.text }]}>
              Custom Slots:
            </Text>
            <View style={styles.customSlotsList}>
              {availability[selectedDate]
                ?.filter(slot => !timeSlots.includes(slot))
                .map(slot => (
                  <View key={slot} style={styles.customSlotItem}>
                    <Text style={[styles.customSlotText, { color: theme.colors.text }]}>
                      {slot}
                    </Text>
                    {editing && (
                      <TouchableOpacity 
                        onPress={() => handleSlotToggle(slot)}
                        style={styles.removeButton}
                      >
                        <MaterialCommunityIcons 
                          name="close" 
                          size={16} 
                          color={theme.colors.error} 
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
            </View>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  saveConfirmation: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  confirmationCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  confirmationText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  calendarCard: {
    marginBottom: 16,
    padding: 8,
  },
  slotsCard: {
    flex: 1,
    padding: 16,
  },
  slotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  slotButton: {
    width: '30%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: 'center',
  },
  slotText: {
    fontSize: 12,
    fontWeight: '500',
  },
  customSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  slotInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    width: 80,
  },
  customSlots: {
    marginTop: 16,
  },
  customTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  customSlotsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  customSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  customSlotText: {
    fontSize: 12,
  },
  removeButton: {
    marginLeft: 8,
  },
});

export default AvailabilityManager;