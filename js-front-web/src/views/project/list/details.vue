<template>
  <div>
    <el-descriptions class="margin-top" title="项目信息" :column="4" border style="margin: 30px auto; width: 96%">
      <template slot="extra">
        <el-button type="primary" size="small" @click="readonly = false">修改</el-button>
      </template>
      <el-descriptions-item>
        <template slot="label"> 项目编号 </template>
        {{ detailsObj.no }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 项目类型 </template>
        <el-select v-model="detailsObj.projectType" clearable placeholder="请选择" :disabled="true">
          <el-option v-for="item in optionsProjectType" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 适应症 </template>
        <el-input v-model="detailsObj.indication" :readonly="readonly" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 方案编号 </template>
        <el-input v-model="detailsObj.planNo" :readonly="readonly" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 评估标准 </template>
        <el-select v-model="detailsObj.evaluationCriteria" clearable placeholder="请选择" :disabled="readonly">
          <el-option v-for="item in optionsEvaluationType" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
          <template slot="label"> 研究分期 </template>
          <el-select
              v-model="detailsObj.researchPhase"
              placeholder="请选择"
              clearable
              :disabled="readonly"
              style="width: 100%"
          >
              <el-option label="I期" value="I期" />
              <el-option label="II期" value="II期" />
              <el-option label="III期" value="III期" />
          </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
          <template slot="label"> 客户名称 </template>
          <el-select
              v-model="detailsObj.customerName"
              placeholder="请选择"
              :disabled="readonly"
              filterable
              clearable
          >
              <el-option v-for="item in CustomerList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
          <el-button type="primary" @click="showAddCustomer = true" style="float:right" v-show="readonly === false">新增客户</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 创建人 </template>
        {{ detailsObj.createBy }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 创建时间 </template>
        {{ detailsObj.createTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 修改人 </template>
        {{ detailsObj.updateBy }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 修改时间 </template>
        {{ detailsObj.updateTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 项目简介 </template>
        <el-input v-model="detailsObj.desc" :readonly="readonly" />
      </el-descriptions-item>
    </el-descriptions>
    <el-row :gutter="10" class="mb8" v-show="readonly === false" style="margin: 0px auto; width: 96%">
      <el-col :span="1.5" style="float:right">
        <el-button type="primary" @click="handleAddSure">确定</el-button>
      </el-col>
      <el-col :span="1.5" style="float:right">
        <el-button type="primary" @click="handleCancel">取消</el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" style="margin: 30px auto; width: 96%" type="card" @tab-click="handleClick">
      <el-tab-pane label="受试者列表" name="center">
        <CenterCustomer />
      </el-tab-pane>
      <el-tab-pane label="访视列表" name="project">
        <!-- <ProjectCustomer /> -->
        访视列表
      </el-tab-pane>
      <el-tab-pane label="检查列表" name="data">
        <!-- <ProjectData />
        <ProjectReview /> -->
        检查列表
      </el-tab-pane>
      <el-tab-pane label="导出配置" name="assess">
        <!-- <ProjectAssess /> -->
        导出配置
      </el-tab-pane>
    </el-tabs>
    <AddCustomer :diaShow="showAddCustomer" :newCustomerForm="form" />
  </div>
</template>

<script>
import CenterCustomer from "@/views/image/tester";
import ProjectCustomer from "@/views/project/people";
import ProjectData from "@/views/project/data";
import ProjectReview from "@/views/project/data/review";
import ProjectAssess from "@/views/project/assess";
import { projectDetails } from "@/api/business/project";
import { optionsProjectType, optionsEvaluationType, optionsStatus } from "@/utils/dict/mine";
import { projectEdit } from "@/api/project/list";
import AddCustomer from "@/views/components/customer/addCustomer";
import { listPost as customerListPost } from '@/api/business/customer'

export default {
  components: {
    CenterCustomer,
    ProjectCustomer,
    ProjectData,
    ProjectAssess,
    ProjectReview,
    AddCustomer
  },
  data() {
    return {
      size: "",
      activeName: "center",
      detailsObj: {},
      detailsObjBk: {},
      form:{},
      optionsProjectType,
      optionsEvaluationType,
      optionsStatus,
      readonly: true,
      showAddCustomer:false,
      CustomerList:[]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  mounted() {
    this.getProjectDetails()
    this.getCustomerList()
  },
  methods: {
    /** 查询客户列表 */
    getCustomerList() {
        customerListPost({ pageNum: 1, pageSize: 10000}).then((response) => {
            this.CustomerList = response.rows;
        });
    },
    handleCancel() {
      this.readonly = true
      this.detailsObj = this.detailsObjBk
    },
    handleAddSure() {
      this.$alert('确定修改吗', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.edit()
        }
      });
    },
    edit() {
      projectEdit(this.detailsObj).then((response) => {
        this.readonly = true
        this.getProjectDetails()
      });
    },
    getProjectDetails() {
      this.loading = true;
      projectDetails({ id: this.$route.query.id }).then((response) => {
        this.detailsObj = response.data
        this.detailsObjBk = { ...this.detailsObj }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //关闭新增弹窗
    diaClose() {
            this.showAddCustomer = false
        },
  },
};
</script>
