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
        <el-form-item label="评估标准" prop="standardList">
          <el-input
            v-model="queryParams.standardList"
            placeholder="请输入评估标准"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="IR人数" prop="irPeopleNumber">
          <el-input
            v-model="queryParams.irPeopleNumber"
            placeholder="请输入IR人数"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="是否启动全局评估" prop="isGlobalAssessment">
          <el-input
            v-model="queryParams.isGlobalAssessment"
            placeholder="请输入是否启动全局评估"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="是否启动仲裁" prop="isArbitration">
          <el-input
            v-model="queryParams.isArbitration"
            placeholder="请输入是否启动仲裁"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="仲裁方法" prop="arbitrationWay">
          <el-input
            v-model="queryParams.arbitrationWay"
            placeholder="请输入仲裁方法"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="仲裁维度" prop="arbitrationDimension">
          <el-input
            v-model="queryParams.arbitrationDimension"
            placeholder="请输入仲裁维度"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="是否启动临床评估节点：" prop="isClinicalAssessNode">
          <el-input
            v-model="queryParams.isClinicalAssessNode"
            placeholder="请输入是否启动临床评估节点："
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleAdd">创建评估流程</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['system:cfg:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                    @click="handleDelete" v-hasPermi="['system:cfg:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['system:cfg:export']">导出</el-button>
            </el-col> -->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="cfgList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="项目评估流程配置ID" align="center" prop="id" /> -->
      <el-table-column label="项目ID" align="center" prop="projectId" />
      <el-table-column label="评估类型" align="center" prop="type" />
      <el-table-column label="评估标准" align="center" prop="standardList" />
      <el-table-column label="IR人数" align="center" prop="irPeopleNumber" />
      <el-table-column label="是否启动全局评估" align="center" prop="isGlobalAssessment" />
      <el-table-column label="是否启动仲裁" align="center" prop="isArbitration" />
      <el-table-column label="仲裁方法" align="center" prop="arbitrationWay" />
      <el-table-column label="仲裁维度" align="center" prop="arbitrationDimension" />
      <el-table-column label="是否启动临床评估节点" align="center" prop="isClinicalAssessNode" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.status == '0'"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:cfg:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['system:cfg:remove']">删除</el-button>

                </template>
            </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改项目评估流程配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="评估类型" prop="type">
          <el-select v-model="form.type" placeholder="" style="width:100%" clearable>
            <el-option label="BICR" value="1" />
            <el-option label="筛选评估" value="2" />
            <el-option label="疾病进展确认评估" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="评估标准" prop="standardList">
          <el-select v-model="form.standardList" style="width:100%" placeholder="" clearable>
            <el-option v-for="item in optionsProjectType" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="IR人数" prop="irPeopleNumber">
          <el-select v-model="form.irPeopleNumber" style="width:100%" placeholder="" clearable>
            <el-option label="单IR" value="1" />
            <el-option label="双IR" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启动全局评估" prop="isGlobalAssessment">
          <el-select v-model="form.isGlobalAssessment" style="width:100%" placeholder="" clearable>
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启动仲裁" prop="isArbitration">
          <el-select v-model="form.isArbitration" @change="changeIsArbitration" style="width:100%" placeholder="" clearable>
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="仲裁方法" prop="arbitrationWay" v-if="form.isArbitration!='0'">
          <el-select v-model="form.arbitrationWay" style="width:100%" placeholder="" clearable>
            <el-option label="无" value="1" />
            <el-option label="二选一" value="2" />
            <el-option label="IR3独立评估" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="仲裁维度" prop="arbitrationDimension" v-if="form.isArbitration!='0'">
          <el-select v-model="form.arbitrationDimension" style="width:100%" placeholder="" clearable>
            <el-option label="无" value="0" />
            <el-option label="全局仲裁" value="1" />
            <el-option label="无全局仲裁" value="2" />
            <el-option label="访视点仲裁" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否肿瘤学评估" prop="isClinicalAssessNode">
          <el-select v-model="form.isClinicalAssessNode" style="width:100%" placeholder="" clearable>
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
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
import { listCfg, getCfg, delCfg, addCfg, setAssessFlowStatus } from '@/api/system/cfg'
import { projectDetails } from '@/api/business/project'
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
      optionsProjectType:[],
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
      // 项目评估流程配置表格数据
      cfgList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: this.projectId,
        type: null,
        standardList: null,
        irPeopleNumber: null,
        isGlobalAssessment: null,
        isArbitration: null,
        arbitrationWay: null,
        arbitrationDimension: null,
        isClinicalAssessNode: null,
        status: null
      },
      // 表单参数
      form: {
        id: '',
        projectId: ''
      },
      // 表单校验
      rules: {
        projectId: [
          { required: true, message: '项目ID不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '评估类型不能为空', trigger: 'change' }
        ],
        standardList: [
          { required: true, message: '评估标准不能为空', trigger: 'blur' }
        ],
        irPeopleNumber: [
          { required: true, message: 'IR人数不能为空', trigger: 'blur' }
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
    this.init()
    this.getProjectDetails()
  },
  methods: {
    // 切换是否启动仲裁
    changeIsArbitration(v){
      if(v=='0'){
        this.form.arbitrationDimension = "0"
        this.form.arbitrationWay = '1'
      }else{
        this.form.arbitrationDimension = ""
        this.form.arbitrationWay = ""
      }
      
    },
    getProjectDetails() {
      projectDetails({ id: this.projectId }).then((response) => {
        this.optionsProjectType = response.data.evaluationCriteria.split(',')
      })
    },
    init() {
      this.form.projectId = this.projectId
    },
    changeStatus(item) {
      this.loading = true
      setAssessFlowStatus({
        id: item.id,
        status: item.status === '1' ? '0' : '1'
      }).then(response => {
        this.getList()
      })
    },
    /** 查询项目评估流程配置列表 */
    getList() {
      this.loading = true
      listCfg(this.queryParams).then(response => {
        this.cfgList = response.rows
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
        id: null,
        projectId: null,
        type: null,
        standardList: null,
        irPeopleNumber: null,
        isGlobalAssessment: null,
        isArbitration: null,
        arbitrationWay: null,
        arbitrationDimension: null,
        isClinicalAssessNode: null,
        delFlag: null,
        status: '0',
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
      // this.reset();
      this.open = true
      this.title = '添加项目评估流程配置'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getCfg(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改项目评估流程配置'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addCfg(this.form).then(response => {
            this.$modal.msgSuccess('新增成功')
            this.open = false
            this.getList()
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除项目评估流程配置编号为"' + ids + '"的数据项？').then(function() {
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

