import Svg, { Path } from "react-native-svg";
import { size } from "../../utils/size";
import { palette } from "../../theme/palette";


export const ArrowDown = () => {
	return (
		<Svg width={size(12)} height={size(7)} viewBox="0 0 12 7" fill="none">
			<Path d="M1 1L6 6L11 1" stroke={palette.separateTextColor} strokeWidth={size(2)} strokeLinejoin="round"/>
		</Svg>
	)
}
