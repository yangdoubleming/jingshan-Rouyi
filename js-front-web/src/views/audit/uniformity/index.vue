<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="是否加急">
        <el-select v-model="queryParams.urgentType" placeholder="" clearable>
          <!-- <el-option label="全部" value="0" /> -->
          <el-option label="加急" value="1" />
          <el-option label="不加急" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="中心" prop="centerNo">
        <el-input v-model="queryParams.centerNo" placeholder="" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="受试者" prop="examineNo">
        <el-input v-model="queryParams.examineNo" placeholder="请输入受试者编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="访视日期" prop="actualVisitDate">
        <el-date-picker v-model="queryParams.actualVisitDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="状态" prop="checkStatus">
        <el-select v-model="queryParams.checkStatus" placeholder="" clearable>
          <el-option label="待核查+核查中" value="1" />
          <el-option label="核查通过+未核查通过" value="2" />
          <el-option label="核查不通过" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="完成上传时间" prop="completeUploadTime">
        <el-date-picker v-model="queryParams.completeUploadTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="核查完成时间" prop="checkDate">
        <el-date-picker v-model="queryParams.checkDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['audit:uniformity:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
       <el-table-column type="selection" :selectable="checkSelectMember" width="55" align="center" />
      <el-table-column label="是否加急" align="center" prop="isUrgent">
        <template slot-scope="scope">
          <p v-if="scope.row.isUrgent === 0">
            {{ scope.row.isUrgent === 0 && "-" }}
          </p>
          <p v-if="scope.row.isUrgent === 1" style="color: red">
            {{ scope.row.isUrgent === 1 && "加急" }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="中心" align="center" prop="centerNo" />
      <el-table-column label="受试者编号" align="center" prop="examineNo" width="180" />
      <el-table-column label="受试者随机编号" align="center" prop="randomNo" width="180" />
      <el-table-column label="访视" align="center" prop="visitName" />
      <el-table-column label="访视日期" align="center" prop="actualVisitDate" width="150" />
      <el-table-column prop="fieldSourceTable" label="核查状态" width="150">
        <template slot-scope="scope">
          {{ checkStatusText[scope.row.checkStatus] }}
        </template>
      </el-table-column>
      <el-table-column label="完成上传时间" align="center" width="180" prop="completeUploadTime" />
      <el-table-column label="核查完成时间" align="center" width="180" prop="checkDate" />
      <el-table-column label="核查人员" align="center" width="150" prop="checkUser" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="getCheckList(scope.row)">查看检查列表</el-button>
          <el-button v-if="scope.row.checkStatus === '0' || scope.row.checkStatus === '3'" size="mini" type="text" @click="audit(4, scope.row)">未核查通过</el-button>
          <el-button v-if="scope.row.checkStatus === '0' || scope.row.checkStatus === '3' || scope.row.checkStatus === '4'" size="mini" type="text" @click="audit(1, scope.row)">通过</el-button>
          <el-button v-if="scope.row.checkStatus === '0' || scope.row.checkStatus === '3' || scope.row.checkStatus === '4'" size="mini" type="text" style="color: red;" @click="changeDialogVisible(scope.row)">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <!-- 检查列表 -->
    <el-dialog title="检查列表" :visible.sync="listOpen" width="90%" append-to-body>
      <el-table v-loading="checkLoading" :data="checkList">
        <el-table-column v-for="(item, i) in columns" :key="i" :label="item.label" align="center" :prop="item.prop" />
      </el-table>
    </el-dialog>
    <!-- 不通过 -->
    <el-dialog
      title="一致性核查不通过"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="content">
        <div class="tips">一致性核查不通过，请选择退回节点</div>
        <div style="margin-top: 20px;">
          <el-radio v-model="panelPoint" label="1">CRC</el-radio>
          <el-radio v-model="panelPoint" label="2">数据质控复核</el-radio>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="auditUn(2, rowInfo)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, inspectList, changeCheckStatus } from '@/api/audit/uniformity'
export default {
  name: 'Post',
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      checkLoading: false,
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
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      listOpen: false,
      checkList: [],
      columns: [],
      dialogVisible: false,
      panelPoint: '1',
      rowInfo: '',
      checkStatusText: {
        '0': '待核查',
        "1": "通过",
        '2': '不通过',
        '3': '核查中',
        '4': '未核查通过'
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
      this.queryParams.projectId = JSON.parse(localStorage['chooseProject']).id
      list(this.queryParams).then(response => {
        this.postList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    changeDialogVisible(row) {
      this.dialogVisible = true
      this.rowInfo = row
    },
    getCheckList(row) {
      inspectList({ visitId: row.visitId }).then(response => {
        if (response.data && response.data.length > 0) {
          this.columns = this.buildColumns(response.data[0])
          this.checkList = this.buildRows(response.data)
        }
      }).catch(() => {
        this.columns = []
        this.checkList = []
      })
      this.listOpen = true
    },
    buildColumns(columnsValues) {
      const columns = []
      for (let i = 0; i < columnsValues.length; i++) {
        columns.push({ prop: 'col' + i, label: columnsValues[i] })
      }
      return columns
    },
    buildRows(values) {
      const rows = []
      if (values.length < 2) {
        return rows
      }
      for (let i = 1; i < values.length; i++) {
        const array = values[i]
        const row = {}
        for (let j = 0; j < array.length; j++) {
          row['col' + j] = array[j]
        }
        rows.push(row)
      }
      return rows
    },
    audit(type, row) {
      let title = ''
      let content = ''
      if (type === 4) {
        title = '未核查通过'
        content = '请确认此访视未核查核查通过？'
      } else if (type === 1) {
        title = '一致性核查通过'
        content = '请确认此访视一致性核查通过？'
      }
      const params = { visitId: row.visitId, checkStatus: type }
      this.$confirm(content, title, { type: 'warning' }).then(() => {
        changeCheckStatus(params).then(response => {
          if (response.code === 200) {
            this.$message.success('设置成功')
            this.getList()
          }
        })
      })
    },
    auditUn(type, row) {
      const params = { visitId: row.visitId, checkStatus: 2, panelPoint: this.panelPoint }
      changeCheckStatus(params).then(response => {
        if (response.code === 200) {
          this.$message.success('设置成功')
          this.dialogVisible = false
          this.getList()
        }
      })
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
      this.ids = selection.map(item => item.visitId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.downloadJson('/visit/check/exportCheckList', {
        visitIds: this.ids
      }, `一致性核查列表.xlsx`)
    },
    checkSelectMember(row, index) {
      return row.checkStatus === '0' || row.checkStatus === '3' || row.checkStatus === '4'
    }
  }
}
</script>
