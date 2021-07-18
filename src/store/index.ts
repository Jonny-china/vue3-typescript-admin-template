import { createStore } from 'vuex'
import { StoreAppState } from './modules/app'
import { StoreUserState } from './modules/user'
import { StoreTagsViewState } from './modules/tags-view'
import { StoreErrorLogState } from './modules/error-log'
import { StorePermissionState } from './modules/permission'
import { StoreSettingsState } from './modules/settings'

export interface StoreRootState {
  app: StoreAppState
  user: StoreUserState
  tagsView: StoreTagsViewState
  errorLog: StoreErrorLogState
  permission: StorePermissionState
  settings: StoreSettingsState
}

const store = createStore<StoreRootState>({})

// Declare empty store first, dynamically register all modules later.
export default store
