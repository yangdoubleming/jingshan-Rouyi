<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="100px">
            <el-form-item label="质疑" prop="questionStatus">
                <el-select v-model="queryParams.status" placeholder="全部" clearable>
                    <el-option label="全部" value="全部" />
                    <el-option label="未关闭" value="未关闭" />
                    <el-option label="已关闭" value="已关闭" />
                </el-select>
            </el-form-item>
            <el-form-item label="中心" prop="centerName">
                <el-select v-model="queryParams.status" placeholder="全部" clearable>
                    <el-option label="全部" value="全部" />
                    <el-option label="ZX00001" value="ZX00001" />
                    <el-option label="ZX00002" value="ZX00002" />
                </el-select>
            </el-form-item>
            <el-form-item label="受试者" prop="examinee">
                <el-input v-model="queryParams.postCode" placeholder="" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="访视" prop="visitPlanName">
                <el-input v-model="queryParams.postName" placeholder="" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="访视日期" prop="visitDate">
                <el-date-picker v-model="value1" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="审核状态" prop="auditStatus">
                <el-select v-model="queryParams.status" placeholder="全部" clearable>
                    <el-option label="全部" value="全部" />
                    <el-option label="待审核" value="待审核" />
                    <el-option label="ZX00002" value="ZX00002" />
                </el-select>
            </el-form-item>
            <el-form-item label="完成上传时间" prop="completeUploadDatetime">
                <el-date-picker v-model="value1" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="审核完成时间" prop="auditCompleteDatetime">
                <el-date-picker v-model="value1" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="审核人" prop="auditBy">
                <el-input v-model="queryParams.postName" placeholder="" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['question:add']">发起质疑</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['system:post:edit']">操作记录</el-button>
            </el-col>
            <!--
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                    @click="handleDelete" v-hasPermi="['system:post:remove']">删除</el-button>
            </el-col>
            -->
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['question:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="质疑" align="center" prop="status">
                <template slot-scope="scope">
                    <i class="el-icon-question" v-if="scope.row.status == '正常'" style="color: red; cursor: pointer"
                        @click="openDia"></i>
                    <i class="el-icon-question" v-else style="color: #323e52"></i>
                </template>
            </el-table-column>
            <el-table-column label="中心" align="center" prop="centerName" />
            <el-table-column label="受试者" align="center" prop="examinee" />
            <el-table-column label="访视" align="center" prop="visitPlanName" />
            <el-table-column label="访视日期" align="center" prop="visitDate" />
            <el-table-column label="审核状态" align="center" prop="auditStatus" />
            <el-table-column label="完成上传时间" align="center" prop="completeUploadDatetime" width="150" />
            <el-table-column label="审核完成时间" align="center" prop="auditCompleteDatetime" width="150" />
            <el-table-column label="审核人" align="center" prop="auditBy" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <el-button size="mini" type="text" v-hasPermi="['system:post:edit']">审核</el-button>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

        <!-- 添加或修改岗位对话框 -->
        <el-dialog title="发起质疑" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="质疑类型：" prop="postName">
                    <el-select v-model="form.postName" style="width:100%" placeholder="影像不符合中心手册要求" clearable>
                        <el-option label="层厚不符合中心手册要求" value="全部" />
                        <el-option label="增强扫描期相不符合" value="未关闭" />
                        <el-option label="扫描优先级不符合" value="已关闭" />
                        <el-option label="其他" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="postName">
                    <el-select v-model="form.postName" style="width:100%" placeholder="影像质量问题" clearable>
                        <el-option label="伪影" value="全部" />
                        <el-option label="其他" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="postName">
                    <el-select v-model="form.postName" style="width:100%" placeholder="影像合规性问题" clearable>
                        <el-option label="影像中有标记和或注释" value="全部" />
                        <el-option label="其他" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="质疑内容" prop="postCode">
                    <el-input v-model="form.postCode" type="textarea" :rows="2" placeholder="请输入质疑内容" />
                </el-form-item>
                <el-form-item label="是否加急" prop="postName">
                    <el-select v-model="form.postName" placeholder="影像质量问题" style="width:100%" clearable>
                        <el-option label="是" value="全部" />
                        <el-option label="否" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="postName">
                    <i class="el-icon-picture-outline" style="font-size:22px;"></i>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 访视详情 -->
        <el-dialog title="" :visible.sync="visit" width="1000px" append-to-body>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-size:large;">访视详情</span>
                </div>
                <el-descriptions class="margin-top" title="" :column="4" :size="size" border>
                    <el-descriptions-item>
                        <template slot="label">
                            中心编号：
                        </template>
                        01
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            受试者编号：
                        </template>
                        01001
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            出生年月：
                        </template>
                        1975-01
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            身高：
                        </template>
                        178.0 cm
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            体重：
                        </template>
                        74.0kg
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            计划访视日期：
                        </template>
                        2021-07-20（±7）
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            访视日期：
                        </template>
                        2021-08-01（已超窗）
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            完成上传视时间：
                        </template>
                        2022-09-25 13:28:17
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            状态：
                        </template>
                        等待审核
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            备注：
                        </template>
                        XXXXXXXXXXXXXXXX
                    </el-descriptions-item>
                </el-descriptions>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-size:large;">上传详情</span>
                    <el-button style="float: right;" type="primary">删除</el-button>
                    <el-button style="float: right; margin-right: 20px;">查看</el-button>
                </div>
                <div>
                    <el-tag>DICOM</el-tag>&nbsp;&nbsp;
                    <el-tag type="success">图片集</el-tag>&nbsp;&nbsp;
                    <el-tag type="info">PDF</el-tag>&nbsp;&nbsp;
                    <el-tag type="warning">视频</el-tag>&nbsp;&nbsp;
                    <el-tag type="danger">其它</el-tag>&nbsp;&nbsp;
                </div>
                <el-table :data="tableDatax" border height="230" :summary-method="getSummaries" show-summary
                    style="width: 100%; margin-top: 20px">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="id" label="检查时间">
                    </el-table-column>
                    <el-table-column prop="name" label="检查方式">
                    </el-table-column>
                    <el-table-column prop="amount1" label="检查描述">
                    </el-table-column>
                    <el-table-column prop="amount2" label="序列数量">
                    </el-table-column>
                    <el-table-column prop="amount3" label="图像数量">
                    </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-size:large;">数据描述</span>
                </div>
                <el-table :data="tableDatay" border height="310" :summary-method="getSummaries"
                    style="width: 100%; margin-top: 20px">
                    <el-table-column prop="id" label="检查时间">
                    </el-table-column>
                    <el-table-column prop="name" label="检查方式">
                    </el-table-column>
                    <el-table-column prop="buwei" label="部位">
                    </el-table-column>
                    <el-table-column prop="amount1" label="增强方案">
                    </el-table-column>
                    <el-table-column prop="amount2" label="造影剂给药途径">
                    </el-table-column>
                    <el-table-column prop="amount3" label="创建人">
                        张三
                    </el-table-column>
                    <el-table-column prop="amount3" label="创建时间">
                        2022-09-25 7:24:29
                    </el-table-column>
                    <el-table-column prop="amount3" label="修改人">
                        李四
                    </el-table-column>
                    <el-table-column prop="amount3" label="修改时间">
                        2022-09-25 7:24:29
                    </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-size:large;">系统审核结果</span>
                </div>
                <el-table :data="tableDataz" border height="230" :summary-method="getSummaries" show-summary
                    style="width: 100%; margin-top: 20px">
                    <el-table-column prop="id" label="审核名称">
                    </el-table-column>
                    <el-table-column prop="name" label="方案要求">
                    </el-table-column>
                    <el-table-column prop="buwei" label="数据情况">
                    </el-table-column>
                    <el-table-column prop="amount1" label="审核描述">
                    </el-table-column>
                    <el-table-column prop="amount2" label="审核结果">
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-size:large;">人工审核结果</span>
                    <el-button style="float: right;" type="primary">历史记录</el-button>
                    <el-button style="float: right; margin-right: 20px;">一键通过</el-button>
                </div>
                <el-table :data="tableDataT" border height="440" :summary-method="getSummaries"
                    style="width: 100%; margin-top: 20px">
                    <el-table-column prop="id" label="审核名称">
                    </el-table-column>
                    <el-table-column prop="name" label="方案要求">
                    </el-table-column>
                    <el-table-column label="审核结果" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-radio v-model="radio" label="1">通过</el-radio>
                            <el-radio v-model="radio" label="2">不通过</el-radio>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import { listPost, getPost, delPost, addPost, updatePost } from "@/api/system/post";
export default {
    name: "Post",
    dicts: ['sys_normal_disable'],
    data() {
        return {
            queryDialogVisible: false,
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
                pageNum: 1,
                pageSize: 10,
                postCode: undefined,
                postName: undefined,
                status: undefined
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                postName: [
                    { required: true, message: "岗位名称不能为空", trigger: "blur" }
                ],
                postCode: [
                    { required: true, message: "岗位编码不能为空", trigger: "blur" }
                ],
                postSort: [
                    { required: true, message: "岗位顺序不能为空", trigger: "blur" }
                ]
            },
            tableDatax: [{
                id: '2022-09-25 7:24:29',
                name: 'CT',
                amount1: 'C+',
                amount2: '10',
                amount3: 10
            }, {
                id: '2022-09-25 7:24:29',
                name: 'MR',
                amount1: 'C+',
                amount2: '10',
                amount3: 12
            }, {
                id: '2022-09-25 7:24:29',
                name: 'CT',
                amount1: 'C+',
                amount2: '10',
                amount3: 9
            }],
            tableDataz: [{
                id: '层厚符合方案要求',
                name: '≤5mm',
                amount1: 'MR层厚超出方案要求',
                amount2: '不通过',
                amount3: 10,
                buwei: "CT：3mm, MR：6mm"
            }, {
                id: '检查方式与方案相符',
                name: '基线期CT,MR,骨扫描',
                amount1: '缺少骨扫描',
                amount2: '10',
                amount3: 12,
                buwei: "CT,MR"
            }, {
                id: '检查日期、检查方式与数据描述一致',
                name: '-',
                amount1: '一致',
                amount2: '不通过',
                amount3: 9,
                buwei: "相符"
            }, {
                id: '数据无断层',
                name: '-',
                amount1: '无断层',
                amount2: '通过',
                amount3: 9,
                buwei: "无断层"
            }, {
                id: '受试者出生年月与图像一致',
                name: '-',
                amount1: '一致',
                amount2: '通过',
                amount3: 9,
                buwei: "一致"
            }],
            tableDatay: [{
                id: '2022-09-25 7:24:29',
                name: 'CT',
                amount1: '增强',
                amount2: '通过',
                amount3: 10,
                buwei: "腹部"
            }, {
                id: '2022-09-25 7:24:29',
                name: 'MR',
                amount1: '平扫',
                amount2: '10',
                amount3: 12,
                buwei: "胸部"
            }, {
                id: '2022-09-25 7:24:29',
                name: 'CT',
                amount1: '增强',
                amount2: '通过',
                amount3: 9,
                buwei: "头部"
            }],
            tableDataT: [{
                id: '层厚符合方案要求',
                name: '≤5mm',
                amount1: 'C+',
                amount2: '不适用',
                amount3: 10,
                buwei: "腹部"
            }, {
                id: '检查方式与方案相符',
                name: '基线期CT,MR,骨扫描',
                amount1: 'C+',
                amount2: '10',
                amount3: 12,
                buwei: "胸部"
            }, {
                id: '检查日期、检查方式与数据描述一致',
                name: '-',
                amount1: 'C+',
                amount2: '10',
                amount3: 9,
                buwei: "头部"
            }, {
                id: '数据无断层',
                name: '-',
                amount1: 'C+',
                amount2: '10',
                amount3: 9,
                buwei: "头部"
            }, {
                id: '受试者出生年月与图像一致',
                name: '-',
                amount1: 'C+',
                amount2: '10',
                amount3: 9,
                buwei: "头部"
            }, {
                id: '审核结论',
                name: '-',
                amount1: 'C+',
                amount2: '10',
                amount3: 9,
                buwei: "头部"
            }, {
                id: '备注：',
                name: '-',
                amount1: 'C+',
                amount2: '10',
                amount3: 9,
                buwei: "头部"
            }],
        };
    },
    created() {
        this.getList();
    },
    components: {
    },
    methods: {
        /** 查询岗位列表 */
        getList() {
            this.loading = true;
            listPost(this.queryParams).then(response => {
                // this.postList = response.rows;
                this.postList = [
                    {
                        "questionStatus": null,
                        "centerName": "ZX001",
                        "examinee": "SSZ0001",
                        "visitPlanName": "V2",
                        "visitDate": "2022-03-17",
                        "auditStatus": "审核中",
                        "completeUploadDatetime": "2022-03-18 10:10:01",
                        "auditCompleteDatetime": "2022-04-18 12:12:12",
                        "auditBy": "张三",
                        status: "正常",
                    },
                    {
                        "questionStatus": null,
                        "centerName": "ZX002",
                        "examinee": "SSZ0002",
                        "visitPlanName": "V2",
                        "visitDate": "2022-03-19",
                        "auditStatus": "未审核",
                        "completeUploadDatetime": "2022-03-18 10:10:03",
                        "auditCompleteDatetime": "2022-04-18 12:12:13",
                        "auditBy": "张三",
                        status: "正常",
                    },
                    {
                        "questionStatus": null,
                        "centerName": "ZX003",
                        "examinee": "SSZ0003",
                        "visitPlanName": "V2",
                        "visitDate": "2022-03-20",
                        "auditStatus": "通过",
                        "completeUploadDatetime": "2022-03-18 10:10:15",
                        "auditCompleteDatetime": "2022-04-18 12:12:15",
                        "auditBy": "张三",
                        status: "不正常",
                    },
                    {
                        "questionStatus": null,
                        "centerName": "ZX004",
                        "examinee": "SSZ0004",
                        "visitPlanName": "V2",
                        "visitDate": "2022-03-21",
                        "auditStatus": "未通过",
                        "completeUploadDatetime": "2022-03-18 10:10:05",
                        "auditCompleteDatetime": "2022-04-18 12:12:16",
                        "auditBy": "张三",
                        status: "正常",
                    },
                    {
                        "questionStatus": null,
                        "centerName": "ZX005",
                        "examinee": "SSZ0005",
                        "visitPlanName": "V2",
                        "visitDate": "2022-03-25",
                        "auditStatus": "审核中",
                        "completeUploadDatetime": "2022-03-18 10:10:06",
                        "auditCompleteDatetime": "2022-04-18 12:12:17",
                        "auditBy": "张三",
                        status: "不正常",
                    },
                    {
                        "questionStatus": null,
                        "centerName": "ZX006",
                        "examinee": "SSZ0006",
                        "visitPlanName": "V2",
                        "visitDate": "2022-03-27",
                        "auditStatus": "通过",
                        "completeUploadDatetime": "2022-03-18 10:10:07",
                        "auditCompleteDatetime": "2022-04-18 12:12:18",
                        "auditBy": "张三",
                        status: "不正常",
                    },
                    {
                        "questionStatus": null,
                        "centerName": "ZX007",
                        "examinee": "SSZ0007",
                        "visitPlanName": "V2",
                        "visitDate": "2022-03-31",
                        "auditStatus": "未通过",
                        "completeUploadDatetime": "2022-03-18 10:10:08",
                        "auditCompleteDatetime": "2022-04-18 12:12:19",
                        "auditBy": "张三",
                        status: "正常",
                    },
                    {
                        "questionStatus": null,
                        "centerName": "ZX008",
                        "examinee": "SSZ0008",
                        "visitPlanName": "V2",
                        "visitDate": "2022-05-18",
                        "auditStatus": "未审核",
                        "completeUploadDatetime": "2022-03-18 10:10:09",
                        "auditCompleteDatetime": "2022-04-18 12:12:20",
                        "auditBy": "张三",
                        status: "不正常",
                    },
                    {
                        "questionStatus": null,
                        "centerName": "ZX009",
                        "examinee": "SSZ0009",
                        "visitPlanName": "V2",
                        "visitDate": "2022-05-19",
                        "auditStatus": "审核中",
                        "completeUploadDatetime": "2022-03-18 10:10:10",
                        "auditCompleteDatetime": "2022-04-18 12:12:21",
                        "auditBy": "张三",
                        status: "正常",
                    },
                    {
                        "questionStatus": null,
                        "centerName": "ZX010",
                        "examinee": "SSZ0010",
                        "visitPlanName": "V2",
                        "visitDate": "2022-05-20",
                        "auditStatus": "审核中",
                        "completeUploadDatetime": "2022-03-18 10:10:11",
                        "auditCompleteDatetime": "2022-04-18 12:12:22",
                        "auditBy": "张三",
                        status: "不正常",
                    },

                ]
                this.total = 29;
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
                remark: undefined
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.postId)
            this.single = selection.length != 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加岗位";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const postId = row.postId || this.ids
            getPost(postId).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改岗位";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.postId != undefined) {
                        updatePost(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addPost(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const postIds = row.postId || this.ids;
            this.$modal.confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？').then(function () {
                return delPost(postIds);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('system/post/export', {
                ...this.queryParams
            }, `post_${new Date().getTime()}.xlsx`)
        },
        // 关闭质疑弹窗
        closeDia() {
            this.queryDialogVisible = false
        },
        openDia() {
            this.$refs.queryDia.openDia();
        }
    }
};
</script>
  