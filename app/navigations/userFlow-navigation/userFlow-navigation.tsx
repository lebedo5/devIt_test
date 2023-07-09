import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {  UserProfile } from "../../screens";

type UserFlowParamList = {
	userProfile: undefined
}

const Stack = createNativeStackNavigator<UserFlowParamList>();

export const UserFlowNavigation = () => {
  return (
		<Stack.Navigator
		  screenOptions={{
				headerShown: false,
			}}
			initialRouteName={'userProfile'}
		>
			<Stack.Screen name={"userProfile"} component={UserProfile} />
		</Stack.Navigator>
  )
}
