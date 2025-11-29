import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useLoading } from '../context/loadingContext';

const { width, height } = Dimensions.get('window');

const LoadingComponent: React.FC = () => {
  const { isLoading, message } = useLoading();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (isLoading) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      spinValue.setValue(0);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isLoading, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!isLoading) return null;

  return (
    <Modal 
      transparent 
      animationType="fade" 
      visible={isLoading}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Animated.View 
            style={[styles.spinner, { transform: [{ rotate: spin }] }]} 
          />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#f3f3f3',
    borderTopColor: '#3498db',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoadingComponent;