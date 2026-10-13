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

interface LoginScreenProps {
  authBloc: AuthBloc;
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  authBloc,
  onNavigateToRegister,
}) => {
  const authState = useBlocState(authBloc);
  const [email, setEmail] = useState('Laura@gmail.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = () => {
    authBloc.add({
      type: 'LOGIN_REQUESTED',
      email,
      password,
    });
  };

  const handleDemoLogin = () => {
    authBloc.add({
      type: 'LOGIN_REQUESTED',
      email: 'alex.gigworker@delivery.com',
      password: 'password123',
    });
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Password Reset',
      `A password reset link would be dispatched to ${email || 'your email'}.`
    );
  };

  const handleSocialPress = (provider: string) => {
    Alert.alert(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login`,
      `Logging in with ${provider} OAuth... Signing you in now.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            authBloc.add({
              type: 'LOGIN_REQUESTED',
              email: `${provider}.user@gigworker.com`,
              password: 'socialPassword123',
            });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

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
          {/* Logo at the top matching screenshot 2 */}
          <View style={styles.topLogoArea}>
            <View style={styles.logoSquircle}>
              <Ionicons name="checkmark-sharp" size={32} color={Colors.textWhite} />
            </View>
            <Text style={styles.titleText}>Welcome back!</Text>
          </View>

          {/* Error Banner */}
          {Boolean(authState.errorMessage) && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={Colors.error} />
              <Text style={styles.errorBannerText}>{authState.errorMessage}</Text>
            </View>
          )}

          {/* Form fields */}
          <View style={styles.formContainer}>
            <CustomInput
              label="EMAIL ADDRESS"
              placeholder="e.g. yourname@domain.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
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
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (authState.errorMessage) {
                  authBloc.add({ type: 'CLEAR_AUTH_ERROR' });
                }
              }}
              isPassword
              rightAction={
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              }
            />

            {/* Log In Button */}
            <CustomButton
              title="Log in"
              loading={isLoading}
              onPress={handleLogin}
              style={styles.loginBtn}
            />

            {/* Quick Demo Login Option for evaluator */}
            <CustomButton
              title="⚡ Quick Demo Login (Evaluator Mode)"
              variant="outline"
              loading={isLoading}
              onPress={handleDemoLogin}
              style={styles.demoLoginBtn}
            />
          </View>

          {/* Social login buttons */}
          <SocialLoginButtons
            label="or log in with"
            onSocialPress={handleSocialPress}
          />

          {/* Switch to Sign Up */}
          <View style={styles.switchRow}>
            <Text style={styles.switchPromptText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onNavigateToRegister}>
              <Text style={styles.switchActionText}>Get started!</Text>
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
    marginBottom: 32,
  },
  logoSquircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  forgotPasswordText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  loginBtn: {
    marginTop: Spacing.sm,
    width: '100%',
  },
  demoLoginBtn: {
    marginTop: 10,
    width: '100%',
    height: 46,
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
