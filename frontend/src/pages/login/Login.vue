<template>
  <q-page class="flex flex-center" style="width: 100%">
    <q-card class="q-ma-md q-pa-md" style="width: 100%">
      <q-card-section align="right">
        <q-btn align color="primary" @click="jumpToRegister" ref="registerButton">去注册</q-btn>
      </q-card-section>
      <q-form ref="form" :model="form" class="login-form" >
        <q-input v-model="form.username" label="用户名"
         ref="username"
         lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入用户名']"></q-input>

        <q-input class="q-mt-sm" type="password" v-model="form.password" label="密码" show-password
         ref="password"
         lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入密码']"
        ></q-input>

        <q-option-group
          class="q-mt-md"
          style="margin-left: -16px"
          v-model="group"
          :options="options"
          color="primary"
          inline
        />

        <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-primary text-white" style="width: 300px">
            <q-card-section>
              <div class="text-h6">登录成功！</div>
            </q-card-section>
            <q-card-section class="q-pt-none">欢迎进入</q-card-section>
            <q-card-actions align="right" @click="login" class="bg-white text-primary">
              <q-btn flat label="OK" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="warn" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-primary text-white" style="width: 300px">
            <q-card-section>
              <div class="text-h6">登录失败！</div>
            </q-card-section>
            <q-card-section class="q-pt-none">用户名或密码错误</q-card-section>
            <q-card-actions align="right" class="bg-white text-primary">
              <q-btn flat label="OK" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <div class="q-mt-md">
          <q-btn :loading="loading" class="q-mr-md" color="primary" @click="attemptLogin" ref="loginButton">登录</q-btn>
          <q-btn @click="clean" ref="cleanButton" type="reset">清空</q-btn>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      confirm: false,
      warn: false,
      loading:false,
      form: {
        username: "",
        password: ""
      },
      group: "Participants",
      options: [
        {
          label: "参会人员",
          value: "Participants"
        },
        {
          label: "管理人员",
          value: "Admin"
        }
      ]
    };
  },

  methods: {
    async attemptLogin() {
      this.$refs.username.validate();
      this.$refs.password.validate();

      if (this.$refs.username.hasError || this.$refs.password.hasError) {
        return;
      }
      this.loading = true;
      var result = await this.$store.dispatch("user/login", {
        username: this.form.username,
        password: this.form.password,
        admin: this.group == "Admin"
      });
      console.log("result");
      console.log(result);
      console.log(result.data.code);
      if (result.data.code === "200")
      {
        console.log("confirm");
        this.confirm = true;
      }
      else this.warn = true;
    this.loading = false;
    },
    async login() {
      this.loading = true;
      if (this.group == "Admin")
      {
        var result = await this.$store.dispatch("management/updateInfo", this.form.username);
      }
      this.$store.commit("user/setusername", this.form.username);
      this.loading = false;
      if (this.group === "Participants") {
        this.$router.push("/list");
      } else {
        this.$router.push("/management");
      }
    },
    jumpToRegister() {
      if (this.group === "Participants") this.$router.push("/register");
    },
    clean() {
      this.form.username = "";
      this.form.password = "";
      this.$refs.username.resetValidation();
      this.$refs.password.resetValidation();
    }
  }
};
</script>
