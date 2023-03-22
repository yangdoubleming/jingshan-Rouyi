<template>
  <div>
    <el-button @click="showDialog">创建访视计划</el-button>

    <el-dialog title="创建访视计划" :visible.sync="dialogVisible" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="130px">
        <el-form-item prop="namePrefix" label="访视名称前辍">
          <el-input v-model="form.namePrefix" />
        </el-form-item>
        <el-form-item prop="intervalNum" label="访视名称数字间隔">
          <el-input v-model="form.intervalNum" />
        </el-form-item>
        <el-form-item prop="lastDateDay" label="距上次天数" required>
          <el-input v-model="form.lastDateDay" />
        </el-form-item>
        <el-form-item prop="visitNum" label="访视次数" required>
          <el-input v-model="form.visitNum" />
        </el-form-item>
        <el-form-item prop="intervalDay" label="间隔天数" required>
          <el-input v-model="form.intervalDay" />
        </el-form-item>
        <el-form-item prop="beforeWindowDateDay" label="窗口期前天数" required>
          <el-input v-model="form.beforeWindowDateDay" />
        </el-form-item>
        <el-form-item prop="afterWindowDateDay" label="窗口期后天数" required>
          <el-input v-model="form.afterWindowDateDay" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addVisitPlan } from '@/api/project/list'
export default {
  props: ['projectId'],
  data() {
    return {
      inRequest: false,
      dialogVisible: false,
      form: {}
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        if (this.inRequest) return
        this.inRequest = true
        const response = await addVisitPlan({ ...this.form, projectId: this.projectId })
        if (response.code === 200) {
          this.$message.success(response.msg)
          this.dialogVisible = false
          this.form = {}
          this.$refs['form'].resetFields()
          this.$emit('refresh')
        }
      } finally {
        this.inRequest = false
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>

<style scoped>

</style>

