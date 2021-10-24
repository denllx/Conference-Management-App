<template>
  <q-page class="q-pa-md">
    <div v-if="!session" style="text-align: center; margin-top: 30px">
      <q-circular-progress
        size="36px"
        :indeterminate="true"
        color="primary"
      />
    </div>

    <template v-if="session">
      <div class="text-h5" style="margin-left: 2px">
        {{ session.theme }}
      </div>
      <table style="width: 100%">
        <tr>
          <td class="caption">
          <q-icon class="q-mb-xs" name="mdi-clock-outline" size="20px" />
            时间
            </td>
          <td class="content">
            开始：
            {{ parseDate(session.date.start) }}<br />
            结束：
            {{ parseDate(session.date.end) }}
          </td>
        </tr>
        <tr>
          <td class="caption">
          <q-icon class="q-mb-xs" name="mdi-account" size="20px" />
            主持人</td>
          <td class="content">
            {{ session.host }}
          </td>
        </tr>
        <tr>
          <td class="caption">
            <q-icon class="q-mb-xs" name="mdi-map-marker" size="20px" />
            地点</td>
          <td class="content">{{ session.location }}</td>
        </tr>
      </table>

      <div class="text-h6 q-mt-md">
        <q-icon class="q-mb-xs" name="mdi-text-box-multiple" size="20px" />
        Papers
      </div>
      <Papers :id="$route.params.id" />
    </template>
  </q-page>
</template>

<style scoped>
.caption {
  width: 25%;
}
.content {
  color: rgba(0, 0, 0, 0.7);
}
td {
  vertical-align: top;
}
table {
  border-spacing: 0 6px;
}
</style>

<script>
import axios from 'axios';
import { mapState } from "vuex";
import Papers from 'components/Papers.vue';
import moment from 'moment';

export default {
  name: "Session",
  components: {
    Papers
  },
  data() {
    return {
      session: null
    };
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  async mounted() {
    // load conference
    this.session = await this.$store.dispatch("conference/getSession", this.$route.params.id);
    console.log("Session:", this.session);
  },
  methods: {
    parseDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm');
    }
  }
};
</script>
