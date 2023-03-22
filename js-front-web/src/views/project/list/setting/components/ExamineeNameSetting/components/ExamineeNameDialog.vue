<template>
  <div>
    <el-button @click="showDialog">{{
      type === "create" ? "创建受试者信息名称" : "修改"
    }}</el-button>

    <el-dialog
      v-loading="loading"
      :title="type === 'create' ? '创建受试者信息名称' : '修改受试者信息名称'"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="550px"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item
          prop="nameCn"
          label="字段名称"
          :rules="[{ required: true, message: '字段名称不能为空' }]"
        >
          <el-input v-model="form.nameCn" />
        </el-form-item>
        <el-form-item
          prop="promptTextCn"
          label="提示文字"
        >
          <el-input v-model="form.promptTextCn" />
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="inRequest" type="primary" @click="handleSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import { Message } from "element-ui";
import {
  addExamineeCfg,
  editExamineeCfg,
  examineeInfo,
} from "@/api/project/list";
import { postAliasCfgEdit } from "@/api/project/setting"
export default {
  props: ["projectId", "type", "data"],
  data() {
    return {
      inRequest: false,
      dialogVisible: false,
      loading: false,
      form: {
        nameCn:'',
        promptTextCn:''
      },
    };
  },
  methods: {
    showDialog() {
      console.log(1111,this.da)
      if (this.data) {
        for (let k in this.form) {
          this.form[k] = this.data[k];
        }
      }
      this.dialogVisible = true;
    },
    handleSubmit() {
      if (this.type === "create") {
        this.createExamineeCfg();
      }
      if (this.type === "update") {
        this.updateExamineeCfg();
      }
    },
    async createExamineeCfg() {
      if (!["4", "5"].includes(this.form.inputMode)) {
        this.form.downBoxValueList = undefined;
      }
      if (["4", "5"].includes(this.form.inputMode)) {
        this.form.downBoxValueList = this.form.downBoxValueList.map(
          (item) => item.value
        );
      }
      try {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            if (this.inRequest) return;
            this.inRequest = true;
            const response = await addExamineeCfg({
              ...this.form,
              projectId: this.projectId,
              id: this.data.id,
            });
            if (response.code === 200) {
              this.dialogVisible = false;
              this.$message.success(response.msg);
              this.form = {
                downBoxValueList: [{ value: "" }],
              };
              this.$refs["form"].resetFields();
              this.$emit("refresh");
            }
          } else {
            this.$message.error("请输入必填项");
            return false;
          }
        });
      } finally {
        this.inRequest = false;
      }
    },
    async updateExamineeCfg() {
      try {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            if (this.inRequest) return;
            this.inRequest = true;
            const response = await postAliasCfgEdit({
              ...this.form,
              projectId: this.projectId,
              id: this.data.id,
            });
            if (response.code === 200) {
              this.dialogVisible = false;
              this.$message.success(response.msg);
              this.form = {
                nameCn:'',
                promptTextCn:''
              };
              this.$refs["form"].resetFields();
              this.$emit("refresh");
            }
          } else {
            this.$message.error("请输入必填项");
            return false;
          }
        });
      } finally {
        this.inRequest = false;
      }
    },
    addOptions() {
      this.form.downBoxValueList.push({ value: "" });
    },
    removeOptions(item) {
      if (this.form.downBoxValueList.length === 1) {
        Message.error("下拉框必须要拥有至少一个值");
        return;
      }
      var index = this.form.downBoxValueList.indexOf(item);
      if (index !== -1) {
        this.form.downBoxValueList.splice(index, 1);
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style scoped>
</style>
