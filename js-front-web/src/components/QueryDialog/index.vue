<template>
  <div>
    <i
      class="el-icon-question"
      style="color: red; cursor: pointer"
      @click="openDialog"
    />
    <div class="query-dialog">
      <el-dialog
        title="质疑详情   011/011003/V1"
        :visible.sync="queryDialogVisible"
        width="800px"
        :before-close="closeDia"
        append-to-body
      >
        <el-tabs tab-position="left">
          <el-tab-pane label="扫描部位不完整">
            <div style="background: rgba(240, 240, 240, 0.41); overflow: hidden">
              <div>张三(san.zhang@medspruce.com)</div>
              <div
                style="
                width: 543px;
                background: rgb(74, 117, 229);
                border-radius: 6.5px;
                color: white;
                margin: 5px 0;
              "
              >
                <div style="padding: 5px">质疑编号：202209160001<spa style="color:#ff0000">【加急！！】</spa>
                </div>
                <div style="padding: 5px">质疑发起时长：2天21小时35分钟</div>
                <div style="padding: 5px">
                  质疑类型：图像不符合要求 质疑子类型：缺失必要序列
                </div>
                <div style="padding: 5px">质疑内容：头部核磁缺少T1序列</div>
                <img style="width: 500px; padding: 5px" :src="test01">
              </div>
              <div>2022-09-16 14:55:48</div>
              <div style="float: right; margin-top: 20px">
                李四(si.li@ddd.com)
              </div>
              <div
                style="
                float: right;
                clear: both;
                margin: 5px 0;
                width: 543px;
                height: 50px;
                background: rgb(221, 230, 255);
                border-radius: 6.5px;
                text-align: right;
                line-height: 50px;
              "
              >
                已重新刻盘，上传完成<span style="opacity: 0">哈哈</span>
              </div>
              <div style="float: right; clear: both; margin-bottom: 30px">
                2022-09-16 14:55:48
              </div>
              <el-input type="textarea" :rows="2" placeholder="请输入内容" />
              <div
                style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 15px;
                margin-bottom: 30px;
              "
              >
                <i class="el-icon-picture-outline" style="font-size: 22px" />
                <el-button type="primary">回复</el-button>
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
    queryDialogVisible: {
      type: Boolean,
      default: false
    },
    visitId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      test01,
      visible: false,
      details: []
    }
  },
  methods: {
    async getData() {
      const response = await getExamineVisitDetails({})
      if (response.code === 200) {
        this.details = response.row
      }
    },
    closeDialog() {
      this.$emit('controlQueryDialog', false)
    },
    openDialog() {
      this.visible = true
    }
  }
}
</script>
<style>
#tab-0:before {
    content: "● ";
    font-size: 16px;
    color: red;
    font-weight: bold;
}

#tab-0:after {
    content: " ♨";
    font-size: 16px;
    color: red;
    font-weight: bold;
}
</style>

