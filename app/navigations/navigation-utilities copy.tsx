import { useEffect, useRef, useState } from "react"
import { BackHandler } from "react-native"
import {
  createNavigationContainerRef,
  NavigationAction,
  NavigationState,
  PartialState,
} from "@react-navigation/native"
import { useStores } from "../models"
import { useCustomTheme } from "../theme/use-theme"
import { DarkThemeScreens } from "../theme/theme"

/* eslint-disable */
export const RootNavigation = {
  navigate(_name: string, _params?: any) {
  },
  goBack() {
  },
  resetRoot(_state?: PartialState<NavigationState> | NavigationState) {
  },
  getRootState(): NavigationState {
    return {} as any
  },
  dispatch(_action: NavigationAction) {
  },
}
/* eslint-enable */

export const navigationRef = createNavigationContainerRef()

/**
 * Gets the current screen from any navigation state.
 */
export function getActiveRouteName(state: NavigationState | PartialState<NavigationState>) {
  if (!state) return null
  const route = state.routes[state.index]

  // Found the active route -- return the name
  if (!route.state) return route.name

  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state)
}

/**
 * Gets the current screen params from any navigation state.
 */
export function getActiveRouteParams(state: NavigationState | PartialState<NavigationState>) {
  const route = state.routes[state.index]

  // Found the active route -- return the name
  if (!route.state) return route.params

  return getActiveRouteParams(route.state)
}

/**
 * Hook that handles Android back button presses and forwards those on to
 * the navigation or allows exiting the app.
 */
export function useBackButtonHandler(canExit: (routeName: string) => boolean) {
  const canExitRef = useRef(canExit)
  const { appStore } = useStores()
  const { history } = appStore
  const themeHook = useCustomTheme()

  useEffect(() => {
    canExitRef.current = canExit
  }, [canExit])

  useEffect(() => {
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      if (!navigationRef.isReady()) {
        return false
      }

      // grab the current route
      const routeState = navigationRef.getRootState()
      const routeName = getActiveRouteName(routeState)

      // are we allowed to exit?
      if (canExitRef.current(routeName)) {
        // exit and let the system know we've handled the event
        BackHandler.exitApp()
        return true
      }
      // we can't exit, so let's turn this into a back action
      if (navigationRef.canGoBack()) {
        if (history.length > 1) {
          const lastVisitedScreen = history[history.length - 2].route
          if (DarkThemeScreens.includes(lastVisitedScreen)) {
            themeHook.setTheme("dark")
          } else {
            themeHook.setTheme("light")
          }
        }
        navigationRef.goBack()
        return true
      }

      return false
    }

    // Subscribe when we come to life
    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    // Unsubscribe when we're done
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [])
}

/**
 * Custom hook for persisting navigation state.
 */
export function useNavigationPersistence(storage: any, persistenceKey: string) {
  const [initialNavigationState, setInitialNavigationState] = useState()

  // This feature is particularly useful in development mode.
  // It is selectively enabled in development mode with
  // the following approach. If you'd like to use navigation persistence
  // in production, remove the __DEV__ and set the state to true
  const [isRestored, setIsRestored] = useState(!__DEV__)

  const routeNameRef = useRef<string | undefined>()

  const onNavigationStateChange = (state) => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = getActiveRouteName(state)

    if (previousRouteName !== currentRouteName) {
      // track screens.
      __DEV__ && console.log(currentRouteName)
    }

    // Save the current route name for later comparision
    routeNameRef.current = currentRouteName

    // Persist state to storage
    storage.save(persistenceKey, state)
  }

  const restoreState = async () => {
    try {
      const state = await storage.load(persistenceKey)
      if (state) setInitialNavigationState(state)
    } finally {
      setIsRestored(true)
    }
  }

  useEffect(() => {
    if (!isRestored) restoreState()
  }, [isRestored])

  return { onNavigationStateChange, restoreState, isRestored, initialNavigationState }
}

/**
 * use this to navigate to navigate without the navigation
 * prop. If you have access to the navigation prop, do not use this.
 * More info: https://reactnavigation.org/docs/navigating-without-navigation-prop/
 */
export function navigate(name: any, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never)
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack()
  }
}

export function resetRoot(params = { index: 0, routes: [] }) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(params)
  }
}
