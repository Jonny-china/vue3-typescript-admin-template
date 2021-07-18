<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="[
      isCollapse ? 'simple-mode' : 'full-mode',
      { 'first-level': isFirstLevel }
    ]"
  >
    <template
      v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children"
    >
      <SidebarItemLink
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': isFirstLevel }"
        >
          <Item
            v-if="theOnlyOneChild.meta.icon"
            :icon="theOnlyOneChild.meta.icon"
          />
          <template v-if="theOnlyOneChild.meta.title" #title>
            <span>{{ $t('route.' + theOnlyOneChild.meta.title) }}</span>
          </template>
        </el-menu-item>
      </SidebarItemLink>
    </template>
    <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <Item v-if="item.meta && item.meta.icon" :icon="item.meta.icon" />
        <span v-if="item.meta && item.meta.title">{{
          $t('route.' + item.meta.title)
        }}</span>
      </template>
      <template v-if="item.children">
        <SidebarItem
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item.vue'
import SidebarItemLink from './SidebarItemLink.vue'
import useFixiOSBug from './useFixiOSBug'
import { computed, defineComponent, PropType } from 'vue'
import { RouteRecordNormalized } from 'vue-router'

const SidebarItem = defineComponent({
  name: 'SidebarItem',
  components: { Item, SidebarItemLink },
  props: {
    // route object
    item: {
      type: Object as PropType<RouteRecordNormalized>,
      required: true
    },
    isFirstLevel: {
      type: Boolean,
      default: true
    },
    basePath: {
      type: String,
      default: ''
    },
    isCollapse: Boolean
  },
  setup(props) {
    const { subMenuRef } = useFixiOSBug()

    const alwaysShowRootMenu = computed(() => {
      if (props.item.meta && props.item.meta.alwaysShow) {
        return true
      }
      return false
    })

    const showingChildNumber = computed(() => {
      if (props.item.children) {
        const showingChildren = props.item.children.filter(item => {
          if (item.meta && item.meta.hidden) {
            return false
          } else {
            return true
          }
        })
        return showingChildren.length
      }
      return 0
    })

    const theOnlyOneChild = computed(() => {
      if (showingChildNumber.value > 1) {
        return null
      }
      if (props.item.children) {
        for (const child of props.item.children) {
          if (!child.meta || !child.meta.hidden) {
            return child
          }
        }
      }
      // If there is no children, return itself with path removed,
      // because this.basePath already conatins item's path information
      return { ...props.item, path: '' }
    })

    function resolvePath(routePath: string) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }

    return {
      alwaysShowRootMenu,
      theOnlyOneChild,
      subMenuRef,
      resolvePath
    }
  }
})
export default SidebarItem
</script>
<style lang="scss">
.el-submenu.is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}

.full-mode {
  .nest-menu .el-submenu > .el-submenu__title,
  .el-submenu .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }
}

.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      & > .el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        & > span {
          visibility: hidden;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 16px;
}
</style>
