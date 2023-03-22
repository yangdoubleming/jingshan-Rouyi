<template>
  <div>
    <el-button @click="showDialog">修改</el-button>

    <el-dialog title="修改访视计划" :visible.sync="dialogVisible" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="130px">
        <el-form-item
          prop="name"
          label="访视名称"
        >
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item
          prop="lastDateDay"
          label="距上次天数"
          required
        >
          <el-input v-model="form.lastDateDay" />
        </el-form-item>
        <el-form-item
          prop="beforeWindowDateDay"
          label="窗口期前天数"
          required
        >
          <el-input v-model="form.beforeWindowDateDay" />
        </el-form-item>
        <el-form-item
          prop="afterWindowDateDay"
          label="窗口期后天数"
          required
        >
          <el-input v-model="form.afterWindowDateDay" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="inRequest" type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getVisitPlanDetail, editVisitPlan } from '@/api/project/list'
export default {
  props: ['id'],
  data() {
    return {
      loading: false,
      inRequest: false,
      dialogVisible: false,
      form: {}
    }
  },
  watch: {
    'dialogVisible': function(newValue) {
      if (newValue) {
        this.queryVisitPlanDetail()
      }
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    async queryVisitPlanDetail() {
      try {
        if (this.loading) return
        this.loading = true
        const response = await getVisitPlanDetail(this.id)
        if (response.code === 200) {
          this.form = response.data
        }
      } finally {
        this.loading = false
      }
    },
    async handleSubmit() {
      try {
        if (this.inRequest) return
        this.inRequest = true
        const {id, name, lastDateDay, beforeWindowDateDay, afterWindowDateDay} = this.form
        const response = await editVisitPlan({ id, name, lastDateDay, beforeWindowDateDay, afterWindowDateDay, projectId: this.projectId })
        if (response.code === 200) {
          this.dialogVisible = false
          this.$message.success(response.msg)
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

