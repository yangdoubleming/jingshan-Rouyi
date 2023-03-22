<template>
  <div class="app-container">
    <!-- <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 30px;
      "
    >
      <el-image>
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div style="text-align: center; font-size: 16px; font-weight: bold">
        <div>【客户公司名称】 【方案编号】</div>
        <div>景杉科技 【项目编号】</div>
      </div>
      <el-image :src="logoImg" style="height: 30px">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </div> -->
    <div
      style="
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin: 15px;
            "
    >
      心脏毒性基线后访视期评估病例报告
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span
          style="display: inline-block"
        >受试者编号：{{ $route.query.examineeNo }}</span>
        <span
          style="display: inline-block; margin: 0 50px"
        >访视名称：{{ pageInfo.visitName }}</span>
        <span
          style="display: inline-block;"
        >累计给药次数：{{ drugTimes }}</span>
        <span
          style="display: inline-block; margin-left: 50px"
        >距上次给药后周数：{{ drugWeeks }}
        </span>
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
              :disabled="isReadonly"
              label="1"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedCc"
              :disabled="isReadonly"
              label="0"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedCc"
              :disabled="isReadonly"
              label="2"
            >未提供</el-radio>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *实验室化验单是否已审阅 </template>
          <div>
            <el-radio
              v-model="baselineForm.isReviewedLts"
              :disabled="isReadonly"
              label="1"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedLts"
              :disabled="isReadonly"
              label="0"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedLts"
              :disabled="isReadonly"
              label="2"
            >未提供</el-radio>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *心电图是否已审阅 </template>
          <div>
            <el-radio
              v-model="baselineForm.isReviewedEcg"
              :disabled="isReadonly"
              label="1"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedEcg"
              :disabled="isReadonly"
              label="0"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedEcg"
              :disabled="isReadonly"
              label="2"
            >未提供</el-radio>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *24小时心电图是否已审阅 </template>
          <div>
            <el-radio
              v-model="baselineForm.isReviewedTwentyfourHourEcg"
              :disabled="isReadonly"
              label="1"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedTwentyfourHourEcg"
              :disabled="isReadonly"
              label="0"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedTwentyfourHourEcg"
              :disabled="isReadonly"
              label="2"
            >未提供</el-radio>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *心脏超声报告是否已审阅 </template>
          <div>
            <el-radio
              v-model="baselineForm.isReviewedCur"
              :disabled="isReadonly"
              label="1"
            >是</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedCur"
              :disabled="isReadonly"
              label="0"
            >否</el-radio>
            <el-radio
              v-model="baselineForm.isReviewedCur"
              :disabled="isReadonly"
              label="2"
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
          <template slot="label">
            *是否发生心脏毒性指标改变
          </template>
          <div>
            <div>
              <el-radio
                v-model="baselineForm.info.isIndicatorChange"
                :disabled="isReadonly"
                label="1"
              >是</el-radio>
              <el-radio
                v-model="baselineForm.info.isIndicatorChange"
                :disabled="isReadonly"
                label="0"
              >否</el-radio>
            </div>
            <div
              style="
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                margin-top: 15px;
                            "
            >
              <span style="width: 60px">备注：</span><el-input
                v-model="baselineForm.info.indicatorChangeNote"
                :readonly="isReadonly"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            *心脏毒性指标（主要安全性终点）判定
          </template>
          <div>
            <el-checkbox
              v-model="baselineForm.info.ctiMainDetermine.lvef"
              :disabled="isReadonly || other1Disabled"
              @change="setOther"
            >左室射血分数（LVEF）较基线值降低>10%且绝对值﹤50%；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.ctiMainDetermine.sochf"
              :disabled="isReadonly || other1Disabled"
              @change="setOther"
            >出现充血性心衰症状(NYHA分级III-IV级)或体征（肺部听诊有啰音或下肢水肿），且伴有NT-proBNP升高（超过年龄界限值）；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.ctiMainDetermine.ami"
              :disabled="isReadonly || other1Disabled"
              @change="setOther"
            >发生急性心肌梗死或有临床意义的急性心肌损伤；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.ctiMainDetermine.nawcs"
              :disabled="isReadonly || other1Disabled"
              @change="setOther"
            >新出现的有临床意义的心律失常；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.ctiMainDetermine.qtcf"
              :disabled="isReadonly || other1Disabled"
              @change="setOther"
            >QTcF>500ms或QTcF较基线值延长>60ms；</el-checkbox><br>
            <el-checkbox
              v-model="baselineForm.info.ctiMainDetermine.nothing"
              :disabled="isReadonly || nothing1Disabled"
              @change="setNothing"
            >无</el-checkbox><br>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            *心脏毒性指标（次要安全性终点）判定
          </template>
          <div>
            <el-checkbox
              v-model="
                baselineForm.info.ctiSecondaryDetermine
                  .lvefReduce
              "
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >
              左室射血分数（LVEF）较基线值降低﹤10%，但LVEF绝对值﹤0%，或LVEF绝对值≥50%，但较基线值降低>10%（绝对百分点）；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.ctiSecondaryDetermine.ntPro
              "
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >
              NT-pro
              BNP较基线显著升高，超过年龄界限值；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.ctiSecondaryDetermine.tetUl
              "
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >肌钙蛋白超过正常参考值范围上限；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.ctiSecondaryDetermine.necAwcs
              "
              :disabled="isReadonly || other2Disabled"
              @change="setOther2"
            >新出现的有临床意义的心电图改变和/或心律失常；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.ctiSecondaryDetermine.nothing
              "
              :disabled="isReadonly || nothing2Disabled"
              @change="setNothing2"
            >无</el-checkbox><br>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *停药判定 </template>
          <div>
            <el-checkbox
              v-model="
                baselineForm.info.discontinuationDetermine.lvef
              "
              :disabled="isReadonly || other3Disabled"
              @change="setOther3"
            >
              左室射血分数（LVEF）绝对值≤45%且较基线降低≥10%；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.discontinuationDetermine.sochf
              "
              :disabled="isReadonly || other3Disabled"
              @change="setOther3"
            >
              出现充血性心衰症状（NYHA分级III-IV级）或体征（肺部听诊有啰音或下肢水肿）伴有NT-proBNP超过年龄界限值；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.discontinuationDetermine.ami
              "
              :disabled="isReadonly || other3Disabled"
              @change="setOther3"
            >发生急性心肌梗死或有临床意义的急性心肌损伤，肌钙蛋白超过正常参考值上限2倍及以上；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.discontinuationDetermine.qtcf
              "
              :disabled="isReadonly || other3Disabled"
              @change="setOther3"
            >12导联心电图或心电监护新出现的有临床意义的ST段抬高，经证实存在心肌缺血或心肌梗死；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.discontinuationDetermine.saSb
              "
              :disabled="isReadonly || other3Disabled"
              @change="setOther3"
            >心电图、动态心电图或心电监护记录的严重心律失常：<br>
              室性心动过速、尖端扭转室性心动过速、心室颤动等危及生命的快速性室性心律失常；<br>
              二度II型房室阻滞、二度2:1房室阻滞、高度房室阻滞、三度房室阻滞；<br>
              严重窦性心动过缓（心率≤40次/分），窦性停搏、窦房阻滞；</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.discontinuationDetermine
                  .qtcMre
              "
              :disabled="isReadonly || other3Disabled"
              @change="setOther3"
            >静息心电图测定QTc间期（用Fridericia’s公式校正心率)，当QTc间期延长＞500ms或较基线QTc延长＞60ms</el-checkbox><br>
            <el-checkbox
              v-model="
                baselineForm.info.discontinuationDetermine
                  .nothing
              "
              :disabled="isReadonly || nothing3Disabled"
              @change="setNothing3"
            >无
            </el-checkbox></div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> *判定结论 </template>
          <div>
            <el-radio
              v-model="baselineForm.judgmentConclusion"
              :disabled="isReadonly"
              label="0"
            >不符合方案规定的心脏毒性相关停药判定标准</el-radio><br>
            <el-radio
              v-model="baselineForm.judgmentConclusion"
              :disabled="isReadonly"
              label="1"
            >符合方案规定的心脏毒性相关停药判定标准</el-radio>
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
        <span>方案规定的心脏毒性相关停止治疗标准</span>
      </div>
      <div style="font-size: 14px; color: #606266">
        <div>
          受试者出现以下一条或多条心脏毒性：<br>
          ① 左室射血分数（LVEF）绝对值≤45%且较基线降低≥10%；<br>
          ②
          出现充血性心衰症状（NYHA分级III-IV级）或体征（肺部听诊有啰音或下肢水肿）伴有NT-proBNP超过年龄界限值；<br>
          ③
          发生急性心肌梗死或有临床意义的急性心肌损伤，肌钙蛋白超过正常参考值上限2倍及以上；<br>
          ④
          12导联心电图或心电监护新出现的有临床意义的ST段抬高，经证实存在心肌缺血或心肌梗死；<br>
          ⑤ 心电图、动态心电图或心电监护记录的严重心律失常：<br>
          室性心动过速、尖端扭转室性心动过速、心室颤动等危及生命的快速性室性心律失常；<br>
          二度II型房室阻滞、二度2:1房室阻滞、高度房室阻滞、三度房室阻滞；<br>
          严重窦性心动过缓（心率≤40次/分），窦性停搏、窦房阻滞；<br>
          ⑥
          静息心电图测定QTc间期（用Fridericia’s公式校正心率)，当QTc间期延长＞500ms或较基线QTc延长＞60ms。<br>
          注：若受试者出现可疑上述情况，经由心脏毒性独立评估委员会评估后决定是否符合停止治疗标准。<br>
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
  //   getVisitListByExamineeId,
  visitList,
  assessmenting
} from '@/api/assess/task'
import { visitDetails } from '@/api/image/tester'

export default {
  name: 'Post',
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: false,
      drugWeeks: 0,
      drugTimes: 0,
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
        judgmentDate: this.parseTime(new Date()), // 判断日期
        info: {
          ctiMainDetermine: {
            lvef: false,
            sochf: false,
            ami: false,
            nawcs: false,
            qtcf: false,
            nothing: false
          },
          ctiSecondaryDetermine: {
            lvef: false,
            lvefReduce: false,
            ntPro: false,
            tetUl: false,
            necAwcs: false,
            nothing: false
          },
          discontinuationDetermine: {
            lvef: false,
            sochf: false,
            ami: false,
            qtcf: false,
            saSb: false,
            qtcMre: false,
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
      other2Disabled: false,
      nothing3Disabled: false,
      other3Disabled: false
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
        const data = this.baselineForm.info.ctiMainDetermine
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
        const data = this.baselineForm.info.ctiSecondaryDetermine
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
    // 第三个无
    setOther3(value) {
      if (value) {
        // true进来
        this.nothing3Disabled = true
      } else {
        // false进来
        this.nothing3Disabled = false
        const data = this.baselineForm.info.discontinuationDetermine
        for (const key in data) {
          if (data[key]) {
            this.nothing3Disabled = true
          }
        }
      }
    },
    setNothing3(value) {
      if (value) {
        // true进来
        this.other3Disabled = true
      } else {
        // false进来
        this.other3Disabled = false
      }
    },
    // ---------------
    // 获取顶部给药次数
    visitDetails(visitId) {
      visitDetails(visitId).then((res) => {
        if (res.data.infos && res.data.infos.length > 0) {
          res.data.infos.forEach((item) => {
            if (item.cfgFieldNameCn === '累计给药次数') {
              this.drugTimes = item.value || 0
            }
            if (item.cfgFieldNameCn === '距上次给药后周数') {
              this.drugWeeks = item.value || 0
            }
          })
        }
      })
    },
    // 文件列表切换tab
    handleClick(v, e) {
      this.getVisitOtherDetailList({
        examineeId: this.$route.query.examineeId,
        visitId: v.name,
        visitFile: '2'
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
      if (!this.baselineForm.info.isIndicatorChange) {
        return this.$message.warning('请选择是否发生心脏毒性指标改变')
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
      let ctiMainDetermine = false
      for (const key in this.baselineForm.info.ctiMainDetermine) {
        if (this.baselineForm.info.ctiMainDetermine[key]) {
          ctiMainDetermine = true
        }
      }
      let ctiSecondaryDetermine = false
      for (const key in this.baselineForm.info.ctiSecondaryDetermine) {
        if (this.baselineForm.info.ctiSecondaryDetermine[key]) {
          ctiSecondaryDetermine = true
        }
      }
        let discontinuationDetermine = false
        for (const key in this.baselineForm.info.discontinuationDetermine) {
          if (this.baselineForm.info.discontinuationDetermine[key]) {
            discontinuationDetermine = true
          }
        }
      if (!ctiMainDetermine) {
        return this.$message.warning(
          '心脏毒性指标（主要安全性终点）判定至少选择一项'
        )
      }
      if (!ctiSecondaryDetermine) {
        return this.$message.warning(
          '心脏毒性指标（次要安全性终点）判定至少选择一项'
        )
      }
       //temporary solutions: add by jing for set discontinuationDetermine to not required
      if (!discontinuationDetermine) {
        return this.$message.warning("停药判定至少选择一项");
      }
      this.dialogVisible2 = true
    },
    // PDF文件列表
    getVisitOtherDetailList(obj) {
      getVisitOtherDetailList(obj).then((res) => {
        this.tableData = res.data
      })
    },
    // 页面数据
    jobIndependentInfo() {
      jobIndependentInfo(this.$route.query.assessJobId).then((res) => {
        this.pageInfo = res.data
        // 获取访视列表
        this._getVisitListByExamineeId()
        // 获取给药次数
        this.visitDetails(Number(res.data.visitId))
        // 获取详情回显
        this.jobIndependentDetails()
        if(res.data.status==="0"||res.data.status==="2"){
          this.postAssessmenting();
        }
      })
    },
    // 获取访视列表
    _getVisitListByExamineeId() {
      visitList({
        examineeId: Number(this.$route.query.examineeId),
        projectId: JSON.parse(localStorage['chooseProject']).id,
        pageNum:1,
        pageSize:100
      }).then((res) => {
        for(var i=0;i<res.rows.length;i++){
          if(this.pageInfo.visitId===res.rows[i].id){
            this.visitList =  res.rows.slice(0,i+1)
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
    },
    // 获取详情回显
    jobIndependentDetails() {
      this.loading = true
      jobIndependentDetails(this.$route.query.assessJobId).then((res) => {
        if (res && res.data && res.data.info) {
          if (res.data.info.ctiMainDetermine != null) {
            for (const k in res.data.info.ctiMainDetermine) {
              if (res.data.info.ctiMainDetermine[k] === '1') {
                res.data.info.ctiMainDetermine[k] = true
              } else {
                res.data.info.ctiMainDetermine[k] = false
              }
            }
          } else {
            res.data.info.ctiMainDetermine = {}
          }
          if (res.data.info.ctiSecondaryDetermine != null) {
            for (const k in res.data.info.ctiSecondaryDetermine) {
              if (res.data.info.ctiSecondaryDetermine[k] === '1') {
                res.data.info.ctiSecondaryDetermine[k] = true
              } else {
                res.data.info.ctiSecondaryDetermine[k] = false
              }
            }
          } else {
            res.data.info.ctiSecondaryDetermine = {}
          }
          if (res.data.info.discontinuationDetermine != null) {
            for (const k in res.data.info.discontinuationDetermine) {
              if (
                res.data.info.discontinuationDetermine[k] === '1'
              ) {
                res.data.info.discontinuationDetermine[
                  k
                ] = true
              } else {
                res.data.info.discontinuationDetermine[
                  k
                ] = false
              }
            }
          } else {
            res.data.info.discontinuationDetermine = {}
          }
        }
        this.baselineForm = Object.assign(this.baselineForm, res.data)
        this.isReadonly = this.baselineForm.status === '1'
        this.loading = false
      })
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
      for (const k in this.baselineForm.info.ctiMainDetermine) {
        if (this.baselineForm.info.ctiMainDetermine[k]) {
          this.baselineForm.info.ctiMainDetermine[k] = '1'
        } else {
          this.baselineForm.info.ctiMainDetermine[k] = '0'
        }
      }

      for (const k in this.baselineForm.info.ctiSecondaryDetermine) {
        if (this.baselineForm.info.ctiSecondaryDetermine[k]) {
          this.baselineForm.info.ctiSecondaryDetermine[k] = '1'
        } else {
          this.baselineForm.info.ctiSecondaryDetermine[k] = '0'
        }
      }

      for (const k in this.baselineForm.info.discontinuationDetermine) {
        if (this.baselineForm.info.discontinuationDetermine[k]) {
          this.baselineForm.info.discontinuationDetermine[k] = '1'
        } else {
          this.baselineForm.info.discontinuationDetermine[k] = '0'
        }
      }
      this.baselineForm.judgmentConclusion === '1'
        ? (this.baselineForm.judgmentConclusionContent =
                      '符合方案规定的心脏毒性相关停药判定标准')
        : (this.baselineForm.judgmentConclusionContent =
                      '不符合方案规定的心脏毒性相关停药判定标准')
      independentSubmit(this.baselineForm).then((res) => {
        this.jobIndependentInfo()
        this.jobIndependentDetails()
        this.loading = false
        this.dialogVisible2 = false
        this.$modal.msgSuccess('评估成功')
      })
    }
  }
}
</script>

<style>
.el-radio__input.is-disabled.is-checked .el-radio__inner{
    border-color: #323e52;
    background: #323e52;
}
.el-radio__input.is-disabled + span.el-radio__label{
    color: #323e52;
}
.el-checkbox__input.is-disabled + span.el-checkbox__label{
    color: #323e52;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
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
