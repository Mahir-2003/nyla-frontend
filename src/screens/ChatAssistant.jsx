import { View, Text, TextInput, Button, Keyboard } from "react-native";
import { useState } from "react";
import axios from "axios";

export default function ChatAssistantScreen() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const API_KEY = "NONE";

    const sendMessage = async () => {
        try {
            const newMessages = [
                ...messages,
                { text: input, sender: "user"},
            ];
            setMessages(newMessages);
            
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    messages: [
                        {
                            role: "user",
                            content: `You are a parenting assistant, answer this question as concise as possible: ${input}\n`,
                        },
                        { role: "assistant", content: "Answer: " },
                    ],
                    max_tokens: 150,
                    model: "gpt-3.5-turbo",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );

            // The response text will be the assistant's response
            const assistantMessage = { text: response.data.choices[0].message.content, sender: "assistant" };
            setMessages([...newMessages, assistantMessage]);

            // dismiss the keyboard
            Keyboard.dismiss();
        } catch (error) {
            console.error("Error translating text: ", error.response.data);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 36 }}>
                {messages.map((message, index) => (
                    <View
                        key={index}
                        style={{
                            alignSelf:
                                message.sender === "user" ? "flex-end" : "flex-start",
                            backgroundColor:
                                message.sender === "user" ? "#0084ff" : "#e5e5ea",
                            borderRadius: 6,
                            marginBottom: 6,
                            maxWidth: "80%",
                            padding: 12,
                        }}
                    >
                        <Text
                            style={{ color: message.sender === "user" ? "#fff" : "#000" }}
                        >
                            {message.text}
                        </Text>
                    </View>
                ))}
            </View>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <TextInput
                    style={{
                        borderColor: "#ccc",
                        borderRadius: 6,
                        borderWidth: 1,
                        flex: 1,
                        marginRight: 12,
                        padding: 12,
                    }}
                    value={input}
                    onChangeText={setInput}
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
}
