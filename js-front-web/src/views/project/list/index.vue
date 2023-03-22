<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="72px">
      <el-form-item label="项目编号" prop="no">
        <el-input v-model="queryParams.no" placeholder="请输入 项目编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="方案编号" prop="planNo">
        <el-input v-model="queryParams.planNo" placeholder="请输入 方案编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="适应症" prop="indication">
        <el-input v-model="queryParams.indication" placeholder="请输入 适应症" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户简称" prop="customerName">
        <el-input v-model="queryParams.customerName" placeholder="请输入 客户简称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="queryParams.projectType" placeholder="全部" clearable>
          <el-option label="BICR" value="BICR" />
          <el-option label="咨询项目" value="咨询项目" />
          <el-option label="演示项目" value="演示项目" />
          <el-option label="测试项目" value="测试项目" />
          <el-option label="其它" value="其它" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable>
          <el-option label="进行中" value="1" />
          <el-option label="已关闭" value="2" />
          <!--          <el-option label="已删除" value="3" />-->
          <!--          <el-option label="其它" value="4" />-->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:post:export']"
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column label="项目编号" align="center" prop="no">
        <template slot-scope="scope">
          <router-link :to="{ path: '/project/listDetails', query: { id: scope.row.id } }">
            <el-button type="text">{{ scope.row.no }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="方案编号" align="center" prop="planNo" />
      <el-table-column label="适应症" align="center" prop="indication" />
      <el-table-column label="评估标准" align="center" prop="evaluationCriteria" />
      <el-table-column label="客户简称" align="center" prop="customerName" />
      <el-table-column label="项目类型" align="center" prop="projectType" />
      <el-table-column label="研究分期" align="center" prop="researchPhase"/>
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{ path: '/project/listSetting', query: { id: scope.row.id } }" style="margin-right:10px;">
            <el-button size="mini" type="text">项目配置</el-button>
          </router-link>
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

    <!-- 添加项目 -->
<!--    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="open" width="600px" append-to-body>-->
<!--      <el-form ref="form" :model="form" :rules="rules" label-width="80px">-->
<!--        <el-form-item label="项目类型" prop="projectType">-->
<!--          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 100%">-->
<!--            <el-option label="BICR" value="BICR" />-->
<!--            <el-option label="咨询项目" value="咨询项目" />-->
<!--            <el-option label="演示项目" value="演示项目" />-->
<!--            <el-option label="其它" value="其它" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="适应症" prop="symptom">-->
<!--          <el-input v-model="form.postName" placeholder="请输入适应症" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="方案编号" prop="planNo">-->
<!--          <el-input v-model="form.postName" placeholder="请输入方案编号" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="评估标准" prop="assessStandard">-->
<!--          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 100%">-->
<!--            <el-option label="RECIST1.1" value="RECIST1.1" />-->
<!--            <el-option label="Lugano2014" value="Lugano2014" />-->
<!--            <el-option label="RANO" value="RANO" />-->
<!--            <el-option label="Choi" value="Choi" />-->
<!--            <el-option label="其它" value="其它" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="研究分期" prop="researchStage">-->
<!--          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 100%">-->
<!--            <el-option label="I期" value="I期" />-->
<!--            <el-option label="II期" value="II期" />-->
<!--            <el-option label="III期" value="III期" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="客户" prop="customerName">-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-select v-model="queryParams.status" placeholder="请选择" clearable>-->
<!--                <el-option label="药企1" value="药企1" />-->
<!--                <el-option label="药企2" value="药企2" />-->
<!--                <el-option label="药企3" value="药企3" />-->
<!--                <el-option label="药企4" value="药企4" />-->
<!--                <el-option label="药企5" value="药企5" />-->
<!--              </el-select>-->
<!--            </el-col>-->
<!--            <el-col :span="10">-->
<!--              <el-button type="primary" icon="el-icon-plus">新增客户</el-button>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="项目简介" prop="remark">-->
<!--          <el-input v-model="form.remark" type="textarea" placeholder="请输入" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--        <el-button @click="cancel">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import {
  listPost,
  getPost,
  delPost,
  addPost,
  updatePost
} from '@/api/project/list'
// import { projectExport } from '@/api/business/customer'

export default {
  name: 'Post',
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
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isBusinessProject: 0,
        projectId: JSON.parse(localStorage['chooseProject']).id,
        planNo: '',
        no: '',
        indication: '',
        customerName: '',
        status: '',
        projectType: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        symptom: [{ required: true, message: '不能为空', trigger: 'blur' }],
        planNo: [{ required: true, message: '不能为空', trigger: 'blur' }],
        assessStandard: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        customerName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true
      listPost(this.queryParams).then((response) => {
        this.postList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: 0,
        status: '0',
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.postId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增项目'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const postId = row.postId || this.ids
      getPost(postId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改岗位'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.postId !== undefined) {
            updatePost(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPost(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.postId || this.ids
      this.$modal
        .confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？')
        .then(function() {
          return delPost(postIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => { })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/export', {
        ...this.queryParams
      }, `项目_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
