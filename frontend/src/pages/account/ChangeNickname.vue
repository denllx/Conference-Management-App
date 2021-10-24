<template>
  <div class="q-pa-md" style="max-width:100%">
    <div style="text-align:center;margin-top:30px;font-size:20px">姓名</div>
    <q-input
      counter
      maxlength="25"
      outlined
      v-model="nickname"
      type="text"
      :placeholder="nickname"
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
      content="姓名不能为空!"
      @ok="val => $router.replace('/me/username')"
    ></popup-window>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import PopupWindow from "components/PopupWindow";
export default {
  data() {
    return {
      nickname: "",
      empty: false
    };
  },
  components: {
    PopupWindow
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  methods: {
    async change() {
      let newUserData = Object.assign({}, this.userData, {
        nickname: this.nickname
      });
      if (!this.nickname || this.nickname.length == 0) {
        this.empty = true;
        return;
      }
      console.log("nickname=", this.nickname);
      console.log("userData=", newUserData);
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
};
</script>
