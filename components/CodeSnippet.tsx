import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CodeSnippetProps {
  template: string[];
  filledValues: string[];
  onBlankPress: (index: number) => void;
  isSolved: boolean; // Added to style solved blanks
}

const CodeSnippet: React.FC<CodeSnippetProps> = React.memo(
  ({ template, filledValues, onBlankPress, isSolved }) => {
    let blankIndex = 0;

    const renderLine = (line: string, lineIndex: number) => {
      const parts: JSX.Element[] = [];
      let currentIndex = 0;

      const regex = /(___)/g;
      const matches = line.split(regex);

      matches.forEach((part, partIndex) => {
        if (part === '___') {
          const currentBlankIndex = blankIndex++;
          parts.push(
            <TouchableOpacity
              key={`${lineIndex}-${partIndex}`}
              onPress={() => onBlankPress(currentBlankIndex)}
              style={[styles.blank, isSolved && styles.blankSolved]}
              accessible={true}
              accessibilityLabel={`Blank ${currentBlankIndex + 1}, current value: ${
                filledValues[currentBlankIndex] || 'empty'
              }`}
            >
              <Text style={styles.blankText}>
                {filledValues[currentBlankIndex] || '_'}
              </Text>
            </TouchableOpacity>
          );
        } else if (part.trim().length > 0) {
          parts.push(
            <Text key={`${lineIndex}-${partIndex}`} style={styles.codeText}>
              {part}{' '}
            </Text>
          );
        }
      });

      return parts;
    };

    return (
      <View style={styles.container}>
        {template.map((line, lineIndex) => (
          <Text key={lineIndex} style={styles.codeLine}>
            {renderLine(line, lineIndex)}
          </Text>
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { padding: 40, backgroundColor: '#f5f5d5', borderRadius: 8 },
  codeLine: { fontFamily: 'monospace', fontSize: 16, marginVertical: 4 },
  codeText: { color: '#333' },
  blank: {
    backgroundColor: '#e0e0b0', // A different shade from #f5f5d5 (slightly darker beige)
    borderRadius: 8, // Rounded edges
    paddingHorizontal: 8, // Increased padding for a rectangular look
    paddingVertical: 2,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center', // Center the text vertically
  },
  blankSolved: { 
    backgroundColor: '#d0e8d0', // Lighter green shade for solved state
    borderColor: '#4CAF50', // Green border to match solved state
    borderWidth: 1, // Add a subtle border for solved
  },
  blankText: { 
    color: '#0066cc', // Keep text color consistent
    fontWeight: 'bold',
  },
});

export default CodeSnippet;