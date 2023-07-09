import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite";
import { CodeField, Cursor, useBlurOnFulfill } from "react-native-confirmation-code-field";
import { Text } from "../text/text"
import { palette } from "../../theme/palette";
import { fontSize, size, width } from "../../utils/size";
import { Divider } from "../divider/divider";
import { AnimationError } from "../animation-error/animation-error";

interface ConfirmCodeProps {
	value: string
	setValue: () => void
	isValidCellCode: boolean
}

export const CELL_COUNT = 4
export const ConfirmCode = observer(({ value, setValue, isValidCellCode }: ConfirmCodeProps) => {
	const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});

	return (
		<View style={styles.root}>
			<Text boldText style={styles.title} text={"Code"} />
			<Divider size={14} />
			<CodeField
				ref={ref}
				caretHidden={false}
				value={value}
				onChangeText={setValue}
				cellCount={CELL_COUNT}
				keyboardType="number-pad"
				textContentType="oneTimeCode"
				renderCell={({index, symbol, isFocused}) => (
					<View	key={index} style={[styles.cell, isFocused && styles.focusCell, isValidCellCode && !isFocused && styles.errorCell]}>
						<Text
							style={styles.cellText}>
							{symbol || (isFocused ? <Cursor /> : null)}
						</Text>
					</View>
				)}
			/>
			{isValidCellCode && <AnimationError errorTitle={"Can't be empty"} />}
		</View>
	)
})

const styles = StyleSheet.create({
	root: {
		width: width - size(132),
		justifyContent: "center",
	},
	title: {
		color: palette.separateTextColor,
		fontSize: fontSize(14)
	},
	cell: {
		width: size(48),
		height: size(48),
		borderWidth: size(1),
		borderRadius: size(15),
		borderColor: palette.lightGrey,
		justifyContent: "center",
		alignItems: "center",
	},
	cellText: {
		fontSize: fontSize(16),
		textAlign: 'center',
		paddingTop: size(4)
	},
	focusCell: {
		borderColor: palette.yellow,
	},
	errorCell: {
		borderColor: palette.red
	}
});
