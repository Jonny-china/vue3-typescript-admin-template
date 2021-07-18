<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="
            item.redirect === 'noRedirect' || index === levelList.length - 1
          "
          class="no-redirect"
          >{{ $t('route.' + item.meta.title) }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{
          $t('route.' + item.meta.title)
        }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import * as pathToRegexp from 'path-to-regexp'
import { defineComponent, onMounted, ref, watch } from 'vue'
import {
  RouteLocationMatched,
  RouteLocationRaw,
  useRoute,
  useRouter
} from 'vue-router'

const Breadcrumb = defineComponent({
  setup() {
    const levelList = ref<RouteLocationMatched[]>([])

    const $route = useRoute()
    const $router = useRouter()

    watch(
      () => $route,
      () => {
        if ($route.path.startsWith('/redirect/')) {
          return
        }
        getBreadcrumb()
      },
      { deep: true }
    )

    function getBreadcrumb() {
      // only show routes with meta.title
      let matched = $route.matched.filter(item => item.meta && item.meta.title)

      const first = matched[0]

      if (!isDashboard(first)) {
        matched = [
          {
            path: '/dashboard',
            meta: { title: 'dashboard' }
          } as any
        ].concat(matched)
      }

      levelList.value = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    }
    onMounted(() => {
      getBreadcrumb()
    })

    function isDashboard(route: RouteLocationMatched) {
      const name = (route?.name as string) ?? ''
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    }

    function pathCompile(path: string) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = $route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    }

    function handleLink(item: RouteLocationMatched) {
      const { redirect, path } = item
      if (redirect) {
        $router.push(redirect as RouteLocationRaw)
        return
      }
      $router.push(pathCompile(path))
    }

    return {
      handleLink,
      levelList
    }
  }
})
export default Breadcrumb
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
