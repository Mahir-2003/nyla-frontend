import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const MyBtn = ({ onPress, text }) => {
    return (
        <TouchableOpacity style={{
            backgroundColor: "lightblue",
            padding: 10,
            borderRadius: "20%",
            width: 100,
        }}
            onPress={onPress}>
            <Text style={{textAlign: 'center'}}>{text}</Text>
        </TouchableOpacity>
    );
};

export default MyBtn;
