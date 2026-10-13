import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { sl } from './src/di/injection_container';
import { useBlocState } from './src/core/bloc/bloc.provider';
import { OnboardingScreen } from './src/presentation/screens/OnboardingScreen';
import { LoginScreen } from './src/presentation/screens/LoginScreen';
import { RegisterScreen } from './src/presentation/screens/RegisterScreen';
import { HomeScreen } from './src/presentation/screens/HomeScreen';
import { Colors } from './src/core/theme/colors';

export default function App() {
  const authBloc = sl.getAuthBloc();
  const taskBloc = sl.getTaskBloc();

  const authState = useBlocState(authBloc);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // 1. Check Onboarding status
    const initApp = async () => {
      const seen = await sl.localDataSource.hasSeenOnboarding();
      setHasSeenOnboarding(seen);

      // 2. Check Auth Status
      authBloc.add({ type: 'CHECK_AUTH_STATUS' });
    };

    initApp();
  }, []);

  // When user is authenticated, trigger task loading
  useEffect(() => {
    if (authState.status === 'authenticated' && authState.user) {
      taskBloc.setUserId(authState.user.id);
      taskBloc.add({ type: 'LOAD_TASKS', userId: authState.user.id });
    }
  }, [authState.status, authState.user]);

  const handleCompleteOnboarding = async () => {
    await sl.localDataSource.setOnboardingCompleted();
    setHasSeenOnboarding(true);
  };

  // Loading screen while checking initial storage/session state
  if (hasSeenOnboarding === null || authState.status === 'initial') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // 1. Show Onboarding screen if user is new
  if (!hasSeenOnboarding) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={styles.rootWrapper}>
          <View style={styles.deviceContainer}>
            <OnboardingScreen onGetStarted={handleCompleteOnboarding} />
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  // 2. Show Main Home Screen if logged in
  if (authState.status === 'authenticated') {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={styles.rootWrapper}>
          <View style={styles.deviceContainer}>
            <HomeScreen taskBloc={taskBloc} authBloc={authBloc} />
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  // 3. Show Auth screens (Login / Register)
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.rootWrapper}>
        <View style={styles.deviceContainer}>
          {authMode === 'login' ? (
            <LoginScreen
              authBloc={authBloc}
              onNavigateToRegister={() => setAuthMode('register')}
            />
          ) : (
            <RegisterScreen
              authBloc={authBloc}
              onNavigateToLogin={() => setAuthMode('login')}
            />
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rootWrapper: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#E4E7F4' : Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  deviceContainer: {
    flex: 1,
    width: Platform.OS === 'web' ? 440 : '100%',
    maxWidth: Platform.OS === 'web' ? 440 : '100%',
    backgroundColor: Colors.background,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          maxHeight: 890,
          borderRadius: 36,
          boxShadow: '0 20px 40px rgba(22, 28, 45, 0.16)',
          border: '8px solid #FFFFFF',
        }
      : {}),
  },
});
