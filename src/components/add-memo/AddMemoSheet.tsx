import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { BUBBLE_COLORS, colors } from '../../theme/colors';
import { parseDateInput } from '../../utils/date';
import { DEFAULT_MOOD, type MoodId } from '../icons/MoodIcon';
import { MoodPicker } from './MoodPicker';
import { ColorPicker } from './ColorPicker';

export interface AddMemoInput {
  mood: MoodId;
  text: string | null;
  color: string;
  dueDate: number | null;
  repeatDaily: boolean;
}

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
  const [dueDateText, setDueDateText] = useState('');
  const [repeatDaily, setRepeatDaily] = useState(false);

  const resetAndClose = () => {
    setMood(DEFAULT_MOOD);
    setColor(BUBBLE_COLORS[0]);
    setText('');
    setDueDateText('');
    setRepeatDaily(false);
    onClose();
  };

  const handleSave = () => {
    onSave({
      mood,
      text: text.trim() ? text.trim() : null,
      color,
      dueDate: parseDateInput(dueDateText),
      repeatDaily,
    });
    resetAndClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetAndClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={resetAndClose} />
        <View style={styles.sheet}>
          <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[styles.sheetContent, { paddingBottom: insets.bottom + 20 }]}>
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
            <TextInput
              style={styles.textInput}
              placeholder={t('addMemo:dueDate.placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={dueDateText}
              onChangeText={setDueDateText}
              maxLength={10}
            />

            <View style={styles.repeatRow}>
              <Text style={styles.label}>{t('addMemo:repeatDaily.label')}</Text>
              <Switch
                value={repeatDaily}
                onValueChange={setRepeatDaily}
                trackColor={{ true: colors.accent, false: '#E0D6E8' }}
                thumbColor="#FFFFFF"
              />
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
          </View>
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
  repeatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
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
