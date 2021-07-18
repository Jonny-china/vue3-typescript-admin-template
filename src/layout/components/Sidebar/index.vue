<template>
  <div :class="{ 'has-logo': showLogo }">
    <SidebarLogo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="menuActiveTextColor"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import SidebarLogo from './SidebarLogo.vue'
import SidebarItem from './SidebarItem.vue'
import stylesVariables from '@/styles/_variables'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'
import { AppModule } from '@/store/modules/app'
import { SettingsModule } from '@/store/modules/settings'

const Sidebar = defineComponent({
  name: 'Sidebar',
  components: { SidebarItem, SidebarLogo },
  setup() {
    const route = useRoute()
    const activeMenu = computed(() => {
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })

    const sidebar = computed(() => AppModule.sidebar)
    const permissionRoutes = computed(() => PermissionModule.routes)
    const isCollapse = computed(() => !sidebar.value.opened)
    const showLogo = computed(() => SettingsModule.showSidebarLogo)
    const variables = computed(() => stylesVariables)
    const menuActiveTextColor = computed(() => {
      if (SettingsModule.sidebarTextTheme) {
        return SettingsModule.theme
      } else {
        return variables.value.menuActiveText
      }
    })
    return {
      menuActiveTextColor,
      permissionRoutes,
      sidebar,
      activeMenu,
      showLogo,
      variables,
      isCollapse
    }
  }
})
export default Sidebar
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

.has-logo {
  .el-scrollbar {
    height: calc(100% - 50px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
