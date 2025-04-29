// screens/auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../config/theme';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ForgotPasswordScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Implement password reset logic here
    alert(`Password reset link sent to ${email}`);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Reset Password
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.placeholder }]}>
          Enter your email to receive a reset link
        </Text>

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon="email"
          style={styles.input}
        />

        <Button
          title="Send Reset Link"
          onPress={handleResetPassword}
          style={styles.button}
          disabled={!email}
        />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: theme.colors.primary }]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
  },
  backText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;