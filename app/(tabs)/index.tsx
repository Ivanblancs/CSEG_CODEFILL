// CodeFillGame/app/(tabs)/index.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import App from '../../App'

export default function Index() {
  return (
    <View style={styles.container}>
      <App />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});