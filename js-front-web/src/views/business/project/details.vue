<template>
  <div>
    <el-descriptions
      class="margin-top"
      title="项目信息"
      :column="4"
      border
      style="margin: 30px auto; width: 96%"
    >
      <template slot="extra">
        <el-button
          type="primary"
          size="small"
          @click="readonly = false"
        >修改</el-button>
        <el-button
          v-if="detailsObj.isCanProjectInitiation === 1"
          type="primary"
          size="small"
          @click="zslx"
        >正式立项</el-button>
<!--        <el-button type="primary" size="small">移交项目</el-button>-->
      </template>
      <el-descriptions-item>
        <template slot="label"> 项目编号 </template>
        {{ detailsObj.no }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 项目类型 </template>
        <el-select
          v-model="detailsObj.projectType"
          clearable
          placeholder="请选择 项目类型"
          :disabled="true"
        >
          <el-option
            v-for="item in optionsProjectType"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 适应症 </template>
        <el-input
          v-model="detailsObj.indication"
          placeholder="请输入 适应症"
          :readonly="readonly"
        />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 方案编号 </template>
        <el-input v-model="detailsObj.planNo"
                  placeholder="请输入 方案编号" :readonly="readonly" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 评估标准 </template>
        <el-select
          v-model="detailsObj.evaluationCriteria"
          multiple
          placeholder="请选择 评估标准"
          :disabled="readonly"
        >
          <el-option
            v-for="item in optionsEvaluationType"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 研究分期 </template>
        <el-select
          v-model="detailsObj.researchPhase"
          placeholder="请选择 研究分期"
          clearable
          filterable
          allow-create
          :disabled="readonly"
          style="width: 100%"
        >
          <el-option label="I期" value="I期" />
          <el-option label="II期" value="II期" />
          <el-option label="III期" value="III期" />
          <el-option label="IV期" value="IV期"/>
          <el-option label="IIT" value="IIT"/>
          <el-option label="NA" value="NA"/>
          <el-option label="咨询项目" value="咨询项目"/>
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 客户名称 </template>
        <el-select
          v-model="detailsObj.customerName"
          placeholder="请选择 客户名称"
          :disabled="readonly"
          filterable
          clearable
        >
          <el-option
            v-for="item in CustomerList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <el-button
          v-show="readonly === false"
          type="primary"
          style="float: right"
          @click="showAddCustomer = true"
        >新增客户</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"> 项目简介 </template>
        <el-input v-model="detailsObj.desc" type="textarea" placeholder="请选择 项目简介" oninput="if(value.length>500)value=value.slice(0,500)" :readonly="readonly"/>
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
    </el-descriptions>
    <el-row
      v-show="readonly === false"
      :gutter="10"
      class="mb8"
      style="margin: 0px auto; width: 96%"
    >
      <el-col :span="1.5" style="float: right">
        <el-button
          type="primary"
          @click="handleAddSure"
        >确定</el-button>
      </el-col>
      <el-col :span="1.5" style="float: right">
        <el-button type="primary" @click="handleCancel">取消</el-button>
      </el-col>
    </el-row>
    <el-tabs
      v-model="activeName"
      style="margin: 30px auto; width: 96%"
      type="card"
      @tab-click="handleClick"
    >
<!--      <el-tab-pane label="合同列表" name="businessContract">-->
<!--        &lt;!&ndash;-->
<!--                <BusinessContract />-->
<!--                &ndash;&gt;-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="报价列表" name="businessPrice">-->
<!--        &lt;!&ndash;-->
<!--                <BusinessPrice />-->
<!--                &ndash;&gt;-->
<!--      </el-tab-pane>-->
    </el-tabs>
    <el-dialog
      title="正式立项"
      :close-on-click-modal="false"
      :visible.sync="diaZslx"
      width="500px"
      append-to-body
    >
      <el-form
        ref="hospitalForm"
        :model="formHospital"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="主PM" prop="mainManagerId">
          <el-select
            v-model="formHospital.mainManagerId"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in zsList"
              :key="item.id"
              :value="item.id"
              :label="item.managerName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备PM" prop="spareManagerId">
          <el-select
            v-model="formHospital.spareManagerId"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in zsList"
              :key="item.id"
              :value="item.id"
              :label="item.managerName"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitHospitalForm"
        >确 定</el-button>
      </div>
    </el-dialog>
    <AddCustomer :dia-show="showAddCustomer" :new-customer-form="form" />
  </div>
</template>

<script>
import { projectDetails, setProjectInitiation } from '@/api/business/project'
// import BusinessContract from '@/views/business/contract'
// import BusinessPrice from '@/views/business/price'
import {
  optionsProjectType,
  optionsEvaluationType,
  optionsStatus
} from '@/utils/dict/mine'
import { projectEdit, getProjectManagerList } from '@/api/project/list'
import {
  listPost as customerListPost
  //   projectExport
} from '@/api/business/customer'
import AddCustomer from '@/views/components/customer/addCustomer'
export default {
  components: {
    // BusinessContract,
    // BusinessPrice,
    AddCustomer
  },
  data() {
    return {
      size: '',
      activeName: 'businessContract',
      detailsObj: {},
      detailsObjBk: {},
      form: {},
      optionsProjectType,
      optionsEvaluationType,
      optionsStatus,
      readonly: true,
      showAddCustomer: false,
      dialogVisible: false,
      diaZslx: false,
      zsList: [],
      formHospital: {
        mainManagerId: '',
        spareManagerId: ''
      },
      rules: {
        mainManagerId: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        spareManagerId: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      },
      CustomerList: []
    }
  },
  mounted() {
    this.getProjectDetails()
    this.getProjectManagerList()
    this.getCustomerList()
  },
  methods: {
    /** 查询客户列表 */
    getCustomerList() {
      customerListPost({ pageNum: 1, pageSize: 10000 }).then(
        (response) => {
          this.CustomerList = response.rows
        }
      )
    },
    zslx() {
      this.diaZslx = true
    },
    getProjectManagerList() {
      var tmpProjectId = null
      if (localStorage.getItem('chooseProject') != null) {
        tmpProjectId = JSON.parse(localStorage['chooseProject']).id
      }
      getProjectManagerList({
        projectId: tmpProjectId
      }).then((response) => {
        this.zsList = response.data
      })
    },
    submitHospitalForm: function() {
      this.$refs['hospitalForm'].validate((valid) => {
        if (valid) {
          this.formHospital.projectId = this.$route.query.id
          setProjectInitiation(this.formHospital).then((response) => {
            this.$modal.msgSuccess('正式立项成功')
            this.diaZslx = false
            this.getProjectDetails()
          })
        }
      })
    },
    // 关闭新增弹窗
    diaClose() {
      this.showAddCustomer = false
    },
    handleCancel() {
      this.readonly = true
      this.detailsObj = this.detailsObjBk
    },
    handleAddSure() {
      this.$alert('确定修改吗', '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          this.edit()
        }
      })
    },
    edit() {
      this.detailsObj.evaluationCriteria =
                this.detailsObj.evaluationCriteria.join()
      projectEdit(this.detailsObj).then((response) => {
        this.readonly = true
        this.getProjectDetails()
      })
    },
    getProjectDetails() {
      this.loading = true
      projectDetails({ id: this.$route.query.id }).then((response) => {
        this.detailsObj = response.data
        this.detailsObj.evaluationCriteria =
                    this.detailsObj.evaluationCriteria.split(',')
        this.detailsObjBk = { ...this.detailsObj }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

