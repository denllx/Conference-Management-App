<template>
  <q-item
    clickable
    tag="a"
    :to="link"
    @click="$emit('clicked')"
    active-class="text-blue-7 bg-blue-1"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        {{ title }}
        <span
          v-if="title === '我的消息'"
          class="dot"
          style="margin-left:10px;"
          >{{ totalUnread }}</span
        >
      </q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Essential Links",
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ""
    },

    link: {
      type: String,
      default: "#"
    },

    icon: {
      type: String,
      default: ""
    }
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
  }
};
</script>
