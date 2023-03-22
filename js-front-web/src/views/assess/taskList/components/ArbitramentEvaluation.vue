<!-- 仲裁评估病例报告表 -->
<template>
  <div class="app-container">
    <h1>仲裁评估病例报告表</h1>

    <div class="info-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>中心: {{ reportData.centerNo }}</el-breadcrumb-item>
        <el-breadcrumb-item>受试者: {{ reportData.examineeNo }}</el-breadcrumb-item>
        <el-breadcrumb-item>评估标注: {{ reportData.standardList }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-divider />

    <el-form>
      <div class="section" style="text-align: center;">全局疗效评估</div>
      <el-table
        :data="reportData.globalVisitList"
        style="width: 100%; margin-bottom: 20px;"
      >
        <el-table-column
          label="访视"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.visitName }} 【eICRF】【阅片】【<FlieList btnType="text" />】
          </template>
        </el-table-column>
        <el-table-column label="IR1">
          <el-table-column
            label="访视疗效评估"
            align="center"
          >
            <template slot-scope="scope">
              <div :class="{ diff: scope.row.curativeEffectIR1 !== scope.row.curativeEffectIR2 }">
                {{ scope.row.curativeEffectIR1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="全局疗效评估"
            align="center"
          />
          <el-table-column
            prop="remarksIR1"
            label="全局备注"
            align="center"
          />
        </el-table-column>
        <el-table-column label="IR2">
          <el-table-column
            label="访视疗效评估"
            align="center"
          >
            <template slot-scope="scope">
              <div :class="{ diff: scope.row.curativeEffectIR1 !== scope.row.curativeEffectIR2 }">
                {{ scope.row.curativeEffectIR2 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="全局疗效评估"
            align="center"
          />
          <el-table-column
            prop="remarksIR2"
            label="全局备注"
            align="center"
          />
        </el-table-column>
      </el-table>

      <el-form-item label="同意评估人结果" required>
        <el-radio-group v-model="agreeType">
          <el-radio :label="1">IR1</el-radio>
          <el-radio :label="2">IR2</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="section" style="text-align: center;">
        <span style="color: red;">*</span> 裁定原因
      </div>
      <el-form-item>
        <el-input v-model="arbitrateRemarks" type="textarea" :rows="2" style="width: 100%;" placeholder="请输入内容" />
      </el-form-item>

      <div class="section" style="text-align: center;overflow: hidden;">
        <div style="float:left;"><FileUpload :limit="9" :file-type="fileType" :title="uploadTitle" @updateFileList="updateFileList" /></div>
        <p>裁定原因附件</p>
      </div>
      <div class="img-sty-box">
        <img v-for="(item,index) in arbitrateFileUrlList" :key="index" :src="item" class="img-sty"/>
      </div>

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
  getGlobalArbitrationReport,
  setGlobalArbitrationReport
} from '@/api/assess/task'
import Sign from '../../components/Sign'
import FileUpload from "@/views/components/FileUpload/commonUpload";
import FlieList from "./FlieList.vue";
export default {
  components: { Sign,FileUpload, FlieList },
  data() {
    return {
      loading: false,
      assessJobId: this.$route.query.assessJobId,
      reportData: {},
      agreeType: undefined,
      arbitrateRemarks: '',
      arbitrateFileUrlList: [],
      isValidPass: false,
      fileType:['jpg','png'],
      uploadTitle:'支持jpg,png格式，最多上传9张'
    }
  },
  created() {
    this.queryGlobalArbitrationReport()
  },
  methods: {
    // 接受上传数据
    updateFileList(fileList){
      this.arbitrateFileUrlList = fileList.map(item=>item.url)
    },
    async queryGlobalArbitrationReport() {
      try {
        if (this.loading) return
        this.loading = true
        const response = await getGlobalArbitrationReport({ assessJobId: this.assessJobId })
        if (response.code === 200) {
          this.reportData = response.data
        }
      } finally {
        this.loading = false
      }
    },
    checkData() {
      if ([undefined, null, ''].includes(this.arbitrateRemarks)) {
        this.$message.warning('请输入裁定原因')
        this.isValidPass = false
        return
      }
      this.isValidPass = true
    },
    async sumbitAll() {
      try {
        if (this.loading) return
        this.loading = true
        const response = await setGlobalArbitrationReport({
          assessJobId: this.assessJobId,
          resultInfo: {
            /** 同意评估人结果：1=IR1，2=IR2 */
            agreeType: this.agreeType,
            /** 裁定原因 */
            arbitrateRemarks: this.arbitrateRemarks,
            /** 裁定原因附件(1-1500个字符) */
            arbitrateFileUrlList: this.arbitrateFileUrlList
          }
        })
        if (response.code === 200) {
          this.$message.success(response.msg)
          this.queryGlobalArbitrationReport()
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.img-sty-box{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.img-sty{
  width: 148px;
  height: 148px;
  margin: 15px;
}
.info-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section {
    position: relative;
    width: 100%;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #d7d7d7;
    padding: 10px;
    font-weight: bold;

    p {
        margin: 0;
    }

    .btn-upload {
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
    }

    .el-form-item:last-of-type {
        margin-bottom: 0;
    }
}

.diff {
  background-color: antiquewhite;
}
</style>
