import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { api } from '../services/api';

export default function IrisAssistantModal({ visible, onClose, role = 'doctor', patientId = null }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'model',
      text:
        role === 'patient'
          ? "🌟 Hi! I'm Iris, your Vision Buddy! 👁️✨ Ready to play some games and make your eyes super strong?"
          : "👋 Hello Doctor, I am **Iris** — your Clinical AI Vision Copilot.\n\nI monitor compliance adherence, evaluate suppression scotoma telemetry, and adapt red-cyan filters. How can I assist?",
      tools: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const quickPrompts =
    role === 'patient'
      ? [
          '🎮 Best game to play today?',
          '👓 Why do my glasses look red & blue?',
          '👀 My eyes feel tired!',
        ]
      : [
          '📊 Cohort Compliance Radar',
          `📝 Draft SOAP Note for Patient #${patientId || 22}`,
          '🎯 Recommend Contrast Adjustment',
        ];

  const handleSend = async (messageText = null) => {
    const query = messageText || input.trim();
    if (!query || loading) return;

    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        text: m.text,
      }));

      const res = await api.irisChat(query, role, patientId || 22, history);

      if (res && res.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            role: 'model',
            text: res.reply,
            tools: res.tools_executed || [],
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'model',
          text: '⚠️ Iris is momentarily unavailable. Please check your connection.',
          tools: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && flatListRef.current) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [messages, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarBadge}>
                <Text style={{ fontSize: 18 }}>👁️</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {role === 'patient' ? 'Iris Vision Buddy' : 'Iris Clinical Copilot'}
                </Text>
                <View style={styles.statusRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.headerSubtitle}>
                    {role === 'patient' ? 'Always here to cheer you on!' : 'Autonomous Agentic Core'}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Prompts */}
          <View style={styles.chipsRow}>
            {quickPrompts.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                onPress={() => handleSend(q)}
                disabled={loading}
              >
                <Text style={styles.chipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Message List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item }) => {
              const isUser = item.role === 'user';
              return (
                <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowModel]}>
                  {item.tools && item.tools.length > 0 && (
                    <View style={styles.toolsContainer}>
                      {item.tools.map((t, ti) => (
                        <View key={ti} style={styles.toolBadge}>
                          <Text style={styles.toolBadgeText}>⚡ Tool: {t.name}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleModel]}>
                    <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextModel]}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.loadingText}>Iris is analyzing clinical metrics...</Text>
            </View>
          )}

          {/* Input Footer */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={role === 'patient' ? 'Ask Iris anything...' : 'Ask clinical query...'}
              placeholderTextColor="#94A3B8"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
              onPress={() => handleSend()}
              disabled={!input.trim() || loading}
            >
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '82%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    color: '#94A3B8',
    fontSize: 20,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  msgRow: {
    marginVertical: 4,
  },
  msgRowUser: {
    alignItems: 'flex-end',
  },
  msgRowModel: {
    alignItems: 'flex-start',
  },
  toolsContainer: {
    marginBottom: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  toolBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  toolBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  bubbleModel: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  bubbleTextModel: {
    color: '#0F172A',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  sendBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
