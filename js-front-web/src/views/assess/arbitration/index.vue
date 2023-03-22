<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="getExamineeArbitrationList"
                    >受试者仲裁</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="getVisitArbitrationList"
                    >访视仲裁</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain size="mini" @click="setJJ"
                    >设置加急数据</el-button
                >
                <!--
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleAdd"
          >分配审核任务</el-button
        >
        -->
            </el-col>
            <right-toolbar
                :showSearch.sync="showSearch"
                @queryTable="getList"
            ></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="postList"
            @selection-change="selectIndependentList"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column label="是否紧急" align="center" prop="isUrgent" />
            <el-table-column
                label="评估配置编号"
                align="center"
                prop="assessCfgId"
            />
            <el-table-column label="包含访视" align="center" prop="visitName" />
            <el-table-column label="评估人编号" align="center" prop="irNo" />
            <el-table-column
                label="评估人"
                align="center"
                prop="evaluatorName"
            />
            <el-table-column
                label="开始评估时间"
                align="center"
                prop="startDate"
            />
            <el-table-column
                label="完成评估时间"
                align="center"
                prop="endDate"
            />
            <el-table-column label="创建人" align="center" prop="createBy" />
            <el-table-column
                label="创建时间"
                align="center"
                prop="createTime"
            />
            <el-table-column label="修改人" align="center" prop="updateBy" />
            <el-table-column
                label="修改时间"
                align="center"
                prop="updateTime"
            />
            <el-table-column
                label="对比结果"
                align="center"
                prop="compareResult"
            />
            <el-table-column label="状态" align="center" prop="statusMsg" />
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <Withdraw
                        v-if="scope.row.isCanInvalid === 1"
                        :assessJobId="scope.row.assessJobId"
                        @getList="getList"
                    />
                    <EvaluatorDialog
                        v-if="scope.row.isCanEditEvaluator === 1"
                        :assessJobId="scope.row.assessJobId"
                        @getList="getList"
                    />
                    <CompareRecore
                        :assessJobId="scope.row.assessJobId"
                        :examineeId="chooseNowItem.examineeId"
                        @getList="getList"
                    />
                    <DistributeEvaluator
                        v-if="scope.row.isCanAddEvaluator === 1"
                        :assessJobId="scope.row.assessJobId"
                        @getList="getList"
                    />
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 创建独立评估任务 -->
        <el-dialog
            :title="title"
            :visible.sync="open"
            width="700px"
            append-to-body
        >
            <el-descriptions title="">
                <el-descriptions-item label="受试者编号">{{
                    chooseNowItem.examineeNo
                }}</el-descriptions-item>
                <el-descriptions-item label="随机编码">{{
                    chooseNowItem.randomNo
                }}</el-descriptions-item>
                <el-descriptions-item label="评估类型"
                    >BICR</el-descriptions-item
                >
            </el-descriptions>
            <el-form
                ref="createMissionForm"
                :model="createMissionForm"
                :rules="createMissionFormRules"
                label-width="100px"
            >
                <el-form-item label="评估标准" prop="assessCfgId">
                    <el-select
                        v-model="createMissionForm.assessCfgId"
                        placeholder=""
                        clearable
                    >
                        <el-option
                            v-for="item in creatNeedInfo.assessCfgList"
                            :key="item.id"
                            :label="item.standardList"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="评估流程" prop="postCode">
                    <el-input
                        value="双IR+全局+ADJ+CR"
                        placeholder="请输入评估流程"
                        :readonly="true"
                    />
                </el-form-item>
                <el-form-item label="独立评估人" prop="evaluatorIds">
                    <el-select
                        v-model="createMissionForm.evaluatorIds"
                        placeholder=""
                        multiple
                    >
                        <el-option
                            v-for="item in creatNeedInfo.evaluatorList"
                            :key="item.evaluatorId"
                            :label="item.evaluatorMsg"
                            :value="item.evaluatorId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否加急" prop="isUrgent">
                    <el-radio-group v-model="createMissionForm.isUrgent">
                        <el-radio label="1">加急</el-radio>
                        <el-radio label="0">不加急</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-table
                    ref="multipleTable"
                    :data="creatNeedInfo.visitList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectVisit"
                >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="name" label="是否加急" width="" />
                    <el-table-column prop="name" label="待分配访视" width="" />
                    <el-table-column
                        prop="name"
                        label="此标准已分配医生"
                        width=""
                    />
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 数据重传 -->
        <el-dialog
            :title="title"
            :visible.sync="openDataRetransmission"
            width="700px"
            append-to-body
        >
            <el-descriptions title="">
                <el-descriptions-item label="受试者编号">{{
                    chooseNowItem.examineeNo
                }}</el-descriptions-item>
                <el-descriptions-item label="随机编码">{{
                    chooseNowItem.randomNo
                }}</el-descriptions-item>
            </el-descriptions>
            <el-form
                ref="dataRetransmissionForm"
                :model="dataRetransmissionForm"
                :rules="dataRetransmissionFormRules"
                label-width="110px"
            >
                <el-form-item label="数据退回节点" prop="postSort">
                    <el-select
                        v-model="dataRetransmissionForm.fallbackStageId"
                        placeholder=""
                        clearable
                    >
                        <el-option
                            v-for="item in dataRetransmissionInfo.fallbackStageList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-table
                    ref="multipleTable"
                    :data="dataRetransmissionInfo.visitList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectDataRetransmission"
                >
                    <el-table-column type="selection" width="" />
                    <el-table-column prop="value" label="访视" width="" />
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataRetransmissionForm"
                    >确 定</el-button
                >
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="评估报告"
            :visible.sync="reportDia"
            width="700px"
            :before-close="handleClose"
        >
            <el-image :src="report" style="width: 100%"></el-image>
        </el-dialog>
    </div>
