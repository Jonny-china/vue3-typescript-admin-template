import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import store from '@/store'
import elementVariables from '@/styles/element-variables'
import defaultSettings from '@/settings'

export interface StoreSettingsState {
  theme: string
  fixedHeader: boolean
  showSettings: boolean
  showTagsView: boolean
  showSidebarLogo: boolean
  sidebarTextTheme: boolean
}

@Module({ dynamic: true, store, name: 'settings', namespaced: true })
class Settings
  extends VuexModule<StoreSettingsState>
  implements StoreSettingsState
{
  public theme = elementVariables.theme
  public fixedHeader = defaultSettings.fixedHeader
  public showSettings = defaultSettings.showSettings
  public showTagsView = defaultSettings.showTagsView
  public showSidebarLogo = defaultSettings.showSidebarLogo
  public sidebarTextTheme = defaultSettings.sidebarTextTheme

  @Mutation
  private CHANGE_SETTING(this: any, payload: { key: string; value: any }) {
    const { key, value } = payload
    if (Reflect.has(this, key)) {
      this[key] = value
    }
  }

  @Action
  public ChangeSetting(payload: { key: string; value: any }) {
    this.CHANGE_SETTING(payload)
  }
}

export const SettingsModule = getModule<any>(Settings) as Settings
