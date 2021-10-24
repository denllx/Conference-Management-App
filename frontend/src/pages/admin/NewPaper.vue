<template>
  <q-page class="q-pa-md">
        <!-- <div class="q-gutter-y-md column" style="max-width: 100%">  -->
 <div class="q-gutter-y-md column" style="max-width: 100%"  ref="form" :model="form">
        <q-input v-model="form.title"  label="标题"></q-input> 
        <q-input v-model="form.abstract" label="简介"></q-input>
        <q-input v-model="form.pdf" label="pdf 链接"></q-input>
         <q-btn class="button" color="primary" label="添加作者" @click="newAuthor" />



         <div class="active" 
        v-for="author in author_list"
        :key="author_list.indexOf(author)"
      >
      <q-list  class="active">
        
      <div class="q-pa-xs">
          
      作者 {{author_list.indexOf(author) + 1}}
      </div>
      <q-card-section>
       <q-input class="q-xs" square outlined label="姓名" v-model="author.name">
        </q-input>
        </q-card-section>
        <q-card-section>
        <q-input class="q-xs" square outlined label="联系方式" v-model="author.contact">
          </q-input>
 </q-card-section>
        <q-card-section class="q-gutter-y-xs column" style="max-width: 50%; margin-left: 50%" >
         <q-btn class="q-xs" color="primary" label="删除作者" @click="deleteAuthor(author_list.indexOf(author))" />
         </q-card-section>
       </q-list>
       
      </div>
      
      
         <q-card-section>
        
         </q-card-section>
          <q-btn class="button" color="primary" label="完成" @click="accomplish" />
</div>
      
        
        
         <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">创建新论文成功！</div>
        </q-card-section>
      <q-card-section class="q-pt-none">
          
        </q-card-section>
        <q-card-actions align="right" @click="backtoSession" class="bg-white text-primary">

          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
    
  name: "NewPaper",
  computed: {

    author_list: function () {
      return this.form.author
    }
},
  
 data() {
    return {
    confirm : false,
    form:
    {
     title: "",
     author : [],
     abstract : "",
     pdf: ""
    }
    }
 }
 ,
  methods: {
      async accomplish()
      {
          var data = {"title":this.form.title, "abstract":this.form.abstract, "pdf":this.form.pdf, 
          "author":this.form.author ,"comments":[],
		      "likes":[],
		      "stars": 0};
          const id = await  this.$store.dispatch("management/getCurrentSession");
          var dic = {"data": data,"id":id };
          this.$store.dispatch("management/newPaper", dic);
          this.confirm = true;
      },
      newAuthor()
      {
          var new_author = {"name":"","contact":""};
          this.form.author =  this.form.author.concat(new_author);

      },
       deleteAuthor(id)
      {
          
       this.form.author.splice(id, 1);
       //delete this.form.autor[id];

      },
      async backtoSession()  
      {
        const id = await  this.$store.dispatch("management/getCurrentSession");
        console.log("back to id");
        console.log(id);
        //this.$router.push("/management");
          this.$router.push({
        path: '/modifysession',
        query: { id }
      })
      }
  }
};
</script>
