<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="120px">
            <el-form-item label="客户名称" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入 客户名称" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="客户英文名称" prop="enName">
                <el-input v-model="queryParams.enName" placeholder="请输入 客户英文名称" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="全部" clearable>
                    <el-option label="启用" value="0" />
                    <el-option label="禁用" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['customer:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['customer:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
            <el-table-column label="客户名称" align="center" prop="name">
                <template slot-scope="scope">
                    <router-link to="/project/listDetails">
                      <el-button type="text">{{ scope.row.name }}</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="客户英文名称" align="center" prop="enName" />
            <el-table-column label="已承接项目数" align="center" prop="projectCount" />
            <el-table-column label="创建人" align="center" prop="createBy" />
            <el-table-column label="创建时间" align="center" prop="createTime" />
            <el-table-column label="修改人" align="center" prop="updateBy" />
            <el-table-column label="修改时间" align="center" prop="updateTime" />
            <el-table-column label="状态" align="center" prop="status">
                <template slot-scope="scope">
                    <el-switch @change="changeStatus(scope.row)" :value="scope.row.status=='0'" active-color="#13ce66" inactive-color="#909399"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
        <AddCustomer :diaShow="showAddCustomer" :newCustomerForm="form" :title="title" />
    </div>
  </template>

  <script>
  import AddCustomer from "@/views/components/customer/addCustomer";
  import { listPost, getPost, delPost, updatePost, listAdd, customerAdd, setCustomerStatus } from "@/api/business/customer";

  export default {
    name: "Post",
    dicts: ['sys_normal_disable'],
    components: {
        AddCustomer
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            addNewCustomerDia:false,
            showAddCustomer:false,
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
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                enName: undefined,
                name: undefined,
                status: undefined
            },
            // 表单参数
            projectAddform: {},

            form:{},
            // 表单校验
            rules: {
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        changeStatus(item){
            this.loading = true;
            setCustomerStatus({
                id: item.id,
                status: item.status=='0'?'1':'0',
            }).then(response => {
                this.getList()
            });
        },
        /** 查询岗位列表 */
        getList() {
            this.loading = true;
            listPost(this.queryParams).then(response => {
                this.postList = response.rows;
                this.total = response.total
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        //关闭新增弹窗
        diaClose(){
            this.showAddCustomer = false
            this.getList()
        },
        // 表单重置
        reset() {
            this.form = {
                pageNum: 1,
                pageSize: 10,
                enName: undefined,
                name: undefined,
                status: undefined
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
            this.form = {}
            this.showAddCustomer = true;
            this.title = "新增客户";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.form = row;
            this.showAddCustomer = true;
            this.title = "修改客户";
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
            this.download('customer/export', {
                ...this.queryParams
            }, `post_${new Date().getTime()}.xlsx`)
        }
    }
  };
  </script>
