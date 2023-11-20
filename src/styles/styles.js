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

export const headerPadding = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56, // Adjust this value as needed
    alignItems: "center",
    justifyContent: "center"
  },
});

const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

export default styles;
