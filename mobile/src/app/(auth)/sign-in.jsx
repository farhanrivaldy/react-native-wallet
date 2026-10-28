import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [pendingSecondFactor, setPendingSecondFactor] = useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
        return;
      }

      if (signInAttempt.status === "needs_second_factor") {
        try {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
          });
          setPendingSecondFactor(true);
          return;
        } catch {
          setError("Failed to send verification code. Please try again.");
          return;
        }
      }

      setError("Additional verification required.");
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again.");
      } else if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("Account not found. Please check your email.");
      } else {
        setError(err.errors?.[0]?.message || "An error occurred. Please try again.");
      }
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !pendingSecondFactor) return;
    setError("");

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
        return;
      }

      setError("Verification failed. Please try again.");
    } catch (err) {
      if (err.errors?.[0]?.code === "form_code_incorrect") {
        setError("Invalid code. Please try again.");
      } else {
        setError(err.errors?.[0]?.message || "An error occurred. Please try again.");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image source={require("../../../assets/images/revenue-i4.png")} style={styles.illustration} />
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        {!pendingSecondFactor ? (
          <>
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#9A8478"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />

            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#9A8478"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />

            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>

              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        ) : (
          <>
            <Text style={{ marginBottom: 12, color: COLORS.text, textAlign: "center" }}>
              Enter the verification code sent to {emailAddress}
            </Text>

            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={code}
              placeholder="Enter code"
              placeholderTextColor="#9A8478"
              keyboardType="number-pad"
              autoCapitalize="none"
              onChangeText={setCode}
            />

            <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 16 }}
              onPress={() => {
                setPendingSecondFactor(false);
                setCode("");
                setError("");
              }}
            >
              <Text style={[styles.linkText, { textAlign: "center" }]}>Back to Sign In</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}