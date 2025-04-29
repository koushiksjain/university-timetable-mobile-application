import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';

const Header = ({ title, onBack, rightIcon, onRightPress, scrollY }) => {
  const theme = useTheme();
  const headerHeight = useRef(new Animated.Value(100)).current;
  const titleOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (scrollY) {
      const headerShrink = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [100, 60],
        extrapolate: 'clamp',
      });

      const titleFade = scrollY.interpolate({
        inputRange: [0, 60],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

      headerHeight.setValue(headerShrink);
      titleOpacity.setValue(titleFade);
    }
  }, [scrollY]);

  return (
    <Animated.View style={[styles.container, { 
      height: headerHeight,
      backgroundColor: theme.colors.primary,
      borderBottomColor: theme.colors.border,
    }]}>
      <View style={styles.content}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.icon}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        )}
        
        <Animated.Text 
          style={[
            styles.title, 
            { 
              color: theme.colors.onPrimary,
              opacity: titleOpacity 
            }
          ]}
          numberOfLines={1}
        >
          {title}
        </Animated.Text>
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.icon}>
            <Ionicons name={rightIcon} size={24} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  icon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;