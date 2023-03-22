<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="项目ID" prop="projectId">
          <el-input
            v-model="queryParams.projectId"
            placeholder="请输入项目ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="审核阶段，1-一审  2-二审" prop="auditStep">
          <el-input
            v-model="queryParams.auditStep"
            placeholder="请输入审核阶段，1-一审  2-二审"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="方案要求" prop="schemeRequire">
          <el-input
            v-model="queryParams.schemeRequire"
            placeholder="请输入方案要求"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="审核结果输入方式：" prop="inputMode">
          <el-input
            v-model="queryParams.inputMode"
            placeholder="请输入审核结果输入方式："
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="审核结果输入方式下拉框时，配置的下拉值" prop="downBoxValue">
          <el-input
            v-model="queryParams.downBoxValue"
            placeholder="请输入审核结果输入方式下拉框时，配置的下拉值"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="字符串长度" prop="charLength">
          <el-input
            v-model="queryParams.charLength"
            placeholder="请输入字符串长度"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="queryParams.sort"
            placeholder="请输入排序"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form> -->
    <span style="font-weight:bold">数据质控复核配置</span>
    <el-divider />
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleAdd">创建数据质控复核配置
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:cfg:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:cfg:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:cfg:export']"
          >导出</el-button>
        </el-col>-->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="cfgList" @selection-change="handleSelectionChange">
      <el-table-column label="质控问题" align="center" prop="content" />
      <el-table-column label="字符串长度" align="center" prop="charLength" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="status">
        <!-- <template slot-scope="scope">
                    <el-switch @change="changeStatus(scope.row)" active-text="启用" inactive-text="禁用"
                        :value="scope.row.status == '是'" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </template> -->
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.status"
            active-color="#13ce66"
            inactive-color="#909399"
            active-value="是"
            inactive-value="否"
            @change="changeStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['system:cfg:remove']">删除</el-button> -->
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

    <!-- 添加或修改项目数据审核配置对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="质控问题" prop="content">
          <el-input v-model="form.content" placeholder="请输入质控问题" />
        </el-form-item>
        <el-form-item label="备注" prop="schemeRequire">
          <el-input v-model="form.schemeRequire" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="100" label="排序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCfg, delCfg, addCfg, updateCfg, setDataAuditStatus } from '@/api/system/projectData'

export default {
  name: 'Cfg',
  props: {
    projectId: {
      type: String,
      default: ''
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
      // 项目数据审核配置表格数据
      cfgList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        auditStep: null,
        content: null,
        schemeRequire: null,
        inputMode: null,
        downBoxValue: null,
        charLength: null,
        sort: null,
        status: null
      },
      // 表单参数
      form: {
        auditStep: ''
      },
      // 表单校验
      rules: {
        content: [
          { required: true, message: '质控问题不能为空', trigger: 'blur' },
          { max: 500, message: '长度不大于500个字符', trigger: 'blur' }
        ],
        schemeRequire: [
          { required: true, message: '备注不能为空', trigger: 'blur' },
          { max: 500, message: '长度不大于500个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '创建者不能为空', trigger: 'blur' }
        ],
        updateBy: [
          { required: true, message: '更新者不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeStatus(item) {
      this.loading = true
      setDataAuditStatus({
        id: item.id,
        status: item.status === '是' ? '1' : '0'
      }).then(response => {
        if (response.code === 200) {
          this.$message.success(response.msg)
          this.getList()
        }
      })
    },
    /** 查询项目数据审核配置列表 */
    getList() {
      this.loading = true
      this.queryParams.auditStep = 2
      this.queryParams.projectId = this.projectId
      listCfg(this.queryParams).then(response => {
        this.cfgList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.getList()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        projectId: null,
        auditStep: null,
        content: null,
        schemeRequire: null,
        inputMode: null,
        downBoxValue: null,
        charLength: null,
        sort: null,
        status: '0',
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加数据质控复核配置'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const { id, content, schemeRequire, sort } = row
      this.form = { id, content, schemeRequire, sort }
      this.open = true
      this.title = '修改数据质控复核配置'
    },
    /** 提交按钮 */
    submitForm() {
      this.form.projectId = this.projectId
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCfg(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            this.form.auditStep = '2'
            addCfg(this.form).then(response => {
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
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除项目数据审核配置编号为"' + ids + '"的数据项？').then(function() {
        return delCfg(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => { })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/cfg/export', {
        ...this.queryParams
      }, `cfg_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

