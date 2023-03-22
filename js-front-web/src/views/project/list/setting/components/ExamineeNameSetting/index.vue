<template>
  <div class="app-container">
    <span style="font-weight: bold">受试者名称信息配置</span>
    <el-divider />

    <el-table
      v-loading="loading"
      :data="examineeCfgList"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="nameCn" label="字段名称" />
      <el-table-column prop="promptTextCn" label="提示信息" />
      <el-table-column prop="status" label="状态" >
      <template slot-scope="scope">
          {{scope.row.status=='0'?'启用':'关闭'}}
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateBy" label="修改人" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <ExamineeNameDialog
            type="update"
            :project-id="projectId"
            :data="scope.row"
            @refresh="_getAliasCfgList"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
  
  <script>
import _ from "lodash";
import {
    getAliasCfgList,
} from "@/api/project/setting";
import ExamineeNameDialog from "./components/ExamineeNameDialog";
export default {
  components: { ExamineeNameDialog },
  props: ["activeName"],
  data() {
    return {
      loading: false,
      projectId: this.$route.query.id,
      examineeCfgList: [],
      switchRequest: false,
    };
  },
  watch: {
    activeName: function (newValue, oldValue) {
      if (newValue === "tester") {
        console.log(1113333,newValue)
        this._getAliasCfgList();
      }
    },
  },
  methods: {
    async _getAliasCfgList() {
      try {
        if (this.loading) return;
        this.loading = true;
        const response = await getAliasCfgList({
          projectId: this.projectId,
        });
        if (response.code === 200) {
          this.examineeCfgList = response.rows;
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
  
  <style scoped>
</style>
  