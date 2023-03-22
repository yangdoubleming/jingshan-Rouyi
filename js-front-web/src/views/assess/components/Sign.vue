<template>
  <div style="width: 100%;">
    <el-button
      v-if="isShow"
      style="margin: 20px 0; float: right;"
      type="primary"
      @click="showSignModal"
    >
      完成提交
    </el-button>
    <el-dialog
      v-loading="loading"
      title="✔完成提交"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <div style="font-size: 16px; color: black; font-weight: bold">
        签名声明：
      </div>
      <div style="margin: 10px 0; color: #606266; font-size: 14px">
        本人确认，此病例报告表是由我完成的，在我的经验和知识范围内，我已尽可能的确保评估报告的准确性和完整性。通过输入本人的用户密码，并单击【签名】按钮，完成本人电子签名，与本人手写签名具有同等的法律约束力。
      </div>
      <div>账户： {{ $store.state.user.name }}</div>
      <div class="pass-box">
        <div style="width: 45px">密码：</div>
        <el-input
          v-model="signForm.password"
          style="width: 200px"
          type="password"
          placeholder="请输入内容"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSignForm">
          签 名
        </el-button>
      </span>
    </el-dialog>

    <el-descriptions v-if="showSign" :column="3" border>
      <el-descriptions-item>
        <template slot="label"> 签名时间 </template>
        {{ autographDate }}
      </el-descriptions-item>
      <el-descriptions-item>
        <span class="sign-status"> 已评估 </span>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import {
  autograph
} from '@/api/assess/task'
export default {
  props: ['isValidPass', 'isShow', 'showSign', 'autographDate'],
  data() {
    return {
      loading: false,
      visible: false,
      signForm: {
        username: this.$store.state.user.name,
        password: ''
      }
    }
  },
  methods: {
    showSignModal() {
      this.$emit('checkData')
      this.$nextTick(() => {
        this.visible = this.isValidPass
      })
    },
    async submitSignForm() {
      if (!this.signForm.password) {
        this.$message.warning('请输入密码')
        return
      }
      try {
        if (this.loading) return
        this.loading = true
        const response = await autograph(this.signForm)
        if (response.code === 200) {
          this.visible = false
          this.$emit('submit')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pass-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 10px 0;
}

.sign-status {
    font-weight: bold;
    color: red;
    padding: 5px;
    border: 2px solid red;
}
</style>
