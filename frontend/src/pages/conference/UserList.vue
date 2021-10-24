<template>
  <q-page class="q-py-xs" v-if="users">
    <div class="q-pa-md text-grey-8 text-h6" v-show="users.length === 0">
      暂无参会人员
    </div>
    <q-list v-for="user in users" :key="user.username">
      <q-item
        clickable
        @click="
          $router.push({
            path: '/user',
            query: {
              username: user.username,
            }
          })
        "
      >
        <q-item-section avatar>
          <q-avatar>
            <q-img :src="user.avatar"></q-img>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size:1.2em">
            {{
            user.username
            }}
          </q-item-label>
          <q-item-label caption lines="2">
            {{ user.nickname }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced />
    </q-list>
  </q-page>
</template>

<script>
export default {
  name: "UserList",
  data () {
    return {
      loaded: false,
      users: null
    };
  },
  async mounted() {
    const usernames = JSON.parse(this.$route.query.usernames)
    console.log("User list:", usernames);
    const users = [];
    for (const username of usernames) {
      const user = await this.$store.dispatch("user/getUser", username);
      users.push(user);
    }
    this.users = users;
  }
};
</script>
