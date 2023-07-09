import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { db } from "../utils/store/store";
import { flow } from "mobx";
import { UserModel } from "./user/user-model";

export const AuthModel = types
	.model("App")
	.props({
		users: types.optional(types.array(UserModel), [])
	})
	.views(() => ({}))
	.actions((self) => ({
		updateUsers(data) {
			self.users = data
		}
	}))
	.actions((self) => ({
		getUseData() {
			db.transaction(tx => {
				tx.executeSql("SELECT email, password, username, confirm FROM users", [],
					(txObj, resultSet) => {
						self.updateUsers(resultSet.rows._array)
					},
					(txObj, error) => console.log(error)
				);
			});

		},
		async createTable() {
			await db.transaction(tx => {
				tx.executeSql(
					"CREATE TABLE IF NOT EXISTS "
					+ "users "
					+ "(ID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT, confirm TEXT);"
				)
			})
		},
		signUp: flow(function* (params = {}) {
			const { email, password, username, confirm } = params
			try {
				 db.transaction((tx) => {
					tx.executeSql("INSERT INTO users (email, password, username, confirm) values (?,?,?,?)", [email, password, username, confirm],
						(txObj, error) => console.log(error)
					);
				});
			} catch (e) {
					console.log(e)
			}
		})
	}))
	.actions((self) => ({
		logIn(params) {
			const { email, password } = params
			const result = self.users.find((item) => item.email === email && item.password === password)
			console.log("result", result)
		}
	}))

type AuthType = Instance<typeof AuthModel>

export type App = AuthType

type AuthSnapshotType = SnapshotOut<typeof AuthModel>

export type AuthSnapshot = AuthSnapshotType

export const createAppDefaultModel = () => types.optional(AuthModel, {})
