<template>
  <q-page>
    <div v-if="!conference" style="text-align: center; margin-top: 30px">
      <q-circular-progress size="36px" :indeterminate="true" color="primary" />
    </div>

    <template v-if="conference">
      <div class="text-h5 q-pl-md q-pt-md">
        {{ conference.title }}
        <q-chip dark class="q-mb-sm" color="primary" size="sm">{{
          conference.organizer
        }}</q-chip>
      </div>
      <div class="q-pl-md q-my-xs">
        <q-icon class="q-mb-xs" name="mdi-home" size="20px" />
        主办组织： {{ conference.organizer }}
      </div>
      <div class="q-pl-md q-my-xs">
        <q-icon class="q-mb-xs" name="mdi-text-box-check" size="20px" />
        参会状态：
        <q-chip
          dark
          class="q-mb-sm"
          :color="participated ? 'green' : 'grey'"
          size="sm"
        >
          {{ participated ? "已参加" : "未参加" }}
        </q-chip>
      </div>
      <div class="q-pl-md q-my-xs q-mb-lg">
        <q-icon class="q-mb-xs" name="mdi-account-multiple" size="20px" />
        参会人员：
        <span style="vertical-align: middle">
          <span>{{ conference.users.length }} 人</span>
          <q-btn
            @click="gotoUserList"
            color="primary"
            class="q-ml-md q-px-sm"
            label="查看"
            size="sm"
            dense
            padding="xs"
          />
        </span>
      </div>

      <q-timeline>
        <q-timeline-entry
          class="timeline"
          v-for="event in conference.events"
          :key="event.date"
          :subtitle="event.date"
        >
          {{ event.name }}
        </q-timeline-entry>
      </q-timeline>

      <div style="display: flex">
        <span class="q-pl-md text-h6">
          <q-icon class="q-mb-xs" name="mdi-sitemap" size="20px" />
          Program
        </span>
        <q-space />
        <q-btn
          class="q-mr-lg"
          dense
          v-show="!search"
          @click="search = true"
          flat
          label="搜索"
          icon="mdi-magnify"
        />
      </div>

      <div v-show="search" style="display: flex" class="q-mx-md q-mb-sm">
        <q-input dense v-model="searchText" label="搜索" clearable>
          <template v-slot:prepend>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
        <q-space />
        <q-btn
          flat
          icon="mdi-close"
          dense
          @click="(search = false), (searchText = '')"
        />
      </div>

      <q-separator />
      <q-list>
        <div v-for="keynote in filteredKeynotes" :key="keynote._id">
          <q-item class="q-py-md">
            <q-item-section>
              <q-item-label class="text-subtitle2">
                {{ keynote.theme }}
                <q-chip dark class="q-mb-sm" color="orange-7" size="sm"
                  >keynote</q-chip
                >
              </q-item-label>
              <q-item-label class="text-grey-8">
                <q-icon class="q-mb-xs" name="mdi-clock-outline" size="20px" />
                开始：
                {{ parseDate(keynote.date.start) }}<br />
              </q-item-label>
              <q-item-label class="text-grey-8">
                <q-icon class="q-mb-xs" name="mdi-clock-outline" size="20px" />
                结束：
                {{ parseDate(keynote.date.end) }}
              </q-item-label>
              <q-item-label class="text-grey-8">
                <q-icon class="q-mb-xs" name="mdi-account" size="20px" />
                主持人： {{ keynote.host }}
              </q-item-label>
              <q-item-label class="text-grey-8">
                <q-icon class="q-mb-xs" name="mdi-account" size="20px" />
                报告人： {{ keynote.reporter }}
              </q-item-label>
              <q-item-label class="text-grey-8">
                <q-icon class="q-mb-xs" name="mdi-map-marker" size="20px" />
                地点： {{ keynote.location }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
        </div>
      </q-list>

      <q-list>
        <div
          v-for="session in filteredSessions"
          :key="session._id"
          @click="gotoSession(session._id)"
        >
          <q-item clickable v-ripple class="q-py-md">
            <q-item-section>
              <q-item-label class="text-subtitle2">
                {{ session.theme }}
                <q-chip dark class="q-mb-sm" color="primary" size="sm"
                  >session</q-chip
                >
              </q-item-label>
              <q-item-label class="text-grey-8">
                <q-icon class="q-mb-xs" name="mdi-clock-outline" size="20px" />
                开始：
                {{ parseDate(session.date.start) }}<br />
              </q-item-label>
              <q-item-label class="text-grey-8">
                <q-icon class="q-mb-xs" name="mdi-clock-outline" size="20px" />
                结束：
                {{ parseDate(session.date.end) }}
              </q-item-label>
              <q-item-label class="text-grey-8">
                <q-icon class="q-mb-xs" name="mdi-account" size="20px" />
                主持人： {{ session.host }}
              </q-item-label>
              <q-item-label class="text-grey-8">
                <q-icon class="q-mb-xs" name="mdi-map-marker" size="20px" />
                地点：
                {{ session.location }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="mdi-chevron-right" />
            </q-item-section>
          </q-item>
          <q-separator />
        </div>
      </q-list>

      <div
        class="q-ma-md text-grey-8"
        v-show="
          filteredSessions &&
            filteredSessions.length === 0 &&
            filteredKeynotes &&
            filteredKeynotes.length === 0
        "
      >
        暂无匹配结果
      </div>

      <div style="text-align: center" class="q-mb-md">
        <q-btn
          class="q-mt-md"
          :color="participated ? 'red' : 'green'"
          :label="participated ? '取消参会' : '参加会议'"
          @click="participate"
        />
      </div>
    </template>
  </q-page>
</template>

<style scoped>
.timeline {
  line-height: 4px;
}

.timeline >>> .q-timeline__subtitle {
  margin-bottom: 0px;
  line-height: 8px;
}

.timeline >>> .q-timeline__content {
  padding-bottom: 18px;
}

.timeline >>> .q-timeline__dot.text-primary {
  line-height: 10px;
  padding-bottom: 10px;
  margin-left: 12px;
  transform: translateY(-9px);
}
</style>

<script>
import axios from "axios";
import Fuse from "fuse.js";
import { mapState } from "vuex";
import moment from "moment";

export default {
  name: "PageIndex",
  data() {
    return {
      conference: null,
      search: false,
      searchText: "",
      fuseSessions: null,
      fuseKeynotes: null
    };
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData
    }),
    participated() {
      return this.conference.users.includes(this.userData.username);
    },
    filteredKeynotes() {
      if (this.searchText)
        return (
          this.fuseKeynotes &&
          this.fuseKeynotes.search(this.searchText).map(e => e.item)
        );
      else return this.conference && this.conference.keynotes;
    },
    filteredSessions() {
      if (this.searchText)
        return (
          this.fuseSessions &&
          this.fuseSessions.search(this.searchText).map(e => e.item)
        );
      else return this.conference && this.conference.sessions;
    }
  },
  async created() {
    // load all conferences
    this.conference = await this.$store.dispatch(
      "conference/getConference",
      this.$route.params.id
    );
    this.fuseKeynotes = new Fuse(this.conference.keynotes, {
      keys: ["theme", "date.start", "date.end", "location", "host", "reporter"]
    });
    this.fuseSessions = new Fuse(this.conference.sessions, {
      keys: ["theme", "date.start", "date.end", "location", "host", "papers"]
    });
    console.log("Conference:", this.conference);
  },
  methods: {
    gotoSession(id) {
      this.$router.push(`/session/${id}`);
    },

    gotoUserList() {
      this.$router.push({
        path: "/userlist",
        query: {
          usernames: JSON.stringify(this.conference.users)
        }
      });
    },

    async participate() {
      await axios.post(
        `http://39.107.235.247:3000/conferences/${this.$route.params.id}/users`,
        { action: !this.participated }
      );
      if (this.participated) {
        this.$set(
          this.conference,
          "users",
          this.conference.users.filter(user => user !== this.userData.username)
        );
      } else this.conference.users.push(this.userData.username);

      this.$store.commit("conference/updateConference", this.conference);
    },

    parseDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    }
  }
};
</script>
