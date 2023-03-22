<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="用户ID" prop="userId">
                <el-input v-model="queryParams.userId" placeholder="请输入中心编号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="姓名" prop="userName">
                <el-input v-model="queryParams.userName" placeholder="请输入中心名称" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="角色" prop="roleNames">
                <el-input v-model="queryParams.roleNames" placeholder="请输入创建人" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="queryParams.email" placeholder="请输入邮箱" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="状态" clearable>
                    <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain size="mini" @click="handleAdd">分配项目用户</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="用户ID" align="center" prop="userId" />
            <el-table-column label="姓名" align="center" prop="userName" />
            <el-table-column label="角色" align="center" prop="roleNames" />
            <el-table-column label="邮箱" align="center" prop="email" />
            <el-table-column label="手机" align="center" prop="phoneNumber" />
            <el-table-column label="状态" align="center" prop="status" >
                <template slot-scope="scope">
                    <el-switch @change="changeStatus(scope.row)"
                        :value="scope.row.status == '启用'" active-color="#13ce66" inactive-color="#909399"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy" />
            <el-table-column label="创建时间" align="center" prop="createTime" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="editUser(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

        <!-- 分配用户 -->
        <el-dialog title="分配用户" :close-on-click-modal="false" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="centerForm" :model="centerForm" :rules="centerFormRules" label-width="80px">
                <el-form-item label="用户姓名" prop="postName">
                    <el-row type="flex" class="row-bg" justify="space-between">
                        <el-col :span="16">
                            <el-select v-model="centerForm.userId" placeholder="请选择" @change="changeUser" filterable style="width: 100%">
                                <el-option v-for="item in centerUserList" :key="item.userId" :label="`${item.nickName}${item.email ? `(${item.email})` : ''}`" :value="item.userId" />
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-table v-loading="loading" :data="centerUserList2">
                    <el-table-column label="用户ID" align="center" prop="userId" />
                    <el-table-column label="姓名" align="center" prop="nickName" />
                    <el-table-column label="角色" align="center" prop="roleIds">
                        <template slot-scope="scope">
                            <el-select multiple v-model="scope.row.roleIds" placeholder="请选择" filterable style="width: 100%">
                                <el-option v-for="item in scope.row.userRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="邮箱" align="center" prop="email" />
                    <el-table-column label="手机" align="center" prop="phoneNumber" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteUser(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 分配用户 -->
        <el-dialog title="修改项目用户" :close-on-click-modal="false" :visible.sync="openEdit" width="600px" append-to-body>
            <el-descriptions title="" direction="vertical" :column="5" border>
                <el-descriptions-item label="用户ID">{{detailsInfo.userId}}</el-descriptions-item>
                <el-descriptions-item label="姓名">{{detailsInfo.userName}}</el-descriptions-item>
                <el-descriptions-item label="角色">
                    <el-select multiple v-model="roleIds" placeholder="请选择" filterable style="width: 100%">
                        <el-option v-for="item in detailsInfo.userRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="邮箱">{{detailsInfo.email}}</el-descriptions-item>
                <el-descriptions-item label="手机">{{detailsInfo.phoneNumber}}</el-descriptions-item>
            </el-descriptions>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import { getCanBindUsers, addProjectUser, listPost, setProjectUserStatus, getProjectUserDetails, setProjectUserRole } from "@/api/project/setting";
import { getPost, delPost, addPost, updatePost } from "@/api/system/post";

export default {
    name: "Post",
    dicts: ['sys_normal_disable'],
    props:{
        projectId:{
            type:String,
            default:""
        }
    },
    data() {
        return {
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
            centerUserList:[],
            centerUserList2:[],
            userRoles:[],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            openEdit:false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 50,
            },
            // 表单参数
            form: {},
            centerForm:{},
            // 表单校验
            centerFormRules:{},
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
            userId:'',
            roleIds:[],
            detailsInfo:{}
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // submitEdit
        submitEdit(){
            setProjectUserRole({
                projectId:JSON.parse(localStorage['chooseProject']).id,
                users:[
                    {
                        userId: this.detailsInfo.userId,
                        roleIds: this.roleIds
                    }
                ]
            }).then(res=>{
                this.$message.success('操作成功')
                this.getList();
                this.openEdit = false
            })
        },
        //editUser
        editUser(item){
            this.openEdit = true
            this.getCanBindUsers()
            getProjectUserDetails({id:item.id}).then(res=>{
                console.log(222,res.data.roleIds)
                this.detailsInfo = res.data
                this.roleIds = res.data.roleIds.split(',').map(item=>Number(item))
                console.log(222,this.roleIds)
                console.log(res)
            })
        },
        // 修改状态
        changeStatus(item) {
            this.loading = true;
            setProjectUserStatus({
                id: item.id,
                status: item.status == '启用' ? '1' : '0',
            }).then(response => {
                this.getList()
            });
        },
        /** 删除按钮操作 */
        deleteUser(row) {
            this.centerUserList2 = this.centerUserList2.filter(item=>item.userId!==row.userId)
        },
        changeUser(userId){
            let exit = false
            this.centerUserList2.forEach(item=>{
                if(item.userId==userId){
                    exit = true
                    
                }
            })
            if(exit){
                return this.$message.warning('该用户您已选择过了')
            }
            this.centerUserList2 = this.centerUserList2.concat(this.centerUserList.filter(item=>item.userId===userId))
        },
        /** 分配用户列表 */
        getCanBindUsers() {
            getCanBindUsers({bindUserType:1, projectId:this.projectId }).then(response => {
                this.centerUserList = response.users.rows;
                this.centerUserList.forEach(element => { element.roleId = 9 ||null });
                this.userRoles = response.userRoles
            });
        },
        /** 查询岗位列表 */
        getList() {
            this.loading = true;
            this.queryParams.projectId = this.projectId
            listPost(this.queryParams).then(response => {
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
            this.centerForm = {
                userId:''
            };
            this.centerUserList2 = []
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.postId)
            this.single = selection.length != 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.getCanBindUsers()
            this.open = true;
            this.title = "项目人员";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const postId = row.postId || this.ids
            getPost(postId).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "项目人员";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["centerForm"].validate(valid => {
                if (valid) {
                    if (this.centerForm.postId != undefined) {
                        updatePost(this.centerForm).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.reset()
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        this.centerForm.users = this.centerUserList2
                        this.centerForm.projectId = this.projectId
                        addProjectUser(this.centerForm).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.reset()
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
        }
    }
};
</script>
  