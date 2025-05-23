import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CodeSnippet from './CodeSnippet';
import FillerButton from './FillerButton';
import { questions as initialQuestions } from '../data/questions';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface Question {
  problemId: string;
  problem: string;
  code: string;
  fillers: readonly string[];
  answerSequence: string;
  explanation: string;
  hint: string;
}

const API_URL = 'http://127.0.0.1:8000/generate-question';

const CodeFill: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solvedQuestions, setSolvedQuestions] = useState<{ [key: number]: string[] }>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalExplanation, setModalExplanation] = useState('');
  const [modalIsCorrect, setModalIsCorrect] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [soundObjects, setSoundObjects] = useState<{
    correctSound?: Audio.Sound;
    wrongSound?: Audio.Sound;
    completeSound?: Audio.Sound;
    hintSound?: Audio.Sound;
    clickSound?: Audio.Sound;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0); // Total correct answers
  const [highScore, setHighScore] = useState(0); // High score for current difficulty
  const [streak, setStreak] = useState(0); // Consecutive correct answers

  const currentQuestion = questions[difficulty][currentQuestionIndex] || questions[difficulty][0];
  const blankCount = currentQuestion.code.split('___').length - 1;
  const isCurrentQuestionSolved = !!solvedQuestions[currentQuestionIndex];
  const [filledValues, setFilledValues] = useState<string[]>(Array(blankCount).fill(''));

  // Animated scale and shadow for flame aura
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
    shadowRadius: withSpring(10 + streak * 2), // Dynamic shadow radius based on streak
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    elevation: 5,
  }));

  // Load saved score and high score
  useEffect(() => {
    const loadScores = async () => {
      try {
        const savedScore = await AsyncStorage.getItem(`score_${difficulty}`);
        const savedHighScore = await AsyncStorage.getItem(`highScore_${difficulty}`);
        if (savedScore !== null) {
          setScore(parseInt(savedScore, 10));
        }
        if (savedHighScore !== null) {
          setHighScore(parseInt(savedHighScore, 10));
        }
      } catch (error) {
        console.error('Failed to load scores:', error);
      }
    };
    loadScores();
  }, [difficulty]);

  // Save score and high score
  const saveScores = async (newScore: number) => {
    try {
      await AsyncStorage.setItem(`score_${difficulty}`, newScore.toString());
      if (newScore > highScore) {
        setHighScore(newScore);
        await AsyncStorage.setItem(`highScore_${difficulty}`, newScore.toString());
      }
    } catch (error) {
      console.error('Failed to save scores:', error);
    }
  };

  useEffect(() => {
    const loadSound = async (file: any, key: string) => {
      try {
        const { sound } = await Audio.Sound.createAsync(file);
        return sound;
      } catch (error) {
        console.log(`Failed to load ${key}:`, error);
        return undefined;
      }
    };

    const initializeSounds = async () => {
      const correctSound = await loadSound(require('../assets/audios/correct_sound.mp3'), 'correct_sound');
      const wrongSound = await loadSound(require('../assets/audios/wrong_sound.mp3'), 'wrong_sound');
      const completeSound = await loadSound(require('../assets/audios/complete_sound.mp3'), 'complete_sound');
      const hintSound = await loadSound(require('../assets/audios/hint_sound.mp3'), 'hint_sound');
      const clickSound = await loadSound(require('../assets/audios/click_sound.mp3'), 'click_sound');

      setSoundObjects({
        correctSound,
        wrongSound,
        completeSound,
        hintSound,
        clickSound,
      });
    };

    initializeSounds();

    return () => {
      Object.values(soundObjects).forEach(async (sound) => {
        if (sound) {
          await sound.unloadAsync();
        }
      });
    };
  }, []);

  useEffect(() => {
    if (isCurrentQuestionSolved) {
      setFilledValues(solvedQuestions[currentQuestionIndex]);
      setIsSolved(true);
    } else {
      setFilledValues(Array(blankCount).fill(''));
      setIsSolved(false);
    }
  }, [currentQuestionIndex, solvedQuestions, difficulty]);

  useEffect(() => {
    const questionsLeft = questions[difficulty].length - currentQuestionIndex - 1;
    if (questionsLeft < 2 && !isLoading) {
      console.log(`Fetching new question for ${difficulty}. Questions left: ${questionsLeft}`);
      fetchNewQuestions();
    }
  }, [currentQuestionIndex, difficulty]);

  useEffect(() => {
    if (filledValues.every((val) => val !== '') && !isCurrentQuestionSolved) {
      validateAnswer();
    }
  }, [filledValues]);

  useEffect(() => {
    // Update flame aura scale based on score and streak
    if (score >= 5) {
      scale.value = 1 + streak * 0.1; // Increase scale with streak
    } else {
      scale.value = 1; // No scaling if score < 5
    }
  }, [score, streak]);

  const fetchNewQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty }),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const newQuestion: Question = await response.json();
      console.log('Fetched question:', newQuestion);
      setQuestions((prev) => {
        const updatedQuestions = [...prev[difficulty], newQuestion];
        console.log(`Updated ${difficulty} questions:`, updatedQuestions);
        return {
          ...prev,
          [difficulty]: updatedQuestions,
        };
      });
    } catch (error) {
      console.error('Error fetching new question:', error);
      setModalMessage('Failed to load new question. Please try again.');
      setModalIsCorrect(false);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const playSound = async (sound?: Audio.Sound) => {
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.log('Sound playback failed:', error);
      }
    }
  };

  const handleFillerPress = (filler: typeof currentQuestion.fillers[number]) => {
    const nextEmptyIndex = filledValues.findIndex((val) => val === '');
    if (nextEmptyIndex !== -1 && !isCurrentQuestionSolved) {
      const updatedValues = [...filledValues];
      updatedValues[nextEmptyIndex] = filler;
      setFilledValues(updatedValues);
      playSound(soundObjects.clickSound);
    }
  };

  const handleBlankPress = (index: number) => {
    if (!isCurrentQuestionSolved) {
      const updatedValues = [...filledValues];
      updatedValues[index] = '';
      setFilledValues(updatedValues);
      playSound(soundObjects.clickSound);
    }
  };

  const validateAnswer = () => {
    const playerIndices = filledValues.map((value) => currentQuestion.fillers.indexOf(value));
    const correctIndices = currentQuestion.answerSequence.replace(/[, ]/g, '').split('').map(Number);

    if (JSON.stringify(playerIndices) === JSON.stringify(correctIndices)) {
      setModalMessage('✨ Awesome! You nailed it! ✨');
      setModalExplanation(currentQuestion.explanation);
      setModalIsCorrect(true);
      setIsSolved(true);
      setSolvedQuestions((prev) => ({
        ...prev,
        [currentQuestionIndex]: filledValues,
      }));
      setScore((prev) => {
        const newScore = prev + 1;
        saveScores(newScore);
        return newScore;
      });
      setStreak((prev) => prev + 1);
      playSound(soundObjects.correctSound);
    } else {
      const correctWordsUsed = correctIndices.every((idx) => playerIndices.includes(idx));
      setModalMessage(
        correctWordsUsed ? '😕 Close, but the order’s off!' : '🚫 Oops! Wrong pieces, try again!'
      );
      setModalExplanation('');
      setModalIsCorrect(false);
      setScore((prev) => {
        saveScores(0);
        return 0;
      }); // Reset score to 0 on wrong answer
      setStreak(0); // Reset streak to 0 on wrong answer
      playSound(soundObjects.wrongSound);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalIsCorrect) {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions[difficulty].length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setModalMessage('🎉 You’ve completed all questions!');
        setModalExplanation('');
        setModalIsCorrect(true);
        setShowModal(true);
        setCurrentQuestionIndex(0);
        playSound(soundObjects.completeSound);
      }
    } else {
      setFilledValues(Array(blankCount).fill(''));
    }
  };

  const handleResetQuestion = () => {
    setFilledValues(Array(blankCount).fill(''));
    setIsSolved(false);
    setSolvedQuestions((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestionIndex];
      return updated;
    });
    playSound(soundObjects.clickSound);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      playSound(soundObjects.clickSound);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions[difficulty].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      playSound(soundObjects.clickSound);
    }
  };

  const handleShowHint = () => {
    setShowHintModal(true);
    playSound(soundObjects.hintSound);
  };

  const handleCloseHintModal = () => {
    setShowHintModal(false);
  };

  const handleDifficultyChange = (level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
    setCurrentQuestionIndex(0);
    setSolvedQuestions({});
    setScore(0);
    setStreak(0);
    saveScores(0);
    playSound(soundObjects.clickSound);
  };

  // Determine background color for scores 0-4
  const getScoreBackgroundColor = () => {
    switch (score) {
      case 0:
        return '#333333'; // Dark grey
      case 1:
        return '#4F4F4F'; // Less dark grey
      case 2:
        return '#6B6B6B'; // More less dark grey
      case 3:
        return '#A9A9A9'; // Light grey
      case 4:
        return '#D3D3D3'; // Lighter grey
      default:
        return 'transparent'; // For score >= 5, use flame gradient
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.difficultyContainer}>
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.difficultyButton, difficulty === level && styles.activeDifficulty]}
              onPress={() => handleDifficultyChange(level)}
            >
              <Text style={styles.difficultyText}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.scoreContainer}>
          {score >= 5 ? (
            <Animated.View style={[styles.flameAura, animatedStyle]}>
              <LinearGradient
                colors={['#FF4500', '#FFA500', '#FFFF00']}
                style={styles.flameGradient}
              >
                <Text style={styles.scoreText}>{score}</Text>
              </LinearGradient>
            </Animated.View>
          ) : (
            <View style={[styles.scoreCircle, { backgroundColor: getScoreBackgroundColor() }]}>
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          )}
          <Text style={styles.highScoreText}>High: {highScore}</Text>
        </View>
        <TouchableOpacity onPress={handleResetQuestion} style={styles.resetButton}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <Image
          source={require('../assets/images/python.png')}
          style={styles.pythonImage}
          resizeMode="contain"
        />
        <Text style={styles.problem}>
          {currentQuestion.problem.endsWith('?') ? currentQuestion.problem : `${currentQuestion.problem}?`}
        </Text>
        <CodeSnippet
          template={currentQuestion.code.split('\n')}
          filledValues={filledValues}
          onBlankPress={handleBlankPress}
          isSolved={isCurrentQuestionSolved}
        />
        <View style={styles.fillersContainer}>
          {currentQuestion.fillers.map((filler, index) => (
            <FillerButton
              key={index}
              text={filler}
              onPress={() => handleFillerPress(filler)}
              disabled={filledValues.includes(filler) || isCurrentQuestionSolved}
            />
          ))}
        </View>
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            style={[
              styles.navButton,
              currentQuestionIndex === 0 && styles.navButtonDisabled,
            ]}
          >
            <Icon name="arrow-left" size={24} color="#fff" />
            <Text style={styles.navButtonText}> Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShowHint} style={styles.hintButton}>
            <Icon name="lightbulb-o" size={24} color="#FFD700" />
            <Text style={styles.hintButtonText}> Hint</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNextQuestion}
            disabled={currentQuestionIndex === questions[difficulty].length - 1}
            style={[
              styles.navButton,
              currentQuestionIndex === questions[difficulty].length - 1 && styles.navButtonDisabled,
            ]}
          >
            <Text style={styles.navButtonText}>Next </Text>
            <Icon name="arrow-right" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#fff', '#e0e0e0']}
            style={[styles.modalContainer, modalIsCorrect ? styles.modalSuccess : styles.modalError]}
          >
            <Text style={styles.modalIcon}>{modalIsCorrect ? '✅' : '❌'}</Text>
            <Text
              style={[styles.modalMessage, modalIsCorrect ? styles.successText : styles.errorText]}
            >
              {modalMessage}
            </Text>
            {modalExplanation ? (
              <Text style={styles.explanationText}>{modalExplanation}</Text>
            ) : null}
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      <Modal visible={showHintModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#fff', '#e0e0e0']} style={styles.hintModalContainer}>
            <Text style={styles.hintModalText}>💡 Hint: {currentQuestion.hint}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseHintModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5DC'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 10,
    margin: 10,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  difficultyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#000',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  activeDifficulty: { backgroundColor: '#333' },
  difficultyText: {
    color: '#FFD700',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Roboto',
  },
  highScoreText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Roboto',
    marginTop: 5,
  },
  flameAura: {
    borderRadius: 50,
  },
  flameGradient: {
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    padding: 12,
    backgroundColor: '#FF5722',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  content: { flex: 1, padding: 15 },
  pythonImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  problem: {
    fontSize: 24,
    marginBottom: 15,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 32,
    padding: 10,
    borderWidth: 2,
    borderColor: '#E0D8B0',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fillersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 25,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 10,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  navButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  navButtonText: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  hintButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  hintButtonText: {
    color: '#FFD700',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '85%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  modalSuccess: { borderColor: '#4CAF50', borderWidth: 3 },
  modalError: { borderColor: '#F44336', borderWidth: 3 },
  modalIcon: { fontSize: 60, marginBottom: 20 },
  modalMessage: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  successText: { color: '#4CAF50' },
  errorText: { color: '#F44336' },
  explanationText: {
    fontSize: 14,
    color: '#0288D1',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  hintModalContainer: {
    width: '85%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#FFD700',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  hintModalText: {
    fontSize: 16,
    color: '#0288D1',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
});

export default CodeFill;