<template>
  <q-page class="q-pa-md">
    <div v-if="!finished" style="text-align: center; margin-top: 30px">
      <q-circular-progress
        size="36px"
        :indeterminate="true"
        color="primary"
      />
    </div>

 <div class="q-gutter-y-md column"  style="max-width: 100%"  ref="form" :model="form"  v-show="finished">
        <q-input v-model="form.title"  label="会议标题" >
          <q-icon style="margin-top:20px" name="mdi-pen" size="20px" />
          </q-input>

        <q-input v-model="form.organizer" label="会议组织">
          <q-icon  style="margin-top:20px" name="mdi-home" size="20px" />
          </q-input>


<q-btn style="max-width: 100%" color="primary" label="新的Time Points" @click="newEvent"/>


<div class="text-h6 q-mt-md" style="margin-left: 2px; cursor: pointer; vertical-align: top" @click="listEvents = !listEvents">


      Time Points
      <q-icon

        :name="`mdi-chevron-down`"
        :style="{
          'transform': listEvents ? 'rotate(-180deg)' : 'none',
          'transition': '0.3s',
          'font-size': '18px'
        }"
        />
    </div>

  <q-list  class="q-mt-sm" style="margin-bottom: 10%" v-show="finished && listEvents">
      <q-separator />
      <div
        v-for="event in conference.events"
        :key="event.date"
        @click="modifyEvent(event.date, event.name)"
      >
        <q-item clickable v-ripple class="q-py-md">
          <q-item-section>

            <q-item-label class="text-subtitle2">
              {{event.name }}
              </q-item-label>
              <q-item-section>
               <q-item-label class="text-grey-8 q-pt-xs">
                 <q-icon class="q-mb-xs" name="mdi-clock-outline" size="20px" />
              时间:
              {{ event.date }}
            </q-item-label>
            </q-item-section>
            </q-item-section>
            <q-item-section side >
            <q-icon name="mdi-chevron-right" />
          </q-item-section>
        </q-item>
        <q-separator />
      </div>
    </q-list>



 <q-btn style="max-width: 100%" color="primary" label="新的Keynote" @click="newKeynote"/>

<div class="text-h6 q-mt-md" style="margin-left: 2px; cursor: pointer; vertical-align: top" @click="listKeynotes = !listKeynotes">


      Keynotes
      <q-icon

        :name="`mdi-chevron-down`"
        :style="{
          'transform': listKeynotes ? 'rotate(-180deg)' : 'none',
          'transition': '0.3s',
          'font-size': '18px'
        }"
        />
    </div>

  <q-list  class="q-mt-sm" style="margin-bottom: 10%" v-show="finished && listKeynotes">
      <q-separator />
      <div
        v-for="keynote in conference.keynotes"
        :key="keynote._id"
        @click="modifyKeynote(keynote._id)"
      >
        <q-item clickable v-ripple class="q-py-md">
          <q-item-section>
            <q-item-label class="text-subtitle2">
              {{ keynote.theme }}
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

            <q-item-label class="q-pt-xs">
              <q-icon class="q-mb-xs" name="mdi-map-marker" size="20px" />
              地点:
              <span class="q-ml-sm text-grey-8">
                {{ keynote.location }}
              </span>
            </q-item-label>
          </q-item-section>
                    <q-item-section side >
            <q-icon name="mdi-chevron-right" />
          </q-item-section>
        </q-item>
        <q-separator />
      </div>
    </q-list>




        <q-btn style="max-width: 100%" color="primary" label="新的Session" @click="newSession"/>

<div class="text-h6 q-mt-md" style="margin-left: 2px; cursor: pointer; vertical-align: top" @click="listSessions = !listSessions">


      Sessions
      <q-icon
        :name="`mdi-chevron-down`"
        :style="{
          'transform': listSessions ? 'rotate(-180deg)' : 'none',
          'transition': '0.3s',
          'font-size': '18px'
        }"
        />
    </div>

  <q-list  class="q-mt-sm" style="margin-bottom: 10%" v-show="finished && listSessions">
      <q-separator />
      <div
        v-for="session in conference.sessions"
        :key="session._id"
        @click="modifySession(session._id)"
      >
        <q-item clickable v-ripple class="q-py-md">
          <q-item-section>
            <q-item-label class="text-subtitle2">
              {{ session.theme }}
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
            <q-item-label class="q-pt-xs">
              <q-icon class="q-mb-xs" name="mdi-map-marker" size="20px" />
              地点:
              <span class="q-ml-sm text-grey-8">
                {{ session.location }}
              </span>
            </q-item-label>
            <q-item-label class="q-pt-xs">
              <q-icon class="q-mb-xs" name="mdi-text-box-multiple" size="20px" />
              论文:
              <span class="q-ml-sm text-grey-8">
                {{ session.papers.length }} 篇
              </span>


            </q-item-label>
          </q-item-section>
                    <q-item-section side >
            <q-icon name="mdi-chevron-right" />
          </q-item-section>
        </q-item>
        <q-separator />
      </div>
    </q-list>

