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
      <el-form-item label="项目编号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入 项目编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="方案编号" prop="planNo">
        <el-input
          v-model="queryParams.planNo"
          placeholder="请输入 方案编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="适应症" prop="indication">
        <el-input
          v-model="queryParams.indication"
          placeholder="请输入 适应症"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户简称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入 客户简称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <el-select
          v-model="queryParams.projectType"
          placeholder="全部"
          clearable
        >
          <el-option label="BICR" value="BICR"/>
          <el-option label="咨询项目" value="咨询项目"/>
          <el-option label="演示项目" value="演示项目"/>
          <el-option label="测试项目" value="测试项目"/>
          <el-option label="其它" value="其它"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="全部"
          clearable
        >
          <el-option label="未立项" value="0"/>
          <el-option label="进行中" value="1"/>
          <el-option label="已关闭" value="2"/>
<!--          <el-option label="已删除" value="3"/>-->
<!--          <el-option label="其它" value="4"/>-->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['project:add']"
          type="primary"
          plain
          size="mini"
          @click="handleAdd"
        >创建项目
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['project:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="postList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="项目编号" align="center" prop="no">
        <template slot-scope="scope">
          <router-link
            :to="{
              path: '/business/projectDetails',
              query: { id: scope.row.id },
            }"
          >
            <el-button type="text">{{ scope.row.no }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="方案编号" align="center" prop="planNo"/>
      <el-table-column label="适应症" align="center" prop="indication"/>
      <el-table-column label="评估标准" align="center" prop="evaluationCriteria" />
      <el-table-column label="客户简称" align="center" prop="customerName"/>
      <el-table-column label="项目类型" align="center" prop="projectType"/>
      <el-table-column label="研究分期" align="center" prop="researchPhase"/>
      <el-table-column label="状态" align="center" prop="status"/>`
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <router-link
            :to="{
              path: '/business/projectDetails',
              query: { id: scope.row.id },
            }"
          >
            <el-button type="text">项目详情</el-button>
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="form"
        :model="projectAddform"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="项目类型" prop="projectType">
          <el-select
            v-model="projectAddform.projectType"
            placeholder="请选择 项目类型"
            clearable
            style="width: 100%"
          >
            <el-option label="BICR" value="BICR"/>
            <el-option label="咨询项目" value="咨询项目"/>
            <el-option label="演示项目" value="演示项目"/>
            <el-option label="测试项目" value="测试项目"/>
            <el-option label="其它" value="其它"/>
          </el-select>
        </el-form-item>
        <el-form-item label="适应症" prop="indication">
          <el-input
            v-model="projectAddform.indication"
            placeholder="请输入 适应症"
          />
        </el-form-item>
        <el-form-item label="方案编号" prop="planNo">
          <el-input
            v-model="projectAddform.planNo"
            placeholder="请输入 方案编号"
          />
        </el-form-item>
        <el-form-item label="评估标准" prop="evaluationCriteria">
          <el-select
            v-model="projectAddform.evaluationCriteria"
            placeholder="请选择 评估标准"
            multiple
            style="width: 100%"
          >
            <el-option label="RECIST1.1" value="RECIST1.1"/>
            <el-option label="Lugano2014" value="Lugano2014"/>
            <el-option label="RANO" value="RANO"/>
            <el-option label="Choi" value="Choi"/>
            <el-option label="心脏毒性" value="心脏毒性"/>
            <el-option label="其它" value="其它"/>
          </el-select>
        </el-form-item>
        <el-form-item label="研究分期" prop="researchPhase">
          <el-select
            v-model="projectAddform.researchPhase"
            placeholder="请选择 研究分期"
            clearable
            filterable
            allow-create
            style="width: 100%"
          >
            <el-option label="I期" value="I期"/>
            <el-option label="II期" value="II期"/>
            <el-option label="III期" value="III期"/>
            <el-option label="IV期" value="IV期"/>
            <el-option label="IIT" value="IIT"/>
            <el-option label="NA" value="NA"/>
            <el-option label="咨询项目" value="咨询项目"/>
          </el-select>
        </el-form-item>
        <el-form-item label="客户简称" prop="customerId">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-select
                v-model="projectAddform.customerId"
                placeholder="请选择 客户简称"
                filterable
                clearable
                @change="changeCustomer"
              >
                <el-option
                  v-for="item in CustomerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="showAddCustomer = true"
              >新增客户
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="项目简介" prop="desc">
          <el-input
            v-model="projectAddform.desc"
            type="textarea" oninput="if(value.length>500)value=value.slice(0,500)"
            placeholder="请输入 项目简介"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <!--        <el-button @click="cancel">取 消</el-button>-->
      </div>
    </el-dialog>
    <!-- 新增客户弹窗 -->
    <AddCustomer :dia-show="showAddCustomer" :new-customer-form="newObj"/>
  </div>
</template>

<script>
import AddCustomer from '@/views/components/customer/addCustomer'
import {
  listPost,
  getPost,
  delPost,
  updatePost,
  listAdd,
  customerAdd
} from '@/api/business/project'
import {listPost as customerListPost} from '@/api/business/customer'

export default {
  name: 'Post',
  dicts: ['sys_normal_disable'],
  components: {
    AddCustomer
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      addNewCustomerDia: false,
      showAddCustomer: false,
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
        isBusinessProject: 1,
        planNo: undefined,
        no: undefined,
        indication: '',
        customerName: '',
        status: undefined,
        projectType: ''
      },
      // 表单参数
      projectAddform: {
        customerName: '',
        mainManagerId: 1,
        spareManagerId: 2
      },
      newCustomerForm: {},
      CustomerList: [{name: ''}],
      newObj: {},
      form: {},
      // 表单校验
      rules: {
        projectType: [
          {required: true, message: '请选择 项目类型', trigger: 'blur'}
        ],
        indication: [
          {required: true, message: '请输入 适应症', trigger: 'blur'}
        ],
        planNo: [
          {required: true, message: '请输入 方案编号', trigger: 'blur'}
        ],
        researchPhase: [
          {required: true, message: '请选择 研究分期', trigger: 'blur'}
        ],
        evaluationCriteria: [
          {required: true, message: '请选择 评估标准', trigger: 'blur'}
        ],
        customerId: [
          {required: true, message: '请选择 客户简称', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeCustomer(v) {
      this.CustomerList.forEach((element) => {
        if (element.id === v) {
          this.projectAddform.customerName = element.name
        }
      })
    },
    // 关闭新增弹窗
    diaClose() {
      this.showAddCustomer = false
    },
    /** 查询项目列表 */
    getList() {
      this.loading = true
      listPost(this.queryParams).then((response) => {
        this.postList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 查询客户列表 */
    getCustomerList() {
      customerListPost({pageNum: 1, pageSize: 10000}).then(
        (response) => {
          this.CustomerList = response.rows
        }
      )
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
        planNo: undefined,
        no: undefined,
        indication: '',
        customerName: '',
        postSort: 0,
        status: '0',
        projectType: undefined
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
      this.getCustomerList()
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
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.postId !== undefined) {
            updatePost(this.projectAddform).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            const ob = {...this.projectAddform}
            ob.evaluationCriteria = ob.evaluationCriteria.join()
            listAdd(ob).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    //   新增客户
    submitNewCustomer() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          customerAdd(this.newCustomerForm).then((response) => {
            this.$modal.msgSuccess('新增成功')
            this.addNewCustomerDia = false
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.postId || this.ids
      this.$modal
        .confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？')
        .then(function () {
          return delPost(postIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'project/export',
        {
          ...this.queryParams
        },
        `商务项目_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
