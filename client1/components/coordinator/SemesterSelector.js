import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../config/theme';

const SemesterSelector = ({ semesters, selectedSemester, onSelect }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {semesters.map(semester => (
        <TouchableOpacity
          key={semester.id}
          onPress={() => onSelect(semester.id)}
          style={[
            styles.semesterButton,
            { 
              backgroundColor: semester.id === selectedSemester 
                ? theme.colors.primary 
                : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
        >
          <Text style={[
            styles.semesterText,
            { 
              color: semester.id === selectedSemester 
                ? theme.colors.onPrimary 
                : theme.colors.text,
            }
          ]}>
            {semester.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  semesterButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  semesterText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SemesterSelector;