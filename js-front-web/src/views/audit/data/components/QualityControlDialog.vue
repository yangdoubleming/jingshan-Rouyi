<template>
  <div>
    <el-button size="mini" type="text" @click="visible = true">
      {{ buttonName }}</el-button>
    <el-dialog :visible.sync="visible" width="1000px" :close-on-click-modal="false" append-to-body>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size: large">访视详情</span>
        </div>
        <el-descriptions class="margin-top" title="" :column="3" border>
          <el-descriptions-item>
            <template slot="label"> 中心编号： </template>
            {{ visitDetails.centerNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 受试者编号： </template>
            {{ visitDetails.examineeNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 受试者随机编号 </template>
            {{ visitDetails.randomNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 访视名称： </template>
            {{ visitDetails.visitName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 计划访视日期： </template>
            {{ visitDetails.planVisitDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 首次检查日期 </template>
            {{ visitDetails.actualVisitDate }} <i class="el-icon-edit" style="color:#1890ff;cursor: pointer;"
              @click="showTimeDialog = true"></i>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 完成上传视时间： </template>
            {{ visitDetails.completeUploadTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 状态： </template>
            {{ visitDetails.examineStatus }}
          </el-descriptions-item>
          <el-descriptions-item v-if="drugTimes > 0">
            <template slot="label"> 累计给药次数： </template>
            {{ drugTimes }}
          </el-descriptions-item>
          <el-descriptions-item v-if="drugWeeks > 0">
            <template slot="label"> 距首次给药后周数： </template>
            {{ drugWeeks }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 备注： </template>
            {{ remarkDetails }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <!-- 上传详情,数据描述 -->
      <upload-details :visitId="visitId" :examineId="examineId" :buttonName="buttonName" />
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="position: relative">
          <div>
            <span style="font-size: large">人工审核</span>
            <el-button v-if="buttonName === '质控' && isUrgent=='0'" style="margin: 0 10px" type="danger" size="small" @click="setUrgency">
              设置加急
            </el-button>
            <el-button v-if="buttonName === '质控' && isUrgent=='1'" style="margin: 0 10px" type="danger" size="small" @click="cancelUrgency">
              取消加急
            </el-button>
          </div>
          <el-row class="button-group">
            <SendQuestionDialog v-if="visitDetails.isCanQuestion === 1" :visit-id="visitId" />
            <QuestionDetailDialog v-if="visitDetails.isCanQueryQuestion === 1" :visitId="visitId" :answerType="examineAuditType" />
            <QualityRecordDialog :visitId="visitId" :examineAuditType="examineAuditType"/>
          </el-row>
        </div>
        <el-table :data="manualAuditList" style="width: 100%">
          <el-table-column prop="content" label="质控问题" />
          <el-table-column label="质控结果" width="280">
            <template slot-scope="scope">
              <el-radio-group :disabled="buttonName !== '质控'" v-model="scope.row.chooseValue"
                v-if="scope.row.cfgType == '1'">
                <el-radio v-for="(item, index) in scope.row.optionList" :key="index" :label="item"></el-radio>
              </el-radio-group>
              <el-input v-else v-model="scope.row.configContent" :readonly="buttonName !== '质控'"
                placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="remark">
          <el-col :span="6">备注：</el-col>
          <el-col :span="18"><el-input v-model="remark" :readonly="buttonName !== '质控'"
              placeholder="请输入备注"></el-input></el-col>
        </el-row>
      </el-card>
      <div slot="footer" class="dialog-footer" v-if="buttonName === '质控'">
        <el-button type="danger" @click="operateTips('2')">不通过</el-button>
        <el-button type="primary" @click="operateTips('1')">通过</el-button>
      </div>
    </el-dialog>
    <!-- 修改首次检查日期弹窗 -->
    <el-dialog title="修改首次检查日期" :visible.sync="showTimeDialog" width="30%">
      修改首次检查日期：<el-date-picker v-model="actualVisitDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showTimeDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitDate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamineVisitDetails,
  dataExamineCancelExpedited,
  getVisitOtherListNew,
  dataExamineExpedited,
  dataManualAudit,
  oneQualityControlAudit,
  getUpdateActualVisitDate
} from "@/api/audit/data";
import { getVisitDicomList, visitDetails } from "@/api/image/tester";
import UploadDetails from "./UploadDetails/index.vue";
import QualityRecordDialog from "./QualityRecordDialog.vue";
import SendQuestionDialog from "./SendQuestionDialog.vue";
import QuestionDetailDialog from "./QuestionDetailDialog.vue";
export default {
  props: ["visitId", "buttonName", "examineId", "examineAuditType"],
  components: {
    UploadDetails,
    QuestionDetailDialog,
    QualityRecordDialog,
    SendQuestionDialog,
  },
  data() {
    return {
      visible: false,
      inRequest: false,
      showTimeDialog: false,
      visitDetails: {},
      activeName: "dicom",
      visitRequest: false,
      remark: "",
      visitDicomList: [],
      visitOtherList: [],
      manualAuditList: [],
      jsQualityControlAudits: [],
      drugWeeks: 0,
      drugTimes: 0,
      actualVisitDate: '',
      isUrgent:'0',
      remarkDetails:''
    };
  },
  watch: {
    visible: function (newVisible, oldVisible) {
      if (newVisible) {
        this.getVisitDetails(this.visitId)
        this.getDataManualAudit();
        this.queryExamineVisitDetails();
        if (this.activeName === "dicom") {
          this.queryVisitDicomList();
        }
      }
    },
  },
  provide() {
    return {
      queryExamineVisitDetails: this.queryExamineVisitDetails,
    };
  },
  methods: {
    // 获取顶部给药次数
    getVisitDetails(visitId) {
      visitDetails(visitId).then((res) => {
        this.isUrgent = res.data.isUrgent
        if (res.data.infos && res.data.infos.length > 0) {
          res.data.infos.forEach((item) => {
            if (item.cfgFieldNameCn === '累计给药次数') {
              this.drugTimes = Number(item.value) || 0
            }
            if (item.cfgFieldNameCn === '距上次给药后周数') {
              this.drugWeeks = Number(item.value) || 0
            }
            if (item.cfgFieldNameCn === '备注') {
              this.remarkDetails = item.value || 0
            }
          })
        }
      })
    },
    async submitDate() {
      const res = await getUpdateActualVisitDate({
        visitId: this.visitId,
        actualVisitDate: this.actualVisitDate
      });
      if (res.code === 200) {
        this.showTimeDialog = false
        this.$message.success(res.msg)
        this.queryExamineVisitDetails()
      }
    },
    async queryExamineVisitDetails() {
      if (this.inRequest) return;
      this.inRequest = true;
      const response = await getExamineVisitDetails({
        visitId: this.visitId,
        examineAuditType: this.examineAuditType
      });
      this.inRequest = false;
      if (response.code === 200) {
        this.visitDetails = response.data;
        this.examineAuditType=='2'? this.remark = this.visitDetails.twoExamineRemark:this.remark = this.visitDetails.oneExamineRemark
      }
    },
    async queryVisitDicomList() {
      try {
        if (this.visitRequest) return;
        this.visitRequest = true;
        const response = await getVisitDicomList({
          visitId: this.visitId,
        });
        if (response.code === 200) {
          this.visitDicomList = response.data;
        }
      } finally {
        this.visitRequest = false;
      }
    },
    async queryVisitOtherList() {
      try {
        if (this.visitRequest) return;
        this.visitRequest = true;
        const response = await getVisitOtherListNew({
          visitId: this.visitId,
        });
        if (response.code === 200) {
          this.visitOtherList = response.data.filter(
            (item) => item.type === this.activeName
          );
        }
      } finally {
        this.visitRequest = false;
      }
    },
    // 通过不通过确认
    operateTips(status) {
      let title = status === '2' ? '质控不通过' : '质控通过'
      let des = status === '2' ? '此访视质控不通过，退回CRC重新提交数据' : '请确认此访视质控通过？'
      this.$alert(des, title, {
        confirmButtonText: '确定',
        callback: action => {
          if (action == 'confirm') {
            this.updateExamineVisitStatus(status)
          }
        }
      });
    },
    async updateExamineVisitStatus(status) {
      this.jsQualityControlAudits = this.manualAuditList.map((item) => {
        if (item.cfgType == '1') {
          for (let key in item.configContent) {
            if (key == item.chooseValue) {
              item.configContent[key] = true;
              item.have = true
            } else {
              item.configContent[key] = false;
            }
          }
        }
        return {
          have:item.have || false,
          id: item.id,
          type: item.cfgType,
          configContent: item.configContent,
        };
      });
      try {
        // 判断首次检查日期是否为空
        if(!this.visitDetails.actualVisitDate){
          return this.$message.warning('访视详情-首次检查日期不能为空')
        }
        // 判断必填选是否选择
        let checkStatus = false
        this.jsQualityControlAudits.forEach(ele=>{
          if(ele.have){
            checkStatus = true
          }
        })
        if(!checkStatus){
          return this.$message.warning('所有质控问题，都必须选择质控结果！')
        }
        if (this.visitRequest) return;
        this.visitRequest = true;
        const response = await oneQualityControlAudit({
          visitId: this.visitId,
          remark: this.remark,
          status,
          jsQualityControlAudits: this.jsQualityControlAudits,
        });
        if (response.code === 200) {
          this.$message.success(response.msg);
          this.visible = false;
          this.$emit("refresh");
        }
      } finally {
        this.visitRequest = false;
      }
    },
    // 设置加急
    setUrgency() {
      this.$confirm("确定将此访视设置为加急数据？", "设置为加急数据", {
        confirmButtonText: "确定",
        type: "warning",
        showCancelButton: false,
      })
        .then(async () => {
          if (this.inRequest) return;
          this.inRequest = true;
          const response = await dataExamineExpedited({
            id: this.visitId,
          });
          this.inRequest = false;
          if (response.code === 200) {
            this.getVisitDetails(this.visitId)
            this.$message({
              type: "success",
              message: response.msg,
            });
          }
        })
        .catch(() => { });
    },
    // 取消加急
    cancelUrgency(){
      this.$confirm("确定取消数据加急？", "取消数据加急", {
        confirmButtonText: "确定",
        type: "warning",
        showCancelButton: false,
      })
        .then(async () => {
          if (this.inRequest) return;
          this.inRequest = true;
          const response = await dataExamineCancelExpedited({
            id: this.visitId,
          });
          this.inRequest = false;
          if (response.code === 200) {
            this.getVisitDetails(this.visitId)
            this.$message({
              type: "success",
              message: response.msg,
            });
          }
        })
        .catch(() => { });
    },
    async getDataManualAudit() {
      const response = await dataManualAudit({
        projectId: JSON.parse(localStorage.getItem("chooseProject")).id,
        visitId:this.visitId,
        examineAuditType:this.examineAuditType
      });
      if (response.code === 200) {
        if (response.data && response.data.length > 0) {
          response.data.forEach((item) => {
            if (item.cfgType == '1') {  // 单选框
              if (item.configContent) {
                item.configContent = JSON.parse(item.configContent);
                let data = item.configContent;
                item.optionList = [];
                for (let key in data) {
                  item.optionList.push(key);
                  if (data[key]) {
                    item.chooseValue = key;
                  }
                }
              }
            } else {  // 文本框

            }

          });
        }
        this.manualAuditList = response.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button-group {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  width: 300px;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.remark {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 50px;
}
</style>
