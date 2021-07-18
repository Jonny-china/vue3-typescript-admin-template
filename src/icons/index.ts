import SvgIcon from '@/components/SvgIcon/index.vue' // svg component

const modules = import.meta.glob('./svg/*.svg')
for (const path in modules) {
  modules[path]()
}

export default SvgIcon
