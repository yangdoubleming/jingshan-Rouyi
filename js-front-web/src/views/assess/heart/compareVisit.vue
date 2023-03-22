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
        <div class="box">
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
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedCc"
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedCc"
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedCc"
                                label="2"
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
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedLts"
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedLts"
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedLts"
                                label="2"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *心电图是否已审阅 </template>
                        <div>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedEcg"
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedEcg"
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedEcg"
                                label="2"
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
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.isReviewedTwentyfourHourEcg
                                "
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.isReviewedTwentyfourHourEcg
                                "
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.isReviewedTwentyfourHourEcg
                                "
                                label="2"
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
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedCur"
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedCur"
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.isReviewedCur"
                                label="2"
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
                        <template slot="label">
                            *是否发生心脏毒性指标改变
                        </template>
                        <div>
                            <div>
                                <el-radio
                                    :disabled="isReadonly"
                                    v-model="
                                        baselineForm.info.isIndicatorChange
                                    "
                                    label="1"
                                    >是</el-radio
                                >
                                <el-radio
                                    :disabled="isReadonly"
                                    v-model="
                                        baselineForm.info.isIndicatorChange
                                    "
                                    label="0"
                                    >否</el-radio
                                >
                            </div>
                            <div
                                style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: flex-start;
                                    margin-top: 15px;
                                "
                            >
                                <span style="width: 60px">备注：</span
                                ><el-input
                                    :readonly="isReadonly"
                                    type="textarea"
                                    :rows="2"
                                    placeholder="请输入内容"
                                    v-model="
                                        baselineForm.info.indicatorChangeNote
                                    "
                                ></el-input>
                            </div>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *心脏毒性指标（主要安全性终点）判定
                        </template>
                        <div>
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.ctiMainDetermine.lvef
                                "
                                >左室射血分数（LVEF）较基线值降低>10%且绝对值﹤50%；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.ctiMainDetermine.sochf
                                "
                                >出现充血性心衰症状(NYHA分级III-IV级)或体征（肺部听诊有啰音或下肢水肿），<br />且伴有NT-proBNP升高（超过年龄界限值）；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="baselineForm.info.ctiMainDetermine.ami"
                                >发生急性心肌梗死或有临床意义的急性心肌损伤；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.ctiMainDetermine.nawcs
                                "
                                >新出现的有临床意义的心律失常；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.ctiMainDetermine.qtcf
                                "
                                >QTcF>500ms或QTcF较基线值延长>60ms；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.ctiMainDetermine.nothing
                                "
                                >无</el-checkbox
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *心脏毒性指标（次要安全性终点）判定
                        </template>
                        <div>
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.ctiSecondaryDetermine
                                        .lvefReduce
                                "
                            >
                                左室射血分数（LVEF）较基线值降低﹤10%，但LVEF绝对值﹤0%，<br />或LVEF绝对值≥50%，但较基线值降低>10%（绝对百分点）；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.ctiSecondaryDetermine
                                        .ntPro
                                "
                            >
                                NT-pro
                                BNP较基线显著升高，超过年龄界限值；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.ctiSecondaryDetermine
                                        .tetUl
                                "
                                >肌钙蛋白超过正常参考值范围上限；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"

                                v-model="
                                    baselineForm.info.ctiSecondaryDetermine
                                        .necAwcs
                                "
                                >新出现的有临床意义的心电图改变和/或心律失常；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.ctiSecondaryDetermine
                                        .nothing
                                "
                                >无</el-checkbox
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> 停药判定 </template>
                        <div>
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.discontinuationDetermine
                                        .lvef
                                "
                            >
                                左室射血分数（LVEF）绝对值≤45%且较基线降低≥10%；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.discontinuationDetermine
                                        .sochf
                                "
                            >
                                出现充血性心衰症状（NYHA分级III-IV级）或<br />体征（肺部听诊有啰音或下肢水肿）伴有NT-proBNP超过年龄界限值；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.discontinuationDetermine
                                        .ami
                                "
                                >发生急性心肌梗死或有临床意义的急性心肌损伤，<br />肌钙蛋白超过正常参考值上限2倍及以上；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.discontinuationDetermine
                                        .qtcf
                                "
                                >12导联心电图或心电监护新出现的有临床意义的ST段抬高，<br />经证实存在心肌缺血或心肌梗死；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.discontinuationDetermine
                                        .saSb
                                "
                                >心电图、动态心电图或心电监护记录的严重心律失常：<br />
                                室性心动过速、尖端扭转室性心动过速、心室颤动等危及生命的快速性室性心律失常；<br />
                                二度II型房室阻滞、二度2:1房室阻滞、高度房室阻滞、三度房室阻滞；<br />
                                严重窦性心动过缓（心率≤40次/分），窦性停搏、窦房阻滞；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm.info.discontinuationDetermine
                                        .qtcMre
                                "
                                >静息心电图测定QTc间期（用Fridericia’s公式校正心率)，<br />当QTc间期延长＞500ms或较基线QTc延长＞60ms</el-checkbox
                            ><br />
                          <el-checkbox v-model="baselineForm.info.discontinuationDetermine.nothing"
                            :disabled="isReadonly">无</el-checkbox>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *判定结论 </template>
                        <div>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.judgmentConclusion"
                                label="0"
                                >不符合方案规定的心脏毒性相关停药判定标准</el-radio
                            ><br />
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm.judgmentConclusion"
                                label="1"
                                >符合方案规定的心脏毒性相关停药判定标准</el-radio
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
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedCc"
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedCc"
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedCc"
                                label="2"
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
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedLts"
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedLts"
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedLts"
                                label="2"
                                >未提供</el-radio
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *心电图是否已审阅 </template>
                        <div>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedEcg"
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedEcg"
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedEcg"
                                label="2"
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
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.isReviewedTwentyfourHourEcg
                                "
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.isReviewedTwentyfourHourEcg
                                "
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.isReviewedTwentyfourHourEcg
                                "
                                label="2"
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
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedCur"
                                label="1"
                                >是</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedCur"
                                label="0"
                                >否</el-radio
                            >
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.isReviewedCur"
                                label="2"
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
                        <template slot="label">
                            *是否发生心脏毒性指标改变
                        </template>
                        <div>
                            <div>
                                <el-radio
                                    :disabled="isReadonly"
                                    v-model="
                                        baselineForm2.info.isIndicatorChange
                                    "
                                    label="1"
                                    >是</el-radio
                                >
                                <el-radio
                                    :disabled="isReadonly"
                                    v-model="
                                        baselineForm2.info.isIndicatorChange
                                    "
                                    label="0"
                                    >否</el-radio
                                >
                            </div>
                            <div
                                style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: flex-start;
                                    margin-top: 15px;
                                "
                            >
                                <span style="width: 60px">备注：</span
                                ><el-input
                                    :readonly="isReadonly"
                                    type="textarea"
                                    :rows="2"
                                    placeholder="请输入内容"
                                    v-model="
                                        baselineForm2.info.indicatorChangeNote
                                    "
                                ></el-input>
                            </div>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *心脏毒性指标（主要安全性终点）判定
                        </template>
                        <div>
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.ctiMainDetermine.lvef
                                "
                                >左室射血分数（LVEF）较基线值降低>10%且绝对值﹤50%；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.ctiMainDetermine.sochf
                                "
                                >出现充血性心衰症状(NYHA分级III-IV级)或体征（肺部听诊有啰音或下肢水肿），<br />且伴有NT-proBNP升高（超过年龄界限值）；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="baselineForm2.info.ctiMainDetermine.ami"
                                >发生急性心肌梗死或有临床意义的急性心肌损伤；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.ctiMainDetermine.nawcs
                                "
                                >新出现的有临床意义的心律失常；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.ctiMainDetermine.qtcf
                                "
                                >QTcF>500ms或QTcF较基线值延长>60ms；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.ctiMainDetermine.nothing
                                "
                                >无</el-checkbox
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            *心脏毒性指标（次要安全性终点）判定
                        </template>
                        <div>
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.ctiSecondaryDetermine
                                        .lvefReduce
                                "
                            >
                                左室射血分数（LVEF）较基线值降低﹤10%，但LVEF绝对值﹤0%，<br />或LVEF绝对值≥50%，但较基线值降低>10%（绝对百分点）；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.ctiSecondaryDetermine
                                        .ntPro
                                "
                            >
                                NT-pro
                                BNP较基线显著升高，超过年龄界限值；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.ctiSecondaryDetermine
                                        .tetUl
                                "
                                >肌钙蛋白超过正常参考值范围上限；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.ctiSecondaryDetermine
                                        .necAwcs
                                "
                                >新出现的有临床意义的心电图改变和/或心律失常；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"

                                v-model="
                                    baselineForm2.info.ctiSecondaryDetermine
                                        .nothing
                                "
                                >无</el-checkbox
                            >
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> 停药判定 </template>
                        <div>
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.discontinuationDetermine
                                        .lvef
                                "
                            >
                                左室射血分数（LVEF）绝对值≤45%且较基线降低≥10%；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.discontinuationDetermine
                                        .sochf
                                "
                            >
                                出现充血性心衰症状（NYHA分级III-IV级）或<br />体征（肺部听诊有啰音或下肢水肿）伴有NT-proBNP超过年龄界限值；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.discontinuationDetermine
                                        .ami
                                "
                                >发生急性心肌梗死或有临床意义的急性心肌损伤，<br />肌钙蛋白超过正常参考值上限2倍及以上；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.discontinuationDetermine
                                        .qtcf
                                "
                                >12导联心电图或心电监护新出现的有临床意义的ST段抬高，<br />经证实存在心肌缺血或心肌梗死；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.discontinuationDetermine
                                        .saSb
                                "
                                >心电图、动态心电图或心电监护记录的严重心律失常：<br />
                                室性心动过速、尖端扭转室性心动过速、心室颤动等危及生命的快速性室性心律失常；<br />
                                二度II型房室阻滞、二度2:1房室阻滞、高度房室阻滞、三度房室阻滞；<br />
                                严重窦性心动过缓（心率≤40次/分），窦性停搏、窦房阻滞；</el-checkbox
                            ><br />
                            <el-checkbox
                                :disabled="isReadonly"
                                v-model="
                                    baselineForm2.info.discontinuationDetermine
                                        .qtcMre
                                "
                                >静息心电图测定QTc间期（用Fridericia’s公式校正心率)，<br />当QTc间期延长＞500ms或较基线QTc延长＞60ms</el-checkbox
                            ><br />
                          <el-checkbox v-model="baselineForm2.info.discontinuationDetermine.nothing"
                                       :disabled="isReadonly">无</el-checkbox>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"> *判定结论 </template>
                        <div>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.judgmentConclusion"
                                label="0"
                                >不符合方案规定的心脏毒性相关停药判定标准</el-radio
                            ><br />
                            <el-radio
                                :disabled="isReadonly"
                                v-model="baselineForm2.judgmentConclusion"
                                label="1"
                                >符合方案规定的心脏毒性相关停药判定标准</el-radio
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
                judgmentDate: this.parseTime(new Date()), //判断日期
                info: {
                    ctiMainDetermine: {
                        lvef: false,
                        sochf: false,
                        ami: false,
                        nawcs: false,
                        qtcf: false,
                        nothing: false,
                    },
                    ctiSecondaryDetermine: {
                        lvef: false,
                        lvefReduce: false,
                        ntPro: false,
                        tetUl: false,
                        necAwcs: false,
                        nothing: false,
                    },
                    discontinuationDetermine: {
                        lvef: false,
                        sochf: false,
                        ami: false,
                        qtcf: false,
                        saSb: false,
                        qtcMre: false,
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
                judgmentDate: this.parseTime(new Date()), //判断日期
                info: {
                    ctiMainDetermine: {
                        lvef: false,
                        sochf: false,
                        ami: false,
                        nawcs: false,
                        qtcf: false,
                        nothing: false,
                    },
                    ctiSecondaryDetermine: {
                        lvef: false,
                        lvefReduce: false,
                        ntPro: false,
                        tetUl: false,
                        necAwcs: false,
                        nothing: false,
                    },
                    discontinuationDetermine: {
                        lvef: false,
                        sochf: false,
                        ami: false,
                        qtcf: false,
                        saSb: false,
                        qtcMre: false,
                    },
                },
            },
        };
    },
    created() {
        this.jobIndependentDetails();
        this.jobIndependentDetails2();
    },
    methods: {
        jobIndependentDetails() {
            jobIndependentDetails(this.$route.query.assessJobId).then((res) => {
                if (res && res.data && res.data.info) {
                    if (res.data.info.ctiMainDetermine != null) {
                        for (let k in res.data.info.ctiMainDetermine) {
                            if (res.data.info.ctiMainDetermine[k] == "1") {
                                res.data.info.ctiMainDetermine[k] = true;
                            } else {
                                res.data.info.ctiMainDetermine[k] = false;
                            }
                        }
                    } else {
                        res.data.info.ctiMainDetermine = {};
                    }
                    if (res.data.info.ctiSecondaryDetermine != null) {
                        for (let k in res.data.info.ctiSecondaryDetermine) {
                            if (res.data.info.ctiSecondaryDetermine[k] == "1") {
                                res.data.info.ctiSecondaryDetermine[k] = true;
                            } else {
                                res.data.info.ctiSecondaryDetermine[k] = false;
                            }
                        }
                    } else {
                        res.data.info.ctiSecondaryDetermine = {};
                    }
                    if (res.data.info.discontinuationDetermine != null) {
                        for (let k in res.data.info.discontinuationDetermine) {
                            if (
                                res.data.info.discontinuationDetermine[k] == "1"
                            ) {
                                res.data.info.discontinuationDetermine[
                                    k
                                ] = true;
                            } else {
                                res.data.info.discontinuationDetermine[
                                    k
                                ] = false;
                            }
                        }
                    } else {
                        res.data.info.discontinuationDetermine = {};
                    }
                }
                this.baselineForm = Object.assign(this.baselineForm, res.data);
            });
        },
        jobIndependentDetails2() {
            jobIndependentDetails(this.$route.query.assessJobId2).then((res) => {
                if (res && res.data && res.data.info) {
                    if (res.data.info.ctiMainDetermine != null) {
                        for (let k in res.data.info.ctiMainDetermine) {
                            if (res.data.info.ctiMainDetermine[k] == "1") {
                                res.data.info.ctiMainDetermine[k] = true;
                            } else {
                                res.data.info.ctiMainDetermine[k] = false;
                            }
                        }
                    } else {
                        res.data.info.ctiMainDetermine = {};
                    }
                    if (res.data.info.ctiSecondaryDetermine != null) {
                        for (let k in res.data.info.ctiSecondaryDetermine) {
                            if (res.data.info.ctiSecondaryDetermine[k] == "1") {
                                res.data.info.ctiSecondaryDetermine[k] = true;
                            } else {
                                res.data.info.ctiSecondaryDetermine[k] = false;
                            }
                        }
                    } else {
                        res.data.info.ctiSecondaryDetermine = {};
                    }
                    if (res.data.info.discontinuationDetermine != null) {
                        for (let k in res.data.info.discontinuationDetermine) {
                            if (
                                res.data.info.discontinuationDetermine[k] == "1"
                            ) {
                                res.data.info.discontinuationDetermine[
                                    k
                                ] = true;
                            } else {
                                res.data.info.discontinuationDetermine[
                                    k
                                ] = false;
                            }
                        }
                    } else {
                        res.data.info.discontinuationDetermine = {};
                    }
                }
                this.baselineForm2 = Object.assign(
                    this.baselineForm2,
                    res.data
                );
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
