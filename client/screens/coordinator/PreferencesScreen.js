import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import PreferenceForm from '../../components/coordinator/PreferenceForm';
import Loader from '../../components/common/Loader';

const PreferencesScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { department } = route.params || {};
  const [teachers, setTeachers] = useState([
    { 
      id: '1', 
      name: 'Dr. Smith', 
      email: 'smith@univ.edu',
      department: department?.name || 'Computer Science', 
      preferences: null,
      courses: ['Data Structures', 'Algorithms'],
    },
    { 
      id: '2', 
      name: 'Prof. Johnson', 
      email: 'johnson@univ.edu',
      department: department?.name || 'Computer Science', 
      preferences: null,
      courses: ['Database Systems', 'Operating Systems'],
    },
  ]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSavePreferences = (teacherId, preferences) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === teacherId ? { ...teacher, preferences } : teacher
    ));
    setSelectedTeacher(null);
  };

  const handleGenerateTimetable = () => {
    setLoading(true);
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('TimetableGeneration', { 
        teachers: teachers.filter(t => t.preferences !== null),
        department,
      });
    }, 2000);
  };

  const showPreferenceForm = (teacher) => {
    setSelectedTeacher(teacher);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hidePreferenceForm = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedTeacher(null));
  };

  const renderTeacherItem = ({ item }) => (
    <Card style={styles.teacherCard}>
      <View style={styles.teacherHeader}>
        <MaterialCommunityIcons 
          name="account" 
          size={32} 
          color={theme.colors.primary} 
          style={styles.teacherIcon}
        />
        <View style={styles.teacherInfo}>
          <Text style={[styles.teacherName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.teacherDept, { color: theme.colors.placeholder }]}>
            {item.department}
          </Text>
          {item.courses && item.courses.length > 0 && (
            <Text style={[styles.teacherCourses, { color: theme.colors.primary }]}>
              Courses: {item.courses.join(', ')}
            </Text>
          )}
        </View>
        <View style={styles.statusIndicator}>
          {item.preferences ? (
            <>
              <MaterialCommunityIcons 
                name="check-circle" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.statusText, { color: theme.colors.primary }]}>
                Ready
              </Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons 
                name="alert-circle" 
                size={20} 
                color={theme.colors.error} 
              />
              <Text style={[styles.statusText, { color: theme.colors.error }]}>
                Pending
              </Text>
            </>
          )}
        </View>
      </View>
      <Button 
        title={item.preferences ? "Edit Preferences" : "Add Preferences"} 
        onPress={() => showPreferenceForm(item)} 
        type="outline" 
        style={styles.preferenceButton}
        icon={item.preferences ? "pencil" : "plus"}
      />
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Teacher Preferences" 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Collect Teacher Preferences
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.placeholder }]}>
          {teachers.filter(t => t.preferences !== null).length} of {teachers.length} teachers completed
        </Text>

        <FlatList
          data={teachers}
          renderItem={renderTeacherItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <Button 
          title="Generate Timetable" 
          onPress={handleGenerateTimetable} 
          style={styles.generateButton} 
          disabled={teachers.filter(t => t.preferences !== null).length === 0}
          icon="timetable"
        />
      </View>

      {selectedTeacher && (
        <Animated.View 
          style={[
            styles.formOverlay,
            { 
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          <Card style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                {selectedTeacher.name}'s Preferences
              </Text>
              <TouchableOpacity onPress={hidePreferenceForm}>
                <MaterialCommunityIcons 
                  name="close" 
                  size={24} 
                  color={theme.colors.text} 
                />
              </TouchableOpacity>
            </View>
            <PreferenceForm 
              initialData={selectedTeacher.preferences}
              onSubmit={(preferences) => handleSavePreferences(selectedTeacher.id, preferences)}
              courses={selectedTeacher.courses.map(course => ({ id: course, name: course }))}
            />
          </Card>
        </Animated.View>
      )}

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Preparing to generate timetable...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  teacherCard: {
    marginBottom: 16,
    padding: 16,
  },
  teacherHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  teacherIcon: {
    marginRight: 12,
  },
  teacherInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  teacherDept: {
    fontSize: 14,
  },
  teacherCourses: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  statusIndicator: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    marginTop: 2,
  },
  preferenceButton: {
    marginTop: 8,
  },
  generateButton: {
    marginTop: 8,
  },
  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  formCard: {
    maxHeight: '80%',
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default PreferencesScreen;