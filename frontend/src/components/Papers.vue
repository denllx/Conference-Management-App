<template>
  <div>
    <div v-if="!papers" style="text-align: center; margin-top: 30px">
      <q-circular-progress size="36px" :indeterminate="true" color="primary" />
    </div>

    <template v-if="papers">
      <q-dialog :value="Boolean(author)">
        <q-card style="min-width: 300px">
          <q-card-section>
            <div class="text-subtitle1">提示</div>
          </q-card-section>

          <q-card-section class="q-pt-none text-red">该用户尚未注册</q-card-section>

          <q-card-section v-if="author" class="q-pt-none">
            <q-icon class="q-mb-xs" name="mdi-account-box" size="20px" />
            姓名： {{ author.name }}
            <br />
            <q-icon class="q-mb-xs" name="mdi-phone" size="20px" />
            联系方式： {{ author.contact }}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="关闭" color="primary" @click="author = null" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog :value="Boolean(editingId)" persistent>
        <q-card style="min-width: 300px">
          <q-card-section>
            <div class="text-h6">评论</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              autofocus
              outlined
              dense
              style="resize: none"
              type="textarea"
              v-model="comment"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn @click="clearComment" flat label="取消" />
            <q-btn color="primary" @click="commentPaper" label="提交" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-list class="q-mt-sm">
        <q-separator />
        <div class="q-pa-md text-grey-8 text-h6" v-show="papers.length === 0">暂无论文</div>
        <div v-for="paper in papers" :key="paper._id">
          <q-item class="q-py-md">
            <q-item-section>
              <q-item-label class="text-h6">{{ paper.title }}</q-item-label>
              <q-item-label class="q-pt-xs">
                <q-icon class="q-mb-xs" name="mdi-account-multiple" size="20px" />作者：
                <span v-for="(author, idx) in paper.author" :key="author.name">
                  {{ idx > 0 ? "," : "" }}
                  <span
                    :class="{
                      'q-mr-xs': idx > 0,
                      'text-primary': true
                    }"
                    @click="showAuthor(author)"
                  >{{ author.name }}</span>
                </span>
              </q-item-label>

              <q-item-label
                class="q-pt-xs text-subtitle2"
                style="font-size: 18px"
                v-show="showPaper[paper._id]"
              >Abstract</q-item-label>
              <q-item-label
                class="q-pt-xs text-grey-8"
                v-show="showPaper[paper._id]"
                style="word-break: break-word"
              >{{ paper.abstract }}</q-item-label>
              <q-item-label
                class="q-pt-xs text-subtitle2"
                style="font-size: 18px"
                v-show="showPaper[paper._id]"
              >PDF</q-item-label>
              <q-item-label v-show="showPaper[paper._id]">
                <a style="word-break: break-all;" :href="paper.pdf">{{ paper.pdf }}</a>
              </q-item-label>

              <q-item-label class="q-pt-sm text-grey-8" v-show="showPaper[paper._id]">
                <q-icon
                  style="margin-right: 6px; cursor: pointer;"
                  :color="
                    paper.likes.includes(userData.username)
                      ? 'primary'
                      : undefined
                  "
                  @click="
                    likePaper(
                      paper._id,
                      !Boolean(paper.likes.includes(userData.username))
                    )
                  "
                  size="22px"
                  name="mdi-thumb-up"
                />
                <span style="margin-right: 10px">{{ paper.likes.length }}</span>

                <q-icon
                  @click="editingId = paper._id"
                  style="margin-right: 6px; cursor: pointer;"
                  size="22px"
                  name="mdi-message-reply-text"
                />
                <span style="margin-right: 10px">
                  {{
                  paper.comments.length
                  }}
                </span>

                <q-icon
                  :color="
                    userData.paperIds.includes(paper._id) ? 'orange' : undefined
                  "
                  @click="
                    starPaper(paper._id, !userData.paperIds.includes(paper._id))
                  "
                  style="margin-right: 6px; cursor: pointer;"
                  size="22px"
                  name="mdi-star"
                />
                <span style="margin-right: 10px">{{ paper.stars }}</span>
              </q-item-label>
              <q-item-label class="q-pt-sm" style="font-size: 18px" v-show="showPaper[paper._id]">
                Comments ({{ paper.comments.length }})
                <q-icon
                  clickable
                  name="mdi-chevron-up"
                  class="text-grey-7"
                  @click="$set(hideComments, paper._id, !hideComments[paper._id])"
                  :style="{
                    transform: !hideComments[paper._id]
                      ? 'rotate(180deg)'
                      : 'none',
                    transition: '0.3s',
                    'font-size': '20px',
                    'margin-left': '2px',
                    cursor: 'pointer',
                    'vertical-align': 'top'
                  }"
                />
              </q-item-label>
              <div class="q-pt-sm" v-show="showPaper[paper._id] && !hideComments[paper._id]">
                <q-item v-for="(comment, i) in paper.comments" :key="i">
                  <q-item-section avatar @click="gotoUser(comment.user.username)">
                    <q-avatar>
                      <q-img :src="comment.user.avatar"></q-img>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      @click="gotoUser(comment.user.username)"
                      style="font-size:1.2em"
                    >{{ comment.user.username }}</q-item-label>
                    <q-item-label caption lines="2">{{ comment.content }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>
                      {{
                      getTime(new Date(comment.date).getTime())
                      }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-item-section>

            <q-item-section
              side
              top
              class="q-mt-sm"
              @click="$set(showPaper, paper._id, !showPaper[paper._id])"
            >
              <q-icon
                clickable
                name="mdi-chevron-right"
                :style="{
                  transform: showPaper[paper._id] ? 'rotate(90deg)' : 'none',
                  transition: '0.3s'
                }"
              />
            </q-item-section>
          </q-item>
          <q-separator />
        </div>
      </q-list>
    </template>
  </div>
</template>

<style scoped>
.caption {
  width: 30%;
}
.content {
  color: rgba(0, 0, 0, 0.7);
}
td {
  vertical-align: top;
}
table {
  border-spacing: 0 6px;
}
</style>

<script>
import { mapState } from "vuex";
import getTime from "src/utils/time.js";
import axios from "axios";
import _ from "lodash";

export default {
  name: "Papers",
  props: {
    id: String,
    username: String
  },
  data() {
    return {
      papers: null,
      showPaper: null,
      hideComments: null,
      editingId: null,
      author: null,
      comment: ""
    };
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  async mounted() {
    // load conference
    if (this.id)
      this.papers = await this.$store.dispatch("conference/getPapers", {
        id: this.id
      });
    else
      this.papers = await this.$store.dispatch("user/getPapers", this.username);
    this.hideComments = {};
    this.showPaper = {};
    console.log("papers: ", this.papers);
  },
  methods: {
    getTime,

    async update() {
      if (this.id)
        this.$store.commit("conference/updatePapers", {
          id: this.id,
          data: _.cloneDeep(this.papers)
        });
      else
        this.$store.commit("user/updatePapers", {
          user: this.username,
          papers: _.cloneDeep(this.papers)
        });
    },

    async likePaper(id, like) {
      await axios.patch(`http://39.107.235.247:3000/conferences/papers/${id}`, {
        action: "like",
        value: like
      });
      const paper = this.papers.find(p => p._id === id);
      if (like) paper.likes.push(this.userData.username);
      else
        this.$set(
          paper,
          "likes",
          paper.likes.filter(user => user !== this.userData.username)
        );
      this.update();
    },

    async starPaper(id, star) {
      await axios.patch(`http://39.107.235.247:3000/conferences/papers/${id}`, {
        action: "star",
        value: star
      });
      // update paper
      const paper = this.papers.find(p => p._id === id);
      if (star) ++paper.stars;
      else --paper.stars;
      this.update();

      // update userdata
      const userData = _.cloneDeep(this.userData);
      if (star) {
        userData.paperIds.push(id);
        this.$store.commit("user/updateUserData", userData);
      } else {
        _.remove(userData.paperIds, pid => pid === id);
        this.$store.commit("user/updateUserData", userData);
      }
      this.$store.commit("user/clearUserPapers", userData.username);
      if (!this.id) {
        this.papers = this.papers.filter(p => p._id !== id);
      }
    },

    async commentPaper() {
      await axios.patch(
        `http://39.107.235.247:3000/conferences/papers/${this.editingId}`,
        {
          action: "comment",
          value: this.comment
        }
      );

      const paper = this.papers.find(p => p._id === this.editingId);
      paper.comments.push({
        user: this.userData,
        content: this.comment,
        date: new Date()
      });
      this.update();
      this.clearComment();
    },

    clearComment() {
      this.comment = "";
      this.editingId = null;
    },

    gotoUser(username) {
      this.$router.push({
        path: "/user",
        query: { username }
      });
    },

    async showAuthor(author) {
      const res = await axios.get(
        `http://39.107.235.247:3000/users/nickname/${author.name}`
      );
      if (res.data) {
        this.gotoUser(res.data);
      } else {
        this.author = author;
      }
    }
  }
};
</script>
