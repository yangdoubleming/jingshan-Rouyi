<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          >创建合同</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
          >下载模板</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="postList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="合同编号" align="center" prop="projectNo">
        <template slot-scope="scope">
          <router-link to="/project/listDetails">
            <el-button type="text">{{ scope.row.projectNo }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="合同类型" align="center" prop="planNo" />
      <el-table-column label="状态" align="center" prop="symptom" />
      <el-table-column label="签订日期" align="center" prop="customerName" />
      <el-table-column label="创建人" align="center" prop="projectType" />
      <el-table-column label="创建时间" align="center" prop="projectStatus" />
      <el-table-column label="修改人" align="center" prop="projectStatus" />
      <el-table-column label="修改时间" align="center" prop="projectStatus" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <el-button type="text">文件列表</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form
        ref="form"
        :model="projectAddform"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="项目类型" prop="projectType">
          <el-select
            v-model="projectAddform.projectType"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option label="BICR" value="BICR" />
            <el-option label="咨询项目" value="咨询项目" />
            <el-option label="演示项目" value="演示项目" />
            <el-option label="其它" value="其它" />
          </el-select>
        </el-form-item>
        <el-form-item label="适应症" prop="indication">
          <el-input
            v-model="projectAddform.indication"
            placeholder="请输入适应症"
          />
        </el-form-item>
        <el-form-item label="方案编号" prop="planNo">
          <el-input
            v-model="projectAddform.planNo"
            placeholder="请输入方案编号"
          />
        </el-form-item>
        <el-form-item label="评估标准" prop="evaluationCriteria">
          <el-select
            v-model="projectAddform.evaluationCriteria"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option label="RECIST1.1" value="RECIST1.1" />
            <el-option label="Lugano2014" value="Lugano2014" />
            <el-option label="RANO" value="RANO" />
            <el-option label="Choi" value="Choi" />
            <el-option label="其它" value="其它" />
          </el-select>
        </el-form-item>
        <el-form-item label="研究分期" prop="researchPhase">
          <el-select
            v-model="projectAddform.researchPhase"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option label="I期" value="I期" />
            <el-option label="II期" value="II期" />
            <el-option label="III期" value="III期" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户" prop="customerId">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-select
                v-model="projectAddform.customerId"
                placeholder="请选择"
                clearable
              >
                <el-option label="药企1" value="1" />
                <el-option label="药企2" value="2" />
                <el-option label="药企3" value="3" />
                <el-option label="药企4" value="4" />
                <el-option label="药企5" value="5" />
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="addNewCustomerDia = true"
                >新增客户</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="项目简介" prop="desc">
          <el-input
            v-model="projectAddform.desc"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增客户 -->
    <el-dialog
      title="新增客户"
      :visible.sync="addNewCustomerDia"
      width="600px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="newCustomerForm"
        :rules="rules"
        label-width="130px"
      >
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="newCustomerForm.name" placeholder="请输入适应症" />
        </el-form-item>
        <el-form-item label="客户英文名称" prop="enName">
          <el-input
            v-model="newCustomerForm.enName"
            placeholder="请输入方案编号"
          />
        </el-form-item>
        <el-form-item label="LOGO" prop="logoUrl">
          <el-button type="primary" icon="el-icon-plus">上传图片</el-button>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="socialCreditCode">
          <el-input
            v-model="newCustomerForm.socialCreditCode"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="newCustomerForm.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="邮编" prop="postalCode">
          <el-input v-model="newCustomerForm.postalCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="newCustomerForm.address" placeholder="请输入" />
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
import {
  listPost,
  getPost,
  delPost,
  updatePost,
  listAdd,
  customerAdd,
} from "@/api/project/list";

export default {
  name: "Post",
  dicts: ["sys_normal_disable"],
  data() {
    return {
      // 遮罩层
      loading: true,
      addNewCustomerDia: false,
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
        status: undefined,
      },
      // 表单参数
      projectAddform: {},
      newCustomerForm: {},
      form: {},
      // 表单校验
      rules: {
        projectType: [{ required: true, message: "不能为空", trigger: "blur" }],
        symptom: [{ required: true, message: "不能为空", trigger: "blur" }],
        planNo: [{ required: true, message: "不能为空", trigger: "blur" }],
        assessStandard: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        customerName: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then((response) => {
        // this.postList = response.rows;
        this.postList = [
          {
            planNo: "Squre-ABC-200101",
            projectNo: "P2022100501",
            symptom: "肺癌",
            customerName: "张凤祥",
            projectStatus: "进行中",
            projectType: "BICR",
            flag: false,
          },
          {
            planNo: "Squre-ABC-200103",
            projectNo: "P2022100503",
            symptom: "肝癌",
            customerName: "李逢人",
            projectStatus: "已关闭",
            projectType: "咨询项目",
            flag: false,
          },
          {
            planNo: "Squre-ABC-200105",
            projectNo: "P2022100505",
            symptom: "肝癌",
            customerName: "张小慧",
            projectStatus: "已关闭",
            projectType: "咨询项目",
            flag: false,
          },
          {
            planNo: "Squre-ABC-200106",
            projectNo: "P2022100506",
            symptom: "肝癌",
            customerName: "陈泽强",
            projectStatus: "已关闭",
            projectType: "咨询项目",
            flag: false,
          },
          {
            planNo: "Squre-ABC-200108",
            projectNo: "P2022100508",
            symptom: "肝癌",
            customerName: "杨开",
            projectStatus: "已关闭",
            projectType: "咨询项目",
            flag: false,
          },
          {
            planNo: "Squre-ABC-200109",
            projectNo: "P2022100509",
            symptom: "肝癌",
            customerName: "洪慧中",
            projectStatus: "已关闭",
            projectType: "咨询项目",
            flag: false,
          },
          {
            planNo: "Squre-ABC-200110",
            projectNo: "P2022100510",
            symptom: "肝癌",
            customerName: "周洋",
            projectStatus: "已关闭",
            projectType: "咨询项目",
            flag: false,
          },
        ];
        this.total = 66;
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
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增项目";
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
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.postId != undefined) {
            updatePost(this.projectAddform).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            listAdd(this.projectAddform).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    //   新增客户
    submitNewCustomer() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          customerAdd(this.newCustomerForm).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.addNewCustomerDia = false;
          });
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
        .catch(() => {});
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
  },
};
</script>
