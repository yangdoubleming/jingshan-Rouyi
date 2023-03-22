<template>
  <div style="margin: 20px 0">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: large">数据描述</span>
      </div>
      <div>
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          v-loading="loading"
        >
          <CreateDataDesDialog
            :visitId="visitId"
            :examineId="examineId"
            :category="activeName"
            v-if="buttonName === '质控'"
          />
          <el-tab-pane v-for="ele in allList.filter(ite=>ite.valueList.length>0)" :key="ele.value" :label="ele.name" :name="ele.value">
            <!-- <el-button type="danger" style="margin-bottom: 15px">批量删除</el-button> -->
            <el-table
              :data="ele.valueList"
              border
              style="width: 100%"
            >
              <el-table-column type="selection" />
              <el-table-column
                v-for="item in ele.titleList"
                :key="item.name"
                :prop="item.name"
                :label="item.value"
              />
              <el-table-column
                v-if="buttonName === '质控'"
                label="操作"
                fixed="right"
                width="130"
                align="center"
              >
                <template slot-scope="scope">
                  <CreateDataDesDialog
                    :visitId="visitId"
                    :category="activeName"
                    :examineId="examineId"
                    :dataDescId="scope.row.id"
                  />
                  <el-button
                    v-hasPermi="['system:post:edit']"
                    type="text"
                    @click="deleteFile(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 删除 -->
    <el-dialog
      title="确认删除数据？"
      :visible.sync="dialogFormVisible"
      width="600px"
      :close-on-click-modal="false"
      append-to-body
      modal-append-to-body
    >
      <el-form :model="form" label-width="100px" ref="form" :rules="rules" style="height:50px">
        <!-- <el-form-item label="删除原因" prop="delReason">
          <el-select
            v-model="form.delReason"
            placeholder="请选择"
            multiple=""
            style="width: 100%"
          >
            <el-option
              label="包含受试者隐私"
              value="包含受试者隐私"
            ></el-option>
            <el-option label="数据不可用" value="数据不可用"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2"></el-input>
        </el-form-item> -->
        <div style="float:right;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')"
            >确 定</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <!-- 图片、PDF显示 -->
    <el-dialog
      title="图片集"
      :visible.sync="showPicDia"
      width="60%"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="show-block">
        <el-carousel
          style="height: 520px"
          :autoplay="false"
          indicator-position="none"
          arrow="always"
        >
          <el-carousel-item v-for="item in visitPicUrlList" :key="item">
            <div class="my-show-pic">
              <el-image :src="item.filePath" style="height: 520px" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  removeVisitImageFiles,
  removeVisitPdfFile,
  removeVisitVideoFile,
  dicomBatchRemove,
  getVisitDicomDataDescList,
} from "@/api/audit/data";
import CreateDataDesDialog from "../../CreateDataDesDialog.vue";
export default {
  props: ["visitId", "examineId", "buttonName"],
  components: {
    CreateDataDesDialog,
  },
  data() {
    return {
      loading: false,
      showPicDia: false,
      activeName: "1",
      visitDicomTitle: [],
      visitDicomList: [],
      visitPicList: [
        {
          imageNum: 0,
        },
      ],
      visitPdfList: [],
      visitVideoList: [],
      dialogFormVisible: false,
      nowFileId: "",
      visitPicUrlList: [],
      form: {
        remark: "",
        delReason: "",
      },
      rules: {
      },
      allList: [
        { name: "DICOM", value: "1", titleList: [], valueList: [] },
        { name: "PDF", value: "2", titleList: [], valueList: [] },
        { name: "图片集", value: "3", titleList: [], valueList: [] },
        { name: "视频", value: "4", titleList: [], valueList: [] },
      ],
    };
  },
  watch: {
    examineId: {
        handler (newVal) {
          for (var i = 1; i <= 4; i++) {
            this.getVisitDicomDataDescList(i);
          }
        },
        deep: true,
        immediate: true,
    },
  },
  inject:['queryExamineVisitDetails'],
  provide() {
    return {
      getVisitDicomDataDescList: this.getVisitDicomDataDescList,
    };
  },
  mounted() {},
  methods: {
    // 获取dicom
    async getVisitDicomDataDescList(type) {
      let category = type?String(type):String(this.activeName)
      type = category
      this.loading = true;
      const response = await getVisitDicomDataDescList({
        visitId: this.visitId,
        projectId: JSON.parse(localStorage["chooseProject"]).id,
        category: type,
      });
      if (response.code === 200) {
        this.allList.forEach((item) => {
          if (item.value == type) {
            item.titleList = []
            item.valueList = []
            // 表头
            let titleList = response.data.filter((item) => item.id === null);
            if (titleList.length > 0) {
              let obj = titleList[0];
              for (let key in obj) {
                if (key !== "id") {
                    item.titleList.push({ name: key, value: obj[key] });
                }
              }
            }
            // 数据
            item.valueList = response.data.filter((item) => item.id !== null) || [];
          }
        });
      }
      this.loading = false;
    },
    // 删除dicom
    dicomBatchRemove(obj) {
      this.loading = true;
      dicomBatchRemove(obj)
        .then((response) => {
          this.loading = false;
          this.getVisitDicomDataDescList();
          this.form = {
            remark: "",
            delReason: "",
          };
          this.dialogFormVisible = false;
          this.queryExamineVisitDetails()
          this.$message.success('操作成功')
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // tab切换-查看
    handleClick() {
      this.getVisitDicomDataDescList();
    },
    // 删除-接口
    handleDelete() {
      let obj = {
        id: this.nowFileId,
        // delReason: this.form.delReason.join(","),
        delReason: '',
        remark: this.form.remark,
      };
      this.dicomBatchRemove({
        ids: [this.nowFileId],
        delReason: '',
        remark: this.form.remark,
      })
    },
    // 确认删除文件
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 删除文件
          this.handleDelete();
        } else {
          return false;
        }
      });
    },
    // 查看文件
    seeFile(fileUrls) {
      window.open(fileUrls);
    },
    seePicFile() {
      if (this.visitPicList[0].imageNum > 0) {
        this.showPicDia = true;
      } else {
        this.$message.warning("暂无图片");
      }
    },
    // 删除文件-弹窗提示
    deleteFile(item) {
      this.nowFileId = item.id;
      this.dialogFormVisible = true;
    },
  },
};
</script>

<style>
.el-radio__input.is-disabled.is-checked .el-radio__inner{
    border-color: #323e52;
    background: #323e52;
}
.el-radio__input.is-disabled + span.el-radio__label{
    color: #323e52;
}
.el-checkbox__input.is-disabled + span.el-checkbox__label{
    color: #323e52;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
    background-color: #323e52;
    border-color: #323e52;
}
</style>
