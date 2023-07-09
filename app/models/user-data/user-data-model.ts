import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { db } from "../../utils/store/store";
import * as store from "../../utils/store/store"

export const UserDataModel = types
	.model("UserModel")
	.props({
		userData: types.optional(types.model({
			id: types.optional(types.union(types.number, types.undefined), undefined),
			username: types.optional(types.union(types.string, types.null), ""),
			email: types.optional(types.union(types.string, types.null), ""),
			phonenumber: types.optional(types.union(types.string, types.null), ""),
			position: types.optional(types.union(types.string, types.null), ""),
			skype: types.optional(types.union(types.string, types.null), ""),
			password: types.optional(types.maybeNull(types.number), null),
			code: types.optional(types.maybeNull(types.number), null),
		}), {})
	})
	.views(() => ({}))
	.actions((self) => ({
		toggleUser(params) {
			self.userData = params
		},
	}))
	.actions((self) => ({
		async getUser(params) {
			const { email, password, username, phonenumber = "", position = "", skype = "" } = params

			await store.save("USER_EMAIL", email)

			try {
				db.transaction((tx) => {
					tx.executeSql("INSERT INTO user (email, password, username, phonenumber, position, skype) values (?,?,?,?,?,?)",
						[email, password, username, phonenumber, position, skype],

						(txObj, error) => console.log(error)
					);
				});
			} catch (e) {
				console.log("e", e)
			}
		}
	}))
	.actions((self) => ({
		async createUserTable() {
			await db.transaction(tx => {
				tx.executeSql(
					"CREATE TABLE IF NOT EXISTS "
					+ "user "
					+ "(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT, code INT, phonenumber TEXT, position TEXT, skype TEXT)"
				)
			})
		},
		async getUserData() {
			const userEmail = await store.load("USER_EMAIL")

			await db.transaction(async (tx) => {
				try {
					await tx.executeSql("SELECT * FROM user ", [],
						(txObj, resultSet) => {
							const currentUser = resultSet.rows._array.find((item) => item.email === userEmail)
							self.toggleUser(currentUser)
						},
						(txObj, error) => console.log(error)
					);
				} catch (e) {
					console.log("e", e)
				}
			});
		},
	}))


type UserDataType = Instance<typeof UserDataModel>

export type App = UserDataType

type UserDataSnapshotType = SnapshotOut<typeof UserDataModel>

export type UserDataSnapshot = UserDataSnapshotType

export const createAppDefaultModel = () => types.optional(UserDataModel, {})
