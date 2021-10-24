<template>
  <div class="q-pa-md" style="max-width:100%">
    <div style="text-align:center;margin-top:30px;font-size:20px">
      密码
    </div>
    <form-bar
      title="旧密码"
      :content="oldPassword"
      @input="val => (oldPassword = val)"
    ></form-bar>
    <form-bar
      title="新密码"
      :content="newPassword1"
      @input="val => (newPassword1 = val)"
    ></form-bar>
    <form-bar
      title="确认新密码"
      :content="newPassword2"
      @input="val => (newPassword2 = val)"
    ></form-bar>
    <q-btn class="button-bottom" color="primary" label="完成" @click="change" />
    <popup-window
      :value="inconsistent"
      @input="val => (inconsistent = val)"
      title="修改失败"
      content="新旧密码不一致!"
      @ok="val => $router.replace('/me/password')"
    >
    </popup-window>
    <popup-window
      :value="success"
      @input="val => (success = val)"
      title="修改成功"
      content="你已经成功修改密码!"
      @ok="val => $router.replace('/me')"
    ></popup-window>
    <popup-window
      :value="fail"
      @input="val => (fail = val)"
      title="修改失败"
      content="旧密码不正确!"
      @ok="val => $router.replace('/me')"
    ></popup-window>
    <popup-window
      :value="empty"
      @input="val => (empty = val)"
      title="修改失败"
      content="密码不能为空!"
      @ok="val => $router.replace('/me/password')"
    ></popup-window>
  </div>
</template>

<script>
import FormBar from "components/FormBar";
import PopupWindow from "components/PopupWindow";

import { mapState, mapMutations } from "vuex";
export default {
  components: {
    FormBar,
    PopupWindow
  },
  data() {
    return {
      oldPassword: "",
      newPassword1: "",
      newPassword2: "",
      inconsistent: false,
      success: false,
      fail: false,
      empty: false
    };
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  methods: {
    async change() {
      console.log("oldpassword=", this.oldPassword);
      console.log("newpassword=", this.newPassword1, this.newPassword2);
      if (this.newPassword1 !== this.newPassword2) {
        console.log("change inconsistent");
        this.inconsistent = true;
      } else if (
        !this.newPassword1 ||
        this.newPassword1.length == 0 ||
        !this.oldPassword ||
        this.oldPassword.length == 0
      ) {
        this.empty = true;
      } else {
        const result = await this.$store.dispatch("user/updatePassword", {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword1
        });
        if (result == 0) {
          this.success = true;
        } else {
          this.fail = true;
        }
      }
    }
  }
};
</script>
