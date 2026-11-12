/**
 * 汇总面板：总投入 / 合计日均价 / 达标数，数字用 GSAP 滚动
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../../components';
import { tweenNumber } from '../../../core/animation/gsap';
import { useI18n } from '../../../core/i18n';
import { useTheme } from '../../../core/theme';
import type { DeviceSummary } from '../../../domain/pricing';
import { formatMoney } from './DeviceCard';

export const SummaryPanel: React.FC<{ summary: DeviceSummary }> = ({ summary }) => {
  const { colors, spacing, radius } = useTheme();
  const { t, lang } = useI18n();
  const [dailyText, setDailyText] = useState(() =>
    formatMoney(summary.totalDailyCost, lang),
  );

  useEffect(() => {
    // 合计日均价随天数递减，进入页面时滚动到最新值强调「下降」趋势
    const current = summary.totalDailyCost;
    const tween = tweenNumber(0, current, v => setDailyText(formatMoney(v, lang)), {
      duration: 0.9,
    });
    return () => {
      tween.kill();
    };
  }, [summary.totalDailyCost, lang]);

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderColor: colors.border,
          padding: spacing.lg,
          gap: spacing.md,
        },
      ]}
    >
      <View>
        <Text variant="caption" color={colors.subText}>
          {t('currentDaily')}
        </Text>
        <View style={styles.dailyRow}>
          <Text variant="title" style={styles.dailyValue}>
            {dailyText}
          </Text>
          <Text variant="body" color={colors.subText}>
            {t('perDay')}
          </Text>
        </View>
      </View>
      <View style={[styles.statsRow, { gap: spacing.lg }]}>
        <Stat label={t('totalInvested')} value={formatMoney(summary.totalPrice, lang)} />
        <Stat label={t('devicesCount')} value={String(summary.count)} />
        <Stat
          label={t('achieved')}
          value={`${summary.achievedCount}/${summary.count}`}
          color={colors.success}
        />
      </View>
    </View>
  );
};

const Stat: React.FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color,
}) => {
  return (
    <View style={styles.stat}>
      <Text variant="number" color={color}>
        {value}
      </Text>
      <Text variant="mini" color={color}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  dailyValue: {
    fontSize: 34,
  },
  statsRow: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    gap: 2,
  },
});
