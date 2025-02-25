import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CodeSnippetProps {
  template: string[];
  filledValues: string[];
  onBlankPress: (index: number) => void;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({
  template,
  filledValues,
  onBlankPress,
}) => {
  let blankIndex = 0;

  // Process each line to find and replace blanks
  const renderLine = (line: string, lineIndex: number) => {
    const parts: JSX.Element[] = []; // Explicitly set the type
    let currentIndex = 0;

    // Use regex to split on ___ while preserving other text
    const regex = /(___)/g;
    const matches = line.split(regex);

    matches.forEach((part, partIndex) => {
      if (part === '___') {
        const currentBlankIndex = blankIndex++;
        parts.push(
          <TouchableOpacity
            key={`${lineIndex}-${partIndex}`}
            onPress={() => onBlankPress(currentBlankIndex)}
            style={styles.blank}
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
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5d5', borderRadius: 8 },
  codeLine: { fontFamily: 'monospace', fontSize: 16, marginVertical: 4 },
  codeText: { color: '#333' },
  blank: {
    borderBottomWidth: 2, // Increased for visibility
    borderColor: '#0066cc', // Blue underline to match blankText
    paddingHorizontal: 4,
    minWidth: 30,
    alignItems: 'center',
  },
  blankText: { color: '#0066cc', fontWeight: 'bold' },
});

export default CodeSnippet;
