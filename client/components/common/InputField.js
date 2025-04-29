import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';

const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  secureTextEntry = false, 
  keyboardType, 
  error, 
  icon, 
  rightIcon,
  onRightIconPress,
  onIconPress,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props 
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    Animated.timing(labelPosition, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const animatedLabelStyle = {
    position: 'absolute',
    left: 12,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.placeholder, theme.colors.primary],
    }),
    backgroundColor: theme.colors.background,
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const getRightIcon = () => {
    if (secureTextEntry) {
      return showPassword ? 'eye-off' : 'eye';
    }
    return rightIcon;
  };

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setShowPassword(!showPassword);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={[styles.label, animatedLabelStyle, labelStyle]}>
        {label}
      </Animated.Text>
      <View style={{ position: 'relative' }}>
        {icon && (
          <View style={[styles.iconContainer, { left: 12, top: 16 }]}>
            <Ionicons 
              name={icon} 
              size={20} 
              color={isFocused ? theme.colors.primary : theme.colors.placeholder} 
            />
          </View>
        )}
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
              color: theme.colors.text,
              paddingLeft: icon ? 40 : 12,
              paddingRight: rightIcon || secureTextEntry ? 40 : 12,
              backgroundColor: theme.colors.background,
            },
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.placeholder}
          {...props}
        />
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity 
            style={[styles.iconContainer, { right: 12, top: 16 }]}
            onPress={handleRightIconPress}
          >
            <Ionicons 
              name={getRightIcon()} 
              size={20} 
              color={isFocused ? theme.colors.primary : theme.colors.placeholder} 
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: 16,
    fontSize: 16,
  },
  label: {
    zIndex: 1,
  },
  iconContainer: {
    position: 'absolute',
    padding: 8,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
  },
});

export default InputField;