<template>
  <div>
    <el-button @click="showDialog">{{ type === 'create' ? '创建上传需求配置' : '修改' }}</el-button>

    <el-dialog
      :title="type === 'create' ? '创建上传需求' : '修改上传需求'"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item prop="stage" label="访视阶段">
          <el-select v-model="form.stage">
            <el-option label="全部" :value="0" />
            <el-option label="基线期" :value="1" />
            <el-option label="访视期" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="isMust" label="是否必须">
          <el-select v-model="form.isMust">
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="文件类型">
          <el-select v-model="form.type">
            <el-option v-for="item in fileTypeList" :key="item.id" :value="item.id" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="infoTypeList" label="信息类型">
          <el-select v-model="form.infoTypeList" multiple>
            <el-option v-for="item in infoTypeList" :key="item.id" :value="item.value" :label="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addVisitUploadCfg, editVisitUploadCfg, getUpdateFileType, getVisitCfgDetail } from '@/api/project/list'
export default {
  props: ['projectId', 'type', 'data'],
  data() {
    return {
      inRequest: false,
      dialogVisible: false,
      form: {},
      isRequest: false,
      fileTypeList: [],
      infoTypeList: []
    }
  },
  methods: {
    async showDialog() {
      this.dialogVisible = true
      if (this.type === 'update') {
        this.queryVisitCfgDetail()
      }

      this.queryUpdateFileType()
    },
    handleSubmit() {
      if (this.type === 'create') {
        this.createVisitUploadCfg()
      }
      if (this.type === 'update') {
        this.updateVisitUploadCfg()
      }
    },
    async queryVisitCfgDetail() {
      try {
        if (this.inRequest) return
        this.inRequest = true
        const response = await getVisitCfgDetail(this.data.id)
        if (response.code === 200) {
          const { isMust, type, stage, infoTypeList, id } = response.data
          this.form = {
            id,
            isMust: Number(isMust),
            type: Number(type),
            stage: Number(stage),
            infoTypeList: infoTypeList.split(',')
          }
        }
      } finally {
        this.inRequest = false
      }
    },
    async queryUpdateFileType() {
      try {
        if (this.isRequest) return
        this.isRequest = true
        const response = await getUpdateFileType()
        if (response.code === 200) {
          this.fileTypeList = response.data.fileTypeList
          this.infoTypeList = response.data.infoTypeList
        }
      } finally {
        this.isRequest = false
      }
    },
    async createVisitUploadCfg() {
      try {
        if (this.inRequest) return
        this.inRequest = true
        const response = await addVisitUploadCfg({
          ...this.form,
          infoTypeList: this.form.infoTypeList.join(','),
          projectId: this.projectId
        })
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
    async updateVisitUploadCfg() {
      try {
        if (this.inRequest) return
        this.inRequest = true
        const response = await editVisitUploadCfg({
          ...this.form,
          infoTypeList: this.form.infoTypeList.join(',')
        })
        this.inRequest = false
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
