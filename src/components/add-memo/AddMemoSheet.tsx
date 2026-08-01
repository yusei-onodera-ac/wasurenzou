import { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { BUBBLE_COLORS, colors } from '../../theme/colors';
import { formatShortDate } from '../../utils/date';
import { ALL_WEEKDAYS, WEEKDAY_WEEKDAYS, WEEKEND_WEEKDAYS } from '../../store/useBubbleStore';
import type { Weekday } from '../../types/bubble';
import { DEFAULT_MOOD, type MoodId } from '../icons/MoodIcon';
import { MoodPicker } from './MoodPicker';
import { ColorPicker } from './ColorPicker';

export interface AddMemoInput {
  mood: MoodId;
  text: string | null;
  color: string;
  dueDate: number | null;
  repeatDays: Weekday[] | null;
}

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

function sameDays(a: Weekday[], b: Weekday[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((value, index) => value === sortedB[index]);
}

const PRESETS: { key: string; days: Weekday[] }[] = [
  { key: 'off', days: [] },
  { key: 'daily', days: ALL_WEEKDAYS },
  { key: 'weekdays', days: WEEKDAY_WEEKDAYS },
  { key: 'weekend', days: WEEKEND_WEEKDAYS },
];

interface AddMemoSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (input: AddMemoInput) => void;
}

export function AddMemoSheet({ visible, onClose, onSave }: AddMemoSheetProps) {
  const { t } = useTranslation(['addMemo', 'common']);
  const insets = useSafeAreaInsets();

  const [mood, setMood] = useState<MoodId>(DEFAULT_MOOD);
  const [color, setColor] = useState<string>(BUBBLE_COLORS[0]);
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [repeatDays, setRepeatDays] = useState<Weekday[]>([]);

  const resetAndClose = () => {
    setMood(DEFAULT_MOOD);
    setColor(BUBBLE_COLORS[0]);
    setText('');
    setDueDate(null);
    setDatePickerVisible(false);
    setRepeatDays([]);
    onClose();
  };

  const handleSave = () => {
    onSave({
      mood,
      text: text.trim() ? text.trim() : null,
      color,
      dueDate: dueDate ? dueDate.getTime() : null,
      repeatDays: repeatDays.length > 0 ? repeatDays : null,
    });
    resetAndClose();
  };

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setDatePickerVisible(false);
    if (event.type === 'dismissed') return;
    if (selected) setDueDate(selected);
  };

  const toggleDay = (day: Weekday) => {
    setRepeatDays((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day].sort()
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetAndClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={resetAndClose} />
        <View style={styles.sheet}>
          <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.sheetContent, { paddingBottom: insets.bottom + 20 }]}
          >
            <Text style={styles.title}>{t('addMemo:title')}</Text>

            <TextInput
              style={styles.textInput}
              placeholder={t('addMemo:textInputPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={text}
              onChangeText={setText}
              maxLength={60}
              autoFocus
            />

            <Text style={styles.label}>{t('addMemo:dueDate.label')}</Text>
            <View style={styles.dueDateRow}>
              <Pressable
                accessibilityRole="button"
                style={styles.dueDateTrigger}
                onPress={() => setDatePickerVisible((visible) => !visible)}
              >
                <Text style={[styles.dueDateTriggerText, !dueDate && { color: colors.textSecondary }]}>
                  {dueDate ? formatShortDate(dueDate.getTime()) : t('addMemo:dueDate.placeholder')}
                </Text>
              </Pressable>
              {dueDate ? (
                <Pressable
                  accessibilityRole="button"
                  style={styles.dueDateClear}
                  onPress={() => {
                    setDueDate(null);
                    setDatePickerVisible(false);
                  }}
                >
                  <Text style={styles.dueDateClearText}>{t('addMemo:dueDate.clear')}</Text>
                </Pressable>
              ) : null}
            </View>
            {datePickerVisible ? (
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={dueDate ?? new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
                {Platform.OS === 'ios' ? (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.pickerDoneButton}
                    onPress={() => setDatePickerVisible(false)}
                  >
                    <Text style={styles.pickerDoneText}>{t('common:actions.save')}</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            <Text style={styles.label}>{t('addMemo:repeat.label')}</Text>
            <View style={styles.presetRow}>
              {PRESETS.map((preset) => {
                const active = sameDays(preset.days, repeatDays);
                return (
                  <Pressable
                    key={preset.key}
                    accessibilityRole="button"
                    style={[styles.presetChip, active && styles.presetChipActive]}
                    onPress={() => setRepeatDays(preset.days)}
                  >
                    <Text style={[styles.presetChipText, active && styles.presetChipTextActive]}>
                      {t(`addMemo:repeat.${preset.key}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.dayRow}>
              {ALL_DAYS.map((day) => {
                const active = repeatDays.includes(day);
                return (
                  <Pressable
                    key={day}
                    accessibilityRole="button"
                    style={[styles.dayCircle, active && styles.dayCircleActive]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text style={[styles.dayCircleText, active && styles.dayCircleTextActive]}>
                      {t(`addMemo:repeat.days.${day}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>{t('addMemo:moodPicker.label')}</Text>
            <MoodPicker value={mood} onChange={setMood} />

            <Text style={styles.label}>{t('addMemo:colorPicker.label')}</Text>
            <ColorPicker value={color} onChange={setColor} />

            <View style={styles.actions}>
              <Pressable accessibilityRole="button" style={styles.cancelButton} onPress={resetAndClose}>
                <Text style={styles.cancelText}>{t('common:actions.cancel')}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>{t('common:actions.save')}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(74, 68, 88, 0.35)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  sheetContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
  },
  textInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#EADCF2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  dueDateTrigger: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EADCF2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dueDateTriggerText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  dueDateClear: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dueDateClearText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  pickerWrap: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  pickerDoneButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  pickerDoneText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#F4EEF9',
  },
  presetChipActive: {
    backgroundColor: colors.accent,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4EEF9',
  },
  dayCircleActive: {
    backgroundColor: colors.accent,
  },
  dayCircleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  dayCircleTextActive: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
