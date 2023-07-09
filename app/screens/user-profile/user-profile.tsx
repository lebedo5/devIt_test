import { Button, Divider, Input, LinkText, Screen, Text } from "../../components";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { fontSize, size } from "../../utils/size";
import { EditIcon } from "../../assets/icons/edit-icon";
import { palette } from "../../theme/palette";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStores } from "../../models/root-store/root-store-context";
import { observer } from "mobx-react-lite";

const DEFAULT_IMAGE = require("./Photo.png")
export const UserProfile = observer(() => {
	const { userDataStore: { userData, createUserTable, getUserData }, authStore: { toggleIsAuthenticated, getUsersData, updateData, createTable } } = useStores()
	const [user, updateUser] = useState(userData)
	const { bottom } = useSafeAreaInsets()
	const navigation = useNavigation()

	useEffect(() => {
		createUserTable()
		createTable()
		getUserData()
	}, [])


	const onChange = async (value: string, key: string) => {
		const copy = Object.assign({}, userData)
		copy[key] = value
		updateUser(copy)
	}

	const logOut = () => {
		toggleIsAuthenticated(false)
		navigation.navigate("auth", { screen: "LogIn" })
	}

	const save = () => {
		getUsersData()
		updateData({
			id: user?.id,
			username: user?.username,
			email: user?.email,
			phonenumber: user?.phonenumber,
			position: user?.position,
			skype: user?.skype,
		})
	}

	return (
		<Screen preset={"fixed"}>
			<View style={styles.wrap}>
				<View style={styles.headerContainer}>
					<Text boldText>Edit profile</Text>
					<LinkText containerStyle={styles.headerLink} link={logOut} linkText={"Log Out"}/>
				</View>
				<Divider size={12} />
				<Pressable onPress={() => console.log("sss")} style={styles.imageStyles}>
					<ImageBackground style={[styles.imageStyles, { overflow: 'hidden' }]} resizeMode={"cover"} source={DEFAULT_IMAGE} />
					<View style={styles.iconContainer}>
						<EditIcon />
					</View>
				</Pressable>
				<Divider size={12} />
				<Text boldText style={styles.fullName} text={userData?.username} />
				<Divider size={2} />
				<Text boldText style={styles.occupation} text={userData?.position || "UI/UX Designer"} />
				<Divider size={27} />
				<View>
					<Input
						labelText={"Name"}
						actualPlaceholder={"Name"}
						value={user?.username}
						onChange={(val) => onChange(val, "username")}
					/>
					<Divider size={40} />
					<Input
						labelText={"Email"}
						actualPlaceholder={"Email"}
						value={user?.email}
						onChange={(val) => onChange(val, "email")}
					/>
					<Divider size={40} />
					<Input
						labelText={"Phone"}
						actualPlaceholder={"Phone"}
						value={user?.phonenumber}
						onChange={(val) => onChange(val, "phonenumber")}
					/>
					<Divider size={40} />
					<Input
						labelText={"Position"}
						actualPlaceholder={"Position"}
						value={user?.position}
						onChange={(val) => onChange(val, "position")}
					/>
					<Divider size={40} />
					<Input
						labelText={"Skype"}
						actualPlaceholder={"Skype"}
						value={user?.skype}
						onChange={(val) => onChange(val, "skype")}
					/>
					<Divider size={40} />
					<Button title={"Save"} onPress={save} />
					<Divider size={bottom + size(30)} />
				</View>
			</View>
		</Screen>
	)
})

const styles = StyleSheet.create({
	imageStyles: {
		height: size(70),
		width: size(70),
		borderRadius: size(70),
	},
	fullName: {
		color: palette.textColor,
		fontSize: fontSize(24),
	},
	occupation: {
		color: palette.separateTextColor,
		fontSize: fontSize(14)
	},
	headerLink: {
		position: "absolute",
		right: size(32)
	},
	headerContainer: {
		flexDirection: "row",
		height: size(60),
		alignItems: "center",
		justifyContent: "center",
		width: "100%"
	},
	wrap: { alignItems: "center" },
	iconContainer: { position: "absolute", right: 0, bottom: 0 }
})
