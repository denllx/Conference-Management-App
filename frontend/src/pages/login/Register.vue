<template>
  <q-page class="flex flex-center" style="width: 100%">
    <q-card class="q-ma-md q-pa-md" style="width: 100%">
              <q-card-section align="right">
      <q-btn align="" color="primary" @click="jumpToLogin" ref="loginButton">去登录</q-btn>
      </q-card-section>
      <q-form
        ref="form"
        :model="form"
        class="register-form"
      >
        <q-input v-model="form.username" label="用户名"
        ref="username"
         lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入用户名']"
        ></q-input>
        <q-input v-model="form.nickname" label="真实姓名"
        ref="realname"
         lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入真实姓名']"></q-input>

        <q-input
          class="q-mt-sm"
          type="password"
          v-model="form.password"
          ref="password"
          label="密码"
          show-password
         lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入密码']"
        ></q-input>

      <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">注册成功！</div>
        </q-card-section>
      <q-card-section class="q-pt-none">
          欢迎进入
        </q-card-section>
        <q-card-actions align="right" @click="Register" class="bg-white text-primary">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

         <q-dialog v-model="warn" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">注册失败！</div>
        </q-card-section>
      <q-card-section class="q-pt-none">
          用户名已存在
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-primary">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


        <div class="q-mt-md">
          <q-btn
            :loading="loading"
            class="q-mr-md"
            color="primary"
            ref="registerButton"
            @click="attemptRegister"
            >
            注册</q-btn>
          <q-btn @click="clean" ref="cleanButton"
          type="reset"
            >清空</q-btn>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      confirm: false,
      warn:false,
      formHasError: false,
      loading:false,
      form: {
        username: "",
        nickname:"",
        password: "",
      },
      group: "Participants",
    };
  },

  methods: {


    async attemptRegister() {
      this.$refs.username.validate();
      this.$refs.realname.validate();
      this.$refs.password.validate();

      if (this.$refs.username.hasError || this.$refs.realname.hasError || this.$refs.password.hasError) {
        return;
      }
      this.loading = true;
      var register_result = await this.$store.dispatch("user/register",
      {"username":this.form.username, "password":this.form.password, "nickname": this.form.nickname, "admin":this.group == "Admin"});
      if (register_result.data.code =="200")
      {
        var result = await this.$store.dispatch("user/login", {
        username: this.form.username,
        password: this.form.password,
        admin: this.group == "Admin"
        });
        if (result.data.code === "200") this.confirm = true;
        else
          this.warn = true;

      }
      else
        this.warn = true;
      this.loading = false;

    },
    async Register() {

      this.loading = true;
      if (this.group == "Admin")
      {
        var result = await this.$store.dispatch("management/updateInfo", this.form.username);
      }

      this.$store.commit("user/setusername", this.form.username);

      this.loading = false;
       if (this.group === "Participants")
      {
      this.$router.push("/list");
      }
      else
    {
      this.$router.push("/management");
    }
    },
    jumpToLogin() {

      this.$router.push("/");
    },
    clean() {
      this.form.username = "";
      this.form.nickname = "";
      this.form.password = "";
      this.$refs.username.resetValidation();
      this.$refs.realname.resetValidation();
      this.$refs.password.resetValidation();
    },
  },
};
</script>
