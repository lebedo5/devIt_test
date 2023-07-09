import { observer } from "mobx-react-lite";
import { Text } from "../text/text";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { fontSize } from "../../utils/size";
import { palette } from "../../theme/palette";

interface LinkTextProps {
	separateText?: string
	linkText: string
	link: () => void
	containerStyle: ViewStyle
}

export const LinkText = observer(({ separateText, linkText, link, containerStyle }: LinkTextProps) => {
	return (
		<View style={[styles.container, containerStyle]}>
			{separateText && <Text style={styles.separateText}>{separateText} </Text>}
			<Pressable onPress={link}>
				<Text boldText style={styles.linkText}>{linkText}</Text>
			</Pressable>
		</View>
	)
})

const styles = StyleSheet.create({
	container: { flexDirection: "row", justifyContent: "center" },
	separateText: {
		fontSize: fontSize(14),
		color: palette.separateTextColor
	},
	linkText: {
		fontSize: fontSize(14),
		color: palette.yellow,
	}
})
