// screens/student/BookAppointment.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';

const BookAppointment = ({ route, navigation }) => {
  const theme = useTheme();
  const { teacher, slot } = route.params;
  const [purpose, setPurpose] = useState('');

  const handleBook = () => {
    // Implement booking logic
    alert(`Appointment booked with ${teacher.name} at ${slot}`);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Text style={styles.title}>
          Book Appointment
        </Text>
        
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherText}>
            {teacher.name}
          </Text>
          
          <Text style={styles.slotText}>
            {slot}
          </Text>
        </View>

        <InputField
          label="Purpose of Meeting"
          value={purpose}
          onChangeText={setPurpose}
          multiline
          style={styles.input}
          labelStyle={styles.inputLabel}
        />

        <Button 
          title="Confirm Booking" 
          onPress={handleBook} 
          disabled={!purpose}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  card: {
    padding: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
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
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 32,
    textAlign: 'center',
    color: '#000000',
    textTransform: 'uppercase',
  },
  teacherInfo: {
    marginBottom: 32,
    padding: 20,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  teacherText: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
    color: '#000000',
    textTransform: 'uppercase',
  },
  slotText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000000',
  },
  input: {
    marginBottom: 32,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  button: {
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
  },
});

export default BookAppointment;