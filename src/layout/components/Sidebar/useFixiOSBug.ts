import { AppModule, DeviceType } from '@/store/modules/app'
import { onMounted, ref } from 'vue'

export default function useFixOSBug() {
  const subMenuRef = ref()

  onMounted(() => {
    fixBugIniOS()
  })

  function fixBugIniOS() {
    const $subMenu = subMenuRef.value
    if ($subMenu) {
      const handleMouseleave = $subMenu.handleMouseleave
      $subMenu.handleMouseleave = (e: unknown) => {
        if (AppModule.device === DeviceType.MOBILE) {
          return
        }
        handleMouseleave(e)
      }
    }
  }

  return { subMenuRef }
}
