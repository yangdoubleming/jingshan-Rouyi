<template>
    <div class="app-container" style="overflow-y: auto">
        <div style="margin-bottom:20px;">
            <span style="display: inline-block"
                >受试者编号：{{ $route.query.examineeNo }}</span
            >
            <span style="display: inline-block; margin: 0 50px"
                >访视名称：{{ $route.query.visitName }}</span
            >
        </div>
        <div class="box" >
            <div class="left">
                <div style="text-align: center; margin-bottom: 10px">
                    独立评估者#1 评估结论
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
                                >是</el-radio
                            >
                            <el-radio
                                v-model="baselineForm.isReviewedCc"
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="baselineForm.isReviewedCc"
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *实验室化验单是否已审阅
                        </template>
                        <div>
                            <el-radio
                                v-model="baselineForm.isReviewedLts"
                                label="1"
                                :disabled="isReadonly"
                                >是</el-radio
                            >
                            <el-radio
                                v-model="baselineForm.isReviewedLts"
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="baselineForm.isReviewedLts"
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *心电图是否已审阅 </template>
                        <div>
                            <el-radio
                                v-model="baselineForm.isReviewedEcg"
                                label="1"
                                :disabled="isReadonly"
                                >是</el-radio
                            >
                            <el-radio
                                v-model="baselineForm.isReviewedEcg"
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="baselineForm.isReviewedEcg"
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *24小时心电图是否已审阅
                        </template>
                        <div>
                            <el-radio
                                v-model="
                                    baselineForm.isReviewedTwentyfourHourEcg
                                "
                                label="1"
                                :disabled="isReadonly"
                                >是</el-radio
                            >
                            <el-radio
                                v-model="
                                    baselineForm.isReviewedTwentyfourHourEcg
                                "
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="
                                    baselineForm.isReviewedTwentyfourHourEcg
                                "
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *心脏超声报告是否已审阅
                        </template>
                        <div>
                            <el-radio
                                v-model="baselineForm.isReviewedCur"
                                label="1"
                                :disabled="isReadonly"
                                >是</el-radio
                            >
                            <el-radio
                                v-model="baselineForm.isReviewedCur"
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="baselineForm.isReviewedCur"
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
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
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhEnrolledCriteria.lvef
                                "
                                >左室射血分数（LVEF）≥55%（双平面 Simpson
                                法测量）；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhEnrolledCriteria
                                        .ntProbnp
                                "
                                >NT-proBNP＜年龄界限值；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhEnrolledCriteria.tiwtnr
                                "
                                >肌钙蛋白在正常值范围内；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhEnrolledCriteria.qtcf
                                "
                                >12 导联心电图：无严重心律失常，QTcF
                                ≤480ms；</el-checkbox
                            ><br />
                          <el-checkbox
                            v-model="baselineForm.info.sdhEnrolledCriteria.nothing"
                            :disabled="isReadonly">无
                          </el-checkbox>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *方案规定心脏排除标准 </template>
                        <div style="width:10%">
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhExcludeCriteria.pmiCh
                                "
                            >
                                既往发生过心肌梗死、脑出血；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhExcludeCriteria.avt
                                "
                            >首次给药前6个月内发生过动/静脉血栓事件且未经正规治疗者，<br />如脑血管意外（包括暂时性缺血性发作）、深静脉血栓及肺栓塞者；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhExcludeCriteria.scCd
                                "
                                >首次给药前6个月内发生严重的心脑血管疾病，如急性冠脉综合征、<br />充血性心力衰竭（美国纽约心脏病协会[NYHA]心功能分级Ⅱ-Ⅳ级）、<br />缺血性脑卒中（腔隙性脑梗塞除外）、主动脉夹层等；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhExcludeCriteria.hbcc
                                "
                                >临床无法控制的高血压（即收缩压≥160mmHg，和/或舒张压≥100 mmHg）；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhExcludeCriteria.sciEcg
                                "
                                >静息心电图或动态心电图提示的严重心律失常或形态学改变，<br />如频发室性早搏(24小时动态心电图室早负荷≥10%)、<br />室性心动过速、II-III度房室传导阻滞、病态窦房结综合征等；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhExcludeCriteria.firQtc
                                "
                                >任何增加QTc延长风险或心律失常风险的因素，如心衰、低钾血症、先天性长<br />QT综合征、长 QT 综合征家族史，或一级亲属中有小于40岁发生无法解释的猝死，<br />或使用任何已知可延长QT间期的伴随药物；</el-checkbox
                            ><br />
                          <el-checkbox v-model="baselineForm.info.sdhExcludeCriteria.nothing"
                                       :disabled="isReadonly">无
                          </el-checkbox>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *判定结论 </template>
                        <div>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.judgmentConclusion"
                                label="1"
                                >根据方案规定的心脏功能相关入排标准，符合入组条件</el-radio
                            ><br />
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.judgmentConclusion"
                                label="0"
                                >根据方案规定的心脏功能相关入排标准，不符合入组条件</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> 备注 </template>
                        <div>
                            <el-input
                                :readonly="isReadonly"
                                type="textarea"
                                :rows="2"
                                placeholder="请输入内容"
                                v-model="baselineForm.comment"
                            ></el-input>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item v-show="baselineForm.status == '1'">
                        <template slot="label"> 判定日期 </template>
                        <div>
                          {{ baselineForm.autographDate?baselineForm.autographDate.slice(0,10):'' }}
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <div class="right">
                <div style="text-align: center; margin-bottom: 10px">
                    独立评估者#2 评估结论
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
                                v-model="baselineForm2.isReviewedCc"
                                label="1"
                                :disabled="isReadonly"
                                >是</el-radio
                            >
                            <el-radio
                                v-model="baselineForm2.isReviewedCc"
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="baselineForm2.isReviewedCc"
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *实验室化验单是否已审阅
                        </template>
                        <div>
                            <el-radio
                                v-model="baselineForm2.isReviewedLts"
                                label="1"
                                :disabled="isReadonly"
                                >是</el-radio
                            >
                            <el-radio
                                v-model="baselineForm2.isReviewedLts"
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="baselineForm2.isReviewedLts"
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *心电图是否已审阅 </template>
                        <div>
                            <el-radio
                                v-model="baselineForm2.isReviewedEcg"
                                label="1"
                                :disabled="isReadonly"
                                >是</el-radio
                            >
                            <el-radio
                                v-model="baselineForm2.isReviewedEcg"
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="baselineForm2.isReviewedEcg"
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *24小时心电图是否已审阅
                        </template>
                        <div>
                            <el-radio
                                v-model="
                                    baselineForm2.isReviewedTwentyfourHourEcg
                                "
                                label="1"
                                :disabled="isReadonly"
                                >是</el-radio
                            >
                            <el-radio
                                v-model="
                                    baselineForm2.isReviewedTwentyfourHourEcg
                                "
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="
                                    baselineForm2.isReviewedTwentyfourHourEcg
                                "
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *心脏超声报告是否已审阅
                        </template>
                        <div>
                            <el-radio
                                v-model="baselineForm2.isReviewedCur"
                                label="1"
                                :disabled="isReadonly"
                                >是</el-radio
                            >
                            <el-radio
                                v-model="baselineForm2.isReviewedCur"
                                label="0"
                                :disabled="isReadonly"
                                >否</el-radio
                            >
                            <el-radio
                                v-model="baselineForm2.isReviewedCur"
                                label="2"
                                :disabled="isReadonly"
                                >未提供</el-radio
                            >
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
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.sdhEnrolledCriteria.lvef
                                "
                                >左室射血分数（LVEF）≥55%（双平面 Simpson
                                法测量）；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.sdhEnrolledCriteria
                                        .ntProbnp
                                "
                                >NT-proBNP＜年龄界限值；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.sdhEnrolledCriteria
                                        .tiwtnr
                                "
                                >肌钙蛋白在正常值范围内；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.sdhEnrolledCriteria.qtcf
                                "
                                >12 导联心电图：无严重心律失常，QTcF
                                ≤480ms；</el-checkbox
                            ><br />
                          <el-checkbox
                            v-model="baselineForm.info.sdhEnrolledCriteria.nothing"
                            :disabled="isReadonly">无
                          </el-checkbox>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *方案规定心脏排除标准 </template>
                        <div>
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.sdhExcludeCriteria.pmiCh
                                "
                            >
                                既往发生过心肌梗死、脑出血；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.sdhExcludeCriteria.avt
                                "
                            >首次给药前6个月内发生过动/静脉血栓事件且未经正规治疗者，<br />如脑血管意外（包括暂时性缺血性发作）、深静脉血栓及肺栓塞者；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.sdhExcludeCriteria.scCd
                                "
                                >首次给药前6个月内发生严重的心脑血管疾病，如急性冠脉综合征、<br />充血性心力衰竭（美国纽约心脏病协会[NYHA]心功能分级Ⅱ-Ⅳ级）、<br />缺血性脑卒中（腔隙性脑梗塞除外）、主动脉夹层等；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.sdhExcludeCriteria.hbcc
                                "
                                >临床无法控制的高血压（即收缩压≥160
                                mmHg，和/或舒张压≥100 mmHg）；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.sdhExcludeCriteria.sciEcg
                                "
                                >静息心电图或动态心电图提示的严重心律失常或形态学改变，<br />如频发室性早搏(24小时动态心电图室早负荷≥10%)、<br />室性心动过速、II-III度房室传导阻滞、病态窦房结综合征等；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.sdhExcludeCriteria.firQtc
                                "
                                >任何增加QTc延长风险或心律失常风险的因素，如心衰、低钾血症、先天性长<br />QT综合征、长 QT 综合征家族史，或一级亲属中有小于40岁发生无法解释的猝死，<br />或使用任何已知可延长QT间期的伴随药物；</el-checkbox
                            ><br />
                          <el-checkbox v-model="baselineForm.info.sdhExcludeCriteria.nothing"
                            :disabled="isReadonly">无
                          </el-checkbox>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *判定结论 </template>
                        <div>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.judgmentConclusion"
                                label="1"
                                >根据方案规定的心脏功能相关入排标准，符合入组条件</el-radio
                            ><br />
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.judgmentConclusion"
                                label="0"
                                >根据方案规定的心脏功能相关入排标准，不符合入组条件</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> 备注 </template>
                        <div>
                            <el-input
                                :readonly="isReadonly"
                                type="textarea"
                                :rows="2"
                                placeholder="请输入内容"
                                v-model="baselineForm2.comment"
                            ></el-input>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item v-show="baselineForm2.status == '1'">
                        <template slot="label"> 判定日期 </template>
                        <div>
                          {{ baselineForm2.autographDate?baselineForm2.autographDate.slice(0,10):'' }}
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </div>
    </div>
