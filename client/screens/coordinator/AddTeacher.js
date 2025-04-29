import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import InputField from '../../components/common/InputField';

const AddTeacher = ({ navigation, route }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: route.params?.department || '',
    courses: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Add Teacher" 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.formCard}>
          <InputField
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            icon="account"
            placeholder="Enter teacher's full name"
            required
          />

          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            icon="email"
            placeholder="Enter teacher's email"
            keyboardType="email-address"
            required
          />

          <InputField
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            icon="phone"
            placeholder="Enter teacher's phone"
            keyboardType="phone-pad"
          />

          <InputField
            label="Department"
            value={formData.department}
            onChangeText={(text) => handleChange('department', text)}
            icon="office-building"
            placeholder="Enter department"
          />

          <Button 
            title="Add Teacher" 
            onPress={handleSubmit} 
            style={styles.submitButton}
            loading={loading}
            disabled={!formData.name || !formData.email}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  formCard: {
    padding: 16,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default AddTeacher;