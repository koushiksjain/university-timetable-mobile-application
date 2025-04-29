import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext'; // <-- Import

const ProfileScreen = ({ navigation }) => {
  const { user: authUser, logout } = useAuth(); // Get user from auth context
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    department: 'Computer Science',
    role: 'Student',
    studentId: 'CS20210045',
    phone: '+1 (555) 123-4567',
    bio: 'Final year CS student interested in AI and Machine Learning',
  });
  const [tempUser, setTempUser] = useState({ ...user });
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Update local user state when authUser changes
  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        name: authUser.name || prev.name,
        email: authUser.email || prev.email,
        role: authUser.role || prev.role
      }));
    }
  }, [authUser]);

  const handleEdit = () => {
    setEditMode(true);
    setTempUser({ ...user });
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ ...tempUser });
      setEditMode(false);
      setSaving(false);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };

  const handleCancel = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setEditMode(false);
      fadeAnim.setValue(1);
    });
  };

  const handleChange = (field, value) => {
    setTempUser(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await logout(); // <-- Call logout, user becomes null, RootNavigator rerenders
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="My Profile" 
        onBack={() => navigation.goBack()} 
        rightIcon={editMode ? 'close' : 'pencil'}
        onRightPress={editMode ? handleCancel : handleEdit}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={[
            styles.profileContainer,
            { 
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          <View style={styles.avatarContainer}>
            <TouchableOpacity 
              style={styles.avatarWrapper}
              disabled={!editMode}
              onPress={() => console.log('Change photo')}
            >
              <Image 
                source={require('../../assets/images/icon.png')} 
                style={styles.avatar}
              />
              {editMode && (
                <View style={[
                  styles.avatarOverlay,
                  { backgroundColor: 'rgba(0,0,0,0.5)' }
                ]}>
                  <MaterialIcons 
                    name="edit" 
                    size={24} 
                    color="#FFFFFF" 
                  />
                </View>
              )}
            </TouchableOpacity>
            {!editMode && (
              <Text style={[styles.roleBadge, { backgroundColor: theme.colors.primary }]}>
                {user.role}
              </Text>
            )}
          </View>

          {editMode ? (
            <Card style={styles.editForm}>
              <InputField
                label="Full Name"
                value={tempUser.name}
                onChangeText={(text) => handleChange('name', text)}
                icon="account"
                style={styles.input}
              />
              <InputField
                label="Email"
                value={tempUser.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                icon="email"
                style={styles.input}
              />
              <InputField
                label="Phone"
                value={tempUser.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
                icon="phone"
                style={styles.input}
              />
              <InputField
                label="Department"
                value={tempUser.department}
                onChangeText={(text) => handleChange('department', text)}
                icon="domain"
                style={styles.input}
              />
              <InputField
                label="Bio"
                value={tempUser.bio}
                onChangeText={(text) => handleChange('bio', text)}
                multiline
                icon="text"
                style={styles.input}
              />

              <View style={styles.formButtons}>
                <Button 
                  title="Cancel" 
                  onPress={handleCancel} 
                  type="outline" 
                  style={styles.formButton} 
                />
                <Button 
                  title="Save Changes" 
                  onPress={handleSave} 
                  style={styles.formButton} 
                  loading={saving}
                />
              </View>
            </Card>
          ) : (
            <Card style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons 
                  name="account" 
                  size={20} 
                  color={theme.colors.primary} 
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                  {user.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons 
                  name="email" 
                  size={20} 
                  color={theme.colors.primary} 
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                  {user.email}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons 
                  name="domain" 
                  size={20} 
                  color={theme.colors.primary} 
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                  {user.department}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons 
                  name="identifier" 
                  size={20} 
                  color={theme.colors.primary} 
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                  {user.studentId}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons 
                  name="phone" 
                  size={20} 
                  color={theme.colors.primary} 
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                  {user.phone}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons 
                  name="text" 
                  size={20} 
                  color={theme.colors.primary} 
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                  {user.bio}
                </Text>
              </View>
            </Card>
          )}

          {!editMode && (
            <>
              <Button 
                title="Change Password" 
                onPress={() => navigation.navigate('ForgotPassword')} 
                type="outline" 
                icon="lock-reset"
                style={styles.actionButton}
              />
              <Button 
                title="Log Out" 
                onPress={handleLogout} 
                icon="logout"
                style={styles.actionButton}
                textStyle={{ color: theme.colors.error }}
                color={theme.colors.error}
                type="outline"
              />
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadge: {
    position: 'absolute',
    bottom: -8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  profileInfo: {
    width: '100%',
    padding: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
    width: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
  },
  editForm: {
    width: '100%',
    padding: 20,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButton: {
    marginTop: 8,
    width: '100%',
  },
});

export default ProfileScreen;