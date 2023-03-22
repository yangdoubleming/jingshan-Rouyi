<!-- 修改访视者信息 -->
<template>
  <div>
    <el-button v-if="isCanUpdateInfo === 1" :disabled="!id" type="primary" size="small"
      @click="showVisitDialog">修改访视信息</el-button>
    <el-dialog title="修改访视信息" :visible.sync="editVisitDialog" width="500px" :close-on-click-modal="false"
      append-to-body>
      <el-form ref="visitForm" :model="visitForm" label-width="120px">
        <div v-for="item in visitForm" :key="item.id">
          <el-form-item style="display: none">
            <el-input v-model="item.cfgId" type="hidden" />
          </el-form-item>
          <el-form-item :label="item.cfgFieldNameCn" :required="item.cfgIsRequired === '1'">
            <el-input v-if="item.cfgInputMode === '1'" v-model="item.value" placeholder="请输入">
              <template v-if="item.cfgUnit" slot="append">{{ item.cfgUnit }}</template>
            </el-input>
            <el-input v-if="item.cfgInputMode === '2'" v-model="item.value" type="textarea" :rows="2"
              placeholder="请输入内容" />
            <el-input-number v-if="item.cfgInputMode === '3'" v-model="item.value" :precision="item.cfgDecimalPrecision"
              :controls="false">
              <template slot="append">{{ item.cfgUnit }}</template>
            </el-input-number>
            <el-select v-if="item.cfgInputMode === '4'" v-model="item.value" placeholder="请选择">
              <el-option v-for="option in item.cfgDownBoxValue" :key="option" :label="option" :value="option" />
            </el-select>
            <el-select v-if="item.cfgInputMode === '5'" v-model="item.value" multiple placeholder="请选择">
              <el-option v-for="option in item.cfgDownBoxValue" :key="option" :label="option" :value="option" />
            </el-select>
            <el-date-picker v-if="item.cfgInputMode === '6'" v-model="item.value" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="inRequest" type="primary" @click="editVisitInfo">确 定</el-button>
        <el-button @click="editVisitDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { updateCfg } from '@/api/image/tester'
export default {
  props: {
    id: Number,
    isCanUpdateInfo: Number,
    infos: Array
  },
  data() {
    return {
      // 修改访视者信息
      editVisitDialog: false,
      visitForm: [],
      inRequest: false
    }
  },
  methods: {
    showVisitDialog() {
      this.visitForm = _.cloneDeep(this.infos)
      this.editVisitDialog = true
    },
    checkRequiredValue() {
      for (let item of this.visitForm) {
        if (item.cfgIsRequired === '1' && [undefined, null, ''].includes(item.value)) {
          this.$message.error('请输入必填字段')
          return true
        }
      }
      return false
    },
    // 修改访视信息
    async editVisitInfo() {
      const isRequest = this.checkRequiredValue()
      if (isRequest) return
      try {
        if (this.inRequest) return
        this.inRequest = true
        const infos = this.visitForm.map((item) => ({
          cfgId: item.cfgId,
          value: item.value
        }))
        const response = await updateCfg({
          id: this.id,
          infos
        })
        if (response.code === 200) {
          this.editVisitDialog = false
          this.$message.success(response.msg)
          this.$emit('refresh')
        }
      } finally {
        this.inRequest = false
      }

    }
  }
}
</script>

<style scoped>

</style>
