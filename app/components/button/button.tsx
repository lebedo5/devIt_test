import { observer } from "mobx-react-lite";
import { Text } from "../text/text";
import { Pressable, StyleSheet } from "react-native";
import { palette } from "../../theme/palette";
import { fontSize, size } from "../../utils/size";

interface ButtonProps {
	onPress: () => void
	title: string
}

export const Button = observer(({ onPress, title }: ButtonProps) => {
	return (
		<Pressable onPress={onPress} style={({pressed}) => [
			{
				opacity: pressed ? 0.7 : 1,
			},
			styles.buttonContainer
		]}>
			<Text boldText style={styles.buttonText} text={title}/>
		</Pressable>
	)
})

const styles = StyleSheet.create({
	buttonContainer: {
		backgroundColor: palette.yellow,
		paddingVertical: size(16),
		justifyContent: "center",
		alignItems: 'center',
		borderRadius: size(20),
	},
	buttonText: {
		color: palette.textColor,
		fontSize: fontSize(18),
	},
})
