<template>
  <div class="app-container">
    <span style="font-weight:bold">访视计划配置</span>
    <el-divider />
    <div style="display: flex; justify-content: space-between;">
      <CreateVisitPlanDialog :project-id="projectId" @refresh="queryVisitPlanList" />
      <el-button
        plain
        type="warning"
        icon="el-icon-download"
        @click="handleExport"
      >导出</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="visitPlanList"
      style="width: 100%; margin-top:  20px;"
    >
      <el-table-column
        prop="num"
        label="序号"
      />
      <el-table-column
        prop="name"
        label="访视名称"
      />
      <el-table-column
        prop="lastDateDay"
        label="距离上次天数"
      />
      <el-table-column
        prop="beforeWindowDateDay"
        label="窗口期前天数"
      />
      <el-table-column
        prop="afterWindowDateDay"
        label="窗口期后天数"
      />
      <el-table-column
        prop="createBy"
        label="创建人"
      />
      <el-table-column
        prop="createTimeF"
        label="创建时间"
      />
      <el-table-column
        prop="updateBy"
        label="修改人"
      />
      <el-table-column
        prop="updateTimeF"
        label="修改时间"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <UpdateCreatePlanDialog :id="scope.row.id" @refresh="queryVisitPlanList" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getVisitPlanList } from '@/api/project/list'
import CreateVisitPlanDialog from './components/CreateVisitPlanDialog'
import UpdateCreatePlanDialog from './components/UpdateCreatePlanDialog'
export default {
  components: {
    CreateVisitPlanDialog,
    UpdateCreatePlanDialog
  },
  props: ['activeName'],
  data() {
    return {
      projectId: this.$route.query.id,
      loading: false,
      visitPlanList: []
    }
  },
  watch: {
    'activeName': function(newValue, oldValue) {
      if (newValue === 'visit') {
        this.queryVisitPlanList()
      }
    }
  },
  methods: {
    async queryVisitPlanList() {
      if (this.loading) return
      this.loading = true
      const response = await getVisitPlanList({ projectId: this.projectId })
      this.loading = false
      if (response.code === 200) {
        this.visitPlanList = response.rows
      }
    },
    handleExport() {
      this.download('/visit/plan/export', {
        projectId: this.projectId
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

<style scoped>

</style>
