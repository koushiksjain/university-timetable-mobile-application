import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import TimetableGenerator from '../../components/coordinator/TimetableGenerator';
import Loader from '../../components/common/Loader';

const TimetableGeneration = ({ navigation, route }) => {
  const theme = useTheme();
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [activeView, setActiveView] = useState('department');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { teachers } = route.params;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGenerate = (timetable) => {
    setGeneratedTimetable(timetable);
    // Simulate conflict detection
    const mockConflicts = [
      { id: '1', teacher: 'Dr. Smith', time: 'Mon 10:00-11:00', conflict: 'Double booking' },
      { id: '2', teacher: 'Prof. Johnson', time: 'Wed 14:00-15:00', conflict: 'Room overlap' },
    ];
    setConflicts(mockConflicts);
  };

  const handleResolveConflict = (id) => {
    setConflicts(conflicts.filter(conflict => conflict.id !== id));
  };

  const handleSaveTimetable = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      navigation.navigate('TimetableApproval', { timetable: generatedTimetable });
    }, 1500);
  };

  const handleRegenerate = () => {
    setGeneratedTimetable(null);
    setConflicts([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Timetable Generation" 
        onBack={() => navigation.goBack()} 
        rightIcon="timetable"
      />

      <Animated.View style={{ 
        flex: 1, 
        transform: [{ scale: scaleAnim }],
        opacity: fadeAnim,
      }}>
        {!generatedTimetable ? (
          <Card style={styles.generatorCard}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Generate New Timetable
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.placeholder }]}>
              Based on {teachers.length} teacher preferences
            </Text>
            <TimetableGenerator 
              preferences={teachers} 
              onGenerate={handleGenerate}
            />
          </Card>
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Generated Timetable
              </Text>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons 
                    name="account" 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                  <Text style={[styles.statText, { color: theme.colors.text }]}>
                    {teachers.length} teachers
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons 
                    name="error" 
                    size={20} 
                    color={conflicts.length > 0 ? theme.colors.error : theme.colors.primary} 
                  />
                  <Text style={[
                    styles.statText, 
                    { 
                      color: conflicts.length > 0 ? theme.colors.error : theme.colors.text,
                    }
                  ]}>
                    {conflicts.length} conflicts
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.viewToggle}>
              <Button 
                title="Department View" 
                onPress={() => setActiveView('department')} 
                type={activeView === 'department' ? 'primary' : 'outline'} 
                style={styles.toggleButton} 
              />
              <Button 
                title="Teacher View" 
                onPress={() => setActiveView('teacher')} 
                type={activeView === 'teacher' ? 'primary' : 'outline'} 
                style={styles.toggleButton} 
              />
            </View>

            <Card style={styles.timetableCard}>
              {/* This would be replaced with your actual timetable component */}
              <View style={styles.timetablePlaceholder}>
                <MaterialCommunityIcons 
                  name="timetable" 
                  size={60} 
                  color={theme.colors.placeholder} 
                />
                <Text style={[styles.placeholderText, { color: theme.colors.text }]}>
                  {activeView === 'department' 
                    ? 'Department Timetable View' 
                    : 'Individual Teacher Schedules'}
                </Text>
              </View>
            </Card>

            {conflicts.length > 0 && (
              <Card style={styles.conflictsCard}>
                <Text style={[styles.conflictsTitle, { color: theme.colors.text }]}>
                  Schedule Conflicts
                </Text>
                {conflicts.map(conflict => (
                  <View key={conflict.id} style={styles.conflictItem}>
                    <View style={styles.conflictInfo}>
                      <Text style={[styles.conflictTeacher, { color: theme.colors.text }]}>
                        {conflict.teacher}
                      </Text>
                      <Text style={[styles.conflictTime, { color: theme.colors.placeholder }]}>
                        {conflict.time}
                      </Text>
                      <Text style={[styles.conflictType, { color: theme.colors.error }]}>
                        {conflict.conflict}
                      </Text>
                    </View>
                    <Button 
                      title="Resolve" 
                      onPress={() => handleResolveConflict(conflict.id)} 
                      style={styles.resolveButton} 
                      type="outline"
                      color={theme.colors.error}
                    />
                  </View>
                ))}
              </Card>
            )}

            <View style={styles.actions}>
              <Button 
                title="Regenerate" 
                onPress={handleRegenerate} 
                type="outline" 
                style={styles.actionButton} 
                icon="refresh"
              />
              <Button 
                title="Save & Publish" 
                onPress={handleSaveTimetable} 
                style={styles.actionButton} 
                disabled={conflicts.length > 0}
                loading={saving}
                icon="content-save"
              />
            </View>
          </ScrollView>
        )}
      </Animated.View>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Generating optimal timetable...
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
  generatorCard: {
    margin: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
  },
  viewToggle: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  timetableCard: {
    marginBottom: 16,
    minHeight: 300,
  },
  timetablePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  conflictsCard: {
    marginBottom: 16,
  },
  conflictsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  conflictItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  conflictInfo: {
    flex: 1,
  },
  conflictTeacher: {
    fontSize: 16,
    fontWeight: '500',
  },
  conflictTime: {
    fontSize: 14,
  },
  conflictType: {
    fontSize: 12,
    marginTop: 4,
  },
  resolveButton: {
    width: 100,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
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

export default TimetableGeneration;