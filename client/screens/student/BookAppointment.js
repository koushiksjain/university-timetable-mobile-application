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
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Book Appointment
        </Text>
        
        <Text style={[styles.teacherText, { color: theme.colors.primary }]}>
          {teacher.name}
        </Text>
        
        <Text style={[styles.slotText, { color: theme.colors.text }]}>
          {slot}
        </Text>

        <InputField
          label="Purpose of Meeting"
          value={purpose}
          onChangeText={setPurpose}
          multiline
          style={styles.input}
        />

        <Button 
          title="Confirm Booking" 
          onPress={handleBook} 
          disabled={!purpose}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  teacherText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  slotText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 24,
  },
});

export default BookAppointment;