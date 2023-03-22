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
                    required
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

            <template v-if="lesionType1List.length > 0">
                <div class="section" style="text-align: center">
                    非淋巴结靶病灶
                </div>
                <el-table
                    :data="lesionType1List"
                    style="width: 100%; margin-bottom: 20px"
                >
                    <el-table-column prop="lesionNo" label="病灶编号" />
                    <el-table-column prop="organ" label="病灶部位" />
                    <el-table-column prop="position" label="病灶部位描述" />
                    <el-table-column prop="length" label="最长直径(mm)" />
                    <el-table-column prop="serialNumber" label="影像序列号" />
                    <el-table-column prop="instanceNumber" label="影像层号" />
                    <el-table-column prop="remark" label="备注">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" />
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template v-if="lesionType2List.length > 0">
                <div class="section" style="text-align: center">
                    淋巴结靶病灶
                </div>
                <el-table
                    :data="lesionType2List"
                    style="width: 100%; margin-bottom: 20px"
                >
                    <el-table-column prop="lesionNo" label="病灶编号" />
                    <el-table-column prop="organ" label="病灶部位" />
                    <el-table-column prop="position" label="病灶部位描述" />
                    <el-table-column prop="width" label="最大短径(mm)" />
                    <el-table-column prop="serialNumber" label="影像序列号" />
                    <el-table-column prop="instanceNumber" label="影像层号" />
                    <el-table-column prop="remark" label="备注">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" />
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <el-form-item label="是否存在非靶病灶">
                <el-radio-group v-model="isExistAssessType2" disabled>
                    <el-radio label="是" />
                    <el-radio label="否" />
                </el-radio-group>
            </el-form-item>

            <template v-if="lesionType3List.length > 0">
                <div class="section" style="text-align: center">非靶病灶</div>
                <el-table
                    :data="lesionType3List"
                    style="width: 100%; margin-bottom: 20px"
                >
                    <el-table-column prop="lesionNo" label="病灶编号" />
                    <el-table-column prop="organ" label="病灶部位" />
                    <el-table-column prop="position" label="病灶部位描述" />
                    <el-table-column prop="serialNumber" label="影像序列号" />
                    <el-table-column prop="instanceNumber" label="影像层号" />
                    <el-table-column prop="remark" label="备注">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" />
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <div class="section" style="text-align: center">基线期统计</div>
            <el-table
                :data="baseStatistics"
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
            </el-table>

            <div class="section" style="text-align: center">基线期备注</div>
            <el-form-item>
                <el-input
                    v-model="remarks"
                    :disabled="reportData.isCanSubmitReport === 0"
                    type="textarea"
                    :rows="2"
                    style="width: 100%"
                    placeholder="请输入基线期备注"
                />
            </el-form-item>
        </el-form>

        <Sign
            :is-show="reportData.isCanSubmitReport === 1"
            :is-valid-pass="isValidPass"
            :show-sign="reportData.isCanSubmitReport === 0"
            :autograph-date="reportData.autographTime"
            @checkData="checkData"
            @submit="sumbitAll"
        />
    </div>
</template>

<script>
import {
    getIndependentFirstReport,
    setIndependentFirstReport,
} from "@/api/assess/list";
import Sign from "../../../components/Sign";
import FlieList from "../FlieList.vue";
import Cookies from "js-cookie";
export default {
    components: {
        Sign,
        FlieList
    },
    data() {
        return {
            loading: false,
            /** 任务id */
            assessJobId: this.$route.query.assessJobId,
            reportData: {},
            /** 非淋巴结靶病灶 */
            lesionType1List: [],
            /** 淋巴结靶病灶 */
            lesionType2List: [],
            /** 非靶病灶 */
            lesionType3List: [],
            /** 基线期统计 */
            baseStatistics: [],
            inRequest: false,
            /** 备注 */
            remarks: "",
            /** 当前访视整体影像质量是否符合肿瘤疗效评估要求:0=不符合,1=符合 */
            isDciomAssessQualified: undefined,
            /** 是否存在靶病灶:0=不存在,1=存在 */
            isExistAssessType1: undefined,
            /** 是否存在非靶病灶:0=不存在,1=存在 */
            isExistAssessType2: undefined,
            isValidPass: false,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        async getData() {
            try {
                if (this.loading) return;
                this.loading = true;
                const response = await getIndependentFirstReport({
                    assessJobId: this.assessJobId,
                });
                if (response.code === 200) {
                    this.reportData = response.data;
                    this.remarks = response.data.resultInfo.remarks;
                    this.lesionType1List = response.data.lesionType1List;
                    this.lesionType2List = response.data.lesionType2List;
                    this.lesionType3List = response.data.lesionType3List;
                    this.baseStatistics.push({
                        sodSum: response.data.resultInfo.sodSum,
                        lesionType1LengthSum:
                            response.data.resultInfo.lesionType1LengthSum,
                        lesionType2LengthSum:
                            response.data.resultInfo.lesionType2LengthSum,
                    });
                    if (response.data.resultInfo) {
                        const {
                            isDciomAssessQualified,
                            isExistAssessType1,
                            isExistAssessType2,
                        } = response.data.resultInfo;
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
        checkData() {
            if ([null, undefined, ""].includes(this.isDciomAssessQualified)) {
                this.$message.success("请选择必填项");
                this.isValidPass = false;
                return;
            }
            this.isValidPass = true;
        },
        restrcutureData() {
            const lesionRemarksList = [];
            [
                ...this.lesionType1List,
                ...this.lesionType2List,
                ...this.lesionType3List,
            ].forEach((item) => {
                const { lesionId, remark } = item;
                lesionRemarksList.push({ id: lesionId, value: remark });
            });
            const data = {
                assessJobId: this.assessJobId,
                lesionRemarksList,
                resultInfo: {
                    remarks: this.remarks,
                    isDciomAssessQualified:
                        this.isDciomAssessQualified === "否" ? 0 : 1,
                    isExistAssessType1:
                        this.isExistAssessType1 === "否" ? 0 : 1,
                    isExistAssessType2:
                        this.isExistAssessType2 === "否" ? 0 : 1,
                },
            };
            return data;
        },
        async sumbitAll() {
            try {
                if (this.inRequest) return;
                this.inRequest = true;
                const data = this.restrcutureData();
                const response = await setIndependentFirstReport(data);
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
                "_blank",
                "noopener"
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
