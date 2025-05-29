import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import DepartmentSetup from '../screens/coordinator/DepartmentSetup';
// import PreferencesScreen from '../screens/coordinator/PreferencesScreen';
// import TimetableGeneration from '../screens/coordinator/TimetableGeneration';
// import TimetableApproval from '../screens/coordinator/TimetableApproval';
// import TeacherDetails from '../screens/coordinator/TeacherDetails';
// import AddTeacher from '../screens/coordinator/AddTeacher';

const Stack = createStackNavigator();

export default function CoordinatorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: '#fff',
        },
        headerTintColor: '#6200EE',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
                {
                  translateX: next
                    ? next.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -layouts.screen.width],
                      })
                    : 1,
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="DepartmentSetup" 
        component={DepartmentSetup} 
        options={{ title: 'Department Setup' }}
      />
      <Stack.Screen 
        name="Preferences" 
        component={PreferencesScreen} 
        options={{ title: 'Teacher Preferences' }}
      />
      <Stack.Screen 
        name="TimetableGeneration" 
        component={TimetableGeneration} 
        options={{ title: 'Generate Timetable' }}
      />
      <Stack.Screen 
        name="TimetableApproval" 
        component={TimetableApproval} 
        options={{ title: 'Approve Timetable' }}
      />
      <Stack.Screen 
        name="TeacherDetails" 
        component={TeacherDetails} 
        options={{ title: 'Teacher Details' }}
      />
      <Stack.Screen 
        name="AddTeacher" 
        component={AddTeacher} 
        options={{ title: 'Add Teacher' }}
      />
    </Stack.Navigator>
  );
}