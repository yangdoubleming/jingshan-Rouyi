<template>
  <div>
    <el-button @click="showDialog">{{ type === 'create' ? '字段选择' : '修改' }}</el-button>

    <el-dialog v-loading="loading" :title="type === 'create' ? '字段选择' : '修改受试者信息'" :visible.sync="dialogVisible"
      width="500px" :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item prop="fieldSourceTable" label="字段类型">
          <el-select v-model="form.fieldSourceTable" @change="changeFieldSourceTable" placeholder="请选择">
            <el-option label="受试者信息" value="1" />
            <el-option label="访视信息" value="2" />
            <el-option label="数据描述" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.fieldSourceTable == '3'" prop="category" label="文件类型" :rules="[{ required: true, message: '文件类型不能为空' }]">
          <el-select v-model="form.category" placeholder="请选择" @change="changeCategory">
            <el-option v-for="(item, i) in categoryList" :key="i" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="fieldNameCnId" label="字段名称" :rules="[{ required: true, message: '字段名称不能为空' }]">
          <el-select ref="mySelect" v-model="form.fieldNameCnId" placeholder="请选择">
            <el-option v-for="item in fieldNameCnList" :key="item.id" :label="item.value"
              :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="inRequest" type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { Message } from 'element-ui'
import { editCheckCfgList, getSourceTableFieldList, addCheckCfgList } from '@/api/project/list'
export default {
  props: ['projectId', 'type', 'data'],
  data() {
    return {
      inRequest: false,
      dialogVisible: false,
      loading: false,
      form: {
        projectId: this.projectId
      },
      categoryList: [
        {
          name: 'DICOM',
          id: 1
        }, {
          name: 'PDF',
          id: 2
        }, {
          name: '图片',
          id: 3
        }, {
          name: '视频',
          id: 4
        }
      ],
      fieldNameCnList: [],
      rules: {
        fieldSourceTable: [{ required: true, message: '必须选择', trigger: 'change' }],
        // category: [{ required: true, message: '文件类型不能为空', trigger: 'change' }],
        fieldNameCnId: [{ required: true, message: '字段名称不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    changeFieldSourceTable(value) {
      if (this.form.fieldSourceTable !== '3') {
        this._getSourceTableFieldList()
      }
      // 获取下拉框的 DOM 节点
      const selectInput = this.$refs.mySelect.$refs.reference.getInput()
      // 清空下拉框的选项
      selectInput.value = ''
      // 触发下拉框的 change 事件，以更新绑定的值
      selectInput.dispatchEvent(new Event('change'))
    },
    changeCategory() {
      if (this.form.fieldSourceTable === '3') {
        this._getSourceTableFieldList()
      }
      // 获取下拉框的 DOM 节点
      const selectInput = this.$refs.mySelect.$refs.reference.getInput()
      // 清空下拉框的选项
      selectInput.value = ''
      // 触发下拉框的 change 事件，以更新绑定的值
      selectInput.dispatchEvent(new Event('change'))
    },
    // 查询字段
    _getSourceTableFieldList() {
      const form = { ...this.form }
      const params = {
        projectId: this.projectId,
        fieldSourceTable: form.fieldSourceTable
      }
      if (this.form.fieldSourceTable === '3') {
        params.category = form.category
      } else {
        params.category = ''
      }
      getSourceTableFieldList(params).then(res => {
        this.fieldNameCnList = res.data || []
        // 编辑数据
      }).catch(() => {
        this.fieldNameCnList = []
      })
    },
    showDialog() {
      this.dialogVisible = true
      if (this.data) {
        // this.loading = true
        console.log(this.data, '=0000')
        this.$nextTick(() => {
          this.form = { ...this.data }
          this._getSourceTableFieldList()
        })
        
      //   examineeInfo({ id: this.data.id, projectId: this.data.projectId }).then(res => {
      //     this.form = res.data
      //     if (this.form.downBoxValueList) {
      //       this.form.downBoxValueList = this.form.downBoxValueList((item) => ({ value: item }))
      //     }
      //     this.loading = false
      //   })
      }
    },
    handleSubmit() {
      if (this.type === 'create') {
        this._addCheckCfgList()
      }
      if (this.type === 'update') {
        this.updateExamineeCfg()
      }
    },
    _addCheckCfgList() {
      try {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            const valueList = this.fieldNameCnList.filter(item => item.id === this.form.fieldNameCnId)
            this.form.sourceCfgId = valueList[0].id
            this.form.fieldNameCn = valueList[0].value
            // const response = await addCheckCfgList(this.form)
            getSourceTableFieldList(this.form).then(response => {
              // 编辑数据
              if (response.code === 200) {
                this.dialogVisible = false
                this.$message.success(response.msg)
                this.$refs['form'].resetFields()
                this.$emit('refresh')
              }
            })
          } else {
            this.$message.error('请输入必填项')
            return false
          }
        });
      } finally {
        this.loading = false
      }
    },
    async updateExamineeCfg() {
      try {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.inRequest) return
            this.inRequest = true
            const valueList = this.fieldNameCnList.filter(item => item.id === this.form.fieldNameCnId)
            this.form.sourceCfgId = valueList[0].id
            this.form.fieldNameCn = valueList[0].value
            const response = await editCheckCfgList({ ...this.form, projectId: this.projectId })
            if (response.code === 200) {
              this.dialogVisible = false
              this.$message.success(response.msg)
              this.form = {}
              this.$refs['form'].resetFields()
              this.$emit('refresh')
            }
          } else {
            this.$message.error('请输入必填项')
            return false
          }
        })
      } finally {
        this.inRequest = false
      }
    },
    addOptions() {
      this.form.downBoxValueList.push({ value: '' })
    },
    removeOptions(item) {
      if (this.form.downBoxValueList.length === 1) {
        Message.error('下拉框必须要拥有至少一个值')
        return
      }
      var index = this.form.downBoxValueList.indexOf(item)
      if (index !== -1) {
        this.form.downBoxValueList.splice(index, 1)
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.form.resetFields()
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>

<style scoped></style>
