
<template>
  <span>
    <el-button :type="btnType" @click="showDialog">PDF</el-button>
    <el-dialog
      title="文件列表"
      :visible.sync="show"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in visitInfoList"
          :key="index"
          :label="item.name"
          :name="String(item.id)"
        >
          <el-table :data="tableData" style="width: 100%" header-align="center">
            <el-table-column
              prop="fileName"
              label="文件名称"
              width=""
              align="center"
            />
            <el-table-column prop="name" label="操作" width="" align="center">
              <template slot-scope="scope">
                <a
                  target="_blank"
                  :href="scope.row.storageUrl"
                  style="color: #1890ff"
                  >查看</a
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </span>
</template>
  
  <script>
import { visitList, jobIndependentInfo, getVisitOtherDetailList  } from "@/api/assess/task";
export default {
  props: {
    assessJobId: { type: Number },
    btnType: { type: String, default:'primary' },
  },
  data() {
    return {
      show: false,
      activeName: '',
      visitInfoList: [],
      pageInfo:{},
      tableData:[]
    };
  },
  mounted() {},
  methods: {
    // 显示弹窗
    showDialog() {
      this.show = true;
      this._jobIndependentInfo()
    },
    // 文件列表切换tab
    handleClick(v, e) {
      this._getVisitOtherDetailList({
        examineeId: this.$route.query.examineeId,
        visitId: v.name,
        visitFile: '2'
      })
    },
    // 获取访视ID
    _jobIndependentInfo() {
      jobIndependentInfo(this.$route.query.assessJobId).then((res) => {
        this.pageInfo = res.data
        if(this.pageInfo){
          // 获取访视列表
          this._getVisitListByExamineeId()
        }else{
          return this.$message.error('查询不到访视id及信息')
        }
      })
    },
    // 获取访视列表
    _getVisitListByExamineeId() {
      visitList({
        examineeId: Number(this.$route.query.examineeId),
        projectId: JSON.parse(localStorage['chooseProject']).id,
        pageNum:1,
        pageSize:100
      }).then((res) => {
        for(var i=0;i<res.rows.length;i++){
          if(this.pageInfo.visitId===res.rows[i].id){
            this.visitInfoList =  res.rows.slice(0,i+1)
            break;
          }
        }
        if (this.visitInfoList.length > 0) {
          // PDF文件列表-第一个
          this._getVisitOtherDetailList({
            examineeId: this.$route.query.examineeId,
            visitId: this.pageInfo.visitId,
            visitFile: ''
          })
          this.activeName = String(this.pageInfo.visitId)
        }
      })
    },
    // 文件列表
    _getVisitOtherDetailList(obj) {
      getVisitOtherDetailList(obj).then((res) => {
        this.tableData = res.data
      })
    },
  },
};
</script>
  
  <style scoped>
</style>
  