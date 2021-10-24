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
        <q-input v-model="form.reporter" label="报告人">
           <q-icon style="margin-left:20px;margin-top:20px" name="mdi-account" size="20px" />
        </q-input>
        <q-input v-model="form.location" label="地点">
           <q-icon style="margin-left:20px;margin-top:20px" name="mdi-map-marker" size="20px" />
        </q-input>
        <q-input type="datetime-local" v-model="form.start_date" label="开始时间">
           <q-icon style="margin-left:20px;margin-top:20px" name="mdi-clock-outline" size="20px" />
        </q-input>
        <q-input type="datetime-local" v-model="form.end_date" label="结束时间">
            <q-icon style="margin-left:20px;margin-top:20px" name="mdi-clock-outline" size="20px" />
            </q-input> 
         <q-btn color="primary" label="完成" @click="accomplish" />
         <q-btn color="red" label="删除Keynote" @click="deleteKeynote" />
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
    
  name: "ModifyKeynote",
  
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
     reporter:"",
     location : "",
     start_date:"",
     end_date :""
    }
    }
 }
 ,
   async created() {
    this.keynote = await this.$store.dispatch("management/getKeynote", this.$route.query.id);
    this.form.theme = this.keynote["theme"];
    this.form.host = this.keynote["host"];
    this.form.reporter = this.keynote["reporter"];
    this.form.location = this.keynote["location"];
    this.form.start_date = moment(this.keynote["date"]["start"]).format("yyyy-MM-DDTHH:mm");
    this.form.end_date = moment(this.keynote["date"]["end"]).format("yyyy-MM-DDTHH:mm");
    this.finished = true;
    
  },
  
  methods: {
      async accomplish()
      {
          var paper_ids = 0;
          var body =  {"theme":this.form.theme, "host":this.form.host, "reporter":this.form.reporter,
          "location":this.form.location, "date": {
			"start": this.form.start_date,
			"end": this.form.end_date
        }};
        console.log("body", body);
        var data = {"id": this.keynote._id, "body":body};
        console.log("data", data);
        var result = await this.$store.dispatch("management/modifyKeynote", data);
       if (result === 200) 
       {
        this.confirm = true;
        //this.$router.replace("/management")
       }
      },


      async backtoConference()  
      {
        const id = await  this.$store.dispatch("management/getCurrentConference");
        //this.$router.push("/management");
          this.$router.push({
        path: '/modifyconference',
        query: { id }
      })
      },
      async deleteKeynote()
      {
      const conference_id = await  this.$store.dispatch("management/getCurrentConference");
      const keynote_id = this.keynote._id;
      var dic = {"keynote":keynote_id, "conference": conference_id};
      await  this.$store.dispatch("management/deleteKeynote", dic);
      this.deleted = true;

      },
  }
};
</script>
