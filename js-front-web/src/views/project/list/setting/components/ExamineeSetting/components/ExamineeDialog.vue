<template>
  <div>
    <el-button @click="showDialog">{{ type === 'create' ? '创建受试者信息配置' : '修改' }}</el-button>

    <el-dialog v-loading="loading" :title="type === 'create' ? '创建受试者信息' : '修改受试者信息'" :visible.sync="dialogVisible"
      :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item prop="fieldNameCn" label="字段名称" :rules="[
  { required: true, message: '字段名称不能为空' }
]">
          <el-input v-model="form.fieldNameCn" />
        </el-form-item>
        <el-form-item prop="isRequired" label="是否必须" :rules="[
  { required: true, message: '必须选择' }
]">
          <el-select v-model="form.isRequired" placeholder="请选择">
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="fieldType" label="字段类型" :rules="[
  { required: true, message: '字段类型不能为空' }
]">
          <el-select v-model="form.fieldType" placeholder="请选择">
            <el-option label="文本" value="1" />
            <el-option label="整数" value="2" />
            <el-option label="小数" value="3" />
            <el-option label="日期时间" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item prop="inputMode" label="输入方式" :rules="[
  { required: true, message: '输入方式不能为空' }
]">
          <el-select v-model="form.inputMode" placeholder="请选择">
            <el-option label="文本框" value="1" />
            <el-option label="文本域" value="2" />
            <el-option label="数字输入框" value="3" />
            <el-option label="单选下拉框" value="4" />
            <el-option label="多选下拉框" value="5" />
            <el-option label="年月日" value="6" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="['4', '5'].includes(form.inputMode)" label="下拉框配置">
          <div v-for="(item, index) in form.downBoxValueList" :key="item"
            style="margin-top: `${index === 0 ? 0 : 10px}`">
            <el-col :span="12">
              <el-input v-model="item.value" />
            </el-col>
            <el-col :span="12">
              <el-button type="danger" style="margin-left: 10px" @click="removeOptions(item)">删除</el-button>
            </el-col>
            <el-button v-if="index === form.downBoxValueList.length - 1" type="primary" style="margin-top: 10px;"
              @click="addOptions">新增选项</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="sort" label="排序" :rules="[
  { required: true, message: '排序不能为空' }
]">
          <el-input v-model="form.sort" />
        </el-form-item>
        <el-form-item prop="fieldLength" label="字段长度" :rules="[
  { required: true, message: '字段长度不能为空' }
]">
          <el-input v-model="form.fieldLength" />
        </el-form-item>
        <el-form-item prop="promptTextCn" label="提示文字" :rules="[
  { required: true, message: '提示文字不能为空' }
]">
          <el-input v-model="form.promptTextCn" />
        </el-form-item>
        <el-form-item label="数值范围">
          <el-col :span="11">
            <el-input v-model="form.startNumberValue" />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="form.endNumberValue" />
          </el-col>
        </el-form-item>
        <el-form-item label="小数点精度" :rules="[
  { type: 'number', message: '小数点必须为数字值' }
]">
          <el-input v-model="form.decimalPrecision" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" />
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
import { addExamineeCfg, editExamineeCfg, examineeInfo } from '@/api/project/list'
export default {
  props: ['projectId', 'type', 'data'],
  data() {
    return {
      inRequest: false,
      dialogVisible: false,
      loading: false,
      form: {
        downBoxValueList: [{ value: '' }]
      }
    }
  },
  methods: {
    showDialog() {
      if (this.data) {
        this.loading = true
        examineeInfo({ id: this.data.id, projectId: this.data.projectId }).then(res => {
          this.form = res.data
          if (this.form.downBoxValueList) {
            this.form.downBoxValueList = this.form.downBoxValueList((item) => ({ value: item }))
          }
          this.loading = false
        })
      }
      this.dialogVisible = true
    },
    handleSubmit() {
      if (this.type === 'create') {
        this.createExamineeCfg()
      }
      if (this.type === 'update') {
        this.updateExamineeCfg()
      }
    },
    async createExamineeCfg() {
      if (!['4', '5'].includes(this.form.inputMode)) {
        this.form.downBoxValueList = undefined
      }
      if (['4', '5'].includes(this.form.inputMode)) {
        this.form.downBoxValueList = this.form.downBoxValueList.map((item) => item.value)
      }
      try {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.inRequest) return
            this.inRequest = true
            const response = await addExamineeCfg({ ...this.form, projectId: this.projectId, fieldNameEn: '1', promptTextEn: 'please' })
            if (response.code === 200) {
              this.dialogVisible = false
              this.$message.success(response.msg)
              this.form = {
                downBoxValueList: [{ value: '' }]
              }
              this.$refs['form'].resetFields()
              this.$emit('refresh')
            }
          } else {
            this.$message.error('请输入必填项')
            return false;
          }
        });

      } finally {
        this.inRequest = false
      }
    },
    async updateExamineeCfg() {
      if (!['4', '5'].includes(this.form.inputMode)) {
        this.form.downBoxValueList = undefined
      }
      if (['4', '5'].includes(this.form.inputMode)) {
        this.form.downBoxValueList = this.form.downBoxValueList.map((item) => item.value)
      }
      try {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.inRequest) return
            this.inRequest = true
            const response = await editExamineeCfg({ ...this.form, projectId: this.projectId, fieldNameEn: '1', promptTextEn: 'please' })
            if (response.code === 200) {
              this.dialogVisible = false
              this.$message.success(response.msg)
              this.form = {
                downBoxValueList: [{ value: '' }]
              }
              this.$refs['form'].resetFields()
              this.$emit('refresh')
            }
          } else {
            this.$message.error('请输入必填项')
            return false;
          }
        });
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
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>

<style scoped>

</style>
