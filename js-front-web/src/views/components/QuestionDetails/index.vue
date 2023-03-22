<template>
  <div>
    <!-- <el-button style="margin-left: 10px" size="mini" type="primary" @click="visible = true">质疑详情</el-button> -->
    <el-dialog :visible.sync="visible" width="80%" append-to-body @close="handleClose">
      <template slot="title">
        <span>质疑详情</span>
        <span style="margin-left: 20px">{{ detailData.centerNo }}/{{ detailData.examineeNo }}/{{ detailData.visitName }}</span>
      </template>
      <div v-if="detailData && detailData.visitQuestionList">
        <div class="message-box">
          <div class="left">
            <div v-for="(items, index) in detailData.visitQuestionList" :key="index" class="item" :class="{'active' : index === currentIndex}" @click="changeTab(index)">
              <i v-if="items.questionReplyStatus === 1" class="el-icon-chat-dot-round" style="font-size: 12px; color: red; display: flex; align-items: center; margin-right: 5px;" />
              <div :class="{'grey' : items.questionReplyStatus === 3}">{{items.firstCategoryName}}</div>
              <i v-if="items.isUrgent === 1" class="el-icon-message-solid icon" style="font-size: 22px; color: red;" />
            </div>
          </div>
          <div v-if="detailData.visitQuestionList && detailData.visitQuestionList.length > 0" class="right">
            <div class="talk-box">
              <div class="talk-user">
                {{ detailData.visitQuestionList[currentIndex].createBy }}
              </div>
              <div class="talk-content">
                <p>质疑编号：{{ detailData.visitQuestionList[currentIndex].no }}</p>
                <p>质疑发起时长：{{ detailData.visitQuestionList[currentIndex].differTime }}</p>
                <p>质疑类型：{{ detailData.visitQuestionList[currentIndex].firstCategoryName }} 质疑子类型：{{ detailData.visitQuestionList[currentIndex].secondCategoryName }}</p>
                <p>质疑内容：{{ detailData.visitQuestionList[currentIndex].content }}</p>
                <div class="img-list">
                  <img v-for="(img, i) in detailData.visitQuestionList[currentIndex].imageUrlList" class="img" :key="i" :src="img" alt="" @click="previewImg(img)">
                </div>
              </div>
              <div class="talk-time">{{detailData.visitQuestionList[currentIndex].createTime}}</div>
            </div>
            <div v-for="(item, i) in detailData.visitQuestionList[currentIndex].visitAnswerList" class="reply-box" :class="{'space' : item.answerType === '2'}" :key="i">
              <div class="reply-user">
                {{ item.createBy }}
              </div>
              <div class="reply-content">
                <p>{{ item.content }}</p>
                <div class="img-list">
                  <img v-for="(img, i) in item.imageUrlList" class="img" :key="i" :src="img" alt="" @click="previewImg(img)">
                </div>
              </div>
              <div class="reply-time">{{ item.createTime }}</div>
            </div>
          </div>
        </div>
        <!-- 回复  -->
        <div v-if="detailData.visitQuestionList && detailData.visitQuestionList.length > 0">
          <div v-if="detailData.visitQuestionList[currentIndex].isCanAnswer === 1" class="reply-form">
            <el-input v-model="content" style="width: 100%;" type="textarea" :rows="3" maxlength="300" placeholder="请输入内容" />
            <div class="footer-wrap">
              <!-- <i class="el-icon-picture-outline" style="font-size: 22px" /> -->
              <div class="section" style="text-align: center;overflow: hidden;">
                <div style="float:left;">
                  <FileUpload :limit="9" :file-type="fileType" :title="uploadTitle" @updateFileList="updateFileList" />
                </div>
              </div>
              <div class="contorl">
                <el-button v-if="detailData.visitQuestionList[currentIndex].isCanClosed === 1" type="danger" @click="changeStatus('1')">关闭质疑</el-button>
                <el-button type="primary" @click="changeReply">回复</el-button>
              </div>
            </div>
            <div v-if="imageUrlList && imageUrlList.length > 0" class="img-sty-box">
              <img v-for="(item,index) in imageUrlList" :key="index" :src="item" class="img-sty">
            </div>
          </div>
          <div class="footer">
            <el-button v-if="detailData.visitQuestionList[currentIndex].isCanClosed === 1 && detailData.visitQuestionList[currentIndex].isCanAnswer !== 1" type="danger" @click="changeStatus('1')">关闭质疑</el-button>
            <el-button v-if="detailData.visitQuestionList[currentIndex].isCanOpen === 1" type="primary" @click="changeStatus('0')">重新打开质疑</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 图片放大 -->
    <el-dialog :visible.sync="showPreview" width="90%" height="500px" append-to-body style="text-align: center;overflow: hidden;">
      <div style="height: 600px;overflow: scroll;">
        <img :src="imgPreview" style="max-width: 100%; max-height: 100%; object-fit: contain;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getQuestionDetail, addVisitAnswer, setVisitQuestionStatus } from '@/api/audit/data'
