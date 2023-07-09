import { useState, useMemo } from 'react'
import {  observer } from "mobx-react-lite";
import { Text } from "../text/text";
import { Divider } from "../divider/divider";
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { palette } from "../../theme/palette";
import { fontSize, size, width } from "../../utils/size";
import { EyeIcon } from "../../assets/icons/Eye";
import { useStores } from "../../models/root-store/root-store-context";
import { AnimationError } from "../animation-error/animation-error";

interface InputProps {
	value: string
	onChange: (value: string, key: string) => void
	labelText?: string
	actualPlaceholder?: string
	inputStyle?: ViewStyle
	showSecureIcon?: boolean
	type?: string
	confirmPassword?: boolean
}

export const Input = observer((
	{
		value,
		onChange,
		labelText,
		actualPlaceholder,
		inputStyle: inputStyleOverride,
		showSecureIcon = false,
		type,
		confirmPassword
	}: InputProps) => {
	const { authStore: { emailError, passwordError, userNameError } } = useStores()
	const [secureText, setSecureText] = useState(showSecureIcon)
	const inputStyles = StyleSheet.flatten([styles.input, inputStyleOverride])
	const showSecureText = () => setSecureText(!secureText)

	const errorDependency = [emailError.isValidate,
		emailError.validationText,
		passwordError.isValidate,
		passwordError.validationText,
		userNameError.isValidate,
		userNameError.validationText,
		type, confirmPassword
	]

	const isError = useMemo(() => {
		if(type === "email" && !emailError.isValidate) {
			return <AnimationError errorTitle={emailError.validationText} />
		} else if(type === "password" && !passwordError.isValidate) {
			return <AnimationError errorTitle={passwordError.validationText} />
		} else if(type === "username" && !userNameError.isValidate) {
			return <AnimationError errorTitle={userNameError.validationText} />
		} else if(type === "confirmPassword" && !confirmPassword) {
			return <AnimationError errorTitle={"You should confirm password"} />
		}
	}, [...errorDependency])

	return (
		<>
			{labelText && <>
				<Text boldText style={styles.inputLabelText} text={labelText}/>
				<Divider size={14}/>
			</>}
			<View>
				<TextInput
					placeholder={actualPlaceholder}
					underlineColorAndroid={"transparent"}
					value={value}
					allowFontScaling={false}
					onChangeText={onChange}
					style={[inputStyles, styles.inputText]}
					secureTextEntry={secureText}
					textContentType={'oneTimeCode'}
					autoCorrect={false}
				/>
				{showSecureIcon &&
					<Pressable onPress={showSecureText} style={styles.iconContainer}>
						<EyeIcon secureText={secureText}/>
					</Pressable>
				}
				{isError}
			</View>
		</>
	)
})

const styles = StyleSheet.create({
	formContainer: {

	},
	inputLabelText: {
		color: palette.separateTextColor,
		fontSize: fontSize(14),
	},
	input: {
		fontSize: fontSize(16),
		width: width - size(30),
		borderBottomWidth: size(1),
		paddingBottom: size(10),
		fontFamily: 'PoppinsBold'
	},
	textError: {
		color: palette.red,
		borderBottomColor: palette.yellow,
	},
	inputText: {
		color: palette.textColor,
		borderBottomColor: palette.lightGrey,
	},
	errorText: {
		color: palette.red,
		fontSize: fontSize(13),
		fontWeight: '600'
	},
	iconContainer: {
		position: "absolute",
		right: 0
	}

})