</template>

<script>
import {
    listJobArbitrateList as listPost,
    getPost,
    delPost,
    assessJobIndependentAdd,
    updatePost,
    getCreateAssessDetails,
    getAssessDataFallbackDetails,
    setAssessDataFallback,
    setAssessEvaluatorId,
    setJsAssessJobIsUrgen,
} from "@/api/assess/task";
import report from "@/assets/images/report.png";
import EvaluatorDialog from "./components/EvaluatorDialog";
import Withdraw from "./components/Withdraw";
import CompareRecore from "./components/CompareRecore";
import DistributeEvaluator from "./components/DistributeEvaluator";

export default {
    name: "Post",
    dicts: ["sys_normal_disable"],
    props: {
        chooseNowItem: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    components: {
        EvaluatorDialog,
        Withdraw,
        CompareRecore,
        DistributeEvaluator,
    },
    data() {
        return {
            queryDialogVisible: false,
            reportDia: false,
            openDataRetransmission: false,
            report,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],
            creatNeedInfo: {
                assessCfgId: "",
                assessCfgList: [],
                evaluatorList: [],
                independentEvaluatorList: [],
                visitList: [],
            },
            dataRetransmissionInfo: {},
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                examineeId: this.chooseNowItem.examineeId,
                postCode: undefined,
                postName: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            dataRetransmissionForm: {},
            createMissionForm: {
                projectId: JSON.parse(localStorage["chooseProject"]).id,
                examineeId: this.chooseNowItem.examineeId,
                visitIds: [],
            },
            // 表单校验
            rules: {
                postName: [
                    {
                        required: true,
                        message: "岗位名称不能为空",
                        trigger: "blur",
                    },
                ],
                postCode: [
                    {
                        required: true,
                        message: "岗位编码不能为空",
                        trigger: "blur",
                    },
                ],
                postSort: [
                    {
                        required: true,
                        message: "岗位顺序不能为空",
                        trigger: "blur",
                    },
                ],
            },
            createMissionFormRules: {},
            dataRetransmissionFormRules: {},
            selectIndependentIdsList: [],
            selectDataRetransmissionList: [],
            visitSelectList: [],
        };
    },
    watch: {
        chooseNowItem: {
            handler: function (value) {
                this.queryParams = {
                    ...this.queryParams,
                    examineeId: value.examineeId,
                };
                this.getList();
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        selectVisit(selection) {
            this.createMissionForm.visitIds = selection.map((item) => item.id);
        },
        //
        selectDataRetransmission(selection) {
            this.selectDataRetransmissionList = selection.map(
                (item) => item.id
            );
        },
        // 数据重传
        dataRetransmission() {
            // if (this.selectIndependentIdsList.length < 1) {
            //     return this.$message.warning("请至少选择一个评估任务");
            // }
            getAssessDataFallbackDetails({
              examineeId: this.chooseNowItem.examineeId,
            }).then((response) => {
                this.dataRetransmissionInfo = response.data;
            });
            this.openDataRetransmission = true;
        },
        handleClose() {},
        getExamineeArbitrationList() {
            this.queryParams = { ...this.queryParams, arbitrationDimension: 2 };
            this.getList();
        },
        getVisitArbitrationList() {
            this.queryParams = { ...this.queryParams, arbitrationDimension: 3 };
            this.getList();
        },
        /** 查询岗位列表 */
        getList() {
            this.loading = true;
            listPost(this.queryParams).then((response) => {
                this.postList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                postId: undefined,
                postCode: undefined,
                postName: undefined,
                postSort: 0,
                status: "0",
                remark: undefined,
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        //勾选独立评估任务列表
        selectIndependentList(selection) {
            this.selectIndependentIdsList = selection.map(
                (item) => item.assessJobId
            );
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.postId);
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.getCreateAssessDetails();
            this.open = true;
            this.title = "创建独立评估任务";
        },
        //
        getCreateAssessDetails() {
            getCreateAssessDetails({
                projectId: JSON.parse(localStorage["chooseProject"]).id,
                examineeId: this.chooseNowItem.examineeId,
            }).then((response) => {
                this.creatNeedInfo = response.data || {};
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const postId = row.postId || this.ids;
            getPost(postId).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = "修改岗位";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["createMissionForm"].validate((valid) => {
                if (valid) {
                    if (this.form.postId != undefined) {
                        updatePost(this.form).then((response) => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        if (this.createMissionForm.visitIds < 1) {
                            return this.$message.warning("请至少选择一个访视");
                        }
                        assessJobIndependentAdd(this.createMissionForm).then(
                            (response) => {
                                this.$modal.msgSuccess("新增成功");
                                this.open = false;
                                this.getList();
                            }
                        );
                    }
                }
            });
        },
        submitDataRetransmissionForm: function () {
            if (this.dataRetransmissionForm.visitIds < 1) {
                return this.$message.warning("请至少选择一个访视");
            }
            this.$refs["dataRetransmissionForm"].validate((valid) => {
                if (valid) {
                    // this.dataRetransmissionForm.assessJobIds =
                    //     this.selectIndependentIdsList.join();
                    this.dataRetransmissionForm.visitIds =
                        this.selectDataRetransmissionList.join();
                    setAssessDataFallback(this.dataRetransmissionForm).then(
                        (response) => {
                            this.$modal.msgSuccess("操作成功");
                            this.openDataRetransmission = false;
                        }
                    );
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const postIds = row.postId || this.ids;
            this.$modal
                .confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？')
                .then(function () {
                    return delPost(postIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "system/post/export",
                {
                    ...this.queryParams,
                },
                `post_${new Date().getTime()}.xlsx`
            );
        },
        // 关闭质疑弹窗
        closeDia() {
            this.queryDialogVisible = false;
        },
        openDia() {
            this.$refs.queryDia.openDia();
        },
        // 修改评估人
        updateEvaluator() {
            if (!this.evaluatorId) {
                return this.$message.warning("请选择新评估人");
            }
            setAssessEvaluatorId({
                assessJobId: this.assessJobId,
                evaluatorId: this.evaluatorId,
            }).then((res) => {
                this.evaluatorId = "";
                this.$message.success("修改成功");
                this.show = false;
                this.$emit("getList");
            });
        },
        setJJ() {
            if (this.selectIndependentIdsList.length < 1) {
                this.$message.warning("请至少选择一个评估任务");
                return;
            }
            this.$alert("确定将此访视设置为加急数据？", "设置为加急数据", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        this.setUrgent("1");
                    }
                },
            });
        },
        // 加急
        setUrgent(isUrgent) {
            setJsAssessJobIsUrgen({
                assessJobIds: this.selectIndependentIdsList.join(),
                isUrgent: isUrgent,
            }).then((response) => {
                this.$modal.msgSuccess("操作成功");
                this.getList();
            });
        },
    },
};
</script>