import FileUpload from '@/views/components/FileUpload/commonUpload'
import QuestionDetails from '@/views/components/QuestionDetails/index'
export default {
  components: { FileUpload, QuestionDetails },
  props: ['visitId', 'visible', 'questionId'],
  data() {
    return {
    //   visible: true,
      currentIndex: 0,
      detailData: '',
      content: '',
      imageUrlList: [],
      fileType: ['jpg', 'png'],
      uploadTitle: '支持jpg,png格式，最多上传9张',
      showPreview: false,
      imgPreview: ''
    }
  },
  watch: {
    visible: function(newVisible, oldVisible) {
      if (newVisible) {
        this.getDetails()
      }
    }
  },
  // created() {
  //   this.getDetails()
  // },
  methods: {
    previewImg(url) {
      this.showPreview = true
      this.imgPreview = url
    },
    getDetails(id) {
      getQuestionDetail({ visitId: this.visitId, questionId: this.questionId }).then((res) => {
        if (res.data) {
          this.detailData = res.data
          if (id) {
            this.detailData.visitQuestionList.map((item, index) => {
              if (item.id === id) {
                this.currentIndex = index
              }
            })
          }
        }
      })
    },
    changeTab(e) {
      this.currentIndex = e
    },
    // 接受上传数据
    updateFileList(fileList) {
      this.imageUrlList = fileList.map(item => item.url)
    },
    // 回复
    changeReply() {
      if (this.content === '') {
        return
      }
      const params = {
        questionId: this.detailData.visitQuestionList[this.currentIndex].id,
        content: this.content,
        imageUrlList: this.imageUrlList
      }
      addVisitAnswer(params).then((res) => {
        if (res.code === 200) {
          this.content = ''
          this.imageUrlList = []
          this.$message.success('回复成功！')
          this.getDetails(this.detailData.visitQuestionList[this.currentIndex].id)
        }
      })
    },
    changeStatus(status) {
      const title = status === '1' ? '确认关闭质疑？' : '确定重新打开质疑？'
      this.$confirm(title)
        .then((_) => {
          const params = {
            id: this.detailData.visitQuestionList[this.currentIndex].id,
            status: status
          }
          setVisitQuestionStatus(params).then((res) => {
            if (res.code === 200) {
              // this.$message.success(status === '1' ? '关闭质疑成功！' : '已打开质疑')
              this.getDetails(this.detailData.visitQuestionList[this.currentIndex].id)
            }
          })
        }).catch((_) => {})
    },
    handleClose(done) {
      this.$emit('close')
    //   this.$confirm("确认关闭？")
    //     .then((_) => {
    //       done()
    //     })
    //     .catch((_) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.message-box {
    display: flex;
    justify-content: space-between;
    .left {
        width: 20%;
        max-height: 500px;
        overflow-y: scroll;
        .item {
            display: flex;
            justify-content: center;
            align-content: center;
            height: 50px;
            line-height: 50px;
            text-align: center;
            position: relative;
            cursor: pointer;
            color: #333;
            font-size: 14px;
            padding-right: 15px;
            .grey{
              color: #999;
            }

            &:hover::after {
                border-bottom: 0;   
            }
            &.active { 
                background: rgb(91 173 248 / 17%);
                border-right: 3px solid #0486fe;
            }
            .icon{
                position: absolute;
                right: 10px;
                top: 14px;
            }
        }
    }
    .right {
        width: 78%;
        overflow: hidden;
        clear: both;
        max-height: 500px;
        overflow-y: scroll;
        .talk-box {
            float: left;
            width: 80%;
            margin: 0 0 20px;
            .talk-content {
                margin: 5px 0;
                background-color: #4a75e5;
                border-radius: 6.5px;
                color: white;
                padding: 5px 10px;
                .img-list{
                  display: flex;
                  flex-wrap: wrap;
                  padding-bottom: 20px;
                  .img{
                    width: 100px;
                    margin-right: 15px;
                    cursor: pointer;
                  }
                }
            }
            .talk-time {
                color: #707070;
            }
        }
        .reply-box {
            float: right;
            text-align: right;
            width: 80%;
            margin: 0 0 20px;
            &.space{
              float: left;
              text-align: left;
              .reply-content{
                background-color: #b7c7f1;
              }
            }
            .reply-content {
                margin: 5px 0;
                background-color: #dde6ff;
                border-radius: 6.5px;
                padding: 5px 10px;
                .img-list{
                  display: flex;
                  flex-wrap: wrap;
                  padding-bottom: 20px;
                  justify-content: flex-end;
                  .img{
                    width: 100px;
                    margin-left: 15px;
                    cursor: pointer;
                  }
                }
            }
            .reply-time {
                color: #707070;
            }
        }
    }
}
    .reply-form{
        display: flex;
        padding-left: 38%;
        flex-direction: column;
        margin-top: 30px;
        .footer-wrap{
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }
    }
   .footer {
    margin: 20px 0;
    display: flex;
    justify-content: flex-end;
}
.img-sty-box{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.img-sty{
  width: 148px;
  height: 148px;
  margin: 15px;
}
</style>
