// styles.js
import { StyleSheet, Appearance } from 'react-native';
import colors from './colors';

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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
});

const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

export default styles;
