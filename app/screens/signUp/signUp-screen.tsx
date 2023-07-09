import { useState, useRef } from 'react'
import { observer } from "mobx-react-lite";
import { StyleSheet, View } from "react-native";
import { Button, CELL_COUNT, ConfirmCode, Divider, Input, LinkText, Screen, Text } from "../../components"
import { Logo } from "../../assets/icons/Logo";
import { fontSize, size, width } from "../../utils/size";
import { palette } from "../../theme/palette";
import { useNavigation } from "@react-navigation/native";
import { useStores } from "../../models/root-store/root-store-context";
import PhoneInput from "react-native-phone-number-input";
import { AnimationError } from "../../components/animation-error/animation-error";
export const SignUpScreen = observer(() => {
	const navigation = useNavigation()
	const [phoneValidation, setPhoneValidation] = useState<string>("1");
	const [isValidCellCode, setIsValidCellCode] = useState<boolean>(true);
	const [userData, setUserData] = useState<object>({
		email: "",
		username: "",
		password: "",
		code: "",
		confirmPassword: "",
		phonenumber: ""
	});
	const confirmPasswords = Boolean(userData?.password === userData?.confirmPassword && userData?.password?.length > 5)

	const phoneInput = useRef<PhoneInput>(null);

	const { authStore: { signUp, validationFunction, clearErrors } } = useStores()

	const onChange = async (value: string, key: string) => {
		const copy = Object.assign({}, userData)
		copy[key] = value
		setUserData(copy)

		if(key === "code") {
			setIsValidCellCode(userData?.code?.length === CELL_COUNT - 1)
		}
		if(key === "phonenumber") {
			phoneInput.current?.isValidNumber(phoneValidation)
		}

	}

	const goToLogIn = () => {
		navigation.navigate("LogIn")
		clearErrors()
	}

	const signUpUser = () => {
		if(phoneValidation && isValidCellCode) {
			setIsValidCellCode(userData?.code?.length === CELL_COUNT)
			setPhoneValidation("")
		}

		if(!validationFunction(userData?.email, "email") &&
			!validationFunction(userData?.password, 'password') &&
			!validationFunction(userData?.username, 'username') &&
			confirmPasswords &&
			!phoneInput.current?.isValidNumber(phoneValidation) &&
			!isValidCellCode) return

		signUp({
				code: userData?.code,
				username: userData?.username,
				email: userData?.email,
				password: userData?.password,
				phonenumber: userData?.phonenumber
			})
	}

	return (
		<Screen preset={"fixed"} style={styles.root}>
			<Divider size={20} />
			<Logo />
			<Divider size={30}/>
			<Text boldText style={styles.title} text={"Sign Up To woorkroom"}/>
			<Divider size={30}/>
			<View>
				<>
					<PhoneInput
						ref={phoneInput}
						layout="second"
						defaultCode="UA"
						countryPickerProps={{ withAlphaFilter: true }}
						containerStyle={styles.containerStyle}
						flagButtonStyle={styles.flagButtonStyle}
						codeTextStyle={styles.codeTextStyle}
						textContainerStyle={styles.textContainerStyle}
						textInputStyle={styles.textInputStyle}
						onChangeFormattedText={(val) => onChange(val, "phonenumber")}
						onChangeText={(val) => setPhoneValidation(val)}
					/>
					{!Boolean(phoneValidation) ? <AnimationError errorTitle={"Can be empty"} /> :
						!phoneInput.current?.isValidNumber(phoneValidation) && userData?.phonenumber ?
						<AnimationError errorTitle={"Not valid phone"} /> : null
					}
				</>
				<Divider size={30} />
				<ConfirmCode
					isValidCellCode={!isValidCellCode}
					value={userData?.code}
					setValue={(val) => onChange(val, "code")}
				/>
				<Divider size={40} />
				<Input
					labelText={"Your name"}
					actualPlaceholder={"Your name"}
					value={userData?.username}
					type={"username"}
					onChange={(val) => onChange(val, "username")}
				/>
				<Divider size={40} />
				<Input
					labelText={"Your Email"}
					actualPlaceholder={"Your Email"}
					value={userData?.email}
					type={"email"}
					onChange={(val) => onChange(val, "email")}
				/>
				<Divider size={40} />
				<Input
					labelText={"Password"}
					actualPlaceholder={"Password"}
					type={"password"}
					value={userData?.password}
					onChange={(val) => onChange(val, "password")}
					showSecureIcon
				/>
				<Divider size={40} />
				<Input
					labelText={"Confirm Password"}
					actualPlaceholder={"Confirm Password"}
					type={"confirmPassword"}
					confirmPassword={confirmPasswords}
					value={userData?.confirmPassword}
					onChange={(val) => onChange(val, "confirmPassword")}
					showSecureIcon
				/>
				<Divider size={40} />
				<Button onPress={signUpUser} title={"Next"} />
				<Divider size={12} />
				<LinkText
					separateText={"Have Account?"}
					linkText={"Log In"}
					link={goToLogIn}
				/>
			</View>
		</Screen>
	)
})


const styles = StyleSheet.create({
	root: {  flex: 1,
		paddingHorizontal: size(32),
		alignItems: "center",
		paddingVertical: size(32),
		flexDirection: "column",
		justifyContent: "space-between",
	},
	title: {
		color: palette.textColor,
		fontSize: fontSize(24)
	},
	flagButtonStyle: {
		borderColor: palette.lightGrey,
		borderWidth: size(1),
		borderRadius: size(15),
		marginRight: size(10),
	},
	codeTextStyle: {
		color: palette.separateTextColor
	},
	textContainerStyle: {
		backgroundColor: "transparent",
		borderColor: palette.lightGrey,
		borderWidth: size(1),
		borderRadius: size(15),
		marginRight: size(10),
	},
	textInputStyle: {
		color: palette.separateTextColor
	},
	containerStyle: {
		width: width - size(32),
	}
})
