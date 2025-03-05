import React from 'react';
import { View, StyleSheet } from 'react-native';
import CodeFill from './components/CodeFill';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <CodeFill />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;