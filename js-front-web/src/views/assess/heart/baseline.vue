<template>
  <div v-loading="loading" class="app-container">
    <!--        <div style="display:flex;align-items:center;justify-content:space-between;margin: 30px;">-->
    <!--            <el-image>-->
    <!--                <div slot="error" class="image-slot">-->
    <!--                    <i class="el-icon-picture-outline"></i>-->
    <!--                </div>-->
    <!--            </el-image>-->
    <!--            <div style="text-align:center;font-size: 16px;font-weight: bold;">-->
    <!--                <div>【客户公司名称】 【方案编号】</div>-->
    <!--                <div>景杉科技 【项目编号】</div>-->
    <!--            </div>-->
    <!--            <el-image :src="logoImg" style="height:30px;">-->
    <!--                <div slot="error" class="image-slot">-->
    <!--                    <i class="el-icon-picture-outline"></i>-->
    <!--                </div>-->
    <!--            </el-image>-->
    <!--        </div>-->
    <div
      style="
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin: 15px;
            "
    >
      心脏毒性基线期评估病例报告
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>受试者编号：{{ $route.query.examineeNo }}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="dialogVisible1 = true"
        >查看文件</el-button>
      </div>
      <div style="text-align: center; margin-bottom: 10px">
        心脏毒性判定信息列表
      </div>
      <el-descriptions
        class="margin-top"
        :column="1"
        size="medium"
        border
      >
        <el-descriptions-item>
          <template slot="label"> *临床病历是否已审阅 </template>
          <div>
            <el-radio
              v-model="baselineForm.isReviewedCc"
              label="1"
              :disabled="isReadonly"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedCc"
              label="0"
              :disabled="isReadonly"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedCc"
              label="2"
              :disabled="isReadonly"
            >未提供</el-radio>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *实验室化验单是否已审阅 </template>
          <div>
            <el-radio
              v-model="baselineForm.isReviewedLts"
              label="1"
              :disabled="isReadonly"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedLts"
              label="0"
              :disabled="isReadonly"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedLts"
              label="2"
              :disabled="isReadonly"
            >未提供</el-radio>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *心电图是否已审阅 </template>
          <div>
            <el-radio
              v-model="baselineForm.isReviewedEcg"
              label="1"
              :disabled="isReadonly"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedEcg"
              label="0"
              :disabled="isReadonly"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedEcg"
              label="2"
              :disabled="isReadonly"
            >未提供</el-radio>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *24小时心电图是否已审阅 </template>
          <div>
            <el-radio
              v-model="baselineForm.isReviewedTwentyfourHourEcg"
              label="1"
              :disabled="isReadonly"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedTwentyfourHourEcg"
              label="0"
              :disabled="isReadonly"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedTwentyfourHourEcg"
              label="2"
              :disabled="isReadonly"
            >未提供</el-radio>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *心脏超声报告是否已审阅 </template>
          <div>
            <el-radio
              v-model="baselineForm.isReviewedCur"
              label="1"
              :disabled="isReadonly"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedCur"
              label="0"
              :disabled="isReadonly"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedCur"
              label="2"
              :disabled="isReadonly"
            >未提供</el-radio>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <div style="text-align: center; margin: 10px">判定结论</div>
      <el-descriptions
        class="margin-top"
        :column="1"
        size="medium"
        border
      >
        <el-descriptions-item>
          <template slot="label"> *方案规定心脏入组标准 </template>
          <div>
            <el-checkbox
              v-model="baselineForm.info.sdhEnrolledCriteria.lvef"
              :disabled="isReadonly || other1Disabled"
              @change="setOther"
            >左室射血分数（LVEF）≥55%（双平面 Simpson
              法测量）；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.sdhEnrolledCriteria.ntProbnp
              "
              :disabled="isReadonly || other1Disabled"
              @change="setOther"
            >NT-proBNP＜年龄界限值；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.sdhEnrolledCriteria.tiwtnr
              "
              :disabled="isReadonly || other1Disabled"
              @change="setOther"
            >肌钙蛋白在正常值范围内；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.sdhEnrolledCriteria.qtcf"
              :disabled="isReadonly || other1Disabled"
              @change="setOther"
            >12 导联心电图：无严重心律失常，QTcF
              ≤480ms；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.sdhEnrolledCriteria.nothing"
              :disabled="isReadonly || nothing1Disabled"
              @change="setNothing"
            >无</el-checkbox><br>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *方案规定心脏排除标准 </template>
          <div>
            <el-checkbox
              v-model="baselineForm.info.sdhExcludeCriteria.pmiCh"
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >
              既往发生过心肌梗死、脑出血；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.sdhExcludeCriteria.avt"
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >
              首次给药前 6
              个月内发生过动/静脉血栓事件且未经正规治疗者，<br>如脑血管意外（包括暂时性缺血性发作）、深静脉血栓及肺栓塞者；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.sdhExcludeCriteria.scCd"
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >首次给药前 6
              个月内发生严重的心脑血管疾病，如急性冠脉综合征、充血性心力衰竭（美国纽约心脏病协会[NYHA]心功能分级Ⅱ-Ⅳ级）、<br>
              缺血性脑卒中（腔隙性脑梗塞除外）、主动脉夹层等；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.sdhExcludeCriteria.hbcc"
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >临床无法控制的高血压（即收缩压≥160
              mmHg，和/或舒张压≥100 mmHg）；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.sdhExcludeCriteria.sciEcg
              "
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >静息心电图或动态心电图提示的严重心律失常或形态学改变，如频发室性早搏(24
              小时动态心电图室早负荷≥10%)、室性心动过速、<br>
              II-III
              度房室传导阻滞、病态窦房结综合征等；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.sdhExcludeCriteria.firQtc
              "
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >任何增加 QTc
              延长风险或心律失常风险的因素，如心衰、低钾血症、先天性长
              QT 综合征、长 QT 综合征家族史，<br>
              或 一级亲属中有小于 40
              岁发生无法解释的猝死，或使用任何已知可延长 QT
              间期的伴随药物；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.sdhExcludeCriteria.nothing
              "
              :disabled="isReadonly || nothing2Disabled"
              @change="setNothing2"
            >无</el-checkbox><br>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *判定结论 </template>
          <div>
            <el-radio
              v-model="baselineForm.judgmentConclusion"
              :disabled="isReadonly"
              label="1"
            >根据方案规定的心脏功能相关入排标准，符合入组条件</el-radio><br>
            <el-radio
              v-model="baselineForm.judgmentConclusion"
              :disabled="isReadonly"
              label="0"
            >根据方案规定的心脏功能相关入排标准，不符合入组条件</el-radio>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 备注 </template>
          <div>
            <el-input
              v-model="baselineForm.comment"
              :readonly="isReadonly"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item v-show="baselineForm.status == '1'">
          <template slot="label"> 判定日期 </template>
          <div>
            {{ baselineForm.autographDate?baselineForm.autographDate.slice(0,10):'' }}
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <div
        v-show="baselineForm.status != '1'"
        style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 30px;
                    font-size: 14px;
                    color: #606266;
                "
      >
        在此处签字表明，在您的经验和知识范围内，以上判断准确无误：
        <el-button type="primary" @click="submit">完成提交</el-button>
      </div>
      <div
        v-show="baselineForm.status == '1'"
        style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                "
      >
        <div>
          <el-descriptions style="width: 400px">
            <el-descriptions-item label="签名">{{
              baselineForm.autographUser
            }}</el-descriptions-item>
            <el-descriptions-item label="签名时间">{{
              baselineForm.createTime
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <el-tag
          type="danger"
          size="medium"
          effect="plain"
          style="
                        margin: 15px 0;
                        width: 120px;
                        height: 40px;
                        text-align: center;
                        font-size: 16px;
                        line-height: 40px;
                    "
        >已评估</el-tag>
      </div>
    </el-card>

    <el-card
      class="box-card"
      style="margin: 30px 0"
      shadow="never"
      :close-on-click-modal="false"
    >
      <div slot="header" class="clearfix">
        <span>方案规定的心脏功能相关入、排标准</span>
      </div>
      <div style="font-size: 14px; color: #606266">
        <div>入组标准：</div>
        <div>
          ① 超声心动图：左室射血分数（LVEF）≥55%（双平面 Simpson
          法测量）；<br>
          ② NT-proBNP＜年龄界限值；<br>
          ③ 肌钙蛋白在正常值范围内；<br>
          ④ 12 导联心电图：无严重心律失常，QTcF ≤480ms；<br><br>

          排除标准：<br>
          ① 既往发生过心肌梗死、脑出血；<br>
          ② 首次给药前 6
          个月内发生过动/静脉血栓事件且未经正规治疗者，如脑血管意外（包括暂时性缺血性发作）、深静脉血栓及肺栓塞者；<br>
          ③ 首次给药前 6
          个月内发生严重的心脑血管疾病，如急性冠脉综合征、充血性心力衰竭（美国纽约心脏病协会[NYHA]心功能分级Ⅱ-Ⅳ级）、缺血性脑卒中（腔隙性脑梗塞除外）、主动脉夹层等；<br>
          ④ 临床无法控制的高血压（即收缩压≥160 mmHg，和/或舒张压≥100
          mmHg）；<br>
          ⑤
          静息心电图或动态心电图提示的严重心律失常或形态学改变，如频发室性早搏(24
          小时动态心电图室早负荷≥10%)、室性心动过速、II-III
          度房室传导阻滞、病态窦房结综合征等；<br>
          ⑥ 任何增加 QTc
          延长风险或心律失常风险的因素，如心衰、低钾血症、先天性长 QT
          综合征、长 QT 综合征家族史，或一级亲属中有小于 40
          岁发生无法解释的猝死，或使用任何已知可延长 QT
          间期的伴随药物；<br>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="文件列表"
      :visible.sync="dialogVisible1"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in visitList"
          :key="index"
          :label="item.name"
          :name="String(item.id)"
        >
          <el-table
            :data="tableData"
            style="width: 100%"
            header-align="center"
          >
            <el-table-column
              prop="fileName"
              label="文件名称"
              width=""
              align="center"
            />
            <el-table-column
              prop="name"
              label="操作"
              width=""
              align="center"
            >
              <template slot-scope="scope">
                <a
                  target="_blank"
                  :href="scope.row.storageUrl"
                  style="color: #1890ff"
                >查看</a>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog
      v-loading="loading"
      title="✔完成提交"
      :visible.sync="dialogVisible2"
      width="30%"
      :close-on-click-modal="false"
    >
      <div style="font-size: 16px; color: black; font-weight: bold">
        签名声明：
      </div>
      <div style="margin: 10px 0; color: #606266; font-size: 14px">
        本人确认，此病例报告表是由我完成的，在我的经验和知识范围内，我已尽可能的确保评估报告的准确性和完整性。通过输入本人的用户密码，并单击【签名】按钮，完成本人电子签名，与本人手写签名具有同等的法律约束力。
      </div>
      <div>账户： {{ $store.state.user.name }}</div>
      <div
        style="
                    display: flex;
                    align-items: center;
                    justify-content: start;
                    margin: 10px 0;
                "
      >
        <div style="width: 45px">密码：</div>
        <el-input
          v-model="signForm.password"
          style="width: 200px"
          type="password"
          placeholder="请输入内容"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitSignForm"
        >签 名</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import logoImg from '@/assets/logo/logow.png'
import {
  independentSubmit,
  autograph,
  jobIndependentInfo,
  jobIndependentDetails,
  getVisitOtherDetailList,
  visitList,
  assessmenting
} from '@/api/assess/task'

export default {
  name: 'Post',
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: false,
      activeName: '',
      checkList: [],
      radio: '',
      textarea: '',
      logoImg,
      dialogVisible1: false,
      dialogVisible2: false,
      input: '',
      signForm: {
        username: this.$store.state.user.name,
        password: ''
      },
      baselineForm: {
        assessJobId: this.$route.query.assessJobId, // 评估任务id
        standard: this.$route.query.standardList, // 评估标准
        isReviewedCc: '', // 临床病历是否已审阅（0-否 1-是 2-未提供）
        isReviewedLts: '', // 实验室化验单是否已审阅（0-否 1-是 2-未提供）
        isReviewedEcg: '', // 心电图是否已审阅（0-否 1-是 2-未提供）
        isReviewedTwentyfourHourEcg: '', // 24小时心电图是否已审阅（0-否 1-是 2-未提供）
        isReviewedCur: '', // 心脏超声报告是否已审阅（0-否 1-是 2-未提供）
        judgmentConclusion: '', // 判定结论（0-否 1-是（
        comment: '', // 备注
        status: '',
        judgmentDate: this.parseTime(new Date()), // 判断日期
        info: {
          sdhEnrolledCriteria: {
            lvef: false,
            ntProbnp: false,
            tiwtnr: false,
            qtcf: false,
            nothing: false
          },
          sdhExcludeCriteria: {
            pmiCh: false,
            avt: false,
            scCd: false,
            hbcc: false,
            sciEcg: false,
            firQtc: false,
            nothing: false
          }
        }
      },
      isReadonly: false,
      tableData: [],
      pageInfo: {},
      pageDetails: {},
      visitList: [],
      nothing1Disabled: false,
      other1Disabled: false,
      nothing2Disabled: false,
      other2Disabled: false
    }
  },
  created() {
      this.jobIndependentInfo()
  },
  methods: {
    // 待评估设置为评估中
    postAssessmenting() {
      assessmenting({ assessJobId: this.$route.query.assessJobId })
    },
    // 第一个无
    setOther(value) {
      if (value) {
        // true进来
        this.nothing1Disabled = true
      } else {
        // false进来
        this.nothing1Disabled = false
        const data = this.baselineForm.info.sdhEnrolledCriteria
        for (const key in data) {
          if (data[key]) {
            this.nothing1Disabled = true
          }
        }
      }
    },
    setNothing(value) {
      if (value) {
        // true进来
        this.other1Disabled = true
      } else {
        // false进来
        this.other1Disabled = false
      }
    },
    // 第二个无
    setOther2(value) {
      if (value) {
        // true进来
        this.nothing2Disabled = true
      } else {
        // false进来
        this.nothing2Disabled = false
        const data = this.baselineForm.info.sdhExcludeCriteria
        for (const key in data) {
          if (data[key]) {
            this.nothing2Disabled = true
          }
        }
      }
    },
    setNothing2(value) {
      if (value) {
        // true进来
        this.other2Disabled = true
      } else {
        // false进来
        this.other2Disabled = false
      }
    },
    // 文件列表切换tab
    handleClick(v, e) {
      this.getVisitOtherDetailList({
        examineeId: this.$route.query.examineeId,
        visitId: v.name,
        visitFile: '2'
      })
    },
    // 获取心脏毒性评估页面文件列表
    getVisitOtherDetailList(obj) {
      getVisitOtherDetailList(obj).then((res) => {
        this.tableData = res.data
      })
    },
    // 独立评估任务id获取详情
    jobIndependentInfo() {
      jobIndependentInfo(this.$route.query.assessJobId).then((res) => {
        this.pageInfo = res.data
        // 获取访视列表
        this._getVisitListByExamineeId()
        // 获取详情回显
        this.jobIndependentDetails()
        if(res.data.status==="0"||res.data.status==="2"){
          this.postAssessmenting();
        }
      })
    },
    // 独立评估任务id获取详情
    jobIndependentDetails() {
      this.loading = true
      jobIndependentDetails(this.$route.query.assessJobId).then((res) => {
        if (res && res.data && res.data.info) {
          for (const k in res.data.info.sdhEnrolledCriteria) {
            if (res.data.info.sdhEnrolledCriteria[k] === '1') {
              res.data.info.sdhEnrolledCriteria[k] = true
            } else {
              res.data.info.sdhEnrolledCriteria[k] = false
            }
          }
          for (const k in res.data.info.sdhExcludeCriteria) {
            if (res.data.info.sdhExcludeCriteria[k] === '1') {
              res.data.info.sdhExcludeCriteria[k] = true
            } else {
              res.data.info.sdhExcludeCriteria[k] = false
            }
          }
        }
        this.baselineForm = Object.assign(this.baselineForm, res.data)
        this.isReadonly = this.baselineForm.status === '1'
        this.loading = false
      })
    },

    // 完成提交
    submit() {
      if (!this.baselineForm.isReviewedCc) {
        return this.$message.warning('请选择临床病历是否已审阅')
      }
      if (!this.baselineForm.isReviewedLts) {
        return this.$message.warning('请选择实验室化验单是否已审阅')
      }
      if (!this.baselineForm.isReviewedEcg) {
        return this.$message.warning('请选择心电图是否已审阅')
      }
      if (!this.baselineForm.isReviewedTwentyfourHourEcg) {
        return this.$message.warning('请选择24小时心电图是否已审阅')
      }
      if (!this.baselineForm.isReviewedCur) {
        return this.$message.warning('请选择心脏超声报告是否已审阅')
      }
      if (!this.baselineForm.judgmentConclusion) {
        return this.$message.warning('请选择判定结论')
      }
      if (
        this.baselineForm.comment &&
                this.baselineForm.comment.length > 200
      ) {
        return this.$message.warning('备注不能超过200个字符')
      }
        let sdhEnrolledCriteriaStatus = false
        for (const key in this.baselineForm.info.sdhEnrolledCriteria) {
          if (this.baselineForm.info.sdhEnrolledCriteria[key]) {
            sdhEnrolledCriteriaStatus = true
          }
        }

        let sdhExcludeCriteriaStatus = false
        for (const key in this.baselineForm.info.sdhExcludeCriteria) {
          if (this.baselineForm.info.sdhExcludeCriteria[key]) {
            sdhExcludeCriteriaStatus = true
          }
        }
       //temporary solutions: add by jing for set (sdhEnrolledCriteriaStatus and sdhExcludeCriteriaStatus) to not required
      if (!sdhEnrolledCriteriaStatus) {
        return this.$message.warning("方案规定心脏入组标准至少选择一项");
      }

      //temporary solutions: add by jing for set (sdhEnrolledCriteriaStatus and sdhExcludeCriteriaStatus) to not required
      if (!sdhExcludeCriteriaStatus) {
        return this.$message.warning("方案规定心脏排除标准至少选择一项");
      }
      this.dialogVisible2 = true
    },
    // 签名
    async submitSignForm() {
      if (!this.signForm.password) {
        this.$message.warning('请输入密码')
        return
      }
      try {
        this.loading = true
        const response = await autograph(this.signForm)
        if (response.code === 200) {
          this.submitAll()
        }
      } finally {
        this.loading = false
      }
    },
    // 提交数据
    submitAll() {
      for (const k in this.baselineForm.info.sdhEnrolledCriteria) {
        if (this.baselineForm.info.sdhEnrolledCriteria[k]) {
          this.baselineForm.info.sdhEnrolledCriteria[k] = '1'
        } else {
          this.baselineForm.info.sdhEnrolledCriteria[k] = '0'
        }
      }

      for (const k in this.baselineForm.info.sdhExcludeCriteria) {
        if (this.baselineForm.info.sdhExcludeCriteria[k]) {
          this.baselineForm.info.sdhExcludeCriteria[k] = '1'
        } else {
          this.baselineForm.info.sdhExcludeCriteria[k] = '0'
        }
      }
      this.baselineForm.judgmentConclusion === '1'
        ? (this.baselineForm.judgmentConclusionContent =
                      '根据方案规定的心脏功能相关入排标准，符合入组条件')
        : (this.baselineForm.judgmentConclusionContent =
                      '根据方案规定的心脏功能相关入排标准，不符合入组条件')
      independentSubmit(this.baselineForm).then((res) => {
        this.jobIndependentInfo()
        this.jobIndependentDetails()
        this.loading = false
        this.dialogVisible2 = false
        this.$modal.msgSuccess('评估成功')
      })
    },
    isReadonlyMethod() {
      return this.baselineForm.status === '1'
    },
    // 获取访视列表
    _getVisitListByExamineeId() {
      visitList({
        examineeId: Number(this.$route.query.examineeId),
        projectId: JSON.parse(localStorage['chooseProject']).id
      }).then((res) => {
        for(var i=0;i<res.rows.length;i++){
          if(this.pageInfo.visitId===res.rows[i].id){
            this.visitList =  res.rows.slice(0,i+1)
            console.log()
            break;
          }
        }
        if (this.visitList.length > 0) {
          // PDF文件列表-第一个
          this.getVisitOtherDetailList({
            examineeId: this.$route.query.examineeId,
            visitId: this.pageInfo.visitId,
            visitFile: '2'
          })
          this.activeName = String(this.pageInfo.visitId)
        }
      })
    }
  }
}
</script>

<style>
.el-radio__input.is-disabled.is-checked .el-radio__inner {
    border-color: #323e52;
    background: #323e52;
}
.el-radio__input.is-disabled + span.el-radio__label {
    color: #323e52;
}
.el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #323e52;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #323e52;
    border-color: #323e52;
}
.el-checkbox {
    display: flex;
}
.my-label {
    background: red;
}

.my-content {
    background: #fde2e2;
}
</style>
