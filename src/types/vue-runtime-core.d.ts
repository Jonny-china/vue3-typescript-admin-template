import { InstallOptions } from 'element-plus/lib/utils/config'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $ELEMENT: InstallOptions
  }
}