<q-btn color="primary" label="完成" @click="accomplish" />
<q-btn color="red" label="删除会议" @click="deleteConference" />
</div>

       <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">修改成功！</div>
        </q-card-section>
      <q-card-section class="q-pt-none">

        </q-card-section>
        <q-card-actions align="right" @click="$router.replace('/management')" class="bg-white text-primary">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>

      </q-card>
    </q-dialog>

           <q-dialog v-model="deleted" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">删除成功！</div>
        </q-card-section>
      <q-card-section class="q-pt-none">

        </q-card-section>
        <q-card-actions align="right" @click="$router.replace('/management')" class="bg-white text-primary">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>

      </q-card>
    </q-dialog>



  </q-page>
</template>

<script>
import { mapState } from "vuex";
import moment from 'moment';
export default {
  name: "ModifyConference",
  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  data() {
    return {
      conference: {},
      confirm : false,
      finished: false,
      listSessions: false,
      listKeynotes: false,
      listEvents: false,
      deleted: false,
    form:
    {
     title: "",
     organizer : "",
    }
    };
  },
  async created() {
    this.conference = await this.$store.dispatch("management/getConference", this.$route.query.id);
    console.log("modify conference: ", this.conference);
    console.log("modify conference: ", this.conference.events);
    this.form.title = this.conference["title"];
    this.form.organizer = this.conference["organizer"];

    this.conference_session_ids = await this.$store.dispatch("management/getSessionIDs", this.$route.query.id);
    this.conference_keynote_ids = await this.$store.dispatch("management/getKeynoteIDs", this.$route.query.id);
    this.finished = true;

  },

  methods: {
      async accomplish()
      {

        var body =  {"title":this.form.title, "organizer":this.form.organizer,
			"sessions": this.conference_session_ids, "keynotes": this.conference_keynote_ids,
        "events":this.conference.events, "users":this.conference.users};
        console.log("body", body);
        var data = {"id": this.conference._id, "body":body};
        console.log("data", data);
        var result = await this.$store.dispatch("management/modifyConference", data);
       if (result === 200)
       {
        this.confirm = true;
        //this.$router.replace("/management")
       }

      },

      async deleteConference()
      {
      const username = this.$store.state.user.userData.username
      const conference_id = this.conference._id;
      var dic = {"username":username, "conference": conference_id};
      await  this.$store.dispatch("management/deleteConference", dic);
      this.deleted = true;

      },

       async modifySession(id)
      {
        await this.$store.commit("management/setCurrentConference", this.conference._id);
       this.$router.push({
        path: '/modifysession',
        query: { id }
      })

     },

      async modifyKeynote(id)
      {
        await this.$store.commit("management/setCurrentConference", this.conference._id);
        this.$router.push({
        path: '/modifykeynote',
        query: { id }
      })

     },

      async modifyEvent(date, name)
      {
        await this.$store.commit("management/setCurrentConference", this.conference._id);
        this.$router.push({
        path: '/modifyevent',
        query: { date, name }
      })

     },


    async newSession() {
    console.log("this.conference._id");
    console.log(this.conference._id);
    await this.$store.commit("management/setCurrentConference", this.conference._id);
    this.$router.push("/newsession");
    },

    async newKeynote() {
    console.log("this.conference._id");
    console.log(this.conference._id);
    await this.$store.commit("management/setCurrentConference", this.conference._id);
    this.$router.push("/newkeynote");
    },

    async newEvent() {
    await this.$store.commit("management/setCurrentConference", this.conference._id);
    this.$router.push("/newevent");
    },

    parseDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm');
    }


  }
};
</script>
