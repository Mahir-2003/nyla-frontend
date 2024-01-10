import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { auth, db } from "../utils/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../styles/colors";
import styles from "../styles/styles";
import { KeyboardAvoidingView } from "react-native";

const LessonScreen = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [checkForCompletion, setCheckForCompletion] = useState(false);
  const route = useRoute();
  const [selections, setSelections] = useState({});

  useEffect(() => {
    if (checkForCompletion) {
      console.log("HAHAH");
      // Perform the check
      checkCompletionAndAwardExperience(selections);

      // Reset the check flag
      setCheckForCompletion(false);
    }
  }, [selections, checkForCompletion]);

  useEffect(() => {
    const fetchLesson = async () => {
      const { courseId, unitId, lessonId } = route.params;
      const lessonRef = doc(
        db,
        "courses",
        courseId,
        "units",
        unitId,
        "lessons",
        lessonId
      );
      const questionsCollectionRef = collection(lessonRef, "questions");

      setLoading(true);
      try {
        const lessonSnapshot = await getDoc(lessonRef);
        if (!lessonSnapshot.exists()) {
          console.log("Lesson not found!");
          setLoading(false);
          return;
        }

        const questionsSnapshot = await getDocs(questionsCollectionRef);
        const questions = questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Initialize selections state with all questions isCorrect set to false
        const initialSelections = questions.reduce((acc, question) => {
          if (question.type === "article") {
            acc[question.id] = { isCorrect: true };
          } else {
            acc[question.id] = { isCorrect: false };
          }
          return acc;
        }, {});

        setLesson({
          ...lessonSnapshot.data(),
          questions,
        });

        setSelections(initialSelections);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
      setLoading(false);
    };

    fetchLesson();
  }, [route.params]);

  if (loading) {
    return <ActivityIndicator />;
  }

  const checkCompletionAndAwardExperience = async (currentSelections) => {
    // Use the currentSelections instead of selections state
    const allCorrect = lesson.questions.every(
      (question) =>
        question.type === "article" || currentSelections[question.id]?.isCorrect
    );

    if (allCorrect) {
      // If all answers are correct, mark the lesson as complete and update experience
      await updateLessonCompletionAndExperience();
    }
  };

  const updateLessonCompletionAndExperience = async () => {
    const { courseId, unitId, lessonId } = route.params;
    const userId = auth.currentUser.uid; // Assuming you have access to the authenticated user

    const lessonRef = doc(
      db,
      "courses",
      courseId,
      "units",
      unitId,
      "lessons",
      lessonId
    );

    await updateDoc(lessonRef, {
      completedBy: arrayUnion(userId),
    });

    // Firestore paths
    const userRef = doc(db, "users", userId);
    const lessonCompletionPath = `courseProgress.${courseId}.units.${unitId}.lessons.${lessonId}.completed`;

    console.log("Updating lesson completion and experience...");

    // Firestore update
    await updateDoc(userRef, {
      [lessonCompletionPath]: true,
      // Assuming experience is a simple increment. Adjust as needed.
      experience: increment(lesson.experience),
    });

    console.log("Lesson completion and experience updated!");
  };

  const handleOptionPress = (question, selectedOption) => {
    const isCorrect = question.answer === selectedOption;
    setSelections((prevSelections) => ({
      ...prevSelections,
      [question.id]: { selectedOption, isCorrect },
    }));

    // Indicate that we need to check for completion on the next update
    setCheckForCompletion(true);
  };

  const handleInputChange = (questionId, text) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [questionId]: {
        ...prevSelections[questionId],
        userInput: text,
        isCorrect: undefined,
      },
    }));
  };

  const handleSubmitAnswer = (question) => {
    const userAnswer = selections[question.id]?.userInput || "";
    const correctAnswer = question.answer
      ? question.answer.trim().toLowerCase()
      : "";
    const isCorrect = correctAnswer === userAnswer.trim().toLowerCase();
    setSelections((prevSelections) => {
      const newSelections = {
        ...prevSelections,
        [question.id]: { ...prevSelections[question.id], isCorrect: isCorrect },
      };

      setCheckForCompletion(true);

      return newSelections;
    });
  };

  const renderOptions = (question) =>
    question.options.map((option, optionIndex) => {
      const isSelected = selections[question.id]?.selectedOption === option;
      const isCorrect = selections[question.id]?.isCorrect;
      let backgroundColor = "#f0f0f0";
      if (isSelected) {
        backgroundColor = isCorrect ? "lightgreen" : "lightcoral";
      }

      return (
        <TouchableOpacity
          key={option}
          style={[lessonStyles.optionButton, { backgroundColor }]}
          onPress={() => handleOptionPress(question, option)}
          disabled={isSelected}
        >
          <Text style={lessonStyles.optionText}>{option}</Text>
        </TouchableOpacity>
      );
    });

  const renderFillInTheBlank = (question) => {
    const userInput = selections[question.id]?.userInput || "";
    const isCorrect = selections[question.id]?.isCorrect;
    let inputBackgroundColor = "#fff"; // default white background

    // Only set the background color if isCorrect has a boolean value
    if (userInput.length > 0 && isCorrect !== undefined) {
      inputBackgroundColor = isCorrect ? "lightgreen" : "lightcoral";
    } else {
      // When the user is typing (and isCorrect is undefined), keep the default background
      inputBackgroundColor = "#fff";
    }

    return (
      <View style={lessonStyles.fillBlankContainer}>
        <TextInput
          key={`input-${question.id}`}
          style={[
            lessonStyles.inputField,
            { backgroundColor: inputBackgroundColor },
          ]}
          onChangeText={(text) => handleInputChange(question.id, text)}
          placeholder="Type your answer here"
          value={userInput}
          editable={!isCorrect} // The field is editable only if the answer is not correct
        />
        <TouchableOpacity
          key={`submit-${question.id}`}
          style={lessonStyles.submitButton}
          onPress={() => handleSubmitAnswer(question)}
          disabled={isCorrect} // The submit button is disabled only if the answer is correct
        >
          <Text style={lessonStyles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderArticle = (question) => {
    return (
      <View style={lessonStyles.articleContainer}>
        <Text style={lessonStyles.articleTitle}>{question.title}</Text>
        <Text style={lessonStyles.articleContent}>{question.content}</Text>
      </View>
    );
  };

  if (!lesson) {
    return (
      <View style={lessonStyles.centered}>
        <Text>No lesson data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: colors.primary }}
    >
      <View
        style={{
          ...styles.card,
          width: "100%",
          borderRadius: 0,
          backgroundColor: colors.white,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-double-left" size={25} color={colors.alt} />
        </TouchableOpacity>

        {/* TITLE */}
        <View style={lessonStyles.pill}>
          <Text style={lessonStyles.pillText}>{lesson.title}</Text>
        </View>

        {/* STATUS */}
        <View style={{ ...lessonStyles.pill, borderRadius: 25 }}>
          <Text style={lessonStyles.pillText}>
            {lesson.completedBy?.includes(auth.currentUser.uid) ? "✓" : "✗"}
          </Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={lessonStyles.container}>
          <Text style={lessonStyles.lessonContent}>{lesson.content}</Text>
          {lesson.questions && lesson.questions.length > 0 && (
            <View style={lessonStyles.questionsContainer}>
              {lesson.questions.map((question) => (
                <View key={question.id} style={lessonStyles.card}>
                  <Text style={lessonStyles.questionText}>{question.text}</Text>
                  {question.type === "multiple-choice" &&
                    renderOptions(question)}
                  {question.type === "fill-in-the-blank" &&
                    renderFillInTheBlank(question)}
                  {question.type === "article" && renderArticle(question)}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const lessonStyles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 100, // Add bottom padding here
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  lessonContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  questionsContainer: {
    marginTop: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#fff", // white background for the card
    borderRadius: 8, // rounded corners
    padding: 16, // space inside the card
    marginVertical: 8, // space between cards vertically
    marginHorizontal: 16, // space on the sides
    shadowOpacity: 0.1, // shadow to make the card "pop" a little
    shadowRadius: 3, // how "spread out" the shadow should be
    shadowColor: "#000", // black shadow
    shadowOffset: { width: 0, height: 2 }, // where the shadow should fall
    elevation: 3, // shadow for Android
  },
  questionText: {
    fontSize: 18, // size of the question text
    fontWeight: "bold", // make the text bold
    color: "#333", // dark text for readability
    marginBottom: 8, // space after the question
  },
  optionButton: {
    padding: 12, // space inside the button
    marginVertical: 4, // space between options vertically
    borderRadius: 4, // rounded corners for buttons
    alignItems: "center", // center the text inside
    justifyContent: "center", // center the text vertically
    // Removed the background color here because it's now handled dynamically
  },
  optionText: {
    fontSize: 16, // size of the option text
    color: "#000", // black text
    // if option button is selected, you might want to change the text color
  },
  inputField: {
    flex: 1, // Take up all available space
    borderColor: "#ddd", // light gray border
    borderWidth: 1, // size of the border
    borderRadius: 4, // rounded corners
    padding: 12, // space inside the input field
    marginVertical: 4, // space between input fields vertically
    fontSize: 16, // size of the input text
    color: "#000", // text color inside the input
  },
  fillBlankContainer: {
    flexDirection: "row", // Align input and button in a row
    alignItems: "center",
    marginBottom: 10,
  },
  submitButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: colors.alt,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  articleContainer: {
    marginBottom: 20,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  articleContent: {
    fontSize: 16,
  },
  pill: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.alt,
    paddingHorizontal: 7.5,
    backgroundColor: colors.secondaryPink,
    textAlign: "center",
    marginHorizontal: "10%",
  },
  pillText: {
    color: colors.alt,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LessonScreen;
