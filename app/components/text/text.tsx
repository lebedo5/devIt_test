import * as React from "react"
import { Text as ReactNativeText } from "react-native"
import { TextProps } from "./text.props"

export function Text(props: TextProps) {
  const {
    text,
    children,
    fontFamily = "primary",
    style: styleOverride,
    boldText = false,
    ...rest
  } = props

  const content = children ? children : text

  const styles = [styleOverride]
  return (
    <ReactNativeText {...rest} style={[styles, { fontFamily: boldText ? "PoppinsBold" : "Poppins" }]}>
      {content}
    </ReactNativeText>
  )
}
