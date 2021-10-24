<template>
  <q-page>
    <div style="display: flex">
      <q-select
        class="q-pa-md"
        style="min-width: 150px"
        v-model="organizer" :options="organizers" label="主办组织"
      />
      <q-space />
      <div style="align-self: flex-end">
        <q-btn
          class="q-mr-lg q-mb-md"
          v-show="!search"
          @click="search = true"
          color="primary"
          outline label="搜索" icon="mdi-magnify" />
      </div>
    </div>

    <div
      v-show="search"
      style="display: flex" class="q-mx-md q-mb-sm">
      <q-input v-model="searchText" label="搜索" clearable>
        <template v-slot:prepend>
          <q-icon name="mdi-magnify" />
        </template>
      </q-input>
      <q-space />
      <q-btn
        flat
        icon="mdi-close"
        dense
        @click="search = false, searchText = ''"
        />
    </div>
    <q-separator />

    <div v-if="loading" style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
      <q-circular-progress
        size="36px"
        :indeterminate="true"
        color="primary"
      />
    </div>

    <q-list v-if="conferences">
      <div
        v-for="conference in displayedConferences"
        :key="conference._id"
        @click="gotoConference(conference._id)"
      >
        <q-item clickable v-ripple class="q-py-md">
          <q-item-section>
            <q-item-label class="text-h6">
              {{ conference.title }}
            </q-item-label>
            <q-item-label class="text-grey-9 q-pt-xs">
              <q-icon class="q-mb-xs" name="mdi-home" size="20px" />
              主办组织： {{ conference.organizer }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="mdi-chevron-right" />
          </q-item-section>
        </q-item>
        <q-separator />
      </div>
    </q-list>
  </q-page>
</template>

<script>
import Fuse from 'fuse.js';

export default {
  name: "PageIndex",
  data() {
    return {
      search: false,
      searchText: '',
      conferences: null,
      organizer: '全部',
      organizers: [],
      fuse: null,
      loading: false
    };
  },
  computed: {
    displayedConferences() {
      let results = this.conferences.filter(conf =>
        this.organizer === '全部' || conf.organizer === this.organizer);
      if (this.searchText && this.fuse) {
        results = this.fuse.search(this.searchText).map(e => e.item);
      }
      return results;
    }
  },
  async mounted() {
    this.loading = true;
    // load all conferences
    this.conferences = await this.$store.dispatch("conference/getConferences");
    const organizers = new Set();
    this.conferences.forEach(c => {
      organizers.add(c.organizer);
    });
    this.organizers = [...organizers, '全部'];
    this.fuse = new Fuse(this.conferences, {
      keys: ['title', 'organizer']
    });
    this.loading = false;
  },
  methods: {
    gotoConference(id) {
      this.$router.push(`/conference/${id}`);
    }
  }
};
</script>
