/**
 * 设备列表页：汇总面板 + 设备卡片列表 + 添加入口
 */

import React, { useMemo } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Text } from '../../../components';
import { useI18n } from '../../../core/i18n';
import { useTheme } from '../../../core/theme';
import type { Device } from '../../../domain/device';
import { summarize } from '../../../domain/pricing';
import type { RootStackParamList } from '../../../app/navigation';
import { DeviceCard } from '../components/DeviceCard';
import { SummaryPanel } from '../components/SummaryPanel';
import { useDevices } from '../hooks/useDevices';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceList'>;

export const DeviceListScreen: React.FC<Props> = ({ navigation }) => {
  const { spacing } = useTheme();
  const { t } = useI18n();
  const { devices, removeDevice } = useDevices();
  const summary = useMemo(() => summarize(devices), [devices]);

  const openDevice = (device: Device) => {
    navigation.navigate('DeviceEdit', { device });
  };

  const confirmRemove = (device: Device) => {
    Alert.alert(
      t('deleteConfirmTitle'),
      t('deleteConfirmMessage', { name: device.name }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => removeDevice(device.id),
        },
      ],
    );
  };

  return (
    <Screen>
      <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
        <Text variant="title">{t('appName')}</Text>
        <LangToggle />
      </View>

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xxl,
            gap: spacing.md,
          },
        ]}
        ListHeaderComponent={<SummaryPanel summary={summary} />}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item, index }) => (
          <DeviceCard
            device={item}
            index={index}
            onPress={() => openDevice(item)}
            onLongPress={() => confirmRemove(item)}
          />
        )}
      />

      <AddButton onPress={() => navigation.navigate('DeviceEdit', {})} />
    </Screen>
  );
};

/** 语言切换：中英互切 */
const LangToggle: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const { t, toggleLang } = useI18n();
  return (
    <Pressable
      onPress={toggleLang}
      hitSlop={8}
      style={[
        styles.langToggle,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 1,
        },
      ]}
    >
      <Text variant="caption" color={colors.accent}>
        {t('langToggle')}
      </Text>
    </Pressable>
  );
};

const EmptyState: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  return (
    <View style={[styles.empty, { marginTop: spacing.xxl, gap: spacing.sm }]}>
      <Text variant="heading" color={colors.subText}>
        {t('emptyTitle')}
      </Text>
      <Text variant="caption" color={colors.subText}>
        {t('emptySubtitle')}
      </Text>
    </View>
  );
};

/** 右下角悬浮添加按钮 */
const AddButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.fab, { backgroundColor: colors.accent, borderRadius: radius.pill }]}
    >
      <Text variant="heading" color="#FFFFFF" style={styles.fabIcon}>
        +
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  langToggle: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  empty: {
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabIcon: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -2,
  },
});
