<template>
  <div class="q-pa-md" style="max-width:100%">
    <div style="text-align:center;margin-top:30px;font-size:20px">签名</div>
    <q-input
      counter
      maxlength="50"
      outlined
      v-model="signature"
      type="textarea"
      :placeholder="signature"
      style="width:70%;margin:auto;margin-top:30px"
    />
    <div style="text-align:center;margin-top:30px;font-size:15px;color:grey;">
      不能超过50个字哦~
    </div>
    <q-btn class="button-bottom" color="primary" label="完成" @click="change" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      signature: ""
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
        signature: this.signature
      });
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
