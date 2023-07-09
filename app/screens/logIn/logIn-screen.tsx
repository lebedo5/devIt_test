import { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from "mobx-react-lite";
import { Text, Divider, Screen, Input, Button, LinkText } from "../../components"
import { Logo } from "../../assets/icons/Logo";
import { palette } from "../../theme/palette";
import { fontSize, height, isSmallDevice, size } from "../../utils/size";
import { useNavigation } from "@react-navigation/native";
import { useStores } from "../../models/root-store/root-store-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const LogInScreen = observer(() => {
  const navigation = useNavigation()
  const { authStore: {
    logIn,
    getUsersData,
    validationFunction,
    clearErrors,
    createTable,
    users
  }, userDataStore: {
    createUserTable
  } } = useStores()

  const [userData, setUserData] = useState({
    email: "",
    password: ""
  })

  const { top, bottom } = useSafeAreaInsets()

  useEffect(() => {
    createTable()
    createUserTable()
    getUsersData()
  }, [])

  const onChange = async (value: string, key: string) => {
    const copy = Object.assign({}, userData)
    copy[key] = value
    setUserData(copy)
  }

  const logIns = () => {
    if(!validationFunction(userData?.email, "email") ||
      !validationFunction(userData?.password, "password")) return

    logIn({
      email: userData?.email,
      password: userData?.password
    })
  }

  const createAccount = () => {
    navigation.navigate("SignUp")
    clearErrors()
  }

  return (
    <Screen preset={"fixed"} style={styles.root}>
      <View style={{ alignItems: "center"}}>
        <Divider size={top + 15} />
        <Logo />
        <Divider size={50} />
        <Text boldText style={styles.title} text={"Log in to Woorkroom"}/>
      </View>
      <Divider size={top + 15} />
      <View style={styles.formContainer}>
        <Input
          labelText={"Your Email"}
          actualPlaceholder={"Email"}
          value={userData?.email}
          type={"email"}
          onChange={(val) => onChange(val, "email")}
        />
        <Divider size={isSmallDevice ? 10 : 30} />
        <Input
          labelText={"Password"}
          actualPlaceholder={"Password"}
          value={userData?.password}
          type={"password"}
          onChange={(val) => onChange(val, "password")}
          showSecureIcon={true}
        />
        <Divider size={20}/>
        <Text style={styles.passwordText} text={"Forgot password?"}/>
        <Divider size={30} />

        <Button onPress={logIns} title={"Log in"} />
        <Divider size={12} />
        <LinkText
          separateText={"New User?"}
          linkText={"Create Account"}
          link={createAccount}
        />
        <Divider size={bottom + 20} />
       </View>
    </Screen>
  )
})

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: size(32),
    alignItems: "center",
    justifyContent: "space-between",
    height
  },
  title: {
    color: palette.textColor,
    fontSize: fontSize(24)
  },
  formContainer: {},
  passwordText: {
    color: palette.separateTextColor,
    fontSize: fontSize(14),
    alignSelf: "flex-end"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8
  }
})
