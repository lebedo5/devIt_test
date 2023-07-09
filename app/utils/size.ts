import { Dimensions, PixelRatio } from "react-native"

const DESIGN_WIDTH = 375.0

export const { height, width } = Dimensions.get("screen")
export const isSmallDevice = height < 800

export function size(designSize: number) {
	return PixelRatio.roundToNearestPixel(
		(designSize * Dimensions.get("screen").width) / DESIGN_WIDTH,
	)
}

export function fontSize(designSize: number) {
	return PixelRatio.roundToNearestPixel(
		(designSize * Dimensions.get("screen").width) /
		DESIGN_WIDTH /
		Dimensions.get("screen").fontScale,
	)
}
