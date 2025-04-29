import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import InputField from '../../components/common/InputField';
import Loader from '../../components/common/Loader';
import DepartmentSelector from '../../components/coordinator/DepartmentSelector';
import StudentList from '../../components/coordinator/StudentList';
import SemesterClassSelector from '../../components/coordinator/SemesterClassSelector';

const DepartmentSetup = ({ navigation }) => {
  const theme = useTheme();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newSemester, setNewSemester] = useState('');
  const [newClass, setNewClass] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [savedTimetables, setSavedTimetables] = useState([]);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  // Time slots for the timetable
  const timeSlots = [
    '8:00 - 9:30',
    '9:45 - 11:15',
    '11:30 - 1:00',
    '2:00 - 3:30',
    '3:45 - 5:15'
  ];

  const tabs = [
    { id: 'courses', label: 'Courses', icon: 'book' },
    { id: 'rooms', label: 'Rooms', icon: 'door' },
    { id: 'teachers', label: 'Teachers', icon: 'teach' },
    { id: 'students', label: 'Students', icon: 'account-group' },
    { id: 'semesters', label: 'Semesters', icon: 'calendar' },
    { id: 'classes', label: 'Classes', icon: 'google-classroom' },
  ];

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (department) {
      loadDepartmentData();
      Animated.spring(contentAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      contentAnim.setValue(0);
    }
  }, [department]);

  const loadDepartmentData = () => {
    setLoading(true);
    setTimeout(() => {
      setCourses([
        { id: '1', name: 'Data Structures', code: 'CS201' },
        { id: '2', name: 'Algorithms', code: 'CS202' },
        { id: '3', name: 'Database Systems', code: 'CS203' },
      ]);
      setRooms([
        { id: '1', name: 'Room 101', capacity: 40 },
        { id: '2', name: 'Room 102', capacity: 60 },
        { id: '3', name: 'Lab 201', capacity: 30 },
      ]);
      setTeachers([
        { id: '1', name: 'Dr. Smith', email: 'smith@univ.edu' },
        { id: '2', name: 'Prof. Johnson', email: 'johnson@univ.edu' },
      ]);
      setStudents([
        { id: '1', name: 'John Doe', rollNo: 'CS101', semester: 'spring', class: 'CS-A' },
        { id: '2', name: 'Jane Smith', rollNo: 'CS102', semester: 'spring', class: 'CS-A' },
        { id: '3', name: 'Mike Johnson', rollNo: 'CS201', semester: 'fall', class: 'CS-B' },
      ]);
      setSemesters([
        { id: '1', name: 'Spring 2023', startDate: '2023-01-15', endDate: '2023-05-20' },
        { id: '2', name: 'Fall 2023', startDate: '2023-08-20', endDate: '2023-12-15' },
      ]);
      setClasses([
        { id: '1', name: 'CS-A', semester: 'spring', capacity: 40 },
        { id: '2', name: 'CS-B', semester: 'fall', capacity: 35 },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleAddCourse = () => {
    if (newCourse.trim()) {
      setCourses([...courses, { 
        id: Date.now().toString(), 
        name: newCourse,
        code: `CS${Math.floor(100 + Math.random() * 900)}`
      }]);
      setNewCourse('');
    }
  };

  const handleAddRoom = () => {
    if (newRoom.trim()) {
      setRooms([...rooms, { 
        id: Date.now().toString(), 
        name: newRoom,
        capacity: 40
      }]);
      setNewRoom('');
    }
  };

  const handleAddSemester = () => {
    if (newSemester.trim()) {
      setSemesters([...semesters, { 
        id: Date.now().toString(), 
        name: newSemester,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }]);
      setNewSemester('');
    }
  };

  const handleAddClass = () => {
    if (newClass.trim() && selectedSemester) {
      setClasses([...classes, { 
        id: Date.now().toString(), 
        name: newClass,
        semester: selectedSemester.id,
        capacity: 40
      }]);
      setNewClass('');
    }
  };

  const handleRemoveItem = (list, setList, id) => {
    setList(list.filter(item => item.id !== id));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Preferences', { department });
    }, 1500);
  };

  const handleRefresh = () => {
    setLoading(true);
    loadDepartmentData();
  };

  const generateTimetable = () => {
    setLoading(true);
    setTimeout(() => {
      const timetableData = {
        id: Date.now().toString(),
        semester: selectedSemester?.name || 'All Semesters',
        class: selectedClass?.name || 'All Classes',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        periods: timeSlots,
        schedule: {
          'Monday': {
            '8:00 - 9:30': { course: 'Data Structures', teacher: 'Dr. Smith', room: 'Room 101' },
            '9:45 - 11:15': { course: 'Algorithms', teacher: 'Prof. Johnson', room: 'Room 102' },
            '11:30 - 1:00': { course: 'Database Systems', teacher: 'Dr. Smith', room: 'Lab 201' },
          },
          'Tuesday': {
            '8:00 - 9:30': { course: 'Algorithms', teacher: 'Prof. Johnson', room: 'Room 102' },
            '9:45 - 11:15': { course: 'Data Structures', teacher: 'Dr. Smith', room: 'Room 101' },
          },
          'Wednesday': {
            '8:00 - 9:30': { course: 'Database Systems', teacher: 'Dr. Smith', room: 'Lab 201' },
            '11:30 - 1:00': { course: 'Algorithms', teacher: 'Prof. Johnson', room: 'Room 102' },
          },
          'Thursday': {
            '9:45 - 11:15': { course: 'Data Structures', teacher: 'Dr. Smith', room: 'Room 101' },
            '2:00 - 3:30': { course: 'Database Systems', teacher: 'Dr. Smith', room: 'Lab 201' },
          },
          'Friday': {
            '8:00 - 9:30': { course: 'Algorithms', teacher: 'Prof. Johnson', room: 'Room 102' },
            '3:45 - 5:15': { course: 'Data Structures', teacher: 'Dr. Smith', room: 'Room 101' },
          }
        },
        createdAt: new Date().toISOString()
      };
      setGeneratedTimetable(timetableData);
      setShowTimetableModal(true);
      setLoading(false);
    }, 2000);
  };

  const saveTimetable = () => {
    if (generatedTimetable) {
      setSavedTimetables([...savedTimetables, generatedTimetable]);
      setShowTimetableModal(false);
      navigation.navigate('TimetableGeneration', { 
        department,
        timetable: generatedTimetable,
        semester: selectedSemester,
        class: selectedClass
      });
    }
  };

  const viewSavedTimetable = (timetable) => {
    setGeneratedTimetable(timetable);
    setShowTimetableModal(true);
  };

  const renderTimetableCell = (day, timeSlot) => {
    const period = generatedTimetable.schedule[day]?.[timeSlot];
    if (!period) return <View style={styles.emptyCell} />;
    
    return (
      <TouchableOpacity 
        style={[styles.cell, { backgroundColor: theme.colors.surface }]}
        onPress={() => console.log('Period details:', period)}
      >
        <Text style={[styles.cellCourse, { color: theme.colors.primary }]} numberOfLines={1}>
          {period.course}
        </Text>
        <Text style={[styles.cellInfo, { color: theme.colors.text }]} numberOfLines={1}>
          {period.teacher}
        </Text>
        <Text style={[styles.cellInfo, { color: theme.colors.placeholder }]} numberOfLines={1}>
          {period.room}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimetableHeader = () => (
    <View style={[styles.headerRow, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.timeColumn}>
        <Text style={[styles.headerText, { color: theme.colors.text }]}>Time</Text>
      </View>
      {generatedTimetable.days.map(day => (
        <View key={day} style={styles.dayColumn}>
          <Text style={[styles.headerText, { color: theme.colors.text }]} numberOfLines={1}>
            {day}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderTimetableRow = ({ item: timeSlot }) => (
    <View style={[styles.timetableRow, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.timeColumn}>
        <Text style={[styles.timeText, { color: theme.colors.text }]}>{timeSlot}</Text>
      </View>
      {generatedTimetable.days.map(day => (
        <View key={`${day}-${timeSlot}`} style={styles.dayColumn}>
          {renderTimetableCell(day, timeSlot)}
        </View>
      ))}
    </View>
  );

  const renderSavedTimetables = () => {
    if (savedTimetables.length === 0) return null;
    
    return (
      <View style={styles.savedTimetablesContainer}>
        <Text style={[styles.subtitle, { color: theme.colors.primary, marginTop: 16 }]}>
          Saved Timetables
        </Text>
        <ScrollView horizontal style={styles.savedTimetablesList}>
          {savedTimetables.map((timetable, index) => (
            <TouchableOpacity
              key={timetable.id}
              onPress={() => viewSavedTimetable(timetable)}
              style={[styles.savedTimetableCard, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.savedTimetableTitle, { color: theme.colors.primary }]}>
                Timetable #{index + 1}
              </Text>
              <Text style={[styles.savedTimetableText, { color: theme.colors.text }]}>
                {timetable.semester}
              </Text>
              {timetable.class !== 'All Classes' && (
                <Text style={[styles.savedTimetableText, { color: theme.colors.text }]}>
                  Class: {timetable.class}
                </Text>
              )}
              <Text style={[styles.savedTimetableDate, { color: theme.colors.placeholder }]}>
                {new Date(timetable.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderDepartmentContent = () => {
    if (!department) return null;

    return (
      <Animated.View
        style={{
          opacity: contentAnim,
          transform: [{
            translateY: contentAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }}
      >
        <SemesterClassSelector 
          semesters={semesters} 
          classes={classes} 
          onSemesterSelect={setSelectedSemester} 
          onClassSelect={setSelectedClass}
          selectedSemester={selectedSemester}
          selectedClass={selectedClass}
        />

        <View style={styles.tabs}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tab,
                { 
                  backgroundColor: activeTab === tab.id 
                    ? theme.colors.primary 
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <MaterialCommunityIcons 
                name={tab.icon} 
                size={20} 
                color={activeTab === tab.id ? theme.colors.onPrimary : theme.colors.primary} 
              />
              <Text 
                style={[
                  styles.tabText,
                  { 
                    color: activeTab === tab.id 
                      ? theme.colors.onPrimary 
                      : theme.colors.primary,
                  }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.contentCard}>
          {activeTab === 'courses' && (
            <>
              <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
                {department?.name || 'Department'} Courses
              </Text>
              <View style={styles.addItemContainer}>
                <InputField
                  label="Add New Course"
                  value={newCourse}
                  onChangeText={setNewCourse}
                  style={styles.addInput}
                  onSubmitEditing={handleAddCourse}
                  placeholder="Enter course name"
                />
                <Button 
                  title="Add" 
                  onPress={handleAddCourse} 
                  style={styles.addButton} 
                  disabled={!newCourse.trim()}
                />
              </View>
              <ScrollView style={styles.listContainer}>
                {courses.map(course => (
                  <View key={course.id} style={styles.listItem}>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemText, { color: theme.colors.primary }]}>
                        {course.name}
                      </Text>
                      <Text style={[styles.itemSubtext, { color: theme.colors.placeholder }]}>
                        {course.code}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleRemoveItem(courses, setCourses, course.id)}
                      style={styles.removeButton}
                    >
                      <MaterialCommunityIcons 
                        name="close" 
                        size={20} 
                        color={theme.colors.error} 
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {activeTab === 'rooms' && (
            <>
              <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
                {department?.name || 'Department'} Rooms
              </Text>
              <View style={styles.addItemContainer}>
                <InputField
                  label="Add New Room"
                  value={newRoom}
                  onChangeText={setNewRoom}
                  style={styles.addInput}
                  onSubmitEditing={handleAddRoom}
                  placeholder="Enter room name"
                />
                <Button 
                  title="Add" 
                  onPress={handleAddRoom} 
                  style={styles.addButton} 
                  disabled={!newRoom.trim()}
                />
              </View>
              <ScrollView style={styles.listContainer}>
                {rooms.map(room => (
                  <View key={room.id} style={styles.listItem}>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemText, { color: theme.colors.primary }]}>
                        {room.name}
                      </Text>
                      <Text style={[styles.itemSubtext, { color: theme.colors.placeholder }]}>
                        Capacity: {room.capacity}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleRemoveItem(rooms, setRooms, room.id)}
                      style={styles.removeButton}
                    >
                      <MaterialCommunityIcons 
                        name="close" 
                        size={20} 
                        color={theme.colors.error} 
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {activeTab === 'teachers' && (
            <>
              <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
                {department?.name || 'Department'} Teachers
              </Text>
              <Button 
                title="Import Teachers" 
                onPress={() => {}} 
                icon="import" 
                style={styles.actionButton}
              />
              <Button 
                title="Add New Teacher" 
                onPress={() => navigation.navigate('AddTeacher')} 
                icon="account-plus" 
                style={styles.actionButton}
                type="outline"
              />
              
              <ScrollView style={styles.listContainer}>
                {teachers.map(teacher => (
                  <TouchableOpacity 
                    key={teacher.id} 
                    style={styles.teacherItem}
                    onPress={() => navigation.navigate('TeacherDetails', { teacher })}
                  >
                    <MaterialCommunityIcons 
                      name="account" 
                      size={24} 
                      color={theme.colors.primary} 
                      style={styles.teacherIcon}
                    />
                    <View style={styles.teacherInfo}>
                      <Text style={[styles.teacherName, { color: theme.colors.text }]}>
                        {teacher.name}
                      </Text>
                      <Text style={[styles.teacherEmail, { color: theme.colors.placeholder }]}>
                        {teacher.email}
                      </Text>
                    </View>
                    <MaterialCommunityIcons 
                      name="chevron-right" 
                      size={24} 
                      color={theme.colors.placeholder} 
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {activeTab === 'students' && (
            <>
              <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
                {department?.name || 'Department'} Students
              </Text>
              <Button 
                title="Import Students" 
                onPress={() => {}} 
                icon="import" 
                style={styles.actionButton}
              />
              <Button 
                title="Add New Student" 
                onPress={() => navigation.navigate('AddStudent')} 
                icon="account-plus" 
                style={styles.actionButton}
                type="outline"
              />
              
              <StudentList 
                students={students} 
                onStudentPress={(student) => navigation.navigate('StudentDetails', { student })}
                filterSemester={selectedSemester?.id}
                filterClass={selectedClass?.id}
              />
            </>
          )}

          {activeTab === 'semesters' && (
            <>
              <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
                {department?.name || 'Department'} Semesters
              </Text>
              <View style={styles.addItemContainer}>
                <InputField
                  label="Add New Semester"
                  value={newSemester}
                  onChangeText={setNewSemester}
                  style={styles.addInput}
                  onSubmitEditing={handleAddSemester}
                  placeholder="Enter semester name (e.g., Fall 2023)"
                />
                <Button 
                  title="Add" 
                  onPress={handleAddSemester} 
                  style={styles.addButton} 
                  disabled={!newSemester.trim()}
                />
              </View>
              <ScrollView style={styles.listContainer}>
                {semesters.map(semester => (
                  <View key={semester.id} style={styles.listItem}>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemText, { color: theme.colors.primary }]}>
                        {semester.name}
                      </Text>
                      <Text style={[styles.itemSubtext, { color: theme.colors.placeholder }]}>
                        {semester.startDate} to {semester.endDate}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleRemoveItem(semesters, setSemesters, semester.id)}
                      style={styles.removeButton}
                    >
                      <MaterialCommunityIcons 
                        name="close" 
                        size={20} 
                        color={theme.colors.error} 
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {activeTab === 'classes' && (
            <>
              <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
                {department?.name || 'Department'} Classes
              </Text>
              <View style={styles.addItemContainer}>
                <InputField
                  label="Add New Class"
                  value={newClass}
                  onChangeText={setNewClass}
                  style={styles.addInput}
                  onSubmitEditing={handleAddClass}
                  placeholder="Enter class name (e.g., CS-A)"
                />
                <Button 
                  title="Add" 
                  onPress={handleAddClass} 
                  style={styles.addButton} 
                  disabled={!newClass.trim() || !selectedSemester}
                />
              </View>
              <View style={styles.semesterSelector}>
                <Text style={[styles.label, { color: theme.colors.text }]}>For Semester:</Text>
                <View style={styles.semesterButtons}>
                  {semesters.map(semester => (
                    <TouchableOpacity
                      key={semester.id}
                      onPress={() => setSelectedSemester(semester)}
                      style={[
                        styles.semesterButton,
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
                          styles.semesterButtonText,
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
              <ScrollView style={styles.listContainer}>
                {classes
                  .filter(cls => !selectedSemester || cls.semester === selectedSemester.id)
                  .map(cls => (
                    <View key={cls.id} style={styles.listItem}>
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemText, { color: theme.colors.primary }]}>
                          {cls.name}
                        </Text>
                        <Text style={[styles.itemSubtext, { color: theme.colors.placeholder }]}>
                          {semesters.find(s => s.id === cls.semester)?.name || 'No Semester'} | Capacity: {cls.capacity}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleRemoveItem(classes, setClasses, cls.id)}
                        style={styles.removeButton}
                      >
                        <MaterialCommunityIcons 
                          name="close" 
                          size={20} 
                          color={theme.colors.error} 
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </ScrollView>
            </>
          )}
        </Card>

        {renderSavedTimetables()}

        <View style={styles.buttonRow}>
          <Button 
            title="Generate Timetable" 
            onPress={generateTimetable} 
            style={styles.actionButton}
            icon="timetable"
            disabled={courses.length === 0 || rooms.length === 0 || teachers.length === 0}
          />
          <Button 
            title="Continue to Preferences" 
            onPress={handleSave} 
            style={styles.actionButton}
            icon="arrow-right"
            disabled={courses.length === 0 || rooms.length === 0 || teachers.length === 0}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Department Setup" 
        rightIcon="refresh"
        onRightPress={handleRefresh}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ 
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }],
          opacity: slideAnim
        }}>
          <Card style={styles.departmentCard}>
            <DepartmentSelector 
              onSelect={setDepartment} 
              selectedDepartment={department}
              coordinatorMode={true}
            />
          </Card>

          {renderDepartmentContent()}
        </Animated.View>
      </ScrollView>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
            {activeTab === 'teachers' ? 'Loading teachers...' : 
             activeTab === 'rooms' ? 'Loading rooms...' : 
             activeTab === 'students' ? 'Loading students...' : 
             activeTab === 'semesters' ? 'Loading semesters...' :
             activeTab === 'classes' ? 'Loading classes...' : 'Loading courses...'}
          </Text>
        </View>
      )}

      <Modal
        visible={showTimetableModal}
        animationType="slide"
        onRequestClose={() => setShowTimetableModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <Header 
            title={`Timetable - ${generatedTimetable?.semester} ${generatedTimetable?.class ? `- ${generatedTimetable.class}` : ''}`}
            leftIcon="close"
            onLeftPress={() => setShowTimetableModal(false)}
          />
          
          {generatedTimetable && (
            <View style={styles.timetableContainer}>
              <ScrollView horizontal>
                <View>
                  {renderTimetableHeader()}
                  <FlatList
                    data={timeSlots}
                    renderItem={renderTimetableRow}
                    keyExtractor={(item) => item}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>
          )}
          
          <Button 
            title="Save Timetable" 
            onPress={saveTimetable} 
            style={styles.modalButton}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  departmentCard: {
    margin: 16,
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  tab: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  contentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  addInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    width: 80,
    alignSelf: 'flex-end',
  },
  listContainer: {
    maxHeight: 300,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  itemSubtext: {
    fontSize: 12,
  },
  removeButton: {
    padding: 4,
  },
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  teacherIcon: {
    marginRight: 12,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '500',
  },
  teacherEmail: {
    fontSize: 12,
  },
  actionButton: {
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  semesterSelector: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  semesterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  semesterButton: {
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  semesterButtonText: {
    fontSize: 12,
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
  modalContainer: {
    flex: 1,
  },
  timetableContainer: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    minWidth: 800,
  },
  timetableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    minWidth: 800,
  },
  timeColumn: {
    width: 100,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  dayColumn: {
    flex: 1,
    width: 140,
    padding: 2,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeText: {
    textAlign: 'center',
    fontSize: 12,
  },
  cell: {
    flex: 1,
    padding: 4,
    borderRadius: 4,
    margin: 2,
    justifyContent: 'center',
    minHeight: 60,
  },
  emptyCell: {
    flex: 1,
    padding: 4,
    margin: 2,
    minHeight: 60,
  },
  cellCourse: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellInfo: {
    fontSize: 10,
    textAlign: 'center',
  },
  modalButton: {
    margin: 16,
  },
  savedTimetablesContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  savedTimetablesList: {
    marginTop: 8,
  },
  savedTimetableCard: {
    width: 160,
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
  },
  savedTimetableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savedTimetableText: {
    fontSize: 12,
    marginBottom: 2,
  },
  savedTimetableDate: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default DepartmentSetup;