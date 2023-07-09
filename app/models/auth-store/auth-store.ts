import { getRoot, Instance, SnapshotOut, types } from "mobx-state-tree";
import { UserModel } from "../user/user-model";
import { db } from "../../utils/store/store";
import { Alert } from "react-native";
import * as storage from '../../utils/store/store'
import { flow } from "mobx";
export const AuthModel = types
	.model("App")
	.props({
		isAuthenticated: types.optional(types.boolean, false),
		users: types.optional(types.array(UserModel), []),
		emailError: types.optional(types.model({
			isValidate: types.optional(types.boolean, false),
			validationText:  types.optional(types.string, ""),
		}), {}),
		passwordError: types.optional(types.model({
			isValidate: types.optional(types.boolean, false),
			validationText:  types.optional(types.string, ""),
		}), {}),
		userNameError: types.optional(types.model({
			isValidate: types.optional(types.boolean, false),
			validationText:  types.optional(types.string, ""),
		}), {}),

	})
	.views(() => ({}))
	.actions((self) => ({
		toggleEmailValidation(value) {
			self.emailError = {...value}
		},
		togglePasswordValidation(value) {
			self.passwordError = {...value}
		},
		toggleUserNameValidation(value) {
			self.userNameError = {...value}
		},
		async toggleIsAuthenticated(value) {
			self.isAuthenticated = value
			if(self.isAuthenticated) {
				await storage.saveString("USER_AUTHENTICATED", "true")
			} else {
				await storage.clear()
			}
		},
		clearUsersList() {
			self.users.clear()
		},
		clearErrors() {
			this.toggleEmailValidation({})
			this.togglePasswordValidation({})
			this.toggleUserNameValidation({})
		},
		updateUsers(data) {
			// console.log("datas", self.users)
			self.users.replace(
				data.map((item) => UserModel.create(item)),
			)
			// console.log("datas", self.users[4])
		},
		toggleUserInArray(params) {
			// getUsersData()
			// console.log("params, params?.id", params, params?.id)
			// const existingUser = self.users;
			// let newUsers = [...self.users]
			// const indexToUpdate = self.users.findIndex(name => name.id === 4);
			// // self.users[indexToUpdate].position = params.position;
			// self.users[indexToUpdate].position = params.position
			//
			// // this.clearUsersList()
			// console.log("newUsers", self.users, params)
			// this.updateUsers(newUsers)

			// 	if (users[i].id === params.id) {
			// 		users[i] = params.i;
			// 		console.log(users[i], params.i)
			// 		break;
			// 	}

			// console.log("self.user2", self.userData)
		}
	}))
	.actions((self) => ({
		validationFunction(text, type) {
			if(type === "email") {
				let reg = /^[a-zA-Z0-9_][a-zA-Z0-9_.]*@[a-zA-Z][a-zA-Z0-9]+\.[a-zA-Z]+$/

				if (!Boolean(text)) {
					self.toggleEmailValidation({
						isValidate: false,
						validationText: "Email can't be empty",
					})
					return false
				} else if(!reg.test(text)) {
					self.toggleEmailValidation({
						isValidate: false,
						validationText: "Not valid email (example: john.doe@example.com)",
					})
					return false
				} else if (reg.test(text)) {
					self.toggleEmailValidation({
						isValidate: true,
					})
					return true
				}
			} else if(type === 'password') {
				let reg = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]\w{0,14}$/

				if (text?.length === "") {
					self.togglePasswordValidation({
						isValidate: false,
						validationText: "Password can't be empty and less then 5",
					})
					return false
				} else if (!reg.test(text)) {
					self.togglePasswordValidation({
						isValidate: false,
						validationText: "Not valid password(min one letter (uppercase or lowercase), " +
							"min one number, password should be more then 5 )",
					})
					return false
				} else if (reg.test(text)) {
					self.togglePasswordValidation({
						isValidate: true,
					})
					return true
				}
			} else if(type === 'username') {
				let reg = /^[a-zA-Z0-9]{0,9}$/;

				if (text?.length === "") {
					self.toggleUserNameValidation({
						isValidate: false,
						validationText: "User name can't be empty and less then 4",
						type
					})
					return false
				} else if (!reg.test(text)) {
					self.toggleUserNameValidation({
						isValidate: false,
						validationText: "Not valid name, only letter end number",
						type
					})
					return false
				} else if (reg.test(text)) {
					self.toggleUserNameValidation({
						isValidate: true,
						type
					})
					return true
				}
			}
		},
	}))
	.actions((self) => ({
		async getUsersData() {
			 await db.transaction(async (tx) => {
				try {
					await tx.executeSql("SELECT * FROM users", [],
						(txObj, resultSet) => {
							self.updateUsers(resultSet.rows._array)
						},
						(txObj, error) => console.log(error)
					);
				} catch (e) {
					console.log("e", e)
				}
			});

		},
		async createTable() {
			await db.transaction(tx => {
				tx.executeSql(
					"CREATE TABLE IF NOT EXISTS "
					+ "users "
					+ "(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT, code INT, phonenumber TEXT, position TEXT, skype TEXT)"
				)
			})
		},
		signUp: flow(function* (params) {
			const { userDataStore: { getUser } } = getRoot(self)
			const { email, password, username, phonenumber } = params

			try {
				db.transaction((tx) => {
					tx.executeSql("INSERT INTO users (email, password, username, phonenumber) values (?,?,?,?)",
						[email, password, username, phonenumber],
						(txObj, resultSet) => {
							self.updateUsers([{ id: Math.random(), ...params}])
						},
						(txObj, error) => console.log(error)
					);
				});
				self.toggleIsAuthenticated(true)
				getUser({ email, username, phonenumber })
			} catch (e) {
				console.log(e)
			}
		}),

		updateData(params) {
			// console.log("params, params?.id", params, params?.id)
			const { email, username, phonenumber, position, skype, id } = params

			// tx.executeSql('UPDATE users SET email = ?, username = ?, phonenumber = ?, position = ?, skype = ? WHERE id = ?',

			db.transaction(tx => {
				tx.executeSql('UPDATE users SET position = ? WHERE id = ? ',
					[email, username, phonenumber, position, skype, id],
					(txObj, resultSet) => {
						self.toggleUserInArray(params)
					},
					(txObj, error) => console.log(error)
				);
			});
		},
	}))
	.actions((self) => ({
		logIn(params) {
			const { email, password } = params
			const { userDataStore: { getUser } } = getRoot(self)
			const result = self.users.find((item) => item.email === email && item.password === password)
			if(result) {
				self.toggleIsAuthenticated(true)
				getUser({ ...result })
			} else {
				Alert.alert("This user does not exist",
					"If you are sure that you have registered, check the correctness email and password")
			}
		}
	}))

type AuthType = Instance<typeof AuthModel>

export type App = AuthType

type AuthSnapshotType = SnapshotOut<typeof AuthModel>

export type AuthSnapshot = AuthSnapshotType

export const createAppDefaultModel = () => types.optional(AuthModel, {})
