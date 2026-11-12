/**
 * 设备编辑页：新增 / 编辑共用，含表单校验与删除
 */

import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Button, Field, Screen, Text, TextField } from '../../../components';
import { useI18n } from '../../../core/i18n';
import { useTheme } from '../../../core/theme';
import {
  DEVICE_ICONS,
  DEVICE_TYPES,
  type DeviceDraft,
  type DeviceType,
} from '../../../domain/device';
import type { RootStackParamList } from '../../../app/navigation';
import { useDevices } from '../hooks/useDevices';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceEdit'>;

export const DeviceEditScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { addDevice, updateDevice, removeDevice } = useDevices();
  const editing = route.params?.device;

  const [name, setName] = useState(editing?.name ?? '');
  const [type, setType] = useState<DeviceType>(editing?.type ?? 'phone');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [purchaseDate, setPurchaseDate] = useState(
    editing?.purchaseDate ?? dayjs().format('YYYY-MM-DD'),
  );
  const [target, setTarget] = useState(
    editing?.targetDailyCost != null ? String(editing.targetDailyCost) : '',
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const onDatePicked = (_e: DateTimePickerEvent, date?: Date) => {
    setDatePickerVisible(false);
    if (date) {
      setPurchaseDate(dayjs(date).format('YYYY-MM-DD'));
    }
  };

  const submit = async () => {
    const messages: string[] = [];
    const priceValue = Number(price);
    const targetValue = target.trim() === '' ? null : Number(target);
    if (!name.trim()) {
      messages.push(t('nameRequired'));
    }
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      messages.push(t('priceInvalid'));
    }
    if (!dayjs(purchaseDate, 'YYYY-MM-DD').isValid()) {
      messages.push(t('dateInvalid'));
    }
    if (targetValue !== null && (!Number.isFinite(targetValue) || targetValue <= 0)) {
      messages.push(t('targetInvalid'));
    }
    if (messages.length > 0) {
      setErrors(messages);
      return;
    }

    const draft: DeviceDraft = {
      name: name.trim(),
      type,
      price: priceValue,
      purchaseDate: dayjs(purchaseDate).format('YYYY-MM-DD'),
      targetDailyCost: targetValue,
    };
    if (editing) {
      await updateDevice(editing.id, draft);
    } else {
      await addDevice(draft);
    }
    navigation.goBack();
  };

  const confirmRemove = () => {
    if (!editing) {
      return;
    }
    Alert.alert(
      t('deleteConfirmTitle'),
      t('deleteConfirmMessage', { name: editing.name }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await removeDevice(editing.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Button
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
          >
            ✕
          </Button>
          <Text variant="heading">{editing ? t('editDevice') : t('addDevice')}</Text>
          <View style={styles.closeBtn} />
        </View>

        {errors.length > 0 ? (
          <View
            style={[
              styles.errorBox,
              { backgroundColor: colors.danger + '18', borderRadius: radius.sm },
            ]}
          >
            {errors.map(msg => (
              <Text key={msg} variant="caption" color={colors.danger}>
                · {msg}
              </Text>
            ))}
          </View>
        ) : null}

        <Field label={t('deviceName')}>
          <TextField
            value={name}
            onChangeText={setName}
            placeholder={t('deviceNamePlaceholder')}
          />
        </Field>

        <Field label={t('deviceType')}>
          <View style={[styles.typeGrid, { gap: spacing.sm }]}>
            {DEVICE_TYPES.map(dt => {
              const active = dt === type;
              return (
                <Pressable
                  key={dt}
                  onPress={() => setType(dt)}
                  style={[
                    styles.typeChip,
                    {
                      borderRadius: radius.pill,
                      borderColor: active ? colors.accent : colors.border,
                      backgroundColor: active ? colors.accentSoft : colors.card,
                    },
                  ]}
                >
                  <Text variant="caption" color={active ? colors.accent : colors.subText}>
                    {DEVICE_ICONS[dt]} {t(`typeNames.${dt}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        <Field label={`${t('price')} (¥)`}>
          <TextField
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="7999"
          />
        </Field>

        <Field label={t('purchaseDate')}>
          <Pressable onPress={() => setDatePickerVisible(true)}>
            <View
              style={[
                styles.dateValue,
                {
                  backgroundColor: colors.card,
                  borderRadius: radius.sm,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text>📅 {purchaseDate}</Text>
            </View>
          </Pressable>
          {datePickerVisible ? (
            <DateTimePicker
              value={dayjs(purchaseDate).toDate()}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={onDatePicked}
            />
          ) : null}
        </Field>

        <Field
          label={`${t('targetDailyCost')} (${t('perDay')})`}
          hint={t('targetDailyCostHint')}
        >
          <TextField
            value={target}
            onChangeText={setTarget}
            keyboardType="decimal-pad"
            placeholder="10"
          />
        </Field>

        <Button onPress={submit}>{t('save')}</Button>

        {editing ? (
          <Button variant="danger" onPress={confirmRemove}>
            {t('delete')}
          </Button>
        ) : null}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    minWidth: 72,
  },
  errorBox: {
    padding: 12,
    gap: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeChip: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateValue: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
