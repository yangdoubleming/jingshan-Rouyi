<template>
  <div class="app-container" v-loading="loading">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <!-- <el-form-item label="质疑状态" prop="questionStatus">
        <el-select v-model="queryParams.status" placeholder="全部" clearable>
          <el-option label="全部" value="全部" />
          <el-option label="未回复" value="未回复" />
          <el-option label="已回复" value="已回复" />
          <el-option label="无" value="无" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="中心" prop="centerNo">
        <el-input v-model="queryParams.centerNo" placeholder="请输入中心编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="受试者编号" prop="no">
        <el-input v-model="queryParams.no" placeholder="请输入受试者编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="screenAssessmentStatus">
        <el-select v-model="queryParams.screenAssessmentStatus" placeholder="全部" clearable>
          <el-option label="全部" value="" />
          <el-option label="正常" value="0" />
          <el-option label="出组" value="1" />
          <el-option label="筛选失败" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['examinee:add']">创建受试者</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column label="受试者" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{path:'/image/testerDetails', query:{id:scope.row.id,centerId:scope.row.centerId}}">
            <el-button type="text">{{ scope.row.no }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <!--
      <el-table-column label="质疑" align="center" prop="">
        <template slot-scope="scope">
          <i class="el-icon-question" v-if="scope.row.status == '正常'" style="color: red; cursor: pointer"
            @click="openDia"></i>
          <i class="el-icon-question" v-else style="color: #323e52"></i>
        </template>
      </el-table-column>
      -->
      <el-table-column label="中心" align="center" prop="centerNo" />
      <!-- <el-table-column label="出生年月" align="center" prop="" /> -->
      <el-table-column label="状态" align="center" prop="screenAssessmentStatus">
        <template slot-scope="scope">
            {{changeTxt(scope.row.screenAssessmentStatus)}}
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="openEdit(scope.row)" >修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 创建受试者对话框 -->
    <el-dialog title="创建受试者" :close-on-click-modal="false" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="中心编号" prop="centerNo">
          <el-select v-model="form.centerNo" placeholder="请选择" clearable style="width: 100%">
            <el-option v-for="item in centerArr" :key="item.no" :label="item.no" :value="item.no" />
          </el-select>
        </el-form-item>
        <el-form-item :label="testNoName" prop="no">
          <el-input v-model="form.no" :placeholder="'请输入'+testNoName" />
        </el-form-item>
        <el-form-item :label="baselineDateName" prop="baselineDate">
          <el-date-picker v-model="form.baselineDate" type="date" :placeholder="'请输入'+baselineDateName" style="width:100%;">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改受试者 -->
    <el-dialog title="修改受试者" :close-on-click-modal="false" :visible.sync="openEditDia" width="600px" append-to-body>
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="140px">
        <el-form-item :label="testNoName" prop="no">
          {{nowItem.no}}
        </el-form-item>
        <el-form-item label="受试者状态" prop="screenAssessmentStatus">
          <el-select v-model="editForm.screenAssessmentStatus" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in testerStatus" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import test01 from "@/assets/images/test01.png";
import { testerStatus } from "@/utils/dict/mine";
import {
  listPost,
  getPost,
  delPost,
  addPost,
  updatePost,
  updateStatus
} from "@/api/image/tester";
import { centerList } from "@/api/project/center";
import { getAliasCfgList } from "@/api/project/setting";

export default {
  components: {
  },
  name: "Post",
  dicts: ["sys_normal_disable"],
  data() {
    return {
      testerStatus,
      value1: '2022-02-02',
      loading:false,
      queryDialogVisible: false,
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
      total: 288,
      // 岗位表格数据
      postList: [],
      centerArr:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      chat: false,
      openEditDia: false,
      test01,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: JSON.parse(localStorage['chooseProject']).id,
        postCode: undefined,
        postName: undefined,
        status: undefined,
        no:undefined
      },
      // 表单参数
      form: {},
      editForm:{
        id:'',
        screenAssessmentStatus:''
      },
      nowItem:{},
      // 表单校验
      editRules:{
        screenAssessmentStatus: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      rules: {
        centerNo: [{ required: true, message: "不能为空", trigger: "blur" }],
        no: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      testNoName:'',
      baselineDateName:''
    };
  },
  created() {
    this.getList();
    this.getCenterList()
  },
  methods: {
    changeTxt(v){
      let name = ''
      testerStatus.forEach(item=>{
        if(item.value == v){
          name = item.name
        }
      })
      return name
    },
    openEdit(item){
      this._getAliasCfgList()
      this.nowItem = item
      this.editForm.id = item.id
      this.editForm.screenAssessmentStatus = item.screenAssessmentStatus
      this.openEditDia = true
    },
    /** 查询受试者列表 */
    getList() {
      this.loading = true;
      this.queryParams.projectId = JSON.parse(localStorage['chooseProject']).id
      listPost(this.queryParams).then((response) => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 中心列表 */
    getCenterList() {
        centerList({ pageNum: 1, pageSize: 10000, projectId: JSON.parse(localStorage['chooseProject']).id, isDataJurisdiction:1}).then(response => {
            this.centerArr = response.rows;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.postId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    async handleAdd() {
      await this.getCenterList()
      await this._getAliasCfgList()
      this.reset();
      this.open = true;
      this.title = "新增受试者";
    },
    // 获取受试者名称配置
    async _getAliasCfgList() {
      try {
        const response = await getAliasCfgList({
          projectId: this.queryParams.projectId,
        });
        if (response.code === 200) {
          this.testNoName = response.rows.find(item=>item.sqlField=='no').nameCn
          this.baselineDateName = response.rows.find(item=>item.sqlField=='baselineDate').nameCn
        }
      } finally {
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.postId || this.ids;
      getPost(postId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改岗位";
      });
    },
    submitEditForm(){
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          updateStatus(this.editForm).then((response) => {
            this.openEditDia = false;
            this.getList()
          });
        }
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.postId != undefined) {
            updatePost(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.centerArr.forEach(ele => {
              if(ele.no==this.form.centerNo){

                this.form.centerId = ele.id
              }
            });
            if(this.form.baselineDate){
              this.form.baselineDate = this.parseTime(this.form.baselineDate)
            }
            this.form.projectId = JSON.parse(localStorage['chooseProject']).id
            addPost(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？')
        .then(function () {
          return delPost(postIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/post/export",
        {
          ...this.queryParams,
        },
        `post_${new Date().getTime()}.xlsx`
      );
    },
    // 关闭质疑弹窗
    closeDia() {
      this.queryDialogVisible = false
    },
    openDia() {
      this.$refs.queryDia.openDia();
    }
  },
};
</script>
