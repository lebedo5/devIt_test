import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthModel } from "../auth-store/auth-store";
import { UserDataModel } from "../user-data/user-data-model";

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  authStore: types.optional(AuthModel, {} as any),
  userDataStore: types.optional(UserDataModel, {} as any),
})

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of a RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
