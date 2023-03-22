<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="中心" prop="centerName">
                <el-select v-model="queryParams.status" placeholder="全部" clearable>
                    <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="受试者" prop="examinee">
                <el-input v-model="queryParams.postCode" placeholder="请输入受试者编号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="访视" prop="visitPlanName">
                <el-input v-model="queryParams.postName" placeholder="请输入访视名称" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="全部" clearable>
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
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['audit:anonymous:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
            <el-table-column label="中心" align="center" prop="centerName" />
            <el-table-column label="受试者" align="center" prop="examinee" />
            <el-table-column label="访视" align="center" prop="visitPlanName" />
            <el-table-column label="访视日期" align="center" prop="visitDate" />
            <el-table-column label="完成提交时间" align="center" width="150" prop="completeCommitDatetime" />
            <el-table-column label="匿名开始时间" align="center" width="150" prop="anonymizeStartDatetime" />
            <el-table-column label="匿名结束时间" align="center" width="150" prop="anonymizeEndDatetime" />
            <el-table-column label="耗时" align="center" prop="anonymizeDuration" />
            <el-table-column label="状态" align="center" prop="status" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="130">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleUpdate(scope.row)"
                        v-hasPermi="['audit:anonymous:restart']">重启匿名</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

    </div>
</template>

<script>
import { listPost, getPost, delPost, addPost, updatePost } from "@/api/system/post";

export default {
    name: "Post",
    dicts: ['sys_normal_disable'],
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
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
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
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询岗位列表 */
        getList() {
            this.loading = true;
            listPost(this.queryParams).then(response => {
                // this.postList = response.rows;
                this.postList = [
                ]
                this.total = 0;
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
        }
    }
};
</script>
