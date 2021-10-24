<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-btn
          flat
          dense
          round
          icon="mdi-chevron-left"
          @click="$router.go(-1)"
        />

        <q-toolbar-title style="text-align: center" v-on:dblclick.native="scrollToTop()">
          {{ title }}
        </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          导航栏
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";

export default {
  name: "MainLayout",

  components: {
    EssentialLink
  },

  props: {
    title: {
      type: String,
      default: "会议列表",
      required: true
    }
  },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: "会议管理",
          icon: "house",
          link: "/management"
        },
        {
          title: "个人中心",
          icon: "person",
          link: "/adminme"
        }
      ]
    };
  }
};
</script>
