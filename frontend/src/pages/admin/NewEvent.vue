<template>
  <q-page class="q-pa-md">
        <!-- <div class="q-gutter-y-md column" style="max-width: 100%">  -->
 <div class="q-gutter-y-md column" style="max-width: 100%"  ref="form" :model="form">
         
      <q-input type="date" v-model="form.date" label="时间">
        <q-icon style="margin-left:20px;margin-top:20px" name="mdi-clock-outline" size="20px" />
      </q-input>
        <q-input v-model="form.name"  label="内容">
          <q-icon style="margin-left:20px;margin-top:20px" name="mdi-pen" size="20px" />
        </q-input>
         <q-card-section>
        
         </q-card-section>
         <q-btn color="primary" label="完成" @click="accomplish" />
</div>
      
         
        
         <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">创建成功！</div>
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
    
  name: "NewEvent",
  
 data() {
    return {
    confirm : false,
    form:
    {
     name: "",
     date : "",
    }
    }
 }
 ,
  methods: {
      async accomplish()
      {
        var data =  {"date":this.form.date, "name":this.form.name};
        const id = await  this.$store.dispatch("management/getCurrentConference");
        var dic = {"data": data,"id":id };
        this.$store.dispatch("management/newEvent", dic);
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
