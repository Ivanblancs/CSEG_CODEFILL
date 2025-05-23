import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FillerButtonProps<T extends string> {
  text: T;
  onPress: (text: T) => void;
  disabled: boolean;
}

const FillerButton = <T extends string>({ text, onPress, disabled }: FillerButtonProps<T>) => (
  <TouchableOpacity
    onPress={() => onPress(text)}
    disabled={disabled}
    style={[styles.button, disabled && styles.disabledButton]}
    accessible={true}
    accessibilityLabel={`Option ${text}, ${disabled ? 'already used' : 'available'}`}
  >
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    margin: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  disabledButton: { backgroundColor: '#ccc', opacity: 0.6 },
  buttonText: { fontSize: 14, color: '#000', fontWeight: '500' },
});

export default FillerButton;