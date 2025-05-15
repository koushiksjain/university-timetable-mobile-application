import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../screens/student/Dashboard';
import FreeTeachers from '../screens/student/FreeTeachers';
import TimetableScreen from '../screens/student/TimetableScreen';
import ClassDetails from '../screens/student/ClassDetails';
import BookAppointment from '../screens/student/BookAppointment';

const Stack = createStackNavigator();

export default function StudentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        }),
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="FreeTeachers" 
        component={FreeTeachers} 
        options={{ title: 'Available Teachers' }}
      />
      <Stack.Screen 
        name="Timetable" 
        component={TimetableScreen} 
        options={{ title: 'My Timetable' }}
      />
      <Stack.Screen 
        name="ClassDetails" 
        component={ClassDetails} 
        options={{ title: 'Class Details' }}
      />
      <Stack.Screen 
        name="BookAppointment" 
        component={BookAppointment} 
        options={{ title: 'Book Appointment' }}
      />
    </Stack.Navigator>
  );
}