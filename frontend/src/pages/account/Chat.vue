<template>
  <div class="scroll q-pa-md row justify-center">
    <div style="width:100%">
      <q-chat-message
        label-sanitize
        text-sanitize
        v-for="msg in msgs"
        :key="msg.timestamp"
        :avatar="isMe(msg) ? $store.state.user.userData.avatar : friend.avatar"
        :text="[msg.content]"
        :stamp="getTime(msg.timestamp)"
        :sent="isMe(msg) ? true : false"
      />
      <div id="space" style="margin-bottom:80px" />
      <q-input
        filled
        v-model="newmsg"
        type="text"
        style="position:fixed;bottom:10px;width:90%"
        label="说点儿什么吧..."
        @focus="focus"
        @blur="blur"
      >
        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="send" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import getTime from "src/utils/time.js";
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      friend: JSON.parse(this.$route.query.friend),
      newmsg: ""
    };
  },
  computed: {
    ...mapState({
      allmsgs: state => state.user.messages,
      userData: state => state.user.userData
    }),
    msgs() {
      console.log("msgs:");
      console.log(JSON.parse(this.$route.query.friend).username);
      let msgs = this.allmsgs.filter(
        item =>
          item.friend.username == JSON.parse(this.$route.query.friend).username
      );
      return msgs.length > 0 ? msgs[0].messages : [];
    }
  },
  watch: {
    async allmsgs(newValue, oldValue) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        console.log("change messages");
        // reset unread
        await this.resetUnread();
        // scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);
      }
    }
  },
  methods: {
    async resetUnread() {
      const res = await axios.patch(
        `http://39.107.235.247:3000/users/${this.userData.username}/chats`,
        {
          username: this.friend.username
        }
      );
      console.log("clear unread, ret = ", res.data);
    },
    isMe(msg) {
      // console.log("newmsg=", msg);
      return msg.user === this.$store.state.user.userData.username;
    },
    getTime,
    focus(evt) {
      console.log(document.body.scrollHeight);
      let el = document.getElementById("space");
      el.style.marginBottom = "350px";
      console.log("height=", document.body.scrollHeight);
      window.scrollTo(0, document.body.scrollHeight + 200);
    },
    blur(evt) {
      let el = document.getElementById("space");
      el.style.marginBottom = "80px";
    },
    async send() {
      console.log("send", this.newmsg);
      const result = await this.$store.dispatch("user/sendMessage", {
        friend: this.friend,
        content: this.newmsg,
        timestamp: new Date().getTime()
      });
      this.newmsg = "";
      if (result == 0) {
        console.log("sent successfully");
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        console.log("sending failed");
      }
    }
  },
  mounted: async function() {
    // change unreadcnt to 0
    await this.resetUnread();
    window.scrollTo(0, document.body.scrollHeight);
  }
};
</script>
