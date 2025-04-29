import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';

const Checkbox = ({ value, onValueChange, label }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onValueChange}
      activeOpacity={0.7}
    >
      <View style={[
        styles.checkbox, 
        { 
          borderColor: value ? theme.colors.primary : theme.colors.border,
          backgroundColor: value ? theme.colors.primary : 'transparent',
        }
      ]}>
        {value && (
          <MaterialIcons name="check" size={16} color={theme.colors.onPrimary} />
        )}
      </View>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
  },
});

export default Checkbox;