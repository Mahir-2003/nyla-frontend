import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const ChatAssistantScreen = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch response from OpenAI
  const fetchOpenAIResponse = async (userMessage) => {
    setIsLoading(true); // Start loading before the fetch operation

    // Convert messages to the format expected by OpenAI
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant", // Convert 'bot' to 'assistant'
      content: msg.content,
    }));

    // Add the new user message
    formattedMessages.push({
      role: "user",
      content: userMessage,
    });

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 128,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );
      setIsLoading(false); // Stop loading after the fetch operation
      return response.data;
    } catch (error) {
      setIsLoading(false); // Stop loading if there is an error
      console.error("Error fetching response from OpenAI:", error);
      throw error;
    }
  };

  // Handler for sending a message
  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    // Add user message to messages list
    setMessages((messages) => [
      ...messages,
      { role: "user", content: inputText },
    ]);

    setIsLoading(true);

    try {
      const aiResponse = await fetchOpenAIResponse(inputText);

      // Add OpenAI's response to messages list
      setMessages((messages) => [
        ...messages,
        { role: "bot", content: aiResponse.choices[0].message.content },
      ]);
    } catch (error) {
      setIsLoading(false); // Stop loading if there is an error
      console.error("Error fetching response from OpenAI:", error);
      throw error;
      // Handle error (e.g., show an alert)
    }

    setIsLoading(false);

    // Clear input text
    setInputText("");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.role === "user"
                ? styles.userMessageContainer
                : styles.botMessageContainer,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === "user"
                  ? styles.userMessageText
                  : styles.botMessageText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007aff" />
          </View>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setInputText}
          value={inputText}
          placeholder="Ask a parenting question..."
        />
        <Button onPress={sendMessage} title="Send" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#007aff",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    alignSelf: "center",
    marginVertical: 10,
  },
});

export default ChatAssistantScreen;
