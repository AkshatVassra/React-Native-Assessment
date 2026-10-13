import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../src/core/theme/colors';
import { Spacing } from '../../../src/core/theme/spacing';
import { Typography } from '../../../src/core/theme/typography';
import { CustomInput } from '../components/common/CustomInput';
import { CustomButton } from '../components/common/CustomButton';
import { SocialLoginButtons } from '../components/common/SocialLoginButtons';
import { AuthBloc } from '../blocs/auth/auth_bloc';
import { useBlocState } from '../../../src/core/bloc/bloc.provider';

interface RegisterScreenProps {
  authBloc: AuthBloc;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  authBloc,
  onNavigateToLogin,
}) => {
  const authState = useBlocState(authBloc);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = () => {
    if (!email.trim()) {
      setLocalError('Please enter an email address.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    setLocalError(null);

    authBloc.add({
      type: 'REGISTER_REQUESTED',
      email,
      password,
    });
  };

  const handleSocialPress = (provider: string) => {
    Alert.alert(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign Up`,
      `Sign up with ${provider} OAuth... Creating your account.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            authBloc.add({
              type: 'REGISTER_REQUESTED',
              email: `new.${provider}@gigworker.com`,
              password: 'socialPassword123',
            });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const errorMessage = localError || authState.errorMessage;
  const isLoading = authState.status === 'loading';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo at the top matching screenshot 2 screen 2 */}
          <View style={styles.topLogoArea}>
            <View style={styles.logoSquircle}>
              <Ionicons name="checkmark-sharp" size={32} color={Colors.textWhite} />
            </View>
            <Text style={styles.titleText}>Let's get started!</Text>
          </View>

          {/* Error Banner */}
          {Boolean(errorMessage) && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={Colors.error} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Form fields */}
          <View style={styles.formContainer}>
            <CustomInput
              label="EMAIL ADDRESS"
              placeholder="e.g. gig.worker@domain.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setLocalError(null);
                if (authState.errorMessage) {
                  authBloc.add({ type: 'CLEAR_AUTH_ERROR' });
                }
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              showSuccessCheck={email.includes('@')}
            />

            <CustomInput
              label="PASSWORD"
              placeholder="•••••••• (Min 6 characters)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setLocalError(null);
                if (authState.errorMessage) {
                  authBloc.add({ type: 'CLEAR_AUTH_ERROR' });
                }
              }}
              isPassword
            />

            <CustomInput
              label="CONFIRM PASSWORD"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setLocalError(null);
              }}
              isPassword
            />

            {/* Sign Up Button */}
            <CustomButton
              title="Sign up"
              loading={isLoading}
              onPress={handleRegister}
              style={styles.signUpBtn}
            />
          </View>

          {/* Social login buttons */}
          <SocialLoginButtons
            label="or sign up with"
            onSocialPress={handleSocialPress}
          />

          {/* Switch to Log In */}
          <View style={styles.switchRow}>
            <Text style={styles.switchPromptText}>Already an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.switchActionText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 36,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  topLogoArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoSquircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  titleText: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorBg,
    borderColor: '#FFA39E',
    borderWidth: 1,
    padding: 12,
    borderRadius: Spacing.radiusMd,
    marginBottom: Spacing.md,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  signUpBtn: {
    marginTop: Spacing.sm,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  switchPromptText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  switchActionText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
});
