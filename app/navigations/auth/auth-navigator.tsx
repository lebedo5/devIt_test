import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogInScreen, SignUpScreen } from "../../screens";

type AuthParamList = {
	LogIn: undefined,
	SignUp: undefined
}

const Stack = createNativeStackNavigator<AuthParamList>();

export const AuthNavigator = () => {
  return (
	  <Stack.Navigator
		  screenOptions={{
			  headerShown: false,
		  }}
		  initialRouteName={'LogIn'}
	  >
		  <Stack.Screen name={"LogIn"} component={LogInScreen} />
		  <Stack.Screen name={"SignUp"} component={SignUpScreen} />
		</Stack.Navigator>
  )
}
