import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const UserModel = types
	.model("UserModel")
	.props({
		id: types.optional(types.number, 0),
		username: types.optional(types.union(types.string, types.null), ""),
		phonenumber: types.optional(types.union(types.string, types.null), ""),
		email: types.optional(types.union(types.string, types.null), ""),
		password: types.optional(types.union(types.string, types.null), ""),
		code: types.optional(types.union(types.string, types.null), null),
		position: types.optional(types.union(types.string, types.null), ""),
		skype: types.optional(types.union(types.string, types.null), ""),
	})
	.views(() => ({}))
	.actions((self) => ({
	}))
	.actions((self) => ({
	}))

type UserType = Instance<typeof UserModel>

export type App = UserType

type UserSnapshotType = SnapshotOut<typeof UserModel>

export type UserSnapshot = UserSnapshotType

export const createAppDefaultModel = () => types.optional(UserModel, {})
