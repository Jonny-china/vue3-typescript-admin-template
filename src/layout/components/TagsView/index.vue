<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane
      ref="scrollPaneRef"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tagRef"
        :key="tag.path"
        v-popover:popoverRef
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag)"
      >
        {{ $t('route.' + tag.meta?.title) }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <el-popover
      ref="popoverRef"
      v-model:visible="visible"
      trigger="manual"
      popper-class="tags-view-popover"
      :show-arrow="false"
    >
      <ul class="contextmenu" @click="visible = false">
        <li @click="refreshSelectedTag(selectedTag)">刷新</li>
        <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
          关闭
        </li>
        <li @click="closeOthersTags">关闭其他</li>
        <li @click="closeAllTags(selectedTag)">关闭所有</li>
      </ul>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, nextTick } from 'vue'
import path from 'path'
import {
  RouteRecordRaw,
  RouterLinkProps,
  useRoute,
  useRouter
} from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'
import { TagsViewModule, ITagView } from '@/store/modules/tags-view'
import ScrollPane from './ScrollPane.vue'

const TagsView = defineComponent({
  name: 'TagsView',
  components: { ScrollPane },
  setup() {
    const $route = useRoute()
    const $router = useRouter()

    const visible = ref(false)
    const selectedTag = ref<ITagView>({})
    const tagRef = ref<RouterLinkProps | null>(null)
    const scrollPaneRef = ref<typeof ScrollPane | null>(null)
    const affixTags = ref<ITagView[]>([])

    const visitedViews = computed(() => TagsViewModule.visitedViews)

    const routes = computed(() => PermissionModule.routes)

    watch(
      () => $route.path,
      () => {
        addTags()
        moveToCurrentTag()
      }
    )

    watch(visible, value => {
      if (value) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })

    onMounted(() => {
      initTags()
      addTags()
    })

    function isActive(route: ITagView) {
      return route.path === $route.path
    }

    function isAffix(tag: ITagView) {
      return tag?.meta && tag.meta.affix
    }

    function filterAffixTags(routes: RouteRecordRaw[], basePath = '/') {
      let tags: ITagView[] = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const childTags = filterAffixTags(route.children ?? [], route.path)
          if (childTags.length >= 1) {
            tags = [...tags, ...childTags]
          }
        }
      })
      return tags
    }

    function initTags() {
      affixTags.value = filterAffixTags(routes.value)
      for (const tag of affixTags.value) {
        // Must have tag name
        if (tag.name) {
          TagsViewModule.addVisitedView(tag)
        }
      }
    }

    function addTags() {
      const { name } = $route
      if (name) {
        TagsViewModule.addView($route)
      }
      return false
    }

    function moveToCurrentTag() {
      if (!tagRef.value) return
      nextTick().then(() => {
        const tag = tagRef.value
        if ((tag?.to as ITagView).path === $route.path) {
          scrollPaneRef.value?.moveToTarget?.(tag as any)
          // When query is different then update
          if ((tag!.to as ITagView).fullPath !== $route.fullPath) {
            TagsViewModule.updateVisitedView($route)
          }
        }
      })
    }

    function refreshSelectedTag(view: ITagView) {
      TagsViewModule.delCachedView(view)
      // setTimeout(() => {
      const { fullPath } = view
      nextTick(() => {
        $router
          .replace({
            path: '/redirect' + fullPath
          })
          .catch(err => {
            console.warn(err)
          })
      })
      // }, 3000)
    }

    function closeSelectedTag(view: ITagView) {
      TagsViewModule.delView(view)
      if (isActive(view)) {
        toLastView(TagsViewModule.visitedViews, view)
      }
    }

    function closeOthersTags() {
      if (
        selectedTag.value.fullPath !== $route.path &&
        selectedTag.value.fullPath !== undefined
      ) {
        $router.push(selectedTag.value.fullPath).catch(err => {
          console.warn(err)
        })
      }
      TagsViewModule.delOthersViews(selectedTag.value)
      moveToCurrentTag()
    }

    function closeAllTags(view: ITagView) {
      TagsViewModule.delAllViews()
      if (affixTags.value.some(tag => tag.path === $route.path)) {
        return
      }
      toLastView(TagsViewModule.visitedViews, view)
    }

    function toLastView(visitedViews: ITagView[], view: ITagView) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView !== undefined && latestView.fullPath !== undefined) {
        $router.push(latestView.fullPath).catch(err => {
          console.warn(err)
        })
      } else {
        // Default redirect to the home page if there is no tags-view, adjust it if you want
        if (view.name === 'Dashboard') {
          // to reload home page
          $router.replace({ path: '/redirect' + view.fullPath }).catch(err => {
            console.warn(err)
          })
        } else {
          $router.push('/').catch(err => {
            console.warn(err)
          })
        }
      }
    }
    function openMenu(tag: ITagView) {
      visible.value = true
      selectedTag.value = tag
    }

    function closeMenu() {
      visible.value = false
    }

    function handleScroll() {
      closeMenu()
    }
    return {
      tagRef,
      visible,
      selectedTag,
      visitedViews,
      isActive,
      isAffix,
      handleScroll,
      openMenu,
      closeAllTags,
      closeOthersTags,
      refreshSelectedTag,
      closeSelectedTag
    }
  }
})

export default TagsView
</script>

<style lang="scss">
// Reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}

.tags-view-popover {
  padding: 0 !important;
  border: 0 !important;
  width: auto !important;
  min-width: auto !important;
}
</style>
<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
}

.contextmenu {
  margin: 0;
  background: #fff;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}
</style>
