import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CodeSnippetProps {
  template: string[];
  filledValues: string[];
  onBlankPress: (index: number) => void;
  isSolved: boolean;
}

const CodeSnippet: React.FC<CodeSnippetProps> = React.memo(
  ({ template, filledValues, onBlankPress, isSolved }) => {
    let blankIndex = 0;

    const renderLine = (line: string, lineIndex: number) => {
      const parts: JSX.Element[] = [];
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
        } else if (part.length > 0) { // Include empty strings (e.g., spaces) without trimming
          parts.push(
            <Text key={`${lineIndex}-${partIndex}`} style={styles.codeText}>
              {part}
            </Text>
          );
        }
      });

      return (
        <View style={styles.codeLineContainer}>
          {parts}
        </View>
      );
    };

    return (
      <View style={styles.container}>
        {template.map((line, lineIndex) => (
          <View key={lineIndex} style={styles.lineWrapper}>
            {renderLine(line, lineIndex)}
          </View>
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#f5f5d5',
    borderRadius: 8,
  },
  lineWrapper: {
    marginVertical: 4, // Spacing between lines
  },
  codeLineContainer: {
    flexDirection: 'row', // Align text and blanks horizontally
    alignItems: 'center', // Vertically center all elements in the line
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#333',
  },
  blank: {
    backgroundColor: '#e0e0b0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blankSolved: {
    backgroundColor: '#d0e8d0',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  blankText: {
    fontFamily: 'monospace', // Match codeText font
    fontSize: 16, // Match codeText size
    color: '#0066cc',
    fontWeight: 'bold',
  },
});

export default CodeSnippet;