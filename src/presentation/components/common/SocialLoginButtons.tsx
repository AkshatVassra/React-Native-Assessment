import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../src/core/theme/colors';
import { Spacing } from '../../../../src/core/theme/spacing';
import { Typography } from '../../../../src/core/theme/typography';

interface SocialLoginButtonsProps {
  label?: string;
  onSocialPress?: (provider: string) => void;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  label = 'or log in with',
  onSocialPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.orText}>{label}</Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSocialPress?.('facebook')}
          style={[styles.socialButton, { backgroundColor: Colors.social.facebook }]}
        >
          <FontAwesome5 name="facebook-f" size={18} color={Colors.textWhite} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSocialPress?.('google')}
          style={[styles.socialButton, { backgroundColor: Colors.social.google }]}
        >
          <FontAwesome5 name="google" size={17} color={Colors.textWhite} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSocialPress?.('apple')}
          style={[styles.socialButton, { backgroundColor: Colors.social.apple }]}
        >
          <Ionicons name="logo-apple" size={20} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  orText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  socialButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
