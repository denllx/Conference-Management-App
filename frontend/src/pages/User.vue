<template>
  <q-page class="q-pa-md">
    <div v-if="user">
      <div style="display: inline-flex; width: 100%;">
        <q-avatar class="q-mr-md">
          <q-img :src="user.avatar"> </q-img>
        </q-avatar>
        <div>
          <div style="line-height: 1; font-size: 24px;">{{ user.nickname }}</div>
          <div class="text-grey-8" style="font-size: 17px">{{ user.username }}</div>
        </div>
        <q-space />
        <q-btn v-if="user.username !== $store.state.user.userData.username" color="primary" icon="mail" label="聊天" stack outline @click="gotoChat" />
      </div>

      <div style="font-size: 18px" class="text-grey-8 q-mt-sm">
        <q-icon class="q-mb-xs" name="mdi-square-edit-outline" size="20px" />
        签名
      </div>
      <q-separator class="q-my-sm" />
      <div style="font-size: 17px">{{ user.signature }}</div>

      <div style="font-size: 18px" class="text-grey-8 q-mt-md">
        <q-icon class="q-mb-xs" name="mdi-text-box-multiple" size="20px" />
        收藏论文
      </div>

      <Papers v-if="user.paperIds.length" :username="user.username" />
      <template v-else>
        <q-separator class="q-my-xs" />
        <div class="text-grey-8 q-mt-sm" style="font-size: 15px;">暂未收藏论文</div>
      </template>
    </div>
  </q-page>
</template>

<script>
import Papers from 'components/Papers.vue';

export default {
  components: {
    Papers
  },
  data() {
    return {
      user: null
    };
  },

  watch: {
    '$route'() {
      this.update();
    }
  },

  async mounted() {
    this.update();
  },

  methods: {
    async update() {
      this.user = await this.$store.dispatch("user/getUser", this.$route.query.username);
      console.log(this.user);
    },
    gotoChat() {
      console.log(this.user)
      this.$router.push({
        path: "/chat",
        query: {
          friend: JSON.stringify(this.user)
        }
      })
    }
  }
};
</script>
