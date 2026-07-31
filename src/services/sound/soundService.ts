import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

import { useSettingsStore } from '../../store/useSettingsStore';

const SOUND_SOURCES = {
  tap: require('../../../assets/sounds/tap.wav'),
  add: require('../../../assets/sounds/add.wav'),
  complete: require('../../../assets/sounds/complete.wav'),
  celebration: require('../../../assets/sounds/celebration.wav'),
  delete: require('../../../assets/sounds/delete.wav'),
  forgotten: require('../../../assets/sounds/forgotten.wav'),
} as const;

export type SoundEvent = keyof typeof SOUND_SOURCES;

const players = new Map<SoundEvent, AudioPlayer>();

function getPlayer(event: SoundEvent): AudioPlayer {
  let player = players.get(event);
  if (!player) {
    player = createAudioPlayer(SOUND_SOURCES[event]);
    players.set(event, player);
  }
  return player;
}

export function playSound(event: SoundEvent): void {
  if (!useSettingsStore.getState().soundEnabled) return;
  try {
    const player = getPlayer(event);
    player.seekTo(0).finally(() => player.play());
  } catch {
    // sound is a non-critical nicety; never let playback errors break an interaction
  }
}
