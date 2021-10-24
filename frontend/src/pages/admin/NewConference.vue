<template>
  <q-page class="q-pa-md">
        <!-- <div class="q-gutter-y-md column" style="max-width: 100%">  -->
 <div class="q-gutter-y-md column" style="max-width: 100%"  ref="form" :model="form">
        <q-input v-model="form.title"  label="会议标题">
          <q-icon style="margin-left:20px;margin-top:20px" name="mdi-pen" size="20px" />
          </q-input> 
        <q-input v-model="form.organizer" label="会议组织">
          <q-icon style="margin-left:20px;margin-top:20px" name="mdi-home" size="20px" />
        </q-input>

</div>
      
         <q-btn class="button-bottom" color="primary" label="完成" @click="accomplish" />
         <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">创建新会议成功！</div>
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
import { mapState, mapMutations } from "vuex";
export default {
    
  name: "NewConference",

  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  
 data() {
    return {
    confirm : false,
    form:
    {
     title: "",
     organizer : "",
    }
    }
 }
 ,
  methods: {
      async accomplish()
      {
        var data =  {"title":this.form.title, "organizer":this.form.organizer, "sessions":[], "keynotes":[], "events":[], "users": []};
        var result = await this.$store.dispatch("management/newConference", {"data":data, "name":this.userData.username});
       if (result == 200) 
       {
         this.confirm = true;
        //this.$router.replace("/management")
       }

        
      }
  
  }
};
</script>
