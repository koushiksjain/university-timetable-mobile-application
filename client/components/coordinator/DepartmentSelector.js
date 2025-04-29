import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';


const departments = [
  { id: 'cse', name: 'Computer Science', color: '#FF6B6B' },
  { id: 'ece', name: 'Electronics & Communication', color: '#4ECDC4' },
  { id: 'mech', name: 'Mechanical Engineering', color: '#45B7D1' },
];

const DepartmentSelector = ({ onSelect, selectedDepartment, coordinatorMode = false }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: expanded ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateValue, {
        toValue: expanded ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setExpanded(!expanded);
  };

  const handleSelect = (item) => {
    onSelect(item);
    toggleExpand();
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [60, coordinatorMode ? 400 : 350],
  });

  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <Card style={[styles.departmentCard, { 
        backgroundColor: item.id === selectedDepartment?.id ? theme.colors.primary : theme.colors.surface,
        borderColor: item.id === selectedDepartment?.id ? theme.colors.primary : theme.colors.border,
      }]}>
        <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
        <Text style={[styles.departmentText, { 
          color: item.id === selectedDepartment?.id ? theme.colors.onPrimary : theme.colors.primary 
        }]}>
          {item.name}
        </Text>
        {coordinatorMode && (
          <View style={styles.infoBadge}>
            <Text style={styles.infoText}>5 Teachers</Text>
            <Text style={styles.infoText}>12 Courses</Text>
            <Text style={styles.infoText}>120 Students</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <Animated.View style={[styles.container, { height: heightInterpolation }]}>
        <TouchableOpacity 
          onPress={toggleExpand} 
          style={[styles.header, { borderColor: theme.colors.border }]}
        >
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            {selectedDepartment?.name || 'Select Department'}
          </Text>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
            <MaterialIcons 
              name="keyboard-arrow-down" 
              size={24} 
              color={theme.colors.primary} 
            />
          </Animated.View>
        </TouchableOpacity>

        {expanded && (
          <FlatList
            data={departments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
  },
  container: {
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingTop: 12,
  },
  departmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  departmentText: {
    fontSize: 16,
    flex: 1,
  },
  infoBadge: {
    alignItems: 'flex-end',
  },
  infoText: {
    fontSize: 10,
    color: '#666',
  },
});

export default DepartmentSelector;