<template>
    <div class="app-container">
        <el-form
            v-show="showSearch"
            ref="queryForm"
            :model="queryParams"
            size="small"
            :inline="true"
            label-width="68px"
        >
            <el-form-item label="中心编号" prop="no">
                <el-input
                    v-model="queryParams.no"
                    placeholder="请输入中心编号"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="中心名称" prop="hospitalName">
                <el-input
                    v-model="queryParams.hospitalName"
                    placeholder="请输入中心名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="创建人" prop="createBy">
                <el-input
                    v-model="queryParams.createBy"
                    placeholder="请输入创建人"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="是否通过" prop="authStatus">
                <el-select
                    v-model="queryParams.authStatus"
                    placeholder="状态"
                    clearable
                >
                    <el-option
                        v-for="dict in dict.type.sys_normal_disable"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select
                    v-model="queryParams.status"
                    placeholder="状态"
                    clearable
                >
                    <el-option
                        v-for="dict in dict.type.sys_normal_disable"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索</el-button
                >
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-s-data"
                    size="mini"
                    @click="handleAdd"
                    >创建中心</el-button
                >
            </el-col>
            <!-- 统一到用户管理创建用户 -->
            <!-- <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-s-custom" size="mini" @click="handUser">创建用户</el-button>
            </el-col> -->

            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    >导出</el-button
                >
            </el-col>
            <right-toolbar
                :show-search.sync="showSearch"
                @queryTable="getList"
            />
        </el-row>

        <el-table v-loading="loading" :data="postList">
            <el-table-column label="中心编号" align="center" prop="no" />
            <el-table-column
                label="中心名称"
                align="center"
                prop="hospitalName"
            />
            <!--
            <el-table-column label="是否通过认证" align="center" prop="authStatus" />
            -->
            <el-table-column label="状态" align="center" prop="status">
                <template slot-scope="scope">
                    <el-switch
                        :value="scope.row.status == '启用'"
                        active-color="#13ce66"
                        inactive-color="#909399"
                        @change="changeStatus(scope.row)"
                    />
                </template>
            </el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy" />
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleAdd(scope.row)"
                        >修改</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="removeCenter(scope.row)"
                        >删除</el-button
                    >
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

        <!-- 创建中心 -->
        <el-dialog
            :title="title"
            :visible.sync="open"
            :close-on-click-modal="false"
            width="600px"
            append-to-body
        >
            <el-form
                ref="centerForm"
                :model="centerForm"
                :rules="centerFormRules"
                label-width="80px"
            >
                <el-form-item label="中心编号" prop="no">
                    <el-input
                        v-model="centerForm.no"
                        :disabled="readonlyCenterForm"
                        placeholder="请输入中心编号"
                    />
                </el-form-item>
                <el-form-item label="中心名称" prop="hospitalId">
                    <el-row type="flex" class="row-bg" justify="space-between">
                        <el-col :span="16">
                            <el-select
                                v-model="centerForm.hospitalId"
                                placeholder="请选择"
                                filterable
                                style="width: 100%"
                                @change="handleSelectChange"
                            >
                                <el-option
                                    v-for="item in hospitalLists"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-button
                                type="primary"
                                @click="openHospital = true"
                                >新增医院</el-button
                            >
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-divider />
                <div
                    style="
                        line-height: 24px;
                        font-size: 18px;
                        color: #303133;
                        margin-bottom: 30px;
                    "
                >
                    分配用户
                </div>
                <el-form-item label="用户姓名" prop="postName">
                    <el-row type="flex" class="row-bg" justify="space-between">
                        <el-col :span="16">
                            <el-select
                                multiple
                                v-model="userIds"
                                placeholder="请选择"
                                filterable
                                style="width: 100%"
                                @change="changeUser"
                            >
                                <el-option
                                    v-for="item in centerUserList"
                                    :key="item.userId"
                                    :label="`${item.nickName}(${item.email})`"
                                    :value="item.userId"
                                />
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-table v-loading="loading" :data="centerUserList2">
                    <el-table-column
                        label="用户ID"
                        align="center"
                        prop="userId"
                    />
                    <el-table-column
                        label="姓名"
                        align="center"
                        prop="nickName"
                    />
                    <el-table-column label="角色" align="center" prop="roleId">
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.roleId"
                                placeholder="请选择"
                                filterable
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in scope.row.userRoles"
                                    :key="item.roleId"
                                    :label="item.roleName"
                                    :value="item.roleId"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="邮箱" align="center" prop="email" />
                    <el-table-column
                        label="手机"
                        align="center"
                        prop="phoneNumber"
                    />
                    <el-table-column
                        label="操作"
                        align="center"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="deleteUser(scope.row)"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 创建用户 -->
        <el-dialog
            title="创建中心用户"
            :close-on-click-modal="false"
            :visible.sync="openCenterCus"
            width="600px"
            append-to-body
        >
            <el-form
                ref="centerUserForm"
                :model="formCustomer"
                :rules="formCustomerRules"
                label-width="80px"
            >
                <el-form-item label="姓名" prop="nickName">
                    <el-input
                        v-model="formCustomer.nickName"
                        placeholder="请输入姓名"
                    />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input
                        v-model="formCustomer.email"
                        placeholder="请输入邮箱"
                    />
                </el-form-item>
                <el-form-item label="手机号" prop="phonenumber">
                    <el-input
                        v-model="formCustomer.phonenumber"
                        placeholder="请输入手机号"
                    />
                </el-form-item>
                <el-form-item label="角色" prop="roleId">
                    <el-select
                        v-model="formCustomer.roleId"
                        placeholder="请选择"
                        clearable
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in userRoles"
                            :key="item.roleId"
                            :label="item.roleName"
                            :value="item.roleId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="主要语言" prop="mainLanguage">
                    <el-select
                        v-model="formCustomer.mainLanguage"
                        placeholder="请选择"
                        clearable
                        style="width: 100%"
                    >
                        <el-option label="中文" value="CN" />
                        <el-option label="英文" value="EN" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitCustomerForm"
                    >确 定</el-button
                >
                <el-button @click="openCenterCus = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 创建医院 -->
        <el-dialog
            title="新增医院"
            :close-on-click-modal="false"
            :visible.sync="openHospital"
            width="500px"
            append-to-body
        >
            <el-form
                ref="hospitalForm"
                :model="formHospital"
                :rules="formHospitalRules"
                label-width="80px"
            >
                <el-form-item label="医院名称" prop="name">
                    <el-input
                        v-model="formHospital.name"
                        placeholder="请输入医院名称"
                    />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input
                        v-model="formHospital.address"
                        placeholder="请输入地址"
                    />
                </el-form-item>
                <el-form-item label="邮编" prop="postalCode">
                    <el-input
                        v-model="formHospital.postalCode"
                        placeholder="请输入邮编"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitHospitalForm"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import _ from "lodash";
