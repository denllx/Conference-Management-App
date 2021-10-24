<template>
  <div class="q-pa-md" style="max-width:100%">
    <q-list>
      <q-item clickable v-ripple @click="showBottomSheet()">
        <q-item-section class="caption">
          <q-label class="text-grey-9"
            ><q-icon name="mdi-file-image" size="20px" class="icon"></q-icon
            ><span class="caption-text">头像</span></q-label
          ></q-item-section
        >
        <q-item-section avatar>
          <q-avatar>
            <!-- <img :src="userData.avatar" /> -->
            <q-img :src="userData.avatar"></q-img>
          </q-avatar>
        </q-item-section>
        <q-item-section side class="q-mt-sm right-arrow">
          <q-icon name="mdi-chevron-right" style="color:#d7dade"></q-icon>
        </q-item-section>
      </q-item>
      <q-file
        color="teal"
        flat
        v-model="file"
        bordered
        style="display:none"
        ref="uploader"
        @input="added"
      />
      <q-item clickable v-ripple @click="$router.push('/me/nickname')">
        <q-item-section class="caption">
          <q-label class="text-grey-9">
            <q-icon name="mdi-card-account-details" size="20px"></q-icon>
            <span class="caption-text">姓名</span></q-label
          ></q-item-section
        >
        <q-item-section class="detail">
          {{ userData.nickname }}
        </q-item-section>
        <q-item-section side class="q-mt-sm right-arrow">
          <q-icon name="mdi-chevron-right" style="color:#d7dade"></q-icon>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="$router.push('/me/password')">
        <q-item-section class="caption">
          <q-label class="text-grey-9">
            <q-icon name="mdi-lock-question" size="20px"></q-icon>
            <span class="caption-text">密码</span></q-label
          ></q-item-section
        >
        <q-item-section class="detail">******</q-item-section>

        <q-item-section side class="q-mt-sm right-arrow">
          <q-icon name="mdi-chevron-right" style="color:#d7dade"></q-icon>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="$router.push('/me/signature')">
        <q-item-section class="caption">
          <q-label class="text-grey-9">
            <q-icon name="mdi-draw" size="20px"></q-icon>
            <span class="caption-text">签名</span></q-label
          ></q-item-section
        >
        <q-item-section class="detail">
          {{ userData.signature }}
        </q-item-section>

        <q-item-section side class="q-mt-sm right-arrow">
          <q-icon name="mdi-chevron-right" style="color:#d7dade"></q-icon>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn class="button-bottom" color="red" label="退出登录" @click="logout" />
  </div>
</template>

<style scoped>
.right-arrow {
  margin: 0px;
  padding: 5px;
}

.caption {
  font-size: 1.2em;
}

.detail {
  font-size: 1.1em;
  text-align: right;
}

.caption-text {
  position: fixed;
  left: 60px;
}
</style>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Me",
  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  methods: {
    async logout() {
      const res = await this.$store.dispatch("user/logout");
      if (res.data.code == "200") {
        this.$router.replace("/");
      }
    },
    showBottomSheet() {
      this.$q
        .bottomSheet({
          grid: false,
          actions: [
            {
              label: "从本地上传",
              icon: "photo_album",
              id: "album"
            },
            {
              label: "通过url上传",
              icon: "link",
              id: "url"
            }
          ]
        })
        .onOk(action => {
          console.log("action", action.id);
          if (action.id == "url") {
            this.$router.push("/me/avatar/url");
          } else {
            let uploader = this.$refs.uploader;
            console.log("uploader=", uploader);
            uploader.pickFiles();
          }
        })
        .onCancel(action => {
          console.log("cancel");
        });
    },
    async added(file) {
      //TODO: upload file
      console.log("file=", file);
      const toBase64 = file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          console.log("file=", file);
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      const datauri = await toBase64(file);
      console.log("datauri=", datauri);
      let newUserData = Object.assign({}, this.userData, {
        avatar: datauri
      });
      await this.$store.dispatch("user/updateUserData", newUserData);
    }
  }
};
</script>
