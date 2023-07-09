import { observer } from "mobx-react-lite";
import { Divider } from "../divider/divider";
import { Text } from "../text/text";
import { Animated, StyleSheet, View } from "react-native";
import { fontSize } from "../../utils/size";
import { useState, useEffect } from "react";
import { boolean } from "mobx-state-tree/dist/types/primitives";
import { palette } from "../../theme/palette";

interface AnimationErrorProps {
	errorTitle: string
}

export const AnimationError = observer(({ errorTitle }: AnimationErrorProps) => {

	const [fadeAnim] = useState(new Animated.Value(0));

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true
		}).start();

	}, []);

	return (
		<Animated.View style={{ display: Boolean(fadeAnim) ? "flex" : "none" }}>
			<Divider size={4} />
			<Text style={styles.errorText} text={errorTitle}/>
		</Animated.View>
	)
})

const styles = StyleSheet.create({
	errorText: {
		color: palette.red,
		fontSize: fontSize(13),
		fontWeight: '600'
	}
})
