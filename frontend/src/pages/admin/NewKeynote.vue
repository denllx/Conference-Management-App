<template>
  <q-page class="q-pa-md">
        <!-- <div class="q-gutter-y-md column" style="max-width: 100%">  -->
 <div class="q-gutter-y-md column" style="max-width: 100%"  ref="form" :model="form">
        <q-input v-model="form.theme"  label="主题">
          <q-icon style="margin-left:20px;margin-top:20px" name="mdi-pen" size="20px" /></q-input> 
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
         <q-card-section>
        
         </q-card-section>
         <q-btn color="primary" label="完成" @click="accomplish" />
</div>
      
         
        
         <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">创建新Keynote成功！</div>
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
    
  name: "NewKeynote",
  
 data() {
    return {
    confirm : false,
    form:
    {
     title: "",
     host : "",
     reporter : "",
     location : "",
     start_date:"",
     end_date :""
    }
    }
 }
 ,
  methods: {
      async accomplish()
      {
        var data =  {"theme":this.form.theme, "host":this.form.host,"reporter":this.form.reporter, "location":this.form.location, "date": {
			"start": this.form.start_date,
			"end": this.form.end_date
        },
        };
        const id = await  this.$store.dispatch("management/getCurrentConference");
        var dic = {"data": data,"id":id };
        this.$store.dispatch("management/newKeynote", dic);
        var result = 0;
         this.confirm = true;
      },
      async backtoConference()  
      {
        const id = await  this.$store.dispatch("management/getCurrentConference");
          this.$router.push({
        path: '/modifyconference',
        query: { id }
      })
      }
  }
};
</script>
