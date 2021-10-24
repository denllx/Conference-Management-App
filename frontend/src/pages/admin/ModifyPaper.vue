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
 <div class="q-gutter-y-md column" style="max-width: 100%"  ref="form" :model="form" v-show="finished">
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
          <q-btn color="red" label="删除论文" @click="deletePaper" />
</div>
      
        
        
         <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">修改论文成功！</div>
        </q-card-section>
      <q-card-section class="q-pt-none">
          
        </q-card-section>
        <q-card-actions align="right" @click="backtoSession" class="bg-white text-primary">

          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

     
         <q-dialog v-model="deleted" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">删除论文成功！</div>
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
    
  name: "ModifyPaper",
  computed: {

    author_list: function () {
      console.log("form ")
      console.log(this.form.author)
      return this.form.author
    }
},
  
 data() {
    return {
    confirm : false,
    finished: false,
    deleted: false,
    form:
    {
     title: "",
     author : [],
     abstract : "",
     pdf: ""
    }
    };
 }
 ,
    async created() {
    this.paper = await this.$store.dispatch("management/getPaper", this.$route.query.id);
    console.log(this.paper);
    this.form.title = this.paper.title;
    this.form.abstract = this.paper.abstract;
    this.form.pdf = this.paper.pdf;
    this.form.author = [];

    this.form.author = this.paper.author;
    this.finished = true;
    
  },

  methods: {
      async accomplish()
      {
          var body = {"title":this.form.title, "abstract":this.form.abstract, "pdf":this.form.pdf, 
          "author":this.form.author,	
          "comments":this.paper.comments,
		      "likes":this.paper.likes,
		      "stars": this.paper.star};
           var data = {"id": this.paper._id, "body":body};
        console.log("data", data);
        var result = await this.$store.dispatch("management/modifyPaper", data);
        if (result === 200) 
        {
            this.confirm = true;
        }
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
      async deletePaper()
      {
      const session_id = await  this.$store.dispatch("management/getCurrentSession");
      const paper_id = this.paper._id;
      var dic = {"session":session_id, "paper": paper_id};
      await  this.$store.dispatch("management/deletePaper", dic);
      this.deleted = true;

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
