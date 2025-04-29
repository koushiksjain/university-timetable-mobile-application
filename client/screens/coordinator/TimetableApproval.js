import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const TimetableApproval = ({ navigation, route }) => {
  const theme = useTheme();
  const { timetable } = route.params || {};

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Approve Generated Timetable
        </Text>
        
        {timetable ? (
          <>
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>
              Review the timetable before final approval
            </Text>
            {/* Add your timetable preview component here */}
            <Button 
              title="Approve Timetable" 
              onPress={() => navigation.navigate('Dashboard')} 
              style={styles.button} 
            />
          </>
        ) : (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            No timetable data provided
          </Text>
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
  card: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TimetableApproval;