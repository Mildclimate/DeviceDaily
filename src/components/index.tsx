/**
 * 通用 UI 组件：Screen / Text / Button / Field
 * 全部消费统一主题 tokens，业务组件不直接写死颜色和间距
 */

import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tweenValue } from '../core/animation/gsap';
import { useTheme } from '../core/theme';

export const Screen: React.FC<
  React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>
> = ({ children, style }) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }, style]}>
      {children}
    </SafeAreaView>
  );
};

type TextVariant = 'title' | 'heading' | 'body' | 'caption' | 'mini' | 'number';

export const Text: React.FC<
  React.PropsWithChildren<{
    variant?: TextVariant;
    color?: string;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
  }>
> = ({ variant = 'body', color, style, children, numberOfLines }) => {
  const { colors, font } = useTheme();
  const variantStyle = makeStyles(font)[variant];
  return (
    <Animated.Text
      numberOfLines={numberOfLines}
      style={[variantStyle, { color: color ?? colors.text }, style]}
    >
      {children}
    </Animated.Text>
  );
};

/** 按压时用 GSAP 做轻微缩放反馈 */
export const Button: React.FC<
  React.PropsWithChildren<{
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
  }>
> = ({ onPress, variant = 'primary', disabled, style, children }) => {
  const { colors, radius } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(1);

  const animateTo = (to: number) => {
    tweenValue(scale, scaleValue.current, to, { duration: 0.18, ease: 'power2.out' });
    scaleValue.current = to;
  };

  const backgroundColor =
    variant === 'primary'
      ? colors.accent
      : variant === 'danger'
      ? colors.danger
      : colors.card;
  const textColor =
    variant === 'primary' || variant === 'danger' ? '#FFFFFF' : colors.text;

  return (
    <Pressable
      onPressIn={() => animateTo(0.96)}
      onPressOut={() => animateTo(1)}
      onPress={onPress}
      disabled={disabled}
      style={styles.button}
    >
      <Animated.View
        style={[
          styles.buttonInner,
          {
            backgroundColor,
            borderRadius: radius.md,
            borderColor: variant === 'secondary' ? colors.border : undefined,
            borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
            opacity: disabled ? 0.5 : 1,
          },
          { transform: [{ scale }] },
          style,
        ]}
      >
        <Text color={textColor} style={styles.buttonText}>
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export const Field: React.FC<
  React.PropsWithChildren<{ label: string; hint?: string }>
> = ({ label, hint, children }) => {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ gap: spacing.xs }}>
      <Text variant="caption" color={colors.subText}>
        {label}
      </Text>
      {children}
      {hint ? (
        <Text variant="mini" color={colors.subText}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
};

export const TextField: React.FC<TextInputProps> = props => {
  const { colors, font, radius, spacing } = useTheme();
  return (
    <TextInput
      placeholderTextColor={colors.subText}
      {...props}
      style={[
        {
          backgroundColor: colors.card,
          color: colors.text,
          fontSize: font.body,
          borderRadius: radius.sm,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 2,
        },
        props.style,
      ]}
    />
  );
};

const makeStyles = (font: Record<string, number>) =>
  StyleSheet.create({
    title: { fontSize: font.title, fontWeight: '700' },
    heading: { fontSize: font.heading, fontWeight: '600' },
    body: { fontSize: font.body },
    caption: { fontSize: font.caption },
    mini: { fontSize: font.mini },
    number: { fontSize: font.heading, fontWeight: '700', fontVariant: ['tabular-nums'] },
  });

const styles = StyleSheet.create({
  flex: { flex: 1 },
  button: { alignSelf: 'stretch' },
  buttonInner: { alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  buttonText: { fontWeight: '600' },
});
