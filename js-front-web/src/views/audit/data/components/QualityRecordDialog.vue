<template>
  <div>
    <el-button
      style="margin-left: 10px"
      size="mini"
      type="primary"
      @click="visible = true"
      >质控记录</el-button
    >
    <el-dialog
      width="900px"
      title="质控记录"
      :visible.sync="visible"
      :before-close="handleClose"
      append-to-body
      modal-append-to-body
    >
      <div v-if="infoList.length > 0">
        <div
          class="record-item"
          v-for="(item, index) in infoList"
          :key="index"
          style="margin-bottom: 20px"
        >
          <el-descriptions :column="4" border>
            <el-descriptions-item>
              <template slot="label"> 质控阶段 </template>
              {{ item.stage }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 质控人 </template>
              {{ item.createBy }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 质控完成时间 </template>
              {{ item.createTime }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 质控结论 </template>
              {{ item.status }}
            </el-descriptions-item>
          </el-descriptions>
          <el-table :data="item.cfgs" style="width: 100%" header-align="center">
            <el-table-column prop="content" label="质控问题" align="center" />
            <el-table-column
              prop="configContent"
              label="质控结果"
              width=""
              align="center"
            >
              <template slot-scope="scope">
                <el-radio-group disabled v-model="scope.row.chooseValue" v-if="scope.row.cfgType == '1'">
                  <el-radio
                    v-for="(item, index) in scope.row.optionList"
                    :key="index"
                    :label="item"
                  ></el-radio>
                </el-radio-group>
                <el-input v-else v-model="scope.row.configContent" readonly="true"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </el-dialog>
  </div>
</template>

<script>
import { queryQualityControlRecord } from "@/api/audit/data";
export default {
  props: ["visitId", "examineAuditType"],
  data() {
    return {
      visible: false,
      infoList: [],
    };
  },
  watch: {
    visible: function (newVisible, oldVisible) {
      if (newVisible) {
        this.queryQualityControlRecord();
      }
    },
  },
  methods: {
    queryQualityControlRecord() {
      queryQualityControlRecord({
        examineAuditType: this.examineAuditType,
        visitId: this.visitId,
        projectId: JSON.parse(localStorage["chooseProject"]).id,
      }).then((res) => {
        // infoList - 页面数据
        if (res.data.length > 0) {
          this.infoList = res.data;
          this.infoList.forEach((ele) => {
            if (ele.cfgs && ele.cfgs.length > 0) {
              ele.cfgs.forEach((item) => {
                if (item.cfgType == "1") {
                  // 单选框
                  if (item.configContent) {
                    item.configContent = JSON.parse(item.configContent);
                    let data = item.configContent;
                    item.optionList = [];
                    for (let key in data) {
                      item.optionList.push(key);
                      if (data[key]) {
                        item.chooseValue = key;
                      }
                    }
                  }
                } else {
                  // 文本框
                }
              });
            }
          });
        }
      });
    },
    handleClose(done) {
      done();
    },
    handleSubmit(done) {
      this.$confirm("请再次确认，是否执行此操作？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.record-item {
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  overflow: hidden;
}
</style>
