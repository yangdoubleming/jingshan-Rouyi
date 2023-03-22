<!-- 独立影像评估病例报告表 -->
<template>
    <div class="app-container">
        <h1>独立影像评估病例报告表</h1>

        <div class="info-bar">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item
                    >中心: {{ reportData.centerNo }}</el-breadcrumb-item
                >
                <el-breadcrumb-item
                    >受试者: {{ reportData.examineeNo }}</el-breadcrumb-item
                >
                <el-breadcrumb-item
                    >访视: {{ reportData.visitName }}</el-breadcrumb-item
                >
                <el-breadcrumb-item
                    >评估标注: {{ reportData.standardList }}</el-breadcrumb-item
                >
            </el-breadcrumb>
            <el-button-group>
                <el-button type="primary" @click="openDicom">DICOM</el-button>
                <FlieList />
            </el-button-group>
        </div>

        <el-divider />
        <el-form>
            <div class="section">
                <el-form-item
                    label="当前访视整体影像质量是否符合肿瘤疗效评估要求？"
                >
                    <el-radio-group v-model="isDciomAssessQualified" disabled>
                        <el-radio label="是" />
                        <el-radio label="否" />
                    </el-radio-group>
                </el-form-item>
            </div>

            <el-button type="primary" style="margin: 10px 0" @click="getData">
                同步病灶
            </el-button>

            <el-form-item label="是否存在病灶">
                <el-radio-group v-model="isExistAssessType1" disabled>
                    <el-radio label="是" />
                    <el-radio label="否" />
                </el-radio-group>
            </el-form-item>

            <div class="section" style="text-align: center">非淋巴结靶病灶</div>
            <div class="sub-container">
                <el-table :data="lesionType1List">
                    <el-table-column label="基线期" align="center">
                        <el-table-column prop="lesionNo" label="病灶编号" />
                        <el-table-column prop="organ" label="病灶部位" />
                        <el-table-column prop="position" label="病灶部位描述" />
                        <el-table-column prop="fLength" label="最长直径(mm)" />
                        <el-table-column prop="fRemark" label="备注" />
                    </el-table-column>
                    <el-table-column label="">
                        <el-table-column label="病灶状态">
                            <template slot-scope="scope">
                                <el-select
                                    v-if="scope.row.lesionStatusMsg === null"
                                    v-model="scope.row.lesionStatus"
                                >
                                    <el-option label="扫描未覆盖" value="7" />
                                </el-select>
                                <span>{{ scope.row.lesionStatusMsg }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="length" label="最长直径(mm)" />
                        <el-table-column
                            prop="serialNumber"
                            label="影像序列号"
                        />
                        <el-table-column
                            prop="instanceNumber"
                            label="影像层号"
                        />
                        <el-table-column label="备注">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" />
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>

            <div class="section" style="text-align: center">淋巴结靶病灶</div>
            <div class="sub-container">
                <el-table :data="lesionType2List">
                    <el-table-column label="基线期" align="center">
                        <el-table-column prop="lesionNo" label="病灶编号" />
                        <el-table-column prop="organ" label="病灶部位" />
                        <el-table-column prop="position" label="病灶部位描述" />
                        <el-table-column prop="fWidth" label="最大短径(mm)" />
                        <el-table-column prop="fRemark" label="备注">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.fRemark" />
                          </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="">
                        <el-table-column label="病灶状态">
                            <template slot-scope="scope">
                                <el-select
                                    v-if="scope.row.lesionStatusMsg === null"
                                    v-model="scope.row.lesionStatus"
                                >
                                    <el-option label="扫描未覆盖" value="7" />
                                </el-select>
                                <span v-else>{{
                                    scope.row.lesionStatusMsg
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="width" label="最大短径(mm)" />
                        <el-table-column
                            prop="serialNumber"
                            label="影像序列号"
                        />
                        <el-table-column
                            prop="instanceNumber"
                            label="影像层号"
                        />
                        <el-table-column prop="remark" label="备注">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" />
                          </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>

            <div class="section" style="text-align: center">非靶病灶</div>
            <div class="sub-container">
                <el-table :data="lesionType3List">
                    <el-table-column label="基线期" align="center">
                        <el-table-column prop="lesionNo" label="病灶编号" />
                        <el-table-column prop="organ" label="病灶部位" />
                        <el-table-column prop="position" label="病灶部位描述" />
                        <el-table-column prop="fLength" label="最长直径(mm)" />
                        <el-table-column prop="fRemark" label="备注" />
                    </el-table-column>
                    <el-table-column label="">
                        <el-table-column label="病灶状态">
                            <template slot-scope="scope">
                                <el-select
                                    v-if="scope.row.lesionAssess === null"
                                    v-model="scope.row.lesionAssess"
                                >
                                    <el-option label="NE" value="4" />
                                </el-select>
                                <span v-else>{{
                                    scope.row.lesionAssessMsg
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="length" label="最长直径(mm)" />
                        <el-table-column
                            prop="serialNumber"
                            label="影像序列号"
                        />
                        <el-table-column
                            prop="instanceNumber"
                            label="影像层号"
                        />
                        <el-table-column label="备注">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" />
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>

            <div class="section" style="text-align: center">新病灶</div>
            <el-table :data="lesionType4List">
                <el-table-column prop="lesionNo" label="病灶编号" />
                <el-table-column prop="organ" label="病灶部位" />
                <el-table-column prop="position" label="病灶部位描述" />
                <el-table-column prop="lesionAssessMsg" label="病灶评估" />
                <el-table-column prop="serialNumber" label="影像序列号" />
                <el-table-column prop="instanceNumber" label="影像层号" />
                <el-table-column prop="remark" label="备注">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" />
                    </template>
                </el-table-column>
            </el-table>

            <div class="section" style="text-align: center">既往病灶</div>
            <div class="sub-container">
                <el-table :data="lesionType5List">
                    <el-table-column label="首次" align="center">
                        <el-table-column prop="lesionNo" label="病灶编号" />
                        <el-table-column prop="organ" label="病灶部位" />
                        <el-table-column prop="position" label="病灶部位描述" />
                        <el-table-column prop="fLength" label="最长直径(mm)" />
                        <el-table-column prop="fRemark" label="备注" />
                    </el-table-column>
                    <el-table-column label="本次访视" align="center">
                      <el-table-column label="病灶状态">
                            <template slot-scope="scope">
                                <el-select
                                    v-if="scope.row.lesionAssess === null"
                                    v-model="scope.row.lesionAssess"
                                >
                                    <el-option label="NE" value="4" />
                                </el-select>
                                <span v-else>{{
                                    scope.row.lesionAssessMsg
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="length" label="最长直径(mm)" />
                        <el-table-column
                            prop="serialNumber"
                            label="影像序列号"
                        />
                        <el-table-column
                            prop="instanceNumber"
                            label="影像层号"
                        />
                        <el-table-column prop="remark" label="备注">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" />
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>

            <div class="section" style="text-align: center">本次访视统计</div>
            <el-table
                :data="visitStatistics"
                style="width: 100%; margin-bottom: 20px"
            >
                <el-table-column prop="sodSum" label="SOD值(mm)" />
                <el-table-column
                    prop="lesionType1LengthSum"
                    label="非淋巴结病灶总值(mm)"
                />
                <el-table-column
                    prop="lesionType2LengthSum"
                    label="淋巴结病灶总值(mm)"
                />
                <el-table-column
                    prop="cFirstSodChangeRate"
                    label="较基线SOD变化率"
                />
                <el-table-column label="最低点访视(Nadir)">
                    <template slot-scope="scope">
                        {{
                            scope.row.lowIsFirstVisit === 1
                                ? "基线期"
                                : "访视期"
                        }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="lowSodChange"
                    label="较最低点SOD变化值"
                />
                <el-table-column
                    prop="lowSodChangeRate"
                    label="较最低点SOD变化率"
                />
            </el-table>

            <div class="section" style="text-align: center">疗效评估</div>
            <div class="sub-container">
                <div class="sub-box">
                    <div class="section-sub special">
                        <span style="color: red; margin-right: 10px">*</span>
                        靶病灶
                    </div>
                    <div class="inner-box">
                        <el-select v-model="lesionType1">
                            <el-option
                                v-for="option in curativeEffectStatusList.lesionType1StatusList"
                                :key="option.id"
                                :label="option.value"
                                :value="option.value"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="sub-box">
                    <div class="section-sub special">
                        <span style="color: red; margin-right: 10px">*</span>
                        非靶病灶
                    </div>
                    <div class="inner-box">
                        <el-select v-model="lesionType2">
                            <el-option
                                v-for="option in curativeEffectStatusList.lesionType2StatusList"
                                :key="option.id"
                                :label="option.value"
                                :value="option.id"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="sub-box">
                    <div class="section-sub special">
                        <span style="color: red; margin-right: 10px">*</span>
                        新病灶
                    </div>
                    <div class="inner-box">
                        <el-select v-model="lesionType3">
                            <el-option
                                v-for="option in curativeEffectStatusList.lesionType3StatusList"
                                :key="option.id"
                                :label="option.value"
                                :value="option.id"
                            />
                        </el-select>
                    </div>
                </div>
                <div class="sub-box">
                    <div class="section-sub special">
                        <span style="color: red; margin-right: 10px">*</span>
                        整体肿瘤疗效评估
                    </div>
                    <div class="inner-box">
                        <el-select v-model="curativeEffect">
                            <el-option
                                v-for="option in curativeEffectStatusList.curativeEffectStatusList"
                                :key="option.id"
                                :label="option.value"
                                :value="option.id"
                            />
                        </el-select>
                    </div>
                </div>
            </div>

            <div class="section" style="text-align: center">备注</div>
            <div class="sub-container">
                <div class="sub-box">
                    <div class="section-sub" style="text-align: center">
                        疾病进展备注
                    </div>
                    <el-input
                        v-model="diseaseSpeedRemark"
                        type="textarea"
                        resize="none"
                    />
                </div>
                <div class="sub-box">
                    <div class="section-sub" style="text-align: center">
                        不可评估备注
                    </div>
                    <el-input
                        v-model="notAssessRemark"
                        type="textarea"
                        resize="none"
                    />
                </div>
                <div class="sub-box">
                    <div class="section-sub" style="text-align: center">
                        本次访视备注
                    </div>
                    <el-input
                        v-model="thisVisitRemark"
                        type="textarea"
                        resize="none"
                    />
                </div>
            </div>

            <div class="section" style="text-align: center">
                既往访视疗效评估
            </div>
            <div class="evaluate-container">
                <div class="evaluate-box">
                    <div class="evaluate-name">访视</div>
                    <div class="evaluate-value">疗效评估</div>
                </div>
                <div
                    v-for="item in beforeCurativeEffectVisitList"
                    :key="item.visitId"
                    class="evaluate-container"
                >
                    <div class="evaluate-box">
                        <router-link
                            class="evaluate-name"
                            :to="{
                                path: '/assess/list/visit',
                                query: {
                                    assessJobId: item.assessJobId,
                                },
                            }"
                        >
                            {{ item.visitName }}
                        </router-link>
                        <div class="evaluate-value">
                            {{ item.curativeEffect }}
                        </div>
                    </div>
                </div>
            </div>

            <Sign
                :is-show="reportData.isCanSubmitReport === 1"
                :is-valid-pass="isValidPass"
                :show-sign="reportData.isCanSubmitReport === 0"
                :autograph-date="reportData.autographTime"
                @checkData="checkData"
                @submit="sumbitAll"
            />
        </el-form>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import {
    getIndependentReport,
    getCurativeEffectStatusList,
    setIndependentReport,
} from "@/api/assess/task";
import Sign from "../../../components/Sign";
import FlieList from "../FlieList.vue";
export default {
    components: { Sign, FlieList },
    data() {
        return {
            inRequest: false,
            loading: false,
            assessJobId: this.$route.query.assessJobId,
            reportData: {},
            /** 非淋巴结靶病灶 */
            lesionType1List: [],
            /** 淋巴结靶病灶 */
            lesionType2List: [],
            /** 非靶病灶 */
            lesionType3List: [],
            /** 新病灶 */
            lesionType4List: [],
            /** 既往病灶 */
            lesionType5List: [],
            /** 既往访视疗效评估 */
            beforeCurativeEffectVisitList: [],
            // 本次访视统计
            visitStatistics: [],
            responseEvaluationList: [],
            isDciomAssessQualified: undefined,
            isExistAssessType1: undefined,
            isExistAssessType2: undefined,
            /** 疗效评估-靶病灶 */
            lesionType1: undefined,
            /** 疗效评估-非靶病灶 */
            lesionType2: undefined,
            /** 疗效评估-新病灶 */
            lesionType3: undefined,
            /** 疗效评估-整体肿瘤疗效 */
            curativeEffect: undefined,
            curativeEffectStatusList: {
                lesionType1StatusList: [],
                lesionType2StatusList: [],
                lesionType3StatusList: [],
                curativeEffectStatusList: [],
            },
            /** 疾病进展备注 */
            diseaseSpeedRemark: "",
            /** 不可评估备注 */
            notAssessRemark: "",
            /** 本次访视备注 */
            thisVisitRemark: "",
            isValidPass: false,
        };
    },
    created() {
        this.getData();
        this.queryCurativeEffectStatusList();
    },
    methods: {
        async getData() {
            try {
                if (this.loading) return;
                this.loading = true;
                const response = await getIndependentReport({
                    assessJobId: this.assessJobId,
                });
                if (response.code === 200) {
                    this.reportData = response.data;
                    this.lesionType1List = response.data.lesionType1List;
                    this.lesionType2List = response.data.lesionType2List;
                    this.lesionType3List = response.data.lesionType3List;
                    this.lesionType4List = response.data.lesionType4List;
                    this.lesionType4List = response.data.lesionType5List
                    this.transformVisitStatistics(response.data.resultInfo);
                    this.beforeCurativeEffectVisitList =
                        response.data.beforeCurativeEffectVisitList;

                    this.lesionType1 = Number(
                        response.data.resultInfo.lesionType1
                    );
                    this.lesionType2 = Number(
                        response.data.resultInfo.lesionType2
                    );
                    this.lesionType3 = Number(
                        response.data.resultInfo.lesionType3
                    );
                    this.curativeEffect =
                        response.data.resultInfo.curativeEffect;

                    if (response.data.resultInfo) {
                        const {
                            isDciomAssessQualified,
                            isExistAssessType1,
                            isExistAssessType2,
                            diseaseSpeedRemark,
                            notAssessRemark,
                            thisVisitRemark,
                        } = response.data.resultInfo;
                        this.diseaseSpeedRemark = diseaseSpeedRemark;
                        this.notAssessRemark = notAssessRemark;
                        this.thisVisitRemark = thisVisitRemark;
                        this.isDciomAssessQualified =
                            isDciomAssessQualified === 0 ? "否" : "是";
                        this.isExistAssessType1 =
                            isExistAssessType1 === 0 ? "否" : "是";
                        this.isExistAssessType2 =
                            isExistAssessType2 === 0 ? "否" : "是";
                    }
                }
            } finally {
                this.loading = false;
            }
        },
        transformVisitStatistics(resultInfo) {
            const {
                sodSum,
                lesionType1LengthSum,
                lesionType2LengthSum,
                cFirstSodChangeRate,
                lowIsFirstVisit,
                lowSodChange,
                lowSodChangeRate,
            } = resultInfo;
            this.visitStatistics.push({
                sodSum,
                lesionType1LengthSum,
                lesionType2LengthSum,
                cFirstSodChangeRate,
                lowIsFirstVisit,
                lowSodChange,
                lowSodChangeRate,
            });
        },
        async queryCurativeEffectStatusList() {
            try {
                if (this.inRequest) return;
                this.inRequest = true;
                const response = await getCurativeEffectStatusList();
                if (response.code === 200) {
                    this.curativeEffectStatusList.lesionType1StatusList =
                        response.data[0].childList;
                    this.curativeEffectStatusList.lesionType2StatusList =
                        response.data[1].childList;
                    this.curativeEffectStatusList.lesionType3StatusList =
                        response.data[2].childList;
                    this.curativeEffectStatusList.curativeEffectStatusList =
                        response.data[3].childList;
                }
            } finally {
                this.inRequest = false;
            }
        },
        checkData() {
            if ([undefined, null, "", 0].includes(this.lesionType1)) {
                this.$message.warning("请选择疗效评估 - 靶病灶");
                this.isValidPass = false;
                return;
            }
            if ([undefined, null, "", 0].includes(this.lesionType2)) {
                this.$message.warning("请选择疗效评估 - 非靶病灶");
                this.isValidPass = false;
                return;
            }
            if ([undefined, null, "", 0].includes(this.lesionType3)) {
                this.$message.warning("请选择疗效评估 - 新病灶");
                this.isValidPass = false;
                return;
            }
            if ([undefined, null, "", 0].includes(this.curativeEffect)) {
                this.$message.warning("请选择疗效评估 - 整体肿瘤疗效评估");
                this.isValidPass = false;
                return;
            }
            this.isValidPass = true;
        },
        getLesionRemarksList() {
            const lesionRemarksList = [];
            this.lesionType1List.forEach((item) => {
                const { lesionId, lesionStatus, remark } = item;
                lesionRemarksList.push({
                    lesionId,
                    lesionStatus: Number(lesionStatus),
                    remark,
                });
            });
            this.lesionType2List.forEach((item) => {
                const { lesionId, lesionStatus, remark } = item;
                lesionRemarksList.push({
                    lesionId,
                    lesionStatus: Number(lesionStatus),
                    remark,
                });
            });

            this.lesionType3List.forEach((item) => {
                const { lesionId, lesionAssess, remark } = item;
                lesionRemarksList.push({
                    lesionId,
                    lesionAssess: Number(lesionAssess),
                    remark,
                });
            });

            this.lesionType5List.forEach((item) => {
                const { lesionId, lesionAssess, remark } = item;
                lesionRemarksList.push({
                    lesionId,
                    lesionAssess: Number(lesionAssess),
                    remark,
                });
            });
            return lesionRemarksList;
        },
        async sumbitAll() {
            try {
                if (this.inRequest) return;
                this.inRequest = true;
                const {
                    sodSum,
                    lesionType1LengthSum,
                    lesionType2LengthSum,
                    cFirstSodChangeRate,
                    lowAssessJobId,
                    lowVisitName,
                    lowSodChange,
                    lowSodChangeRate,
                } = this.reportData.resultInfo;
                const resultInfo = {
                    isDciomAssessQualified: this.isDciomAssessQualified,
                    sodSum,
                    lesionType1LengthSum,
                    lesionType2LengthSum,
                    cFirstSodChangeRate,
                    lowAssessJobId,
                    lowVisitName,
                    lowSodChange,
                    lowSodChangeRate,
                    lesionType1: this.lesionType1,
                    lesionType2: this.lesionType2,
                    lesionType3: this.lesionType3,
                    curativeEffect: this.curativeEffect,
                    diseaseSpeedRemark: this.diseaseSpeedRemark,
                    notAssessRemark: this.notAssessRemark,
                    thisVisitRemark: this.thisVisitRemark,
                };
                const response = await setIndependentReport({
                    assessJobId: this.assessJobId,
                    lesionRemarksList: this.getLesionRemarksList(),
                    resultInfo,
                });
                if (response.code === 200) {
                    this.$message.success(response.msg);
                    this.getData();
                }
            } finally {
                this.inRequest = false;
            }
        },
        openDicom() {
            let queryParamsByStudyInstanceUIDs = "";
            this.reportData.filmDicomInfo.studyInstanceUIDs.forEach(
                (item, index) => {
                    queryParamsByStudyInstanceUIDs += `${
                        index > 0 ? "&" : ""
                    }StudyInstanceUIDs=${item}`;
                }
            );

            const token = Cookies.get("Admin-Token");

            window.open(
                `${process.env.VUE_APP_DICOM}/viewer?${queryParamsByStudyInstanceUIDs}&assessJobId=${this.assessJobId}&token=${token}`,
                '_blank',
                'noopener'
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.info-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section {
    margin-top: 20px;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #d7d7d7;
    padding: 10px;
    font-weight: bold;

    .el-form-item:last-of-type {
        margin-bottom: 0;
    }
}

.sub-container {
    display: flex;
    width: 100%;
}
.sub-box {
    width: 50%;
    .section-sub {
        background-color: #e1e1e1;
        padding: 5px;
        font-weight: bold;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.special {
            text-align: center;
            background-color: transparent;
            border: 1px solid #dcdfe6;
        }
    }

    .inner-box {
        padding: 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #dcdfe6;
    }
}

.evaluate-container {
    display: -webkit-box;
    overflow-y: auto;

    .evaluate-box {
        text-align: center;
        min-width: 120px;
        border: 1px solid #dcdfe6;
        .evaluate-name {
            height: 35px;
            padding: 5px 0;
            display: block;
            width: 100%;
            border-bottom: 1px solid #dcdfe6;
        }

        a.evaluate-name {
            color: #019fff;
            text-decoration: underline;
        }

        .evaluate-value {
            padding: 5px 0;
            width: 100%;
        }
    }
}
</style>
