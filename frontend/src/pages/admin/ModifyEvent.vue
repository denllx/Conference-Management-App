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
        <q-input  type="date" v-model="form.date" label="时间">
          <q-icon style="margin-left:20px;margin-top:20px" name="mdi-clock-outline" size="20px" />

        </q-input>
        <q-input v-model="form.name"  label="内容">
          <q-icon style="margin-left:20px; margin-top:20px" name="mdi-pen" size="20px" />
          </q-input> 

         <q-btn color="primary" label="完成" @click="accomplish" />
         <q-btn color="red" label="删除" @click="deleteEvent" />
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
export default {
    
  name: "ModifyEvent",
  
 data() {
    return {
    confirm : false,
    finished : false,
    deleted: false,
    form:
    {
     name: "",
     date: "",
    }
    }
 }
 ,
   async created() {
    this.event = {};
    this.event.name = this.$route.query.name;
    this.event.date = this.$route.query.date;
    this.form.name = this.event.name;
    this.form.date = this.event.date;
    console.log(this.event);
    this.old_name = this.$route.query.name;
    this.old_date =this.$route.query.date;
    this.finished = true;
  },
  
  methods: {
      async accomplish()
      {
          var paper_ids = 0;
          var body =  {"name":this.form.name,"date":this.form.date,"old_name":this.old_name, "old_date":this.old_date};
        console.log("body", body);
        const id = await  this.$store.dispatch("management/getCurrentConference");
        var data = {"id": id, "body":body};
        console.log("data", data);
        var result = await this.$store.dispatch("management/modifyEvent", data);
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
      async deleteEvent()
      {
      const conference_id = await  this.$store.dispatch("management/getCurrentConference");
      var dic = {"event":{"name":this.old_name, "date":this.old_date}, "conference": conference_id};
      await  this.$store.dispatch("management/deleteEvent", dic);
      this.deleted = true;

      },
  }
};
</script>
