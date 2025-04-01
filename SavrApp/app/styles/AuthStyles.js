import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
    width: "40%",
    marginVertical: 10,
  },
  lineDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 15,
  },
  continueButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  orText: {
    textAlign: "center",
    marginVertical: 15,
  },
  googleButton: {
    flexDirection: "row",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
  },
  link: {
    color: "#000",
    fontWeight: "bold",
  },
  bottomBar: {
    height: 5,
    width: 40,
    backgroundColor: "#000",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;