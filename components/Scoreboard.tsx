import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ScoreboardProps {
  streak: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ streak }) => {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const flameIntensity = useSharedValue(0);

  // Update animation based on streak
  useEffect(() => {
    if (streak >= 5) {
      scale.value = withRepeat(
        withTiming(1.2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      opacity.value = withTiming(0.8 + Math.min((streak - 5) * 0.05, 0.2), { duration: 500 });
      flameIntensity.value = withTiming(Math.min(streak - 4, 10), { duration: 500 });
    } else {
      scale.value = withTiming(1, { duration: 500 });
      opacity.value = withTiming(0, { duration: 500 });
      flameIntensity.value = withTiming(0, { duration: 500 });
    }
  }, [streak]);

  // Animated styles for flame aura
  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    borderRadius: 50,
    width: 100 + flameIntensity.value * 10,
    height: 100 + flameIntensity.value * 10,
  }));

  // Animated text style
  const textStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 0.8 }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flameAura, flameStyle]}>
        <LinearGradient
          colors={streak >= 5 ? ['#FF4500', '#FFD700', '#FF4500'] : ['transparent', 'transparent']}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.Text style={[styles.scoreText, textStyle]}>
        Streak: {streak}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  flameAura: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#FF4500',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    zIndex: 1,
  },
});

export default Scoreboard;