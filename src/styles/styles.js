// styles.js
import { StyleSheet, Appearance } from "react-native";
import colors from "./colors";

const colorScheme = Appearance.getColorScheme();

const commonStyles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 7.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5,
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  interaction: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionText: {
    marginLeft: 8,
  },
  pill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#c8c4cc',
    borderWidth: .5,
    borderRadius: 50,
    padding: 5,
    paddingHorizontal: 10,
  },
  divider: {
    color: '#c8c4cc',
    marginHorizontal: 10,
  },
};

const lightStyles = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: colors.primary,
  },
  card: {
    ...commonStyles.card,
    backgroundColor: colors.white,
  },
});

const darkStyles = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: colors.primary,
  },
  card: {
    ...commonStyles.card,
    backgroundColor: colors.black,
  },
});

const styles = colorScheme === "dark" ? darkStyles : lightStyles;

export default styles;
