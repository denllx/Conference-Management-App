<template>
  <div class="q-pa-md" style="max-width:100%">
    <div style="text-align:center;margin-top:30px;font-size:20px">用户名</div>
    <q-input
      counter
      maxlength="25"
      outlined
      v-model="username"
      type="text"
      :placeholder="username"
      style="width:70%;margin:auto;margin-top:30px"
    />
    <div style="text-align:center;margin-top:30px;font-size:15px;color:grey;">
      不能超过25个字哦~
    </div>
    <q-btn class="button-bottom" color="primary" label="完成" @click="change" />
    <popup-window
      :value="empty"
      @input="val => (empty = val)"
      title="修改失败"
      content="用户名不能为空!"
      @ok="val => $router.replace('/me/username')"
    ></popup-window>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import PopupWindow from "components/PopupWindow";

export default {
  components: {
    PopupWindow
  },
  data() {
    return {
      empty: false,
      username: ""
    };
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  methods: {
    async change() {
      let newUserData = Object.assign({}, this.userData, {
        username: this.username
      });
      console.log("username=", this.username);
      if (!this.username || this.username.length == 0) {
        this.empty = true;
      } else {
        console.log("newuserdata=", newUserData);
        const result = await this.$store.dispatch(
          "user/updateUserData",
          newUserData
        );
        if (result == 1) {
          //TODO: alert
        } else if (result == 0) {
          //TODO: alert
        }
        this.$router.replace("/me");
      }
    }
  }
};
</script>
