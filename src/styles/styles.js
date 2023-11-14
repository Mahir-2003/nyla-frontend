// styles.js
import { StyleSheet, Appearance } from 'react-native';

const colorScheme = Appearance.getColorScheme();

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // other light styles
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    // other dark styles
  },
});

const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

export default styles;