</template>

<script>
import { jobIndependentDetails } from "@/api/assess/task";
export default {
    data() {
        return {
            loading: false,
            isReadonly: true,
            baselineForm: {
                assessJobId: this.$route.query.assessJobId, //评估任务id
                standard: this.$route.query.standardList, //评估标准
                isReviewedCc: "", // 临床病历是否已审阅（0-否 1-是 2-未提供）
                isReviewedLts: "", //实验室化验单是否已审阅（0-否 1-是 2-未提供）
                isReviewedEcg: "", //心电图是否已审阅（0-否 1-是 2-未提供）
                isReviewedTwentyfourHourEcg: "", //24小时心电图是否已审阅（0-否 1-是 2-未提供）
                isReviewedCur: "", //心脏超声报告是否已审阅（0-否 1-是 2-未提供）
                judgmentConclusion: "", //判定结论（0-否 1-是（
                comment: "", //备注
                status: "",
                judgmentDate: this.parseTime(new Date()), //判断日期
                info: {
                    sdhEnrolledCriteria: {
                        lvef: false,
                        ntProbnp: false,
                        tiwtnr: false,
                        qtcf: false,
                    },
                    sdhExcludeCriteria: {
                        pmiCh: false,
                        avt: false,
                        scCd: false,
                        hbcc: false,
                        sciEcg: false,
                        firQtc: false,
                    },
                },
            },
            baselineForm2: {
                assessJobId: this.$route.query.assessJobId, //评估任务id
                standard: this.$route.query.standardList, //评估标准
                isReviewedCc: "", // 临床病历是否已审阅（0-否 1-是 2-未提供）
                isReviewedLts: "", //实验室化验单是否已审阅（0-否 1-是 2-未提供）
                isReviewedEcg: "", //心电图是否已审阅（0-否 1-是 2-未提供）
                isReviewedTwentyfourHourEcg: "", //24小时心电图是否已审阅（0-否 1-是 2-未提供）
                isReviewedCur: "", //心脏超声报告是否已审阅（0-否 1-是 2-未提供）
                judgmentConclusion: "", //判定结论（0-否 1-是（
                comment: "", //备注
                status: "",
                judgmentDate: this.parseTime(new Date()), //判断日期
                info: {
                    sdhEnrolledCriteria: {
                        lvef: false,
                        ntProbnp: false,
                        tiwtnr: false,
                        qtcf: false,
                    },
                    sdhExcludeCriteria: {
                        pmiCh: false,
                        avt: false,
                        scCd: false,
                        hbcc: false,
                        sciEcg: false,
                        firQtc: false,
                    },
                },
            },
        };
    },
    created() {
        this.getJobIndependentDetails();
        this.getJobIndependentDetails2();
    },
    methods: {
        getJobIndependentDetails() {
            jobIndependentDetails(this.$route.query.assessJobId).then((res) => {
                if (res && res.data && res.data.info) {
                    for (let k in res.data.info.sdhEnrolledCriteria) {
                        if (res.data.info.sdhEnrolledCriteria[k] == "1") {
                            res.data.info.sdhEnrolledCriteria[k] = true;
                        } else {
                            res.data.info.sdhEnrolledCriteria[k] = false;
                        }
                    }
                    for (let k in res.data.info.sdhExcludeCriteria) {
                        if (res.data.info.sdhExcludeCriteria[k] == "1") {
                            res.data.info.sdhExcludeCriteria[k] = true;
                        } else {
                            res.data.info.sdhExcludeCriteria[k] = false;
                        }
                    }
                }
                this.baselineForm = Object.assign(this.baselineForm, res.data);
            });
        },
        getJobIndependentDetails2() {
            jobIndependentDetails(this.$route.query.assessJobId2).then((res) => {
                if (res && res.data && res.data.info) {
                    for (let k in res.data.info.sdhEnrolledCriteria) {
                        if (res.data.info.sdhEnrolledCriteria[k] == "1") {
                            res.data.info.sdhEnrolledCriteria[k] = true;
                        } else {
                            res.data.info.sdhEnrolledCriteria[k] = false;
                        }
                    }
                    for (let k in res.data.info.sdhExcludeCriteria) {
                        if (res.data.info.sdhExcludeCriteria[k] == "1") {
                            res.data.info.sdhExcludeCriteria[k] = true;
                        } else {
                            res.data.info.sdhExcludeCriteria[k] = false;
                        }
                    }
                }
                this.baselineForm2 = Object.assign(this.baselineForm2, res.data);
            });
        },
    },
};
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
.box {
  display: flex;
  width:auto;
}
</style>
