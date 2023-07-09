import React, { useEffect } from "react"
import {
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
  StatusBar
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ScreenProps } from "./screen.props"
import { size } from "../../utils/size"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isNonScrolling, presets } from "./screen.presets";

const isIos = Platform.OS === "ios"

function ScreenWithoutScrolling(props: ScreenProps) {
  const insets = useSafeAreaInsets()
  const preset = presets.fixed
  const style = props.style || {}
  const { topOffset = 24 } = props
  const backgroundStyle = props.backgroundColor
    ? { backgroundColor: "white" }
    : {}
  const insetStyle = { paddingTop: props.unsafe ? size(topOffset) : insets.top }

  return (
    <KeyboardAwareScrollView
      style={[preset.outer, backgroundStyle]}
      keyboardShouldPersistTaps='handled'
    >
      <StatusBar  />
      <View style={[preset.outer, style, insetStyle, { backgroundColor: "white" }]}>{props.children}</View>
    </KeyboardAwareScrollView>
  )
}

function ScreenWithScrolling(props: ScreenProps) {
  const { unsafe = true } = props
  const insets = useSafeAreaInsets()
  const preset = presets.scroll
  const style = props.style || {}
  const { topOffset = 0 } = props
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}
  const insetStyle = { paddingTop: unsafe ? size(topOffset) : insets.top }

  return (
    <>
      <StatusBar barStyle={isIos ? "dark-content" : "light-content"} />
      <View style={[preset.outer, backgroundStyle, insetStyle]}>
        <SafeAreaView style={preset.outer}>
          <KeyboardAvoidingView
            style={[preset.outer, backgroundStyle]}
            behavior={isIos ? "padding" : "height"}
            keyboardVerticalOffset={props.keyboardOffset || 0}
          >
            <ScrollView
              style={[preset.outer, backgroundStyle]}
              contentContainerStyle={[preset.inner, style]}
            >
              {props.children}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </>
  )
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export function Screen(props: ScreenProps) {
  const [showContent, setShowContent] = React.useState(false)

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setShowContent(true)
    })
  }, [])
  if (!showContent) return null

  if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} />
  } else {
    return <ScreenWithScrolling {...props} />
  }
}
