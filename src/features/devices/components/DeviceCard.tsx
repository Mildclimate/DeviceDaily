/**
 * 设备卡片：日均价 + 摊薄进度条，列表挂载时 GSAP 入场
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../../../components';
import { tweenValue } from '../../../core/animation/gsap';
import { useI18n } from '../../../core/i18n';
import { useTheme } from '../../../core/theme';
import { DEVICE_ICONS, type Device } from '../../../domain/device';
import {
  amortizeProgress,
  dailyCost,
  daysSince,
  daysToTarget,
} from '../../../domain/pricing';

export interface DeviceCardProps {
  device: Device;
  index: number;
  onPress: () => void;
  onLongPress?: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  index,
  onPress,
  onLongPress,
}) => {
  const { colors, spacing, radius } = useTheme();
  const { t, lang } = useI18n();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 列表入场：轻微上移 + 淡入，按 index 错开
    tweenValue(entrance, 0, 1, { duration: 0.45, delay: Math.min(index, 8) * 0.06 });
  }, [entrance, index]);

  const price = useMemo(() => formatMoney(device.price, lang), [device.price, lang]);
  const daily = useMemo(() => formatMoney(dailyCost(device), lang), [device, lang]);
  const days = daysSince(device.purchaseDate);
  const rest = daysToTarget(device);
  const progress = amortizeProgress(device);
  const achieved = rest !== null && rest <= 0;

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderColor: colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          },
          {
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.row}>
          <Text variant="heading" style={styles.icon}>
            {DEVICE_ICONS[device.type]}
          </Text>
          <View style={styles.titleBlock}>
            <Text variant="heading" numberOfLines={1}>
              {device.name}
            </Text>
            <Text variant="caption" color={colors.subText}>
              {price} · {t('usedDays', { days })}
            </Text>
          </View>
          <View style={styles.dailyBlock}>
            <Text variant="mini" color={colors.subText}>
              {t('dailyCostLabel')}
            </Text>
            <Text variant="number">{daily}</Text>
          </View>
        </View>

        <View style={[styles.row, { marginTop: spacing.md, gap: spacing.sm }]}>
          {rest === null ? (
            <Text variant="caption" color={colors.subText}>
              {t('noTarget')}
            </Text>
          ) : achieved ? (
            <Text variant="caption" color={colors.success}>
              ✓ {t('targetReached')}
            </Text>
          ) : (
            <>
              <View
                style={[
                  styles.track,
                  { backgroundColor: colors.border, borderRadius: radius.pill },
                ]}
              >
                <Animated.View
                  style={{
                    height: 4,
                    borderRadius: radius.pill,
                    backgroundColor: colors.accent,
                    width: `${Math.round((progress ?? 0) * 100)}%`,
                  }}
                />
              </View>
              <Text variant="mini" color={colors.subText}>
                {t('daysToTarget', { days: rest })}
              </Text>
            </>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

/** 货币格式化：千分位 + 保留两位（整数则省略小数） */
export function formatMoney(value: number, lang: string): string {
  const formatted = value.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    maximumFractionDigits: 2,
  });
  return `¥${formatted}`;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
    fontSize: 24,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  dailyBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  track: {
    flex: 1,
    height: 4,
    overflow: 'hidden',
  },
});
