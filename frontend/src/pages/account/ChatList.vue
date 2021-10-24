<template>
  <q-page class="q-py-xs">
    <q-list v-for="chat in msgs" :key="chat._id">
      <q-item clickable @click="evt => jumpToChat(evt, chat)">
        <q-item-section avatar>
          <q-avatar size="50px">
            <q-img :src="chat.friend.avatar"></q-img>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size:1.4em;font-weight:500;">
            {{ chat.friend.username }}
            <!-- <span class="dot" style="margin-left:5px;text-align:center;">{{
              chat.unread
            }}</span> -->
          </q-item-label>
          <q-item-label caption lines="2" style="font-size:1.3em;">
            {{ chat.messages[chat.messages.length - 1].content }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>
            {{ getTime(chat.messages[chat.messages.length - 1].timestamp) }}
          </q-item-label>
          <q-item-label caption lines="2">
            <span class="dot" style="margin-left:5px;text-align:center;">{{
              chat.unread
            }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced inset="item" />
    </q-list>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import getTime from "src/utils/time.js";

export default {
  name: "MyMessages",
  data() {
    return {
      friend: null
    };
  },
  computed: {
    ...mapState({
      msgs: state => state.user.messages
    })
  },
  methods: {
    getTime,
    jumpToChat: async function(event, chat) {
      let friend = chat.friend;
      friend.nickname = (
        await this.$store.dispatch("user/getUser", friend.username)
      ).nickname;
      this.$router.push({
        path: "/chat",
        query: {
          friend: JSON.stringify(friend)
        }
      });
    }
  },
  mounted() {
    console.log("messages=", this.msgs);
  }
  // async mounted() {
  // await this.$store.dispatch("user/getMessages");
  // console.log("msgs", this.msgs);
  // }
};
</script>
