import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import CodeSnippet from './components/CodeSnippet';
import FillerButton from './components/FillerButton';
import { questions } from './data/questions';

interface Question {
  problemId: string;
  problem: string;
  code: string;
  fillers: readonly string[];
  answerSequence: string;
  explanation: string;
  hint: string;
}

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solvedQuestions, setSolvedQuestions] = useState<{ [key: number]: string[] }>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalExplanation, setModalExplanation] = useState('');
  const [modalIsCorrect, setModalIsCorrect] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const currentQuestion = questions.easy[currentQuestionIndex];
  const blankCount = currentQuestion.code.split('___').length - 1;
  const isCurrentQuestionSolved = !!solvedQuestions[currentQuestionIndex];
  const [filledValues, setFilledValues] = useState<string[]>(Array(blankCount).fill(''));

  useEffect(() => {
    if (isCurrentQuestionSolved) {
      setFilledValues(solvedQuestions[currentQuestionIndex]);
      setIsSolved(true);
    } else {
      setFilledValues(Array(blankCount).fill(''));
      setIsSolved(false);
    }
  }, [currentQuestionIndex, solvedQuestions]);

  useEffect(() => {
    if (filledValues.every((val) => val !== '') && !isCurrentQuestionSolved) {
      validateAnswer();
    }
  }, [filledValues]);

  const handleFillerPress = (filler: typeof currentQuestion.fillers[number]) => {
    const nextEmptyIndex = filledValues.findIndex((val) => val === '');
    if (nextEmptyIndex !== -1 && !isCurrentQuestionSolved) {
      const updatedValues = [...filledValues];
      updatedValues[nextEmptyIndex] = filler;
      setFilledValues(updatedValues);
    }
  };

  const handleBlankPress = (index: number) => {
    if (!isCurrentQuestionSolved) {
      const updatedValues = [...filledValues];
      updatedValues[index] = '';
      setFilledValues(updatedValues);
    }
  };

  const validateAnswer = () => {
    const playerIndices = filledValues.map((value) => currentQuestion.fillers.indexOf(value));
    // Remove commas and spaces from answerSequence for consistent splitting
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
    } else {
      const correctWordsUsed = correctIndices.every((idx) => playerIndices.includes(idx));
      setModalMessage(
        correctWordsUsed ? '😕 Close, but the order’s off!' : '🚫 Oops! Wrong pieces, try again!'
      );
      setModalExplanation('');
      setModalIsCorrect(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalIsCorrect) {
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.hard.length);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.problem}>{currentQuestion.problem}</Text>
        <CodeSnippet
          template={currentQuestion.code.split('\n')}
          filledValues={filledValues}
          onBlankPress={handleBlankPress}
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
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, modalIsCorrect ? styles.modalSuccess : styles.modalError]}>
            <Text style={styles.modalIcon}>{modalIsCorrect ? '✅' : '❌'}</Text>
            <Text style={[styles.modalMessage, modalIsCorrect ? styles.successText : styles.errorText]}>
              {modalMessage}
            </Text>
            {modalExplanation ? <Text style={styles.explanationText}>{modalExplanation}</Text> : null}
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5e8c7' },
  content: { flex: 1, padding: 10 },
  problem: { fontSize: 16, marginBottom: 10, color: '#333', textAlign: 'center' },
  fillersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalSuccess: { borderColor: '#4CAF50', borderWidth: 2 },
  modalError: { borderColor: '#F44336', borderWidth: 2 },
  modalIcon: { fontSize: 50, marginBottom: 15 },
  modalMessage: { fontSize: 18, textAlign: 'center', marginBottom: 15 },
  successText: { color: '#4CAF50', fontWeight: 'bold' },
  errorText: { color: '#F44336', fontWeight: 'bold' },
  explanationText: { fontSize: 14, color: '#0288D1', textAlign: 'center', fontStyle: 'italic', marginBottom: 20, lineHeight: 20 },
  closeButton: { padding: 10, backgroundColor: '#E0F7FA', borderRadius: 5 },
  closeButtonText: { color: '#0066cc', fontSize: 16, fontWeight: 'bold' },
});

export default App;