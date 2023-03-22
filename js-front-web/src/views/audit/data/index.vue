<template>
    <div class="app-container">
        <el-tabs v-model="queryParams.examineAuditType" @tab-click="handleClick">
            <el-tab-pane label="数据质控" name="1" />
            <el-tab-pane label="数据质控复核" name="2" />
        </el-tabs>

        <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="100px">
            <el-form-item label="质疑状态">
                <el-select v-model="queryParams.questionReplyStatus" placeholder="" clearable>
                  <el-option label="QC未回复" :value="0" />
                  <el-option label="CRC未回复" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="是否加急">
                <el-select v-model="queryParams.urgentType" placeholder="全部" clearable>
                    <el-option label="全部" value="0" />
                    <el-option label="加急" value="1" />
                    <el-option label="不加急" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="中心" prop="centerNo">
                <el-input v-model="queryParams.centerNo" placeholder="" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="受试者编号" prop="examineNo">
                <el-input v-model="queryParams.examineNo" placeholder="" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="访视日期" prop="visitDate">
                <el-date-picker v-model="queryParams.actualVisitDate" type="date" value-format="yyyy-MM-dd"
                    placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="状态" prop="auditStatus">
                <el-select v-model="queryParams.examineStatus" placeholder="全部" clearable>
                    <el-option label="全部" value="" />
                    <el-option v-for="item in examineStatusList" :key="item.id" :label="item.value" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="完成上传时间" prop="completeUploadDatetime">
                <el-date-picker v-model="queryParams.completeUploadTime" type="date" value-format="yyyy-MM-dd"
                    placeholder="选择日期" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button v-hasPermi="['question:add']" type="primary" plain icon="el-icon-plus" size="mini"
                    @click="handleAdd">发起质疑</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button v-hasPermi="['system:post:edit']" type="success" plain icon="el-icon-edit" size="mini"
                    :disabled="single" @click="handleUpdate">操作记录</el-button>
            </el-col>
            <!--
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                        @click="handleDelete" v-hasPermi="['system:post:remove']">删除</el-button>
                </el-col>
                -->
            <el-col :span="1.5">
        <el-button v-hasPermi="['question:export']" type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
    </el-col>
    <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
</el-row>

        <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :selectable="checkSelectMember" width="55" align="center" />
            <el-table-column label="质疑" align="center" prop="examineType">
                <template slot-scope="scope">
                    <i v-if="scope.row.questionReplyStatus === 1" class="el-icon-question" style="color: red; cursor: pointer" @click="openDia(scope.row)" />
          <i class="el-icon-question" v-else-if="scope.row.questionReplyStatus === 2" style="color: #999; cursor: pointer" @click="openDia(scope.row)" />
          <i class="el-icon-question" v-else-if="scope.row.questionReplyStatus === 3" style="color: rgb(19, 206, 102); cursor: pointer" @click="openDia(scope.row)" />
          <span v-else>-</span>

                </template>
            </el-table-column>
            <el-table-column label="是否加急" align="center" prop="isUrgent">
                <template slot-scope="scope">
                    <p v-if="scope.row.isUrgent === 0">
                        {{ scope.row.isUrgent === 0 && "没有加急" }}
                    </p>
                    <p v-if="scope.row.isUrgent === 1" style="color: red">
                        {{ scope.row.isUrgent === 1 && "加急" }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="中心" align="center" prop="centerNo" />
            <el-table-column label="受试者编号" align="center" prop="examineNo" />
            <el-table-column label="受试者随机编号" align="center" prop="randomNo" />
            <el-table-column label="访视" align="center" prop="visitName" />
            <el-table-column label="首次检查日期" align="center" prop="actualVisitDate" />
            <el-table-column label="状态" align="center" prop="examineStatusMsg" />
            <el-table-column label="完成上传时间" align="center" prop="completeUploadTime" width="150" />
            <el-table-column label="质控完成时间" align="center" prop="completeExamineTime" width="150" />
            <el-table-column label="质控人" align="center" prop="examineAdmin" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <QualityControlDialog v-show="scope.row.isCanExamine == '1'" :visitId="scope.row.visitId" :examineAuditType="scope.row.examineAuditType"
                        :examineId="scope.row.examineId" buttonName="质控" @refresh="getData" />
                    <QualityControlDialog v-show="scope.row.isShowExamineRecord == '1'" :visitId="scope.row.visitId" :examineAuditType="scope.row.examineAuditType"
                        :examineId="scope.row.examineId" buttonName="质控记录" @refresh="getData" />
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

        <!-- 发起质疑 -->
        <el-dialog title="发起质疑" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="质疑类型：" prop="secondCategoryId">
                <el-cascader v-model="form.secondCategoryId" :options="categoryList" :props="props" style="width: 90%" clearable />
                </el-form-item>
                <el-form-item label="质疑内容：" prop="content">
                <el-input
                    v-model="form.content"
                    style="width: 90%"
                    type="textarea"
                    :rows="2"
                    maxlength="200"
                    placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="是否加急：" prop="isUrgent">
                <el-select v-model="form.isUrgent" placeholder="请选择" style="width: 90%" clearable>
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                </el-select>
                </el-form-item>
                <el-form-item label="图片：" prop="imageUrlList">
                <!-- <i class="el-icon-picture-outline" style="font-size: 22px" /> -->
                <div class="section" style="text-align: center;overflow: hidden;">
                    <div style="float:left;">
                    <FileUpload :limit="9" :file-type="fileType" :title="uploadTitle" @updateFileList="updateFileList" />
                    </div>
                </div>
                <div v-if="form.imageUrlList && form.imageUrlList.length > 0" class="img-sty-box">
                    <img v-for="(item,index) in form.imageUrlList" :key="index" :src="item" class="img-sty" @click="previewImg(item)">
                </div>
                </el-form-item>
                <el-form-item style="display: flex; justify-content: end">
                    <el-button type="primary" @click="handleSubmit">确认</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 质疑详情 -->
      <QuestionDetails :visible="detailsDialog" :visitId="visitIdDetail" @close="closeDia" />
      <!-- 图片放大 -->
    <el-dialog :visible.sync="showPreview" width="90%" height="500px" append-to-body style="text-align: center;overflow: hidden;">
      <div style="height: 600px;overflow: scroll;">
        <img :src="imgPreview" style="max-width: 100%; max-height: 100%; object-fit: contain;">
      </div>
    </el-dialog>
    </div>
</template>

<script>
import { getPost, delPost, addPost, updatePost } from "@/api/system/post";
import { getDataExamineList, getExamineStatusList, getQuestionCategoryList, addQuestionBacth } from "@/api/audit/data";
import QualityControlDialog from "./components/QualityControlDialog.vue";
import QuestionDetails from '@/views/components/QuestionDetails/index'
import FileUpload from '@/views/components/FileUpload/commonUpload'
export default {
  name: 'Post',
    dicts: ["sys_normal_disable"],
    components: {
        QualityControlDialog,
        QuestionDetails,
        FileUpload
    },
    data() {
        return {
            showPreview: false,
            imgPreview: '',
            fileType: ['jpg', 'png'],
            uploadTitle: '支持jpg,png格式，最多上传9张',
            categoryList: [],
            detailsDialog: false,
            props: {
                value: 'id',
                label: 'name',
                children: 'child'
            },
            visitIds: '',
            visitIdDetail: '',
            activeName: "1",
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
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            visit: false,
            // 查询参数
            queryParams: {
                projectId: JSON.parse(localStorage.getItem("chooseProject")).id,
                examineAuditType: "1",
                pageNum: 1,
                pageSize: 10,
                questionReplyStatus: undefined,
                urgentType: undefined,
                centerNo: undefined,
                examineNo: undefined,
                actualVisitDate: undefined,
                examineStatus: undefined,
                completeUploadTime: undefined,
            },
            // 表单参数
            form: {
                secondCategoryId: '',
                content: '',
                imageUrlList: [],
                isUrgent: '' //0-不加急 1-加急
            },
            // 表单校验
            rules: {
        secondCategoryId: [{ required: true, message: '质疑类型不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '质疑内容不能为空', trigger: 'blur' }],
        isUrgent: [{ required: true, message: '请选择是否加急', trigger: 'blur' }]
        // imageUrlList: [{ required: true, message: '请上传图片', trigger: 'blur' }]
            },
            tableDatax: [
                {
                    id: "2022-09-25 7:24:29",
                    name: "CT",
                    amount1: "C+",
                    amount2: "10",
                    amount3: 10,
                },
                {
                    id: "2022-09-25 7:24:29",
                    name: "MR",
                    amount1: "C+",
                    amount2: "10",
                    amount3: 12,
                },
                {
                    id: "2022-09-25 7:24:29",
                    name: "CT",
                    amount1: "C+",
                    amount2: "10",
                    amount3: 9,
                },
            ],
            tableDataz: [
                {
                    id: "层厚符合方案要求",
                    name: "≤5mm",
                    amount1: "MR层厚超出方案要求",
                    amount2: "不通过",
                    amount3: 10,
                    buwei: "CT：3mm, MR：6mm",
                },
                {
                    id: "检查方式与方案相符",
                    name: "基线期CT,MR,骨扫描",
                    amount1: "缺少骨扫描",
                    amount2: "10",
                    amount3: 12,
                    buwei: "CT,MR",
                },
                {
                    id: "检查日期、检查方式与数据描述一致",
                    name: "-",
                    amount1: "一致",
                    amount2: "不通过",
                    amount3: 9,
                    buwei: "相符",
                },
                {
                    id: "数据无断层",
                    name: "-",
                    amount1: "无断层",
                    amount2: "通过",
                    amount3: 9,
                    buwei: "无断层",
                },
                {
                    id: "受试者出生年月与图像一致",
                    name: "-",
                    amount1: "一致",
                    amount2: "通过",
                    amount3: 9,
                    buwei: "一致",
                },
            ],
            tableDatay: [
                {
                    id: "2022-09-25 7:24:29",
                    name: "CT",
                    amount1: "增强",
                    amount2: "通过",
                    amount3: 10,
                    buwei: "腹部",
                },
                {
                    id: "2022-09-25 7:24:29",
                    name: "MR",
                    amount1: "平扫",
                    amount2: "10",
                    amount3: 12,
                    buwei: "胸部",
                },
                {
                    id: "2022-09-25 7:24:29",
                    name: "CT",
                    amount1: "增强",
                    amount2: "通过",
                    amount3: 9,
                    buwei: "头部",
                },
            ],
            tableDataT: [
                {
                    id: "层厚符合方案要求",
                    name: "≤5mm",
                    amount1: "C+",
                    amount2: "不适用",
                    amount3: 10,
                    buwei: "腹部",
                },
                {
                    id: "检查方式与方案相符",
                    name: "基线期CT,MR,骨扫描",
                    amount1: "C+",
                    amount2: "10",
                    amount3: 12,
                    buwei: "胸部",
                },
                {
                    id: "检查日期、检查方式与数据描述一致",
                    name: "-",
                    amount1: "C+",
                    amount2: "10",
                    amount3: 9,
                    buwei: "头部",
                },
                {
                    id: "数据无断层",
                    name: "-",
                    amount1: "C+",
                    amount2: "10",
                    amount3: 9,
                    buwei: "头部",
                },
                {
                    id: "受试者出生年月与图像一致",
                    name: "-",
                    amount1: "C+",
                    amount2: "10",
                    amount3: 9,
                    buwei: "头部",
                },
                {
                    id: "审核结论",
                    name: "-",
                    amount1: "C+",
                    amount2: "10",
                    amount3: 9,
                    buwei: "头部",
                },
                {
                    id: "备注：",
                    name: "-",
                    amount1: "C+",
                    amount2: "10",
                    amount3: 9,
                    buwei: "头部",
                },
            ],
            examineStatusList: [],
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取质疑类型列表
        getCategoryList() {
            getQuestionCategoryList().then((res) => {
                if (res.data && res.data.length > 0) {
                // this.options = res.data
                this.categoryList = this.getTreeData(res.data)
                }
            })
        },
        getTreeData(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].child.length < 1) {
                // sub若为空数组，则将sub设为undefined
                data[i].child = undefined
                } else {
                // sub若不为空数组，则继续 递归调用 本方法
                this.getTreeData(data[i].child)
                }
            }
            return data
        },
        async getData() {
            this.getList();
            this.queryExamineStatusList();
        },
        /** 查询岗位列表 */
        async getList() {
            try {
                this.loading = true;
                const response = await getDataExamineList(this.queryParams);
                if (response.code === 200) {
                    if (response.rows.length > 0) {
                        response.rows = response.rows.map(item => { return { ...item, examineAuditType: this.queryParams.examineAuditType } })
                    }
                    this.postList = response.rows;
                    this.total = response.total;
                }
            } finally {
                this.loading = false;
            }
        },
        async queryExamineStatusList() {
            const response = await getExamineStatusList({
                examineAuditType: this.queryParams.examineAuditType,
            });
            if (response.code === 200) {
                this.examineStatusList = response.data;
            }
        },
        handleClick() {
            this.queryExamineStatusList()
            this.getList();
        },
        // 取消按钮
        cancel() {
            this.$refs.form.resetFields()
            this.form.imageUrlList = []
            this.open = false
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
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams = {
                projectId: JSON.parse(localStorage.getItem("chooseProject")).id,
                examineAuditType: "1",
                pageNum: 1,
                pageSize: 10,
                questionReplyStatus: undefined,
                urgentType: undefined,
                centerNo: undefined,
                examineNo: undefined,
                actualVisitDate: undefined,
                examineStatus: undefined,
                completeUploadTime: undefined,
            };
            this.$refs["queryForm"].resetFields();
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.postId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
            this.visitIds = selection.map((item) => item.visitId)
        },
        /** 新增按钮操作 */
        handleAdd() {
            if (!this.visitIds || this.visitIds.length < 0) {
                this.$message.error("请选择至少一条数据")
                return
            }
            this.open = true;
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
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.postId !== undefined) {
                        updatePost(this.form).then((response) => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addPost(this.form).then((response) => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        previewImg(url) {
        this.showPreview = true
        this.imgPreview = url
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
                .catch(() => { });
        },
        /** 导出按钮操作 */
        async handleExport() {
            this.download(
                "/dataExamine/export",
                {
                    ...this.queryParams,
                },
                `post_${new Date().getTime()}.xlsx`
            );
        },
        // 关闭质疑弹窗
        closeDia() {
        this.visitIdDetail = ''
        this.detailsDialog = false
        },
        openDia(row) {
        this.visitIdDetail = row.visitId
        this.detailsDialog = true
        },
        // 接受上传数据
        updateFileList(fileList) {
            this.form.imageUrlList = fileList.map(item => item.url)
        },
        async handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                this.form.visitIds = this.visitIds
                this.form.examineAuditType = this.queryParams.examineAuditType
                this.form.secondCategoryId = this.form.secondCategoryId[1]
                addQuestionBacth(this.form).then((res) => {
                    if (res.code === 200) {
                    this.$message.success(res.msg)
                    this.cancel()
                    }
                })
                }
            })
        },
        checkSelectMember(row, index) {
            return row.isCanQuestion === 1
        }
    },
};
</script>

<style  lang="scss" scoped>
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
  cursor: pointer;
}
</style>
