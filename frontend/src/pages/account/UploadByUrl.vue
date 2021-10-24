<template>
  <div class="q-pa-md" style="max-width:100%">
    <div
      style="text-align:center;margin-top:30px;margin-bottom:30px;font-size:20px"
    >
      图片链接
    </div>
    <div class="row">
      <q-input outlined v-model="tempurl" type="text" class="col-8" />
      <q-space />
      <q-btn
        color="primary"
        @click="refresh"
        class="col-3"
        style="font-size:15px"
        >预览
      </q-btn>
    </div>
    <q-img :src="url" style="margin-top:20px;width:100%">
      <template v-slot:loading>
        <div class="text-subtitle1 text-white">
          加载中...
        </div>
      </template>
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          图片加载失败
        </div>
      </template>
    </q-img>
    <q-btn class="button-bottom" color="primary" label="完成" @click="upload" />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      url: this.$store.state.user.userData.avatar,
      tempurl: "",
      preview: false
    };
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  methods: {
    refresh() {
      this.url = this.tempurl;
      console.log("change url:", this.url);
    },
    async upload() {
      console.log("upload");
      let newUserData = Object.assign({}, this.userData, {
        avatar: this.url
      });
      await this.$store.dispatch("user/updateUserData", newUserData);
      this.$router.replace("/me");
    }
  }
};
</script>
