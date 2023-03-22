<!-- 全局评估病例报告表 -->
<template>
  <div class="app-container">
    <h1>全局评估病例报告表</h1>

    <div class="info-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>中心: {{ reportData.centerNo }}</el-breadcrumb-item>
        <el-breadcrumb-item>受试者: {{ reportData.examineeNo }}</el-breadcrumb-item>
        <el-breadcrumb-item>评估标注: {{ reportData.standardList }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-divider />

    <el-form>
      <div class="section" style="text-align: center">疗效评估</div>
      <el-table
        :data="visitList"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column label="访视">
          <template slot-scope="scope">
            {{ scope.row.visitName }}【eICRF】【阅片】【<FlieList btnType="text" />】
          </template>
        </el-table-column>
        <el-table-column prop="curativeEffect" label="访视疗效评估" />
        <el-table-column :render-header="renderAgreeHeader">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.isAgree"
              :disabled="reportData.isCanSubmitReport === 0"
              placeholder="请选择"
              @change="handleSelect(scope.row.isAgree, scope.$index)"
            >
              <el-option label="是" value="是" />
              <el-option label="否" value="否" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :render-header="renderGlobalEvaluationHeader">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.isFirstVisit === 1"
              v-model="scope.row.globalCurativeEffect"
              :disabled="reportData.isCanSubmitReport === 0"
              placeholder="请选择"
            >
              <el-option
                label="基线期存在疾病"
                value="基线期存在疾病"
              />
              <el-option
                label="基线期不存在疾病"
                value="基线期不存在疾病"
              />
            </el-select>
            <el-select
              v-if="scope.row.isFirstVisit === 0"
              v-model="scope.row.globalCurativeEffect"
              :disabled="reportData.isCanSubmitReport === 0"
              placeholder="请选择"
            >
              <el-option
                v-for="item in curativeEffectStatusList"
                :key="item.id"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="全局备注">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remarks"
              :disabled="reportData.isCanSubmitReport === 0"
            />
          </template>
        </el-table-column>
      </el-table>

      <div class="section" style="text-align: center">受试者备注</div>
      <el-form-item>
        <el-input
          v-model="examineeRemarks"
          :disabled="reportData.isCanSubmitReport === 0"
          type="textarea"
          :rows="2"
          style="width: 100%"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <Sign
      :is-show="reportData.isCanSubmitReport === 1"
      :is-valid-pass="isValidPass"
      :show-sign="reportData.isCanSubmitReport === 0"
      :autograph-date="reportData.autographDate"
      @checkData="checkData"
      @submit="sumbitAll"
    />
  </div>
</template>

<script>
import {
  getGlobalReport,
  getCurativeEffectStatusList,
  setGlobalReport
} from '@/api/assess/task'
import Sign from '../../components/Sign'
import FlieList from "./FlieList.vue";
export default {
  components: { Sign, FlieList },
  data() {
    return {
      loading: false,
      assessJobId: this.$route.query.assessJobId,
      reportData: {},
      visitList: [],
      examineeRemarks: null,
      inRequest: false,
      curativeEffectStatusList: [],
      isValidPass: false
    }
  },
  created() {
    this.queryGlobalReport()
    this.queryCurativeEffectStatusList()
  },
  methods: {
    renderAgreeHeader(h, { column, $index }) {
      return (
        <div>
          <span style='color: red; margin-right: 5px;'>*</span>
          <span>是否同意</span>
        </div>
      )
    },
    renderGlobalEvaluationHeader(h, { column, $index }) {
      return (
        <div>
          <span style='color: red; margin-right: 5px;'>*</span>
          <span>全局疗效评估</span>
        </div>
      )
    },
    handleSelect(value, index) {
      if (value === '是') {
        this.visitList[index].globalCurativeEffect = this.visitList[index].curativeEffect
      }
    },
    async queryGlobalReport() {
      try {
        if (this.loading) return
        this.loading = true
        const response = await getGlobalReport({
          assessJobId: this.assessJobId
        })
        if (response.code === 200) {
          this.reportData = response.data
          const { visitList, examineeRemarks } =
                        response.data.resultInfo
          this.visitList = visitList
          this.examineeRemarks = examineeRemarks
        }
      } finally {
        this.loading = false
      }
    },
    async queryCurativeEffectStatusList() {
      try {
        if (this.inRequest) return
        this.inRequest = true
        const response = await getCurativeEffectStatusList()
        if (response.code === 200) {
          this.curativeEffectStatusList = response.data[3].childList
        }
      } finally {
        this.inRequest = false
      }
    },
    checkData() {
      for (let i = 0; i < this.visitList.length; i++) {
        if ([undefined, null, ''].includes(this.visitList[i].globalCurativeEffect)) {
          this.$message.warning('请选择全局疗效评估')
          this.isValidPass = false
          return
        }
        if ([undefined, null, ''].includes(this.visitList[i].isAgree)) {
          this.$message.warning('请选择是否同意')
          this.isValidPass = false
          return
        }
        if (this.visitList[i].isAgree === '否' && [undefined, null, ''].includes(this.visitList[i].remarks)) {
          this.$message.warning('请输入全局备注')
          this.isValidPass = false
          return
        }
        this.isValidPass = true
      }
    },
    async sumbitAll() {
      try {
        if (this.inRequest) return
        this.inRequest = true
        const response = await setGlobalReport({
          assessJobId: this.assessJobId,
          resultInfo: {
            examineeRemarks: this.examineeRemarks,
            visitList: this.visitList
          }
        })
        if (response.code === 200) {
          this.$message.success(response.msg)
          this.queryGlobalReport()
        }
      } finally {
        this.inRequest = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #d7d7d7;
    padding: 10px;
    font-weight: bold;

    .el-form-item:last-of-type {
        margin-bottom: 0;
    }
}
</style>
