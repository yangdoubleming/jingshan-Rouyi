<template>
  <div id="query-dialog">
    <div>
      <i class="el-icon-question" style="color: #F56C6C; cursor: pointer" v-if="status == '0'" @click="openDialog" />
      <i v-else-if="status == '1'" class="el-icon-question" style="color: #67C23A;" />
      <i v-else class="el-icon-minus" style="color: #909399;" />
    </div>
    <div class="query-dialog">
      <el-dialog title="质疑详情 011/011003/V1" :visible.sync="queryDialogVisible" width="800px;" :before-close="closeDialog"
        append-to-body>
        <el-tabs tab-position="left" :stretch="false">
          <el-tab-pane label="扫描部位不完整">
            <div class="right-gray-bg">
              <div class="left-box">
                <div>张三(san.zhang@medspruce.com)</div>
                <div class="left-talk-content">
                  <div class="left-talk-inner-box">
                    <div>质疑编号：202209160001<spa class="emgency">【加急！！】</spa>
                    </div>
                    <div>质疑发起时长：2天21小时35分钟</div>
                    <div>
                      质疑类型：图像不符合要求 质疑子类型：缺失必要序列
                    </div>
                    <div>质疑内容：头部核磁缺少T1序列</div>
                    <img :src="test01">
                  </div>
                </div>
                <div>2022-09-16 14:55:48</div>
              </div>
              <div class="right-box">
                <div>
                  李四(si.li@ddd.com)
                </div>
                <div class="right-talk-content">
                  <div class="right-talk-inner-box">
                    <div>已重新刻盘，上传完成</div>
                  </div>
                </div>
                <div>
                  2022-09-16 14:55:48
                </div>
              </div>
              <div class="down-input-box">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" />
                <div class="down-btn">
                  <i class="el-icon-picture-outline" style="font-size: 22px" />
                  <el-button type="primary">回复</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="图像不符合要求">图像不符合要求</el-tab-pane>
          <el-tab-pane label="图像断层">图像断层</el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { getExamineVisitDetails } from '@/api/audit/data'
import test01 from '@/assets/images/test01.png'
export default {
  props: {
    sourceId: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: '0'
    },
    sourceType: {
      type: String,
      default: '1'
    },
  },
  data() {
    return {
      test01,
      queryDialogVisible: false,
      details: []
    }
  },
  created(){
    // this.getData()
  },
  methods: {
    async getData() {
      const response = await getExamineVisitDetails({sourceId:this.sourceId,sourceType:this.sourceType})
      if (response.code === 200) {
        this.details = response.row
      }
    },
    closeDialog() {
      this.$emit('controlQueryDialog', false)
    },
    openDialog() {
      this.queryDialogVisible = true
    }
  }
}
</script>

<!-- 样式重置 -->
<style>
#query-dialog #tab-0:before {
  content: "● ";
  font-size: 16px;
  color: red;
  font-weight: bold;
}

#query-dialog #tab-0:after {
  content: " ♨";
  font-size: 16px;
  color: red;
  font-weight: bold;
}
#query-dialog .el-tabs__item{
  width: 200px;
  white-space: normal;
  line-height:25px;
}
</style>
<style scoped lang="scss">
.right-gray-bg {
  background: rgba(240, 240, 240, 0.41);
  overflow: hidden;
  padding: 10px;
  .left-box {
    float: left;

    .left-talk-content {
      width: 543px;
      background: #4a75e5;
      border-radius: 6.5px;
      color: white;
      margin: 5px 0;

      .left-talk-inner-box {
        padding: 10px;

        * {
          padding: 3px 5px;
          clear: both;
        }

        .emgency {
          color: #ff0000;
        }

        img {
          width: 500px;
          display: block;
        }
      }
    }
  }

  .right-box {
    float: right;
    margin: 20px 0;
    overflow: hidden;

    * {
      float: right;
      clear: both;
    }

    .right-talk-content {
      margin: 5px 0;
      width: 543px;
      background: #dde6ff;
      border-radius: 6.5px;
      text-align: right;

      .right-talk-inner-box {
        padding: 10px;

        * {
          padding: 3px 5px;
          clear: both;
        }

        .emgency {
          color: #ff0000;
        }

        img {
          width: 500px;
          display: block;
        }
      }
    }
  }
  .down-input-box{
    margin: 5px;
    .down-btn{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 15px;
      margin-bottom: 30px;
    }
  }
  
}
</style>

