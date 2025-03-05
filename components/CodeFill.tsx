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
import CodeSnippet from './CodeSnippet';
import FillerButton from './FillerButton';
import { questions } from '../data/questions';

interface Question {
  problemId: string;
  problem: string;
  code: string;
  fillers: readonly string[];
  answerSequence: string;
  explanation: string;
  hint: string;
}

const CodeFill: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
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

  const currentQuestion = questions[difficulty][currentQuestionIndex] || questions[difficulty][0];
  const blankCount = currentQuestion.code.split('___').length - 1;
  const isCurrentQuestionSolved = !!solvedQuestions[currentQuestionIndex];
  const [filledValues, setFilledValues] = useState<string[]>(Array(blankCount).fill(''));

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
    if (filledValues.every((val) => val !== '') && !isCurrentQuestionSolved) {
      validateAnswer();
    }
  }, [filledValues]);

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
      playSound(soundObjects.clickSound); // Play click sound for filler button
    }
  };

  const handleBlankPress = (index: number) => {
    if (!isCurrentQuestionSolved) {
      const updatedValues = [...filledValues];
      updatedValues[index] = '';
      setFilledValues(updatedValues);
      playSound(soundObjects.clickSound); // Play click sound for blank button
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
      playSound(soundObjects.correctSound);
    } else {
      const correctWordsUsed = correctIndices.every((idx) => playerIndices.includes(idx));
      setModalMessage(
        correctWordsUsed ? '😕 Close, but the order’s off!' : '🚫 Oops! Wrong pieces, try again!'
      );
      setModalExplanation('');
      setModalIsCorrect(false);
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
    playSound(soundObjects.clickSound);
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
        <Text style={styles.problem}>{currentQuestion.problem}</Text>
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

// Styles remain unchanged
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
  },
  activeDifficulty: { backgroundColor: '#333' },
  difficultyText: {
    color: '#FFD700',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
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
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight: '400',
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