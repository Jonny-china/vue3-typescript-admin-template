import { AppModule, DeviceType } from '@/store/modules/app'
import { onBeforeMount, onBeforeUnmount, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const WIDTH = 992 // refer to Bootstrap's responsive design

export default function useResize() {
  const $route = useRoute()

  const device = computed(() => AppModule.device)
  const sidebar = computed(() => AppModule.sidebar)

  watch(
    () => $route.fullPath,
    () => {
      if (device.value === DeviceType.MOBILE && sidebar.value.opened) {
        AppModule.CloseSideBar(false)
      }
    }
  )

  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })

  onMounted(() => {
    if (isMobile()) {
      AppModule.ToggleDevice(DeviceType.MOBILE)
      AppModule.CloseSideBar(true)
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })

  function isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  function resizeHandler() {
    const mobile = isMobile()
    if (!document.hidden) {
      AppModule.ToggleDevice(mobile ? DeviceType.MOBILE : DeviceType.DESKTOP)

      if (mobile) {
        AppModule.CloseSideBar(true)
      }
    }
  }
}
