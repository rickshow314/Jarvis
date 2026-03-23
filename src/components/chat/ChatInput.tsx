import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VoiceWaveform } from './VoiceWaveform';
import { voiceService } from '../../services/voice.service';

interface Props {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: Props) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const toggleVoice = async () => {
    if (isListening) {
      await voiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      await voiceService.startListening((result) => {
        setText(result);
        setIsListening(false);
        onSend(result);
      });
    }
  };

  return (
    <View style={styles.container}>
      {isListening ? (
        <View style={styles.waveformContainer}>
          <VoiceWaveform isActive={isListening} />
        </View>
      ) : (
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Message Jarvis..."
          placeholderTextColor="#999"
          multiline
          onSubmitEditing={handleSend}
        />
      )}
      <TouchableOpacity onPress={toggleVoice} style={[styles.iconBtn, isListening && styles.activeBtn]}>
        <Ionicons name={isListening ? 'stop' : 'mic'} size={22} color={isListening ? '#fff' : '#6C63FF'} />
      </TouchableOpacity>
      {!isListening && (
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.iconBtn, styles.sendBtn]}
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EBEBF0',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 120,
    color: '#1A1A2E',
  },
  waveformContainer: {
    flex: 1,
    height: 44,
    backgroundColor: '#F5F5FA',
    borderRadius: 22,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EFF8',
  },
  activeBtn: { backgroundColor: '#6C63FF' },
  sendBtn: { backgroundColor: '#6C63FF' },
});
