<!-- 评估任务列表 -->
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <!--          <el-form-item label="质疑回复状态" prop="examineReplyStatus">-->
      <!--            <el-select-->
      <!--              v-model="queryParams.examineReplyStatus"-->
      <!--              placeholder="全部"-->
      <!--              clearable-->
      <!--            >-->
      <!--              <el-option label="未回复" value="1" />-->
      <!--              <el-option label="已回复" value="2" />-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <el-form-item label="是否加急" prop="isUrgent">
        <el-select v-model="queryParams.isUrgent" placeholder="全部" clearable>
          <el-option label="不加急" value="0" />
          <el-option label="加急" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="受试者编号" prop="examineeNo">
        <el-input
          v-model="queryParams.examineeNo"
          placeholder="请输入受试者编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评估类型" prop="assessJobType">
        <el-select
          v-model="queryParams.assessJobType"
          placeholder="全部"
          clearable
        >
          <el-option label="独立评估" value="1" />
          <el-option label="全局评估" value="2" />
          <el-option label="仲裁评估" value="3" />
          <el-option label="临床评估" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="评估开始时间" prop="startDate">
        <el-date-picker
          clearable
          v-model="queryParams.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择评估开始时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="评估人" prop="evaluatorName">
        <el-input
          v-model="queryParams.evaluatorName"
          placeholder="请输入评估人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable>
          <el-option label="全部" value="" />
          <el-option label="待评估" value="0" />
          <el-option label="已评估" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="jobList"
      @selection-change="handleSelectionChange"
    >
      <!--            <el-table-column label="质疑" align="center" prop="examineType" >-->
      <!--                <template slot-scope="scope">-->
      <!--                    &lt;!&ndash; <QueryDialog /> &ndash;&gt;-->
      <!--                </template>-->
      <!--            </el-table-column>-->
      <el-table-column label="是否加急" align="center" prop="isUrgent" />
      <el-table-column label="受试者" align="center" prop="examineeNo" />
      <el-table-column label="访视" align="center" prop="visitName" />
      <el-table-column label="类型" align="center" prop="assessJobTypeMsg" />
      <el-table-column label="评估标准" align="center" prop="standardList" />
      <el-table-column label="评估人" align="center" prop="evaluatorName" />
      <el-table-column
        label="评估开始时间"
        align="center"
        prop="startDate"
        width="180"
      />
      <el-table-column
        label="评估完成时间"
        align="center"
        prop="endDate"
        width="180"
      />
      <el-table-column label="状态" align="center" prop="statusMsg" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- 独立评估-基线报告-普通项目 -->
          <router-link
            v-if="
              scope.row.projectStandard === 1 &&
              scope.row.assessJobType === 1 &&
              scope.row.isFirstVisit === 1
            "
            :to="{
              path: '/assess/list/base',
              query: {
                assessJobId: scope.row.assessJobId,
                examineeId: scope.row.examineeId
              },
            }"
          >
            <el-button
              v-if="scope.row.isCanWriteReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估</el-button
            >
            <el-button
              v-if="scope.row.isCanReadReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估报告</el-button
            >
          </router-link>

          <!-- 独立评估-基线报告-心脏毒性项目 -->
          <router-link
            v-if="
              scope.row.projectStandard === 2 &&
              scope.row.assessJobType === 1 &&
              scope.row.isFirstVisit === 1
            "
            :to="{
              path: '/assess/heart/baseline',
              query: {
                assessJobId: scope.row.assessJobId,
                examineeId: scope.row.examineeId,
                standardList: scope.row.standardList,
                examineeNo: scope.row.examineeNo,
                statusMsg: scope.row.statusMsg,
              },
            }"
          >
            <el-button
              v-if="scope.row.isCanWriteReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估</el-button
            >
            <el-button
              v-if="scope.row.isCanReadReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估报告</el-button
            >
          </router-link>

          <!-- 独立评估-访视报告-普通项目 -->
          <router-link
            v-if="
              scope.row.projectStandard === 1 &&
              scope.row.assessJobType === 1 &&
              scope.row.isFirstVisit === 0
            "
            :to="{
              path: '/assess/list/visit',
              query: {
                assessJobId: scope.row.assessJobId,
                examineeId: scope.row.examineeId
              },
            }"
          >
            <el-button
              v-if="scope.row.isCanWriteReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估</el-button
            >
            <el-button
              v-if="scope.row.isCanReadReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估报告</el-button
            >
          </router-link>

          <!-- 独立评估-访视报告-心脏毒性项目 -->
          <router-link
            v-if="
              scope.row.projectStandard === 2 &&
              scope.row.assessJobType === 1 &&
              scope.row.isFirstVisit === 0
            "
            :to="{
              path: '/assess/heart/visit',
              query: {
                assessJobId: scope.row.assessJobId,
                examineeId: scope.row.examineeId,
                examineeNo: scope.row.examineeNo,
                standardList: scope.row.standardList,
                statusMsg: scope.row.statusMsg,
              },
            }"
          >
            <el-button
              v-if="scope.row.isCanWriteReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估</el-button
            >
            <el-button
              v-if="scope.row.isCanReadReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估报告</el-button
            >
          </router-link>

          <!-- 心脏毒性项目 心脏毒性裁定评估 -->
          <router-link
            v-if="
              scope.row.projectStandard === 2 && scope.row.assessJobType === 3
            "
            :to="{
              path: '/assess/heart/ruling',
              query: {
                assessJobId: scope.row.assessJobId,
                examineeId: scope.row.examineeId,
                standardList: scope.row.standardList,
                examineeNo: scope.row.examineeNo,
                visitName: scope.row.visitName,
                statusMsg: scope.row.statusMsg,
              },
            }"
          >
            <el-button
              v-if="scope.row.isCanWriteReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估</el-button
            >
            <el-button
              v-if="scope.row.isCanReadReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估报告</el-button
            >
          </router-link>

          <!-- 全局评估 -->
          <router-link
            v-if="
              scope.row.projectStandard === 1 && scope.row.assessJobType === 2
            "
            :to="{
              path: '/assess/list/global',
              query: {
                assessJobId: scope.row.assessJobId,
                examineeId: scope.row.examineeId,
                standardList: scope.row.standardList,
              },
            }"
          >
            <el-button
              v-if="scope.row.isCanWriteReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估</el-button
            >
            <el-button
              v-if="scope.row.isCanReadReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估报告</el-button
            >
          </router-link>

          <!-- 仲裁评估 -->
          <router-link
            v-if="
              scope.row.projectStandard === 1 && scope.row.assessJobType === 3
            "
            :to="{
              path: '/assess/list/arbitrament',
              query: {
                assessJobId: scope.row.assessJobId,
                examineeId: scope.row.examineeId,
                standardList: scope.row.standardList,
              },
            }"
          >
            <el-button
              v-if="scope.row.isCanWriteReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估</el-button
            >
            <el-button
              v-if="scope.row.isCanReadReport === 1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >评估报告</el-button
            >
          </router-link>

          <!-- <router-link :to="{
              path:'/assess/heart/baseline',
              query:{
                assessJobId: scope.row.assessJobId,
                examineeId: scope.row.examineeId,
                standardList: scope.row.standardList
                examineeNo:scope.row.examineeNo,
                }
              }">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
              >评估</el-button>
            </router-link>
            <router-link v-show="scope.row.visitName!=='访视期'" :to="{path:'/assess/heart/visit', query:{assessJobId:scope.row.assessJobId,examineeId:scope.row.examineeId,standardList:scope.row.standardList}}">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
              >评估</el-button>
            </router-link> -->
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

    <!-- 添加或修改评估任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item
          label="如果是作废后自动重新生成的数据，会保留之前id"
          prop="oldId"
        >
          <el-input
            v-model="form.oldId"
            placeholder="请输入如果是作废后自动重新生成的数据，会保留之前id"
          />
        </el-form-item>
        <el-form-item label="项目ID" prop="projectId">
          <el-input v-model="form.projectId" placeholder="请输入项目ID" />
        </el-form-item>
        <el-form-item label="受试者id" prop="examineeId">
          <el-input v-model="form.examineeId" placeholder="请输入受试者id" />
        </el-form-item>
        <el-form-item label="受试者编号" prop="examineeNo">
          <el-input v-model="form.examineeNo" placeholder="请输入受试者编号" />
        </el-form-item>
        <el-form-item label="评估配置ID" prop="assessCfgId">
          <el-input v-model="form.assessCfgId" placeholder="请输入评估配置ID" />
        </el-form-item>
        <el-form-item label="评估标准" prop="standardList">
          <el-input v-model="form.standardList" placeholder="请输入评估标准" />
        </el-form-item>
        <el-form-item label="评估开始时间" prop="startDate">
          <el-date-picker
            clearable
            v-model="form.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择评估开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="评估完成时间" prop="endDate">
          <el-date-picker
            clearable
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择评估完成时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remarkMsg">
          <el-input v-model="form.remarkMsg" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="是否加急" prop="isUrgent">
          <el-input v-model="form.isUrgent" placeholder="请输入是否加急" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="评估人" prop="evaluatorId">
          <el-input v-model="form.evaluatorId" placeholder="请输入评估人" />
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
import { listJob, getJob, delJob, addJob, updateJob } from "@/api/assess/list";
import QueryDialog from "@/views/components/QueryDialog";
import { setQueryConfig, getRequest } from "@/utils";
export default {
  name: "Job",
  components: {
    QueryDialog,
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
      // 评估任务表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: JSON.parse(localStorage["chooseProject"]).id,
        status: "0",
        isUrgent:'',
        examineeNo:'',
        assessJobType:'',
        startDate:'',
        evaluatorName:'',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          {
            required: true,
            message: "评估类型不能为空",
            trigger: "change",
          },
        ],
        projectId: [
          {
            required: true,
            message: "项目ID不能为空",
            trigger: "blur",
          },
        ],
        examineeId: [
          {
            required: true,
            message: "受试者id不能为空",
            trigger: "blur",
          },
        ],
        examineeNo: [
          {
            required: true,
            message: "受试者编号不能为空",
            trigger: "blur",
          },
        ],
        assessCfgId: [
          {
            required: true,
            message: "评估配置ID不能为空",
            trigger: "blur",
          },
        ],
        standardList: [
          {
            required: true,
            message: "评估标准不能为空",
            trigger: "blur",
          },
        ],
        createBy: [
          {
            required: true,
            message: "创建者不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if(sessionStorage['assessListParams']){
      let urlObj = JSON.parse(sessionStorage['assessListParams'])
      for (let k in this.queryParams) {
        if(urlObj[k]){
          if(k=='pageNum' || k=='pageSize'){
            this.queryParams[k] = Number(urlObj[k])
          }else{
            this.queryParams[k] = urlObj[k]
          }
        }
      }
    }
    this.getList();
  },
  methods: {
    /** 查询评估任务列表 */
    getList() {
      this.loading = true;
      this.queryParams.projectId = JSON.parse(localStorage["chooseProject"]).id,
      listJob(this.queryParams).then((response) => {
        this.jobList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      sessionStorage['assessListParams'] = JSON.stringify(this.queryParams)
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        oldId: null,
        type: null,
        projectId: null,
        examineeId: null,
        examineeNo: null,
        assessCfgId: null,
        standardList: null,
        startDate: null,
        endDate: null,
        status: "0",
        remarkMsg: null,
        isUrgent: null,
        delFlag: null,
        evaluatorId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.queryParams={
        pageNum: 1,
        pageSize: 10,
        projectId: JSON.parse(localStorage["chooseProject"]).id,
        status: "0",
        isUrgent:'',
        examineeNo:'',
        assessJobType:'',
        startDate:'',
        evaluatorName:'',
        status:''
      },
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加评估任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getJob(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改评估任务";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateJob(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJob(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除评估任务编号为"' + ids + '"的数据项？')
        .then(function () {
          return delJob(ids);
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
        "system/job/export",
        {
          ...this.queryParams,
        },
        `job_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
