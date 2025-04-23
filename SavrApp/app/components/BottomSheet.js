import React, { useRef, useContext, useState, useEffect } from 'react';
import { Animated, PanResponder, Dimensions, View, Appearance } from 'react-native';
import SettingsContext from '../contexts/SettingsContext';
import getStyles from '../styles/BottomSheetStyles';
import COLORS from '../constants/colors';


const BottomSheet = ({ children }) => {
  const screenHeight = Dimensions.get('window').height;
  const SHEET_HEIGHT = screenHeight * 0.30;
  const PEEK_HEIGHT = 40;
  const sheetAnim = useRef(new Animated.Value(0)).current; // 0 = fully open; max = SHEET_HEIGHT - PEEK_HEIGHT
  const lastOffset = useRef(0);
  const HIDE_THRESHOLD = 1 / 4;
  const SHOW_THRESHOLD = 1 / 6;

  const { darkMode } = useContext(SettingsContext);

  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);

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
          backgroundColor: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
        },
      ]}
    >
      <View {...panResponder.panHandlers} style={{...styles.handleContainer,  height: PEEK_HEIGHT}} > 
        <View style={styles.handleBar} />
      </View>
      {children}
    </Animated.View>
  );
};



export default BottomSheet;