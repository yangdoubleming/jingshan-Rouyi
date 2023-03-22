<template>
  <span>
    <el-button
      v-show="!dataDescId"
      type="primary"
      style="margin-bottom: 15px"
      @click="showDia"
      >创建</el-button
    >
    <el-button
      v-show="dataDescId"
      type="text"
      style="margin-bottom: 15px"
      @click="showEditDia"
      >修改</el-button
    >
    <el-dialog
      width="600px"
      :title="title"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      append-to-body
      modal-append-to-body
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="检查方式" v-if="category=='1'" prop="inspectionMethod">
          <el-select
            v-model="ruleForm.inspectionMethod"
            placeholder="请选择检查方式"
            style="width: 100%"
          >
            <el-option label="CT" value="CT"></el-option>
            <el-option label="MR" value="MR"></el-option>
            <el-option label="NM" value="NM"></el-option>
            <el-option label="PET" value="PET"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查时间" prop="inspectionTime">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="ruleForm.inspectionTime"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="检查描述" v-if="category=='1'" prop="studyDescription">
          <el-input v-model="ruleForm.studyDescription"></el-input>
        </el-form-item>

        <!-- 动态显示 -->
        <div v-for="item in showList" :key="item.cfgId">
          <!-- 文本框 -->
          <el-form-item
            v-if="item.cfgInputMode == '1'"
            :label="item.cfgFieldNameCn"
            :prop="item.newName"
          >
            <el-input v-model="ruleForm[item.newName]"></el-input>
          </el-form-item>
          <!-- 文本域 -->
          <el-form-item
            v-if="item.cfgInputMode == '2'"
            :label="item.cfgFieldNameCn"
            :prop="item.newName"
          >
            <el-input
              v-model="ruleForm[item.newName]"
              type="textarea"
              :rows="2"
            ></el-input>
          </el-form-item>
          <!-- 数字输入框 -->
          <el-form-item
            v-if="item.cfgInputMode == '3'"
            :label="item.cfgFieldNameCn"
            :prop="item.newName"
          >
            <el-input-number
              v-model="ruleForm[item.newName]"
              label="描述文字"
            ></el-input-number>
          </el-form-item>
          <!-- 单选下拉框 -->
          <el-form-item
            v-if="item.cfgInputMode == '4'"
            :label="item.cfgFieldNameCn"
            :prop="item.newName"
          >
            <el-select
              v-model="ruleForm[item.newName]"
              @click="this.currentClickName = item.newName"
              @change="$forceUpdate()"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="ele in item.cfgDownBoxValue"
                :key="ele"
                :label="ele"
                :value="ele"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 多选下拉框 -->
          <el-form-item
            v-if="item.cfgInputMode == '5'"
            :label="item.cfgFieldNameCn"
            :prop="item.newName"
          >
            <el-select
              v-model="ruleForm[item.newName]"
              @change="$forceUpdate()"
              multiple
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="ele in item.cfgDownBoxValue"
                :key="ele"
                :label="ele"
                :value="ele"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 年月日 -->
          <el-form-item
            v-if="item.cfgInputMode == '6'"
            :label="item.cfgFieldNameCn"
            :prop="item.newName"
          >
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="ruleForm[item.newName]"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </span>
</template>

<script>
import {
  getDicomDescCfgByProjectId,
  dicomDescAdd,
  dicomDescEdit,
  getVisitDicomDataDescById,
} from "@/api/audit/data";
export default {
  props: ["visitId", "examineId", "dataDescId","category"],
  data() {
    return {
      visible: false,
      title: "创建DICOM数据描述",
      ruleForm: {
        examineId: this.examineId,
        visitId: this.visitId,
        projectId: JSON.parse(localStorage["chooseProject"]).id,
        // 检查方式
        inspectionMethod: "",
        // 检查日期
        inspectionTime: "",
        // 检查描述
        studyDescription: "",
        infos: [],
      },
      rules: {
        inspectionMethod: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        inspectionTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
      // 动态展示的数据数组
      showList: [],
      fileTypeText:{
        "1": "DICOM",
        "2": "PDF",
        "3": "图片",
        "4": "视频",
      },
      currentClickName:''
    };
  },
  mounted() {},
  inject:['getVisitDicomDataDescList','queryExamineVisitDetails'],
  methods: {
    //编辑-回显
    getVisitDicomDataDescById() {
      getVisitDicomDataDescById({ dataDescId: this.dataDescId }).then((res) => {
        this.ruleForm.inspectionMethod = res.data.inspectionMethod;
        this.ruleForm.studyDescription = res.data.studyDescription;
        this.ruleForm.inspectionTime = res.data.inspectionTime;
        if (res.data.infos && res.data.infos.length > 0) {
          res.data.infos.forEach((item) => {
            let name = `name_${item.cfgId}`;
            if (item.value.indexOf(",") !== -1) {
              this.ruleForm[name] = item.value.split(",");
            } else {
              this.ruleForm[name] = item.value;
            }
          });
          console.log(66666,this.ruleForm)
        }
      });
    },
    // 显示弹窗
    showDia() {
      this.title = `创建${this.fileTypeText[this.category]}数据描述`;
      this.visible = true;
      this.createDataDes();
    },
    showEditDia() {
      this.title = `修改${this.fileTypeText[this.category]}数据描述`;
      this.visible = true;
      this.createDataDes();
    },
    // 关闭弹窗
    handleClose() {
      this.visible = false;
      this.ruleForm = {
        examineId: this.examineId,
        visitId: this.visitId,
        projectId: JSON.parse(localStorage["chooseProject"]).id,
        // 检查方式
        inspectionMethod: "",
        // 检查日期
        inspectionTime: "",
        // 检查描述
        studyDescription: "",
        infos: [],
      };
    },
    // 获取项目下数据描述动态配置字段
    createDataDes() {
      // 编辑-回显
      if (this.dataDescId) {
        this.getVisitDicomDataDescById();
      }
      //获取动态配置字段
      getDicomDescCfgByProjectId({
        projectId: JSON.parse(localStorage["chooseProject"]).id,
        category: this.category,
      }).then((response) => {
        this.showList = response.data || [];
        if (response.data && response.data.length > 0) {
          this.showList.forEach((item) => {
            item.newName = "name_" + item.cfgId;
            if (item.cfgIsRequired == "1") {
              this.rules[item.newName] = [
                { required: true, message: "不能为空", trigger: "blur" },
              ];
            }
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let arrayKeys = [];
          for (let key in this.ruleForm) {
            if (key.indexOf("name_") !== -1) {
              arrayKeys.push(key);
            }
          }
          arrayKeys.forEach((item) => {
            if (this.ruleForm[item] instanceof Array) {
              this.ruleForm.infos.push({
                cfgId: item.slice(5),
                value: this.ruleForm[item].join(","),
              });
            } else {
              this.ruleForm.infos.push({
                cfgId: item.slice(5),
                value: this.ruleForm[item],
              });
            }
          });
          if (this.dataDescId) {
            // 编辑
            let subObj = {
              id: this.dataDescId,
              category:this.category,
              inspectionMethod: this.ruleForm.inspectionMethod,
              inspectionTime: this.ruleForm.inspectionTime,
              studyDescription: this.ruleForm.studyDescription,
              infos: this.ruleForm.infos,
            };
            dicomDescEdit(subObj).then((res) => {
              this.$message.success("操作成功");
              this.handleClose();
              this.getVisitDicomDataDescList()
              this.queryExamineVisitDetails()
            });
          } else {
            // 新增
            let subObj = {
              projectId: this.ruleForm.projectId,
              examineeId: this.ruleForm.examineId,
              visitId: this.ruleForm.visitId,
              category:this.category,
              inspectionMethod: this.ruleForm.inspectionMethod,
              inspectionTime: this.ruleForm.inspectionTime,
              studyDescription: this.ruleForm.studyDescription,
              infos: this.ruleForm.infos,
            };
            dicomDescAdd(subObj).then((res) => {
              this.$message.success("操作成功");
              this.handleClose();
              this.getVisitDicomDataDescList()
              this.queryExamineVisitDetails()
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.record-item {
  border-radius: 5px;
  filter: drop-shadow(rgba(0, 0, 0, 0.7) 0px 3px 6px);
  overflow: hidden;
}
</style>
