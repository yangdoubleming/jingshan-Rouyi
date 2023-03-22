<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="质疑状态" prop="questionReplyStatus">
        <el-select v-model="queryParams.questionReplyStatus" placeholder="全部" clearable>
          <!-- <el-option label="全部" value="全部" /> -->
          <el-option label="QC未回复" :value="0" />
          <el-option label="CRC未回复" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否紧急" prop="isUrgent">
        <el-select v-model="queryParams.isUrgent" placeholder="" clearable>
          <!-- <el-option label="全部" value="全部" /> -->
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="质疑编号" prop="questionNo">
        <el-input v-model="queryParams.questionNo" placeholder="请输入质疑编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="中心名称" prop="centerNo">
        <el-input v-model="queryParams.centerNo" placeholder="请输入中心名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="受试者" prop="examineNo">
        <el-input v-model="queryParams.examineNo" placeholder="请输入受试者" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="访视" prop="visitName">
        <el-input v-model="queryParams.visitName" placeholder="请输入访视" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="访视日期" prop="actualVisitDate">
        <el-date-picker v-model="queryParams.actualVisitDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="质疑类型" prop="firstCategoryId">
        <el-select v-model="queryParams.firstCategoryId" placeholder="全部" clearable>
          <el-option v-for="(item, i) in categoryList" :key="i" :label="item.name" :value="item.id" />
          <!-- <el-option label="扫描部位不全" value="未回复" /> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="postList">
      <el-table-column label="质疑编号" align="center" prop="questionNo">
        <template slot-scope="scope">
          <router-link to="">
            <el-button type="text">{{scope.row.questionNo}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="质疑" align="center" prop="status">
        <template slot-scope="scope">
          <i v-if="scope.row.questionReplyStatus === 1" class="el-icon-question" style="color: red; cursor: pointer" @click="openDia(scope.row)" />
          <i class="el-icon-question" v-else-if="scope.row.questionReplyStatus === 2" style="color: #999; cursor: pointer" @click="openDia(scope.row)" />
          <i class="el-icon-question" v-else-if="scope.row.questionReplyStatus === 3" style="color: rgb(19, 206, 102); cursor: pointer" @click="openDia(scope.row)" />
          <span v-else>-</span>

        </template>
      </el-table-column>
      <el-table-column label="是否紧急" align="center" prop="isUrgency">
        <template slot-scope="scope">
          <i class="el-icon-message-solid" v-if="scope.row.isUrgent == 1" style="color: red; cursor: pointer"
            @click="chat = true"></i>
          <span v-else style="color: #323e52">-</span>
        </template>
      </el-table-column>

      <el-table-column label="中心" align="center" prop="centerNo" />
      <el-table-column label="受试者" align="center" prop="examineeNo" />
      <el-table-column label="访视" align="center" prop="visitName" />
      <el-table-column label="访视日期" align="center" prop="actualVisitDate" />
      <el-table-column label="质疑类型" align="center" prop="firstCategoryName" />
      <el-table-column label="质疑子类型" align="center" prop="secondCategoryName" />
      <el-table-column label="质疑发起时间" width="150" align="center" prop="createTime" />
      <el-table-column label="质疑发起时长" width="130" align="center" prop="differTime" />
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
      <!-- 质疑详情 -->
      <QuestionDetails :visible="detailsDialog" :visitId="visitId" :questionId="questionId" @close="closeDia" />
  </div>
</template>

<script>
import QuestionDetails from '@/views/components/QuestionDetails/index'
import { getQuestionList, getQuestionCategoryList } from '@/api/audit/data'

export default {
  name: "Post",
  dicts: ["sys_normal_disable"],
  components: { QuestionDetails },
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
        projectId: '',
        questionReplyStatus: '', //0=未回复,1=已回复
        isUrgent: '',
        questionNo: '',
        centerNo: '',
        examineNo: '',
        visitName: '',
        actualVisitDate: '',
        firstCategoryId: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      detailsDialog: false,
      visitId: '',
      questionId: '',
      categoryList: ''
    };
  },
  created() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    // 获取质疑类型列表
    getCategoryList() {
      getQuestionCategoryList().then((res) => {
        if (res.data && res.data.length > 0) {
          // this.options = res.data
          this.categoryList = res.data
        }
      })
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      this.queryParams.projectId = JSON.parse(localStorage["chooseProject"]).id
      getQuestionList(this.queryParams).then((response) => {
        this.postList = response.rows
        this.total = response.total
        this.loading = false
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
        remark: undefined,
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
    // 关闭质疑弹窗
    closeDia() {
      this.visitId = ''
      this.questionId = ''
      this.detailsDialog = false
    },
    openDia(row) {
      this.visitId = row.visitId
      this.questionId = row.id
      this.detailsDialog = true
    }
  },
};
</script>
