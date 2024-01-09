import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const MyTextInput = ({ placeholder, onChangeText, value, autoCapitalize = 'sentences' }) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            autoCapitalize={autoCapitalize}
            secureTextEntry={true}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 6,
        margin: 6,
        padding: 10,
    },
});

export default MyTextInput;

