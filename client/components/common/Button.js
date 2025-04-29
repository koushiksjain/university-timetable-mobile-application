import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, Platform, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';

const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false, 
  type = 'primary',
  icon,
  iconPosition = 'left',
  iconSize = 20,
  iconColor
}) => {
  const theme = useTheme();
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  
  const getButtonStyle = () => {
    const baseStyle = [
      styles.button, 
      { 
        backgroundColor: disabled ? theme.colors.disabled : 
          type === 'secondary' ? theme.colors.secondary : 
          type === 'outline' ? 'transparent' : theme.colors.primary,
        borderWidth: type === 'outline' ? 2 : 0,
        borderColor: type === 'outline' ? theme.colors.primary : 'transparent',
        opacity: disabled ? 0.6 : 1
      }, 
      style
    ];
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [
      styles.text, 
      { 
        color: type === 'outline' ? theme.colors.primary : theme.colors.onPrimary,
        marginLeft: icon && iconPosition === 'left' ? 8 : 0,
        marginRight: icon && iconPosition === 'right' ? 8 : 0
      }, 
      textStyle
    ];
    return baseStyle;
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    return type === 'outline' ? theme.colors.primary : theme.colors.onPrimary;
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={iconSize} 
              color={getIconColor()} 
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={iconSize} 
              color={getIconColor()} 
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;