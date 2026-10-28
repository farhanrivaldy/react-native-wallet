import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View } from "react-native";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <View style={{ flex: 1, backgroundColor: "#000" }} />;

  if (isSignedIn) {
    return <Redirect href="/root" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