import { Message } from "element-ui";
import {
    delPost,
    updatePost,
    addCenterUser,
    getCanBindUsers,
} from "@/api/project/setting";
import {
    hospitalAdd,
    hospitalList,
    centerAddPost,
    centerEditPost,
    centerList,
    setUserCenterStatus,
    listPost,
    deleteCenterByIds,
} from "@/api/project/center";

export default {
    name: "Post",
    dicts: ["sys_normal_disable"],
    props: {
        projectId: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            hospitalLists: [],
            centerUserList: [],
            centerUserList2: [],
            userRoles: [],
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
            openCenterCus: false,
            openHospital: false,
            readonlyCenterForm: false,
            centerId: "",
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 50,
                projectId: this.projectId,
                no: undefined,
                authStatus: "",
                createBy: "",
                hospitalName: undefined,
                status: undefined,
            },
            userIds: [],
            // 表单参数
            form: {},
            centerForm: {
                projectId: this.projectId,
                authStatus: 1,
                status: 0,
                id: "",
                userCenters: [],
            },
            formCustomer: {},
            formHospital: {},
            // 表单校验
            formHospitalRules: {
                name: [
                    { required: true, message: "不能为空", trigger: "blur" },
                ],
                postalCode: [
                    {
                        pattern: /^\d{6}$/,
                        message: "请输入6位数字",
                        trigger: "blur",
                    },
                ],
            },
            formCustomerRules: {
                nickName: [
                    { required: true, message: "不能为空", trigger: "blur" },
                ],
                email: [
                    { required: true, message: "不能为空", trigger: "blur" },
                ],
                roleId: [
                    { required: true, message: "不能为空", trigger: "blur" },
                ],
                // phonenumber: [
                //     { required: true, message: "不能为空", trigger: "blur" }
                // ],
                mainLanguage: [
                    { required: true, message: "不能为空", trigger: "blur" },
                ],
            },
            centerFormRules: {
                no: [{ required: true, message: "不能为空", trigger: "blur" }],
                hospitalId: [
                    { required: true, message: "不能为空", trigger: "blur" },
                ],
            },
        };
    },
    watch: {
        projectId: function (newVal) {
            newVal;
        },
    },
    mounted() {
        this.getList();
        this.getHospitalList();
    },
    methods: {
        handUser() {
            this.getCanBindUsers();
            this.openCenterCus = true;
        },
        handleSelectChange() {
            this.$forceUpdate();
        },
        // 获取中心用户列表
        async listPost(centerId) {
            try {
                if (this.loading) return;
                this.loading = true;
                const response = await listPost({
                    projectId: this.projectId,
                    centerId: centerId,
                });
                this.centerUserList2 = response.rows;
            } finally {
                this.loading = false;
            }
        },
        changeStatus(item) {
            this.loading = true;
            setUserCenterStatus({
                id: item.id,
                status: item.status === "启用" ? "1" : "0",
            }).then((response) => {
                this.getList();
            });
        },
        changeUser() {
            const list = this.centerUserList.filter((item) =>
                this.userIds.includes(item.userId)
            );
            list.forEach((item) => {
                item.roleId = "";
                this.centerUserList2.forEach((ele) => {
                    if (item.userId === ele.userId) {
                        item.roleId = ele.roleId;
                    }
                });
            });
            this.centerUserList2 = _.cloneDeep(list);
        },
        /** 查询岗位列表 */
        getList() {
            this.loading = true;
            centerList(this.queryParams).then((response) => {
                this.postList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 查询医院列表 */
        getHospitalList() {
            hospitalList({ pageNum: 1, pageSize: 100 }).then((response) => {
                this.hospitalLists = response.rows;
            });
        },
        /** 分配用户列表 */
        async getCanBindUsers(centerId) {
            const response = await getCanBindUsers({
                bindUserType: 2,
                projectId: this.projectId,
                pageSize: 10000,
                centerId,
            });
            this.centerUserList = response.users.rows;
            this.userRoles = response.userRoles;
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.centerForm = {
                projectId: this.projectId,
                authStatus: 1,
                status: 0,
                id: "",
            };
            this.centerUserList2 = [];
            this.resetForm("centerForm");
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
        /** 新增,修改按钮操作 */
        async handleAdd(item) {
            if (item.id) {
                await this.getCanBindUsers();
                this.reset();
                this.readonlyCenterForm = true;
                this.centerId = item.id;
                await this.listPost(item.id);
                this.centerForm.id = item.id;
                this.centerForm.no = item.no;
                this.centerForm.hospitalId = item.hospitalId;
                this.userRoles = [...this.userRoles, ...this.centerUserList2];
                this.userIds = this.centerUserList2.map((item) => item.userId);
                this.open = true;
                this.title = "修改中心";
            } else {
                await this.getCanBindUsers(this.centerId);
                this.reset();
                this.readonlyCenterForm = false;
                this.centerId = "";
                this.open = true;
                this.title = "创建中心";
                this.userIds = [];
            }
        },
        async removeCenter(item) {
            this.$modal
                .confirm("是否确认删除中心")
                .then(function () {
                    return deleteCenterByIds({ ids: String(item.id) });
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
        /** 删除按钮操作 */
        deleteUser(row) {
            this.centerUserList2 = this.centerUserList2.filter(
                (item) => item.userId !== row.userId
            );
            this.userIds = this.centerUserList2.map((item) => item.userId);
        },
        /** 提交按钮 */
        submitForm: function () {
            this.centerForm.userCenters = _.cloneDeep(this.centerUserList2);
            if (this.centerForm.userCenters.length > 0) {
                const isHaveRoleId = this.centerForm.userCenters.every(
                    (item) => item.roleId
                );
                if (!isHaveRoleId) {
                    Message.error("用户尚未分配角色");
                    return;
                }
            }

            this.$refs["centerForm"].validate((valid) => {
                if (valid) {
                    if (this.title === "创建中心") {
                        centerAddPost(this.centerForm).then((response) => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.centerForm = {
                                projectId: this.projectId,
                                authStatus: 1,
                                status: 0,
                                id: "",
                                userCenters: [],
                            };
                            this.userIds = [];
                            this.$refs["centerForm"].resetFields();
                            this.getList();
                        });
                    }
                    if (this.title === "修改中心") {
                        const { id, hospitalId, userCenters } = this.centerForm;
                        centerEditPost({
                            id,
                            hospitalId,
                            projectId: this.projectId,
                            userCenters: userCenters.map((item) => ({
                                roleId: item.roleId,
                                userId: item.userId,
                            })),
                        }).then((response) => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.centerForm = {
                                projectId: this.projectId,
                                authStatus: 1,
                                status: 0,
                                id: "",
                                userCenters: [],
                            };
                            this.userIds = [];
                            this.$refs["centerForm"].resetFields();
                            this.getList();
                        });
                    }
                }
            });
        },
        submitCustomerForm: function () {
            this.$refs["centerUserForm"].validate((valid) => {
                if (valid) {
                    if (this.centerForm.postId !== undefined) {
                        updatePost(this.centerForm).then((response) => {
                            this.$modal.msgSuccess("修改成功");
                            this.openCenterCus = false;
                            this.formCustomer = {};
                            this.getUserCenterJoins();
                        });
                    } else {
                        this.formCustomer.userName = this.formCustomer.email;
                        addCenterUser(this.formCustomer).then((response) => {
                            this.$modal.msgSuccess("新增成功");
                            this.openCenterCus = false;
                            this.formCustomer = {};
                            this.getUserCenterJoins();
                        });
                    }
                }
            });
        },
        submitHospitalForm: function () {
            this.$refs["hospitalForm"].validate((valid) => {
                if (valid) {
                    if (this.centerForm.postId !== undefined) {
                        updatePost(this.centerForm).then((response) => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getHospitalList();
                        });
                    } else {
                        hospitalAdd(this.formHospital).then((response) => {
                            this.$modal.msgSuccess("新增成功");
                            this.openHospital = false;
                            this.getHospitalList();
                        });
                    }
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
                "center/export",
                {
                    ...this.queryParams,
                },
                `post_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>
