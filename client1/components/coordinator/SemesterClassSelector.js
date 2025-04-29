import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';

const SemesterClassSelector = ({ 
  semesters, 
  classes, 
  onSemesterSelect, 
  onClassSelect,
  selectedSemester,
  selectedClass
}) => {
  const theme = useTheme();

  return (
    <Card style={styles.container}>
      <View style={styles.selectorContainer}>
        <View style={styles.selector}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Semester:</Text>
          <View style={styles.itemsContainer}>
            <TouchableOpacity
              onPress={() => onSemesterSelect(null)}
              style={[
                styles.item,
                { 
                  backgroundColor: !selectedSemester 
                    ? theme.colors.primary 
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <Text 
                style={[
                  styles.itemText,
                  { 
                    color: !selectedSemester 
                      ? theme.colors.onPrimary 
                      : theme.colors.text,
                  }
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            {semesters.map(semester => (
              <TouchableOpacity
                key={semester.id}
                onPress={() => onSemesterSelect(semester)}
                style={[
                  styles.item,
                  { 
                    backgroundColor: selectedSemester?.id === semester.id 
                      ? theme.colors.primary 
                      : theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
              >
                <Text 
                  style={[
                    styles.itemText,
                    { 
                      color: selectedSemester?.id === semester.id 
                        ? theme.colors.onPrimary 
                        : theme.colors.text,
                    }
                  ]}
                >
                  {semester.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.selector}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Class:</Text>
          <View style={styles.itemsContainer}>
            <TouchableOpacity
              onPress={() => onClassSelect(null)}
              style={[
                styles.item,
                { 
                  backgroundColor: !selectedClass 
                    ? theme.colors.primary 
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <Text 
                style={[
                  styles.itemText,
                  { 
                    color: !selectedClass 
                      ? theme.colors.onPrimary 
                      : theme.colors.text,
                  }
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            {classes
              .filter(cls => !selectedSemester || cls.semester === selectedSemester.id)
              .map(cls => (
                <TouchableOpacity
                  key={cls.id}
                  onPress={() => onClassSelect(cls)}
                  style={[
                    styles.item,
                    { 
                      backgroundColor: selectedClass?.id === cls.id 
                        ? theme.colors.primary 
                        : theme.colors.surface,
                      borderColor: theme.colors.border,
                    }
                  ]}
                >
                  <Text 
                    style={[
                      styles.itemText,
                      { 
                        color: selectedClass?.id === cls.id 
                          ? theme.colors.onPrimary 
                          : theme.colors.text,
                      }
                    ]}
                  >
                    {cls.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </View>

      {selectedSemester && (
        <View style={styles.semesterInfo}>
          <MaterialCommunityIcons 
            name="calendar-range" 
            size={16} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {selectedSemester.startDate} to {selectedSemester.endDate}
          </Text>
        </View>
      )}

      {selectedClass && (
        <View style={styles.classInfo}>
          <MaterialCommunityIcons 
            name="google-classroom" 
            size={16} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            Capacity: {selectedClass.capacity} students
          </Text>
          {selectedSemester && (
            <Text style={[styles.infoText, { color: theme.colors.placeholder }]}>
              ({semesters.find(s => s.id === selectedClass.semester)?.name || 'No Semester'})
            </Text>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selector: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 12,
    fontWeight: '500',
  },
  semesterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default SemesterClassSelector;