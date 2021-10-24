<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-y-md column"  style="max-width: 100%" >
      <q-btn  color="primary" @click="newConference" label="新的会议" />
      
    <div v-if="loading" style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
      <q-circular-progress
        size="36px"
        :indeterminate="true"
        color="primary"
      />
    </div>
    <q-list style="margin-bottom: 20%" v-show="finished">
      <div
        v-for="conference in displayedConferences"
        :key="conference._id"
        @click="modifyConference(conference._id)"
      >
        <q-item clickable v-ripple class="q-py-md">
          <q-item-section>
            <q-item-label class="text-h6">
              {{ conference.title }}
              <q-chip dark class="q-mb-sm" color="primary" size="sm">{{ conference.organizer }}</q-chip>
            </q-item-label>
            <q-item-label class="text-grey-7">
              {{ conference.location }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="mdi-chevron-right" />
          </q-item-section>
        </q-item>
        <q-separator />
      </div>
    </q-list>

    </div>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
export default {

  name: "Management",
  data() {
    return {
      finished: false,
      loading: false
    }},

     computed: {
    ...mapState({
      conferences: state => state.management.conferences,
      userData: state => state.user.userData
    }),
    displayedConferences() {
      return this.conferences;
    }
  },

    async created() {
    // load all conferences
    this.loading = true;
    await this.$store.dispatch("management/getConferences", this.userData.username);
    console.log("get conferences successfully!");
    this.finished = true;
    console.log("conferences=", this.conferences);
    this.loading = false;
  },

      async mounted() {
    // load all conferences
    this.loading = true;
    await this.$store.dispatch("management/getConferences", this.userData.username);
    console.log("get conferences successfully!");
    this.finished = true;
    console.log("conferences=", this.conferences);
    this.loading = false;
  },

  methods: {
    newConference()
    {
      this.$router.push("/newconference");
    },

    modifyConference(id) {
      this.$router.push({
        path: '/modifyconference',
        query: { id }
      })
    }

  }
};
</script>
