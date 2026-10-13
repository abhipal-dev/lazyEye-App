import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import CustomIcon from '../../components/CustomIcon';

const GRID_SIZE = 14;

export default function DichopticSnakeGame({ onClose }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const leftColor = currentUser?.left_eye_contrast_color || '#FF0033';
  const rightColor = currentUser?.right_eye_contrast_color || '#00E5FF';

  const [snake, setSnake] = useState([
    { r: 7, c: 5 },
    { r: 7, c: 4 },
    { r: 7, c: 3 },
  ]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState({ r: 7, c: 10 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const dirRef = useRef('RIGHT');
  const savedRef = useRef(false);

  useEffect(() => {
    dirRef.current = direction;
  }, [direction]);

  // Duration Stopwatch
  useEffect(() => {
    const int = setInterval(() => {
      if (!gameOver) setSecondsElapsed((p) => p + 1);
    }, 1000);
    return () => clearInterval(int);
  }, [gameOver]);

  // Game Loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 280);

    return () => clearInterval(interval);
  }, [snake, gameOver]);

  const moveSnake = () => {
    const head = { ...snake[0] };

    switch (dirRef.current) {
      case 'UP':
        head.r -= 1;
        break;
      case 'DOWN':
        head.r += 1;
        break;
      case 'LEFT':
        head.c -= 1;
        break;
      case 'RIGHT':
        head.c += 1;
        break;
    }

    // Wall collision
    if (head.r < 0 || head.r >= GRID_SIZE || head.c < 0 || head.c >= GRID_SIZE) {
      handleGameOver();
      return;
    }

    // Self collision
    if (snake.some((segment) => segment.r === head.r && segment.c === head.c)) {
      handleGameOver();
      return;
    }

    const newSnake = [head, ...snake];

    // Food collision
    if (head.r === food.r && head.c === food.c) {
      setScore((s) => s + 25);
      spawnFood(newSnake);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const spawnFood = (currentSnake) => {
    let newFood;
    while (!newFood || currentSnake.some((s) => s.r === newFood.r && s.c === newFood.c)) {
      newFood = {
        r: Math.floor(Math.random() * GRID_SIZE),
        c: Math.floor(Math.random() * GRID_SIZE),
      };
    }
    setFood(newFood);
  };

  const handleGameOver = () => {
    setGameOver(true);
    if (!savedRef.current) {
      savedRef.current = true;
      api.recordGameSession({
        userId: currentUser?.id || 1,
        gameName: 'Snake',
        score,
        durationSeconds: Math.max(20, secondsElapsed),
      });
    }
  };

  const handleExit = () => {
    if (!savedRef.current && score > 0) {
      savedRef.current = true;
      api.recordGameSession({
        userId: currentUser?.id || 1,
        gameName: 'Snake',
        score,
        durationSeconds: Math.max(15, secondsElapsed),
      });
    }
    onClose();
  };

  const handleDirChange = (newDir) => {
    if (gameOver) return;
    const current = dirRef.current;
    if (newDir === 'UP' && current !== 'DOWN') setDirection('UP');
    if (newDir === 'DOWN' && current !== 'UP') setDirection('DOWN');
    if (newDir === 'LEFT' && current !== 'RIGHT') setDirection('LEFT');
    if (newDir === 'RIGHT' && current !== 'LEFT') setDirection('RIGHT');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#040711' }]}>
      {/* Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Dichoptic Snake</Text>
          <Text style={styles.dichopticHint}>
            Snake body (OS: <Text style={{ color: leftColor }}>Red</Text>) • Apple food (OD: <Text style={{ color: rightColor }}>Cyan</Text>)
          </Text>
        </View>

        <TouchableOpacity onPress={handleExit} style={styles.exitBtn} accessible={true} accessibilityLabel="Exit snake game">
          <CustomIcon library="Feather" name="x" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.exitBtnText}>Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statVal}>{score}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>LENGTH</Text>
          <Text style={styles.statVal}>{snake.length}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>DURATION</Text>
          <Text style={styles.statVal}>
            {Math.floor(secondsElapsed / 60)}:{(secondsElapsed % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>

      {/* Board */}
      <View style={styles.boardWrap}>
        <View style={styles.board}>
          {Array.from({ length: GRID_SIZE }).map((_, rIdx) => (
            <View key={rIdx} style={styles.row}>
              {Array.from({ length: GRID_SIZE }).map((_, cIdx) => {
                const isSnake = snake.some((s) => s.r === rIdx && s.c === cIdx);
                const isHead = snake[0].r === rIdx && snake[0].c === cIdx;
                const isFood = food.r === rIdx && food.c === cIdx;

                let cellColor = '#080E1C';
                if (isSnake) {
                  cellColor = leftColor; // Left Eye
                } else if (isFood) {
                  cellColor = rightColor; // Right Eye
                }

                return (
                  <View
                    key={cIdx}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: cellColor,
                        borderRadius: isFood ? 8 : 3,
                        borderColor: isSnake || isFood ? '#00000066' : '#101C36',
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}

          {/* Game Over */}
          {gameOver && (
            <View style={styles.overlay}>
              <Text style={styles.overTitle}>THERAPY SESSION COMPLETE</Text>
              <Text style={styles.overScore}>Score: {score} pts</Text>
              <Text style={styles.overTime}>Duration: {secondsElapsed}s logged to doctor</Text>
              <TouchableOpacity onPress={handleExit} style={styles.overBtn}>
                <Text style={styles.overBtnText}>Save & Finish</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* 4-Way D-Pad Touch Controls */}
      <View style={styles.dpadWrap}>
        <TouchableOpacity onPress={() => handleDirChange('UP')} style={[styles.dpadBtn, styles.dpadUp]} accessible={true} accessibilityLabel="Move up">
          <CustomIcon library="Feather" name="chevron-up" size={24} color="#00E5FF" />
        </TouchableOpacity>

        <View style={styles.dpadMidRow}>
          <TouchableOpacity onPress={() => handleDirChange('LEFT')} style={styles.dpadBtn} accessible={true} accessibilityLabel="Move left">
            <CustomIcon library="Feather" name="chevron-left" size={24} color="#00E5FF" />
          </TouchableOpacity>
          <View style={styles.dpadCenter} />
          <TouchableOpacity onPress={() => handleDirChange('RIGHT')} style={styles.dpadBtn} accessible={true} accessibilityLabel="Move right">
            <CustomIcon library="Feather" name="chevron-right" size={24} color="#00E5FF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleDirChange('DOWN')} style={[styles.dpadBtn, styles.dpadDown]} accessible={true} accessibilityLabel="Move down">
          <CustomIcon library="Feather" name="chevron-down" size={24} color="#00E5FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 18,
    paddingBottom: Platform.OS === 'android' ? 28 : 14,
    paddingHorizontal: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dichopticHint: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  exitBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  statsBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0C1324',
    borderRadius: 10,
    padding: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2D4A',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  boardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  board: {
    backgroundColor: '#070D1B',
    borderWidth: 2,
    borderColor: '#1E2F52',
    borderRadius: 12,
    padding: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 20,
    height: 20,
    borderWidth: 0.5,
    margin: 0.5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 13, 27, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overTitle: {
    color: '#00E5FF',
    fontSize: 16,
    fontWeight: '900',
  },
  overScore: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  overTime: {
    color: '#94A3B8',
    fontSize: 11.5,
    marginTop: 2,
  },
  overBtn: {
    marginTop: 14,
    backgroundColor: '#00E5FF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  overBtnText: {
    color: '#070C18',
    fontSize: 12,
    fontWeight: '800',
  },
  dpadWrap: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  dpadMidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dpadCenter: {
    width: 44,
    height: 44,
  },
  dpadBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#0F1A33',
    borderWidth: 1.5,
    borderColor: '#243C6E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadUp: {
    marginBottom: 6,
  },
  dpadDown: {
    marginTop: 6,
  },
  dpadText: {
    color: '#00E5FF',
    fontSize: 18,
    fontWeight: '900',
  },
});

