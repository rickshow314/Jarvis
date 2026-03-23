import React, { useEffect, useRef } from "react";
import {
  FlatList,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useChatStore } from "@/src/store/chat.store";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { ChatInput } from "@/src/components/chat/ChatInput";
import { MessageBubble } from "@/src/components/chat/MessageBubble";

export default function ChatScreen() {
  const { messages, isLoading, sendMessage, initConversation } = useChatStore();
  const isConnected = useNetworkStatus();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.safe}>
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline  Jarvis will respond when reconnected</Text>
        </View>
      )}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Hi, I am Jarvis</Text>
            <Text style={styles.emptySubtitle}>Tap the mic or type to get started</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={styles.listContent}
          />
        )}
        {isLoading && (
          <View style={styles.typingRow}>
            <Text style={styles.typingText}>Jarvis is thinking...</Text>
          </View>
        )}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  offlineBanner: { backgroundColor: "#FF6B6B", paddingVertical: 6, alignItems: "center" },
  offlineText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  listContent: { paddingTop: 12, paddingBottom: 8 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyTitle: { fontSize: 26, fontWeight: "700", color: "#1A1A2E" },
  emptySubtitle: { fontSize: 16, color: "#888" },
  typingRow: { paddingHorizontal: 20, paddingBottom: 4 },
  typingText: { color: "#999", fontSize: 13, fontStyle: "italic" },
});
