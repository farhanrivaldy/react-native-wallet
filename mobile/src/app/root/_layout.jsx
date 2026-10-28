import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { View } from "react-native";

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <View style={{ flex: 1, backgroundColor: "#000" }} />;

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
