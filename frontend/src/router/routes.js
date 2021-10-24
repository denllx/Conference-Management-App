const routes = [
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/login/Login.vue")
      }
    ]
  },
  {
    path: "/register",
    component: () => import("layouts/RegisterLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/login/Register.vue")
      }
    ]
  },
  {
    path: "/management",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "会议管理" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/Management.vue")
      }
    ]
  },
  {
    path: "/newconference",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "新的会议" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/NewConference.vue")
      }
    ]
  },
  {
    path: "/modifyconference",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "修改会议信息" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/ModifyConference.vue")
      }
    ]
  },
  {
    path: "/newsession",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "新的Session" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/NewSession.vue")
      }
    ]
  },
  {
    path: "/modifysession",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "修改Session信息" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/ModifySession.vue")
      }
    ]
  },
  {
    path: "/newkeynote",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "新的Keynote" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/NewKeynote.vue")
      }
    ]
  },
  {
    path: "/newevent",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "新的会议重要时间" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/NewEvent.vue")
      }
    ]
  },
  {
    path: "/modifykeynote",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "修改Keynote信息" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/ModifyKeynote.vue")
      }
    ]
  },
  {
    path: "/newpaper",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "新的论文" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/NewPaper.vue")
      }
    ]
  },
  {
    path: "/modifypaper",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "修改论文信息" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/ModifyPaper.vue")
      }
    ]
  },
  {
    path: "/modifyevent",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "修改重要时间信息" },
    children: [
      {
        path: "",
        component: () => import("pages/admin/ModifyEvent.vue")
      }
    ]
  },

  {
    path: "/adminme",
    component: () => import("layouts/AdminMainLayout.vue"),
    props: { title: "个人中心" },
    children: [
      {
        path: "",
        component: () => import("pages/account/Home.vue")
      }
    ]
  },
  {
    path: "/mymessages",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "我的消息" },
    children: [
      {
        path: "",
        component: () => import("pages/account/ChatList.vue")
      }
    ]
  },
  {
    path: "/list",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "会议列表" },
    children: [
      {
        path: "",
        component: () => import("pages/list.vue")
      }
    ]
  },
  {
    path: "/conference/:id",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "会议详情" },
    children: [
      {
        path: "",
        component: () => import("pages/conference/_id.vue")
      }
    ]
  },
  {
    path: "/session/:id",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "Session 详情" },
    children: [
      {
        path: "",
        component: () => import("pages/conference/Session.vue")
      }
    ]
  },
  {
    path: "/userlist",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "参会人员" },
    children: [
      {
        path: "",
        component: () => import("pages/conference/UserList.vue")
      }
    ]
  },
  {
    path: "/mypapers",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "我的收藏" },
    children: [
      {
        path: "",
        component: () => import("pages/account/Collections.vue")
      }
    ]
  },
  {
    path: "/me",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "个人中心" },
    children: [
      {
        path: "",
        component: () => import("pages/account/Home.vue")
      }
    ]
  },
  {
    path: "/me/username",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "修改用户名" },
    children: [
      {
        path: "",
        component: () => import("pages/account/ChangeUsername.vue")
      }
    ]
  },
  {
    path: "/me/nickname",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "修改昵称" },
    children: [
      {
        path: "",
        component: () => import("pages/account/ChangeNickname.vue")
      }
    ]
  },
  {
    path: "/me/signature",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "修改签名" },
    children: [
      {
        path: "",
        component: () => import("pages/account/ChangeSignature.vue")
      }
    ]
  },
  {
    path: "/me/password",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "修改密码" },
    children: [
      {
        path: "",
        component: () => import("pages/account/ChangePassword.vue")
      }
    ]
  },
  {
    path: "/me/avatar/url",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "修改头像" },
    children: [
      {
        path: "",
        component: () => import("pages/account/UploadByUrl.vue")
      }
    ]
  },
  {
    path: "/chat",
    component: () => import("layouts/MainLayout.vue"),
    props: route => ({ title: JSON.parse(route.query.friend).nickname }),
    children: [
      {
        path: "",
        component: () => import("pages/account/Chat.vue")
      }
    ]
  },
  {
    path: "/user",
    component: () => import("layouts/MainLayout.vue"),
    props: { title: "用户详情" },
    children: [
      {
        path: "",
        component: () => import("pages/User.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
