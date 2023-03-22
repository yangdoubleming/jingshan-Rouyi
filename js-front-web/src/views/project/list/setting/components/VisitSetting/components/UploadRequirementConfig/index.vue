<template>
  <div class="app-container">
    <span style="font-weight:bold">上传需求配置</span>
    <el-divider />
    <div style="display: flex; justify-content: space-between;">
      <UploadRequirementDialog type="create" :projectId="projectId" @refresh="queryVisitUploadCfgList" />
      <el-button
        plain
        type="warning"
        icon="el-icon-download"
        @click="handleExport"
      >导出</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="visitUploadCfgList"
      style="width: 100%; margin-top:  20px;"
    >
      <el-table-column
        prop="isMust"
        label="是否必须"
      />
      <el-table-column
        prop="typeMsg"
        label="文件类型"
      />
      <el-table-column
        prop="infoTypeList"
        label="信息类型"
      />
      <el-table-column
        prop="status"
        label="状态"
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
        width="180"
      >
        <template slot-scope="scope">
          <UploadRequirementDialog type="update" :projectId="projectId" :data="scope.row" @refresh="queryVisitUploadCfgList" />
          <el-switch
            v-model="scope.row.status"
            style="margin-left: 20px"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="启用"
            inactive-value="禁用"
            @change="(status) => {
              switchVisitUploadCfgStatus(status, scope.$index, scope.row)
            }"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash'
import { getVisitUploadCfgList, setVisitUploadCfgStatus } from '@/api/project/list'
import UploadRequirementDialog from './components/UploadRequirementDialog'
export default {
  components: { UploadRequirementDialog },
  props: ['activeName'],
  data() {
    return {
      loading: false,
      projectId: this.$route.query.id,
      visitUploadCfgList: [],
      switchRequest: false
    }
  },
  watch: {
    'activeName': function(newValue) {
      if (newValue === 'visit') {
        this.queryVisitUploadCfgList()
      }
    }
  },
  methods: {
    async queryVisitUploadCfgList() {
      if (this.loading) return
      this.loading = true
      const response = await getVisitUploadCfgList({ projectId: this.projectId })
      this.loading = false
      if (response.code === 200) {
        this.visitUploadCfgList = response.rows
      }
    },
    async switchVisitUploadCfgStatus(status, index, item) {
      try {
        if (this.switchRequest) return
        this.switchRequest = true
        const response = await setVisitUploadCfgStatus({ 
          id: item.id, 
          status: status === '启用' ? 0 : 1
        })
        if (response.code === 200) {
          this.$message.success(response.msg)
        }
      } catch (e) {
        const list = _.cloneDeep(this.visitUploadCfgList)
        list[index].status = status === '启用' ? '禁用' : '启用'
        this.visitUploadCfgList = [...list]
      } finally {
        this.switchRequest = false
      }
    },
    // 上传需求配置导出
    handleExport() {
      this.download('/visit/cfg/export', {
        projectId: this.projectId
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

  <style scoped>

  </style>

