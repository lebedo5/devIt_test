import { useState, useEffect, useCallback } from 'react'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigation } from "./app/navigations";
import { RootStoreProvider } from "./app/models/root-store/root-store-context";
import { RootStore } from "./app/models/root-store/root-store";
import { setupRootStore } from "./app/models";
import * as storage from "./app/utils/store/store"
import { useNavigationPersistence } from "./app/navigations/navigation-utilities copy";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { StyleSheet, View } from "react-native";
import { palette } from "./app/theme/palette";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"
SplashScreen.preventAutoHideAsync();

export default function App() {

  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
          'PoppinsBold': require('./assets/fonts/Poppins-Medium.ttf'),
        });
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  useEffect(() => {
    ;(async () => {
      setupRootStore().then(setRootStore)
    })()
  }, [])

  // if (!fontsLoaded) <AppLoading />
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
      <NavigationContainer>
        <View style={styles.root} onLayout={onLayoutRootView}>
          <RootStoreProvider value={rootStore}>
            <SafeAreaProvider>
              <AppNavigation />
            </SafeAreaProvider>
          </RootStoreProvider>
        </View>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.yellow
  }
})
