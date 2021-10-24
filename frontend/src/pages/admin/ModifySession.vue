<template>
  <q-page class="q-pa-md">
        <div v-if="!finished" style="text-align: center; margin-top: 30px">
      <q-circular-progress
        size="36px"
        :indeterminate="true"
        color="primary"
      />
    </div>
        <!-- <div class="q-gutter-y-md column" style="max-width: 100%">  -->
 <div class="q-gutter-y-md column" style="max-width: 100%"  ref="form" :model="form"  v-show="finished">
        <q-input v-model="form.theme"  label="主题">
           <q-icon style="margin-left:20px;margin-top:20px" name="mdi-pen" size="20px" />
           </q-input>
        <q-input v-model="form.host" label="主持人">
          <q-icon style="margin-left:20px;margin-top:20px" name="mdi-account" size="20px" />
        </q-input>
        <q-input v-model="form.location" label="地点">
           <q-icon style="margin-left:20px;margin-top:20px" name="mdi-map-marker" size="20px" />
        </q-input>
        <q-input type="datetime-local" v-model="form.start_date" label="开始时间">
           <q-icon style="margin-left:20px;margin-top:20px" name="mdi-clock-outline" size="20px" />
        </q-input>
        <q-input type="datetime-local" v-model="form.end_date" label="结束时间">
           <q-icon style="margin-left:20px;margin-top:20px" name="mdi-clock-outline" size="20px" /></q-input>
        <q-btn style="max-width: 100%" color="primary" label="新的论文" @click="newPaper"/>

<div class="text-h6 q-mt-md" style="margin-left: 2px; cursor: pointer; vertical-align: top" @click="listSessions = !listSessions">
    <q-icon class="q-mb-xs" name="mdi-text-box-multiple" size="20px" />
    Papers

      <q-icon
        class="q-ml-sm"
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
        v-for="paper in paper_list"
        :key="paper._id"
         @click="modifyPaper(paper._id)"
      >
        <q-item clickable v-ripple class="q-py-md">
          <q-item-section>
            <q-item-label class="text-subtitle2">
              {{ paper.title }}
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
         <q-btn color="red" label="删除Session" @click="deleteSession" />
</div>



         <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">修改成功！</div>
        </q-card-section>
      <q-card-section class="q-pt-none">

        </q-card-section>
        <q-card-actions align="right" @click="backtoConference" class="bg-white text-primary">

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
        <q-card-actions align="right" @click="backtoConference" class="bg-white text-primary">

          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment';

export default {

  name: "ModifySession",

 data() {
    return {
    confirm : false,
    finished : false,
    listSessions: false,
    deleted: false,
    paper_list: "",
    form:
    {
     theme: "",
     host : "",
     location : "",
     start_date:"",
     end_date :""
    }
    }
 }
 ,
   async created() {
    this.session = await this.$store.dispatch("management/getSession", this.$route.query.id);
    this.paper_list = await this.$store.dispatch("management/getPapers", this.$route.query.id);
    console.log("modify session: ", this.session);
    console.log("paper_list: ", this.paper_list);
    this.form.theme = this.session["theme"];
    this.form.host = this.session["host"];
    this.form.location = this.session["location"];
    console.log(this.session["date"]["start"]);
    this.form.start_date = moment(this.session["date"]["start"]).format("yyyy-MM-DDTHH:mm");
    console.log(this.form.start_date);
    this.form.end_date = moment(this.session["date"]["end"]).format("yyyy-MM-DDTHH:mm");
    // this.paper_ids = await this.$store.dispatch("management/getPaperIDs", this.$route.query.id);
    this.finished = true;

  },

  methods: {
      async accomplish()
      {
          var paper_ids = 0;
          var body =  {"theme":this.form.theme, "host":this.form.host, "location":this.form.location, "date": {
			"start": this.form.start_date,
			"end": this.form.end_date
        },"papers": this.session.papers};
        console.log("body", body);
        var data = {"id": this.session._id, "body":body};
        console.log("data", data);
        var result = await this.$store.dispatch("management/modifySession", data);
       if (result === 200)
       {
        this.confirm = true;
        //this.$router.replace("/management")
       }
      },
      async newPaper() {
        console.log("this.session._id");
        console.log(this.session._id);
        await this.$store.commit("management/setCurrentSession", this.session._id);
        this.$router.push("/newpaper");
        },

      async modifyPaper(id) {
        await this.$store.commit("management/setCurrentSession", this.session._id);
       this.$router.push({
        path: '/modifypaper',
        query: { id }
        })
        },

      async backtoConference()
      {
        const id = await  this.$store.dispatch("management/getCurrentConference");
        console.log("back to id");
        console.log(id);
        //this.$router.push("/management");
          this.$router.push({
        path: '/modifyconference',
        query: { id }
      })
      },
      async deleteSession()
      {
      const conference_id = await  this.$store.dispatch("management/getCurrentConference");
      const session_id = this.session._id;
      var dic = {"session":session_id, "conference": conference_id};
      await  this.$store.dispatch("management/deleteSession", dic);
      this.deleted = true;

      }
  }
};
</script>
