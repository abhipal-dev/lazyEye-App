import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

const COLS = 10;
const ROWS = 16;

const SHAPES = [
  // I-piece
  [[1, 1, 1, 1]],
  // O-piece
  [
    [1, 1],
    [1, 1],
  ],
  // T-piece
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  // L-piece
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  // Z-piece
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

export default function DichopticTetrisGame({ onClose }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const leftColor = currentUser?.left_eye_contrast_color || '#FF0033';
  const rightColor = currentUser?.right_eye_contrast_color || '#00E5FF';

  const [grid, setGrid] = useState(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [piecePos, setPiecePos] = useState({ r: 0, c: 3 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const timerRef = useRef(null);
  const sessionSavedRef = useRef(false);

  const spawnPiece = () => {
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setCurrentPiece(randomShape);
    setPiecePos({ r: 0, c: Math.floor((COLS - randomShape[0].length) / 2) });
  };

  useEffect(() => {
    spawnPiece();
  }, []);

  // Therapy duration stopwatch
  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused && !gameOver) {
        setSecondsElapsed((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, gameOver]);

  // Main game tick
  useEffect(() => {
    if (paused || gameOver || !currentPiece) return;

    timerRef.current = setInterval(() => {
      moveDown();
    }, 700);

    return () => clearInterval(timerRef.current);
  }, [currentPiece, piecePos, grid, paused, gameOver]);

  const canMove = (piece, r, c) => {
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (piece[row][col]) {
          const newR = r + row;
          const newC = c + col;
          if (newR >= ROWS || newC < 0 || newC >= COLS) return false;
          if (newR >= 0 && grid[newR][newC] !== 0) return false;
        }
      }
    }
    return true;
  };

  const moveDown = () => {
    if (!currentPiece) return;
    if (canMove(currentPiece, piecePos.r + 1, piecePos.c)) {
      setPiecePos((prev) => ({ ...prev, r: prev.r + 1 }));
    } else {
      // Settle piece on grid
      lockPiece();
    }
  };

  const moveLeft = () => {
    if (!currentPiece || paused || gameOver) return;
    if (canMove(currentPiece, piecePos.r, piecePos.c - 1)) {
      setPiecePos((prev) => ({ ...prev, c: prev.c - 1 }));
    }
  };

  const moveRight = () => {
    if (!currentPiece || paused || gameOver) return;
    if (canMove(currentPiece, piecePos.r, piecePos.c + 1)) {
      setPiecePos((prev) => ({ ...prev, c: prev.c + 1 }));
    }
  };

  const rotatePiece = () => {
    if (!currentPiece || paused || gameOver) return;
    // Rotate 90 degrees
    const rotated = currentPiece[0].map((_, index) =>
      currentPiece.map((row) => row[index]).reverse()
    );
    if (canMove(rotated, piecePos.r, piecePos.c)) {
      setCurrentPiece(rotated);
    }
  };

  const dropFast = () => {
    if (!currentPiece || paused || gameOver) return;
    let r = piecePos.r;
    while (canMove(currentPiece, r + 1, piecePos.c)) {
      r++;
    }
    setPiecePos((prev) => ({ ...prev, r }));
    lockPiece(r);
  };

  const lockPiece = (customR) => {
    const finalR = customR !== undefined ? customR : piecePos.r;
    const newGrid = grid.map((row) => [...row]);

    for (let row = 0; row < currentPiece.length; row++) {
      for (let col = 0; col < currentPiece[row].length; col++) {
        if (currentPiece[row][col]) {
          const targetR = finalR + row;
          const targetC = piecePos.c + col;
          if (targetR < 0) {
            handleGameOver();
            return;
          }
          newGrid[targetR][targetC] = 1; // Settled block (OD)
        }
      }
    }

    // Clear completed lines
    let cleared = 0;
    const filteredGrid = newGrid.filter((row) => {
      const full = row.every((cell) => cell === 1);
      if (full) cleared++;
      return !full;
    });

    while (filteredGrid.length < ROWS) {
      filteredGrid.unshift(Array(COLS).fill(0));
    }

    setGrid(filteredGrid);
    setLines((prev) => prev + cleared);
    setScore((prev) => prev + (cleared ? cleared * 100 + 20 : 15));

    // Check spawn collision
    const nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const startC = Math.floor((COLS - nextShape[0].length) / 2);
    if (!canMove(nextShape, 0, startC)) {
      handleGameOver();
    } else {
      setCurrentPiece(nextShape);
      setPiecePos({ r: 0, c: startC });
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    if (!sessionSavedRef.current) {
      sessionSavedRef.current = true;
      api.recordGameSession({
        userId: currentUser?.id || 1,
        gameName: 'Tetris',
        score,
        durationSeconds: Math.max(30, secondsElapsed),
      });
    }
  };

  const handleExit = () => {
    if (!sessionSavedRef.current && score > 0) {
      sessionSavedRef.current = true;
      api.recordGameSession({
        userId: currentUser?.id || 1,
        gameName: 'Tetris',
        score,
        durationSeconds: Math.max(20, secondsElapsed),
      });
    }
    onClose();
  };

  return (
    <View style={[styles.container, { backgroundColor: '#040711' }]}>
      {/* Game Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Dichoptic Tetris</Text>
          <Text style={styles.dichopticHint}>
            Falling piece (OS Left: <Text style={{ color: leftColor }}>Red</Text>) • Grid (OD Right: <Text style={{ color: rightColor }}>Cyan</Text>)
          </Text>
        </View>

        <TouchableOpacity onPress={handleExit} style={styles.exitBtn}>
          <Text style={styles.exitBtnText}>✕ Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statVal}>{score}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>LINES</Text>
          <Text style={styles.statVal}>{lines}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>DURATION</Text>
          <Text style={styles.statVal}>
            {Math.floor(secondsElapsed / 60)}:{(secondsElapsed % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>

      {/* Tetris Board */}
      <View style={styles.boardWrap}>
        <View style={styles.board}>
          {grid.map((row, rIdx) => (
            <View key={rIdx} style={styles.row}>
              {row.map((cell, cIdx) => {
                // Check if current falling piece occupies this cell
                let isFalling = false;
                if (currentPiece && !gameOver) {
                  const pieceR = rIdx - piecePos.r;
                  const pieceC = cIdx - piecePos.c;
                  if (
                    pieceR >= 0 &&
                    pieceR < currentPiece.length &&
                    pieceC >= 0 &&
                    pieceC < currentPiece[0].length &&
                    currentPiece[pieceR][pieceC]
                  ) {
                    isFalling = true;
                  }
                }

                // DICHOPTIC CHROMATIC SEPARATION:
                // Falling piece = Left Eye Color (e.g. Red)
                // Settled grid piece = Right Eye Color (e.g. Cyan/Blue)
                let cellColor = '#0E162B';
                if (isFalling) {
                  cellColor = leftColor;
                } else if (cell === 1) {
                  cellColor = rightColor;
                }

                return (
                  <View
                    key={cIdx}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: cellColor,
                        borderColor: isFalling || cell === 1 ? '#00000088' : '#14203D',
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}

          {/* Game Over Overlay */}
          {gameOver && (
            <View style={styles.overlay}>
              <Text style={styles.overTitle}>THERAPY COMPLETE!</Text>
              <Text style={styles.overScore}>Final Score: {score} pts</Text>
              <Text style={styles.overTime}>
                Session: {Math.floor(secondsElapsed / 60)}m {secondsElapsed % 60}s logged
              </Text>
              <TouchableOpacity onPress={handleExit} style={styles.overBtn}>
                <Text style={styles.overBtnText}>Save & Return to Portal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* On-Screen Touch Controls */}
      <View style={styles.controlsBar}>
        <TouchableOpacity onPress={moveLeft} style={styles.ctrlBtn}>
          <Text style={styles.ctrlIcon}>⬅️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={rotatePiece} style={[styles.ctrlBtn, styles.ctrlRotate]}>
          <Text style={styles.ctrlIcon}>🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={dropFast} style={[styles.ctrlBtn, styles.ctrlDrop]}>
          <Text style={styles.ctrlIcon}>⬇️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={moveRight} style={styles.ctrlBtn}>
          <Text style={styles.ctrlIcon}>➡️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
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
    marginBottom: 10,
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
    marginTop: 1,
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
    borderRadius: 3,
    margin: 0.5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 13, 27, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overTitle: {
    color: '#00E5FF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  overScore: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  overTime: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  overBtn: {
    marginTop: 16,
    backgroundColor: '#00E5FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  overBtnText: {
    color: '#070C18',
    fontSize: 12,
    fontWeight: '800',
  },
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  ctrlBtn: {
    width: 58,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0F1A33',
    borderWidth: 1,
    borderColor: '#223661',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlRotate: {
    backgroundColor: '#16284F',
    borderColor: '#00E5FF',
  },
  ctrlDrop: {
    backgroundColor: '#1E122C',
    borderColor: '#FF0055',
  },
  ctrlIcon: {
    fontSize: 20,
  },
});
