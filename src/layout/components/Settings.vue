<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">Page style setting</h3>

      <div class="drawer-item">
        <span>Theme Color</span>
        <theme-picker
          style="float: right; height: 26px; margin: -3px 8px 0 0"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>Open Tags-View</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Fixed Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Sidebar Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ThemePicker from '@/components/ThemePicker/index.vue'
import { computed } from 'vue'
import { SettingsModule } from '@/store/modules/settings'

export default {
  components: { ThemePicker },
  setup() {
    const fixedHeader = computed({
      get() {
        return SettingsModule.fixedHeader
      },
      set(val: boolean) {
        SettingsModule.ChangeSetting({ key: 'fixedHeader', value: val })
      }
    })

    const tagsView = computed({
      get() {
        return SettingsModule.showTagsView
      },
      set(val: boolean) {
        SettingsModule.ChangeSetting({ key: 'showTagsView', value: val })
      }
    })

    const sidebarLogo = computed({
      get() {
        return SettingsModule.showSidebarLogo
      },
      set(val: boolean) {
        SettingsModule.ChangeSetting({ key: 'showSidebarLogo', value: val })
      }
    })

    function themeChange(val: string) {
      SettingsModule.ChangeSetting({ key: 'theme', value: val })
    }

    return {
      fixedHeader,
      tagsView,
      sidebarLogo,
      themeChange
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
