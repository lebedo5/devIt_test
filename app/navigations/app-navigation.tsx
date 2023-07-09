import { useEffect, useCallback } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthNavigator } from "./auth/auth-navigator";
import { UserFlowNavigation } from "./userFlow-navigation/userFlow-navigation";
import { useStores } from "../models/root-store/root-store-context";
import { useFocusEffect } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import * as storage from "../utils/store/store";

type NavigatorParamList = {
	auth: undefined,
	userFlow: undefined
}
const Stack = createNativeStackNavigator<NavigatorParamList>();

export const AppNavigation = observer(() => {

	const { authStore: { isAuthenticated, getUsersData, createTable, toggleIsAuthenticated }, userDataStore: { createUserTable } } = useStores()

	const getInitialScreen = async () => {
		toggleIsAuthenticated(Boolean(await storage.load("USER_AUTHENTICATED")))
	}

	useEffect(() => {
		getInitialScreen()
	}, [])


	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName={'auth'}
		>
			{isAuthenticated ?
				(<Stack.Screen
					options={{ orientation: "portrait" }}
					name={"userFlow"}
					component={UserFlowNavigation}
				/>) : null}
			{!isAuthenticated &&
				(<Stack.Screen
					name={"auth"}
					component={AuthNavigator}
				/>)}
		</Stack.Navigator>
	)
})
