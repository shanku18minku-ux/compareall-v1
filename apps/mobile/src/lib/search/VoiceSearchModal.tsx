// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration
} from 'react-native';

interface VoiceSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onQueryExtracted: (query: string) => void;
}

const MOCK_SCENARIOS = [
  { spoken: "pizza under 100", translated: "pizza under 100" },
  { spoken: "veg thali in lazeez restaurant", translated: "veg thali in lazeez restaurant" },
  { spoken: "pizza from dominos", translated: "pizza from dominos" },
  { spoken: "chicken biryani under 150", translated: "chicken biryani under 150" }
];

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ visible, onClose, onQueryExtracted }) => {
  const [phase, setPhase] = useState<'listening' | 'transcribing' | 'done'>('listening');
  const [scenario, setScenario] = useState(MOCK_SCENARIOS[0]);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Pick a random scenario for demonstration
      setScenario(MOCK_SCENARIOS[Math.floor(Math.random() * MOCK_SCENARIOS.length)]);
      setPhase('listening');
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          })
        ])
      ).start();

      // Sequence of mock voice recognition
      setTimeout(() => {
        setPhase('transcribing');
        Vibration.vibrate(50);
        setTimeout(() => {
           setPhase('done');
           Vibration.vibrate([0, 50, 50, 50]);
           setTimeout(() => {
              onQueryExtracted(scenario.translated);
           }, 800);
        }, 1200);
      }, 2500);
    } else {
      pulseAnim.stopAnimation();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.micContainer}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.micCircle}>
              <Text style={styles.micIcon}>🎤</Text>
            </View>
          </View>

          <View style={styles.statusBox}>
            {phase === 'listening' && (
              <Text style={styles.statusLabel}>Listening...</Text>
            )}
            {phase === 'transcribing' && (
              <>
                <Text style={styles.statusLabel}>Transcribed:</Text>
                <Text style={styles.spokenText}>"{scenario.spoken}"</Text>
              </>
            )}
            {phase === 'done' && (
              <>
                <Text style={styles.statusLabel}>Searching NLP Intent:</Text>
                <Text style={styles.translatedText}>"{scenario.translated}"</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
    minHeight: 320,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: 'bold',
  },
  micContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: 120,
  },
  pulseCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  micCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  micIcon: {
    fontSize: 32,
    color: '#fff',
  },
  statusBox: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statusLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  spokenText: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  translatedText: {
    fontSize: 18,
    color: '#16a34a',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
