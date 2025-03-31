import React, { useRef } from 'react';
import { Animated, PanResponder, Dimensions, StyleSheet, View } from 'react-native';

const BottomSheet = ({ children, isDarkMode }) => {
  const screenHeight = Dimensions.get('window').height;
  const SHEET_HEIGHT = screenHeight * 0.35;
  const PEEK_HEIGHT = 50;
  const sheetAnim = useRef(new Animated.Value(0)).current; // 0 = fully open; max = SHEET_HEIGHT - PEEK_HEIGHT
  const lastOffset = useRef(0);
  const HIDE_THRESHOLD = 1 / 4;
  const SHOW_THRESHOLD = 1 / 6;

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: () => {
        sheetAnim.stopAnimation((value) => {
          lastOffset.current = value;
        });
      },
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onPanResponderMove: (_, gs) => {
        let newVal = lastOffset.current + gs.dy;
        newVal = Math.min(Math.max(newVal, 0), SHEET_HEIGHT - PEEK_HEIGHT);
        sheetAnim.setValue(newVal);
      },
      onPanResponderRelease: (_, gs) => {
        const delta = gs.dy;
        if (lastOffset.current === 0) {
          if (delta > (SHEET_HEIGHT - PEEK_HEIGHT) * HIDE_THRESHOLD) {
            Animated.timing(sheetAnim, {
              toValue: SHEET_HEIGHT - PEEK_HEIGHT,
              duration: 200,
              useNativeDriver: false,
            }).start(() => { lastOffset.current = SHEET_HEIGHT - PEEK_HEIGHT; });
          } else {
            Animated.timing(sheetAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }).start(() => { lastOffset.current = 0; });
          }
        } else if (lastOffset.current === SHEET_HEIGHT - PEEK_HEIGHT) {
          if (delta < -(SHEET_HEIGHT - PEEK_HEIGHT) * SHOW_THRESHOLD) {
            Animated.timing(sheetAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }).start(() => { lastOffset.current = 0; });
          } else {
            Animated.timing(sheetAnim, {
              toValue: SHEET_HEIGHT - PEEK_HEIGHT,
              duration: 200,
              useNativeDriver: false,
            }).start(() => { lastOffset.current = SHEET_HEIGHT - PEEK_HEIGHT; });
          }
        } else {
          sheetAnim.stopAnimation((finalVal) => {
            if (finalVal < (SHEET_HEIGHT - PEEK_HEIGHT) / 2) {
              Animated.timing(sheetAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
              }).start(() => { lastOffset.current = 0; });
            } else {
              Animated.timing(sheetAnim, {
                toValue: SHEET_HEIGHT - PEEK_HEIGHT,
                duration: 200,
                useNativeDriver: false,
              }).start(() => { lastOffset.current = SHEET_HEIGHT - PEEK_HEIGHT; });
            }
          });
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          height: SHEET_HEIGHT,
          transform: [{ translateY: sheetAnim }],
          backgroundColor: isDarkMode ? '#121212' : '#fff',
        },
      ]}
    >
      <View {...panResponder.panHandlers} style={styles.handleContainer} > 
        <View style={styles.handleBar} />
      </View>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  handleContainer: {
    height: 40, // Increase this value to make the grab area taller
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d5d5d5',
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#888',
    marginVertical: 8,
  },
});

export default BottomSheet;