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
        >
          <q-badge v-show="totalUnread > 0" color="red" floating>
            {{ totalUnread }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8"> 导航栏</q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          @clicked="leftDrawerOpen = false"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container v-scroll="scrollHandler">
      <router-view />

      <q-page-sticky :offset="[18, 18]">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          >
            <q-btn v-show="showFab" fab color="primary" icon="mdi-chevron-up" @click="scrollToTop" />
        </transition>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
import EssentialLink from "components/EssentialLink";
import { mapActions } from "vuex";
import { scroll } from 'quasar';
const { getScrollPosition, setScrollPosition } = scroll;


export default {
  name: "MainLayout",

  components: {
    EssentialLink
  },

  props: {
    title: {
      type: String,
      default: "",
      required: true
    }
  },
  data() {
    return {
      showFab: false,
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: "会议列表",
          icon: "house",
          link: "/list"
        },
        {
          title: "我的消息",
          icon: "chat",
          link: "/mymessages"
        },
        {
          title: "我的收藏",
          icon: "favorite",
          link: "/mypapers"
        },
        {
          title: "个人中心",
          icon: "person",
          link: "/me"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      msgs: state => state.user.messages
    }),
    totalUnread() {
      // console.log("msgs=", this.msgs);
      return this.msgs
        .map(item => item.unread)
        .reduce((total, elem) => total + elem, 0);
    }
    /*
    pathActive() {
      console.log(this.$route.matched, this.link)
      return this.$route.matched.findIndex(e => this.link === e.path) !== -1;
    }
    */
  },
  methods: {
    ...mapActions("user", ["getMessages"]),

    scrollToTop() {
      setScrollPosition(window, 0, 300);
    },

    scrollHandler(position) {
      this.showFab = position > 0
    }
  },
  async mounted() {
    await this.getMessages();
    setInterval(this.getMessages, 1000); // check for new message every 1s
    setInterval(() => {
      this.$store.commit("conference/clearCache");
    }, 60 * 1000); // check for new message every 1min
  }
};
</script>
