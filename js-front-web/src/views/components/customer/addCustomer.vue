<template>
  <!-- 新增客户 -->
  <el-dialog
    :title="title"
    :visible.sync="diaShow"
    :before-close="diaClose"
    width="600px"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      ref="form"
      :model="newCustomerForm"
      :rules="rules"
      label-width="130px"
    >
      <el-form-item label="客户简称" prop="name">
        <el-input v-model="newCustomerForm.name" placeholder="请输入 客户简称" />
      </el-form-item>
      <el-form-item label="客户英文名称" prop="enName">
        <el-input
          v-model="newCustomerForm.enName"
          placeholder="请输入 客户英文名称"
        />
      </el-form-item>
      <el-form-item label="LOGO" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          v-loading="loadingA"
          :action="baseUrl"
          :with-credentials="true"
          :headers="myHeaders"
          capture="camera"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadA"
          :on-success="handleAvatarSuccessA"
        >
          <el-image
            class="avatar"
            v-if="newCustomerForm.logoUrl"
            :src="newCustomerForm.logoUrl"
            fit="fit"
          ></el-image>
          <el-button v-else type="primary" icon="el-icon-plus"
            >上传图片</el-button
          >
        </el-upload>
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="socialCreditCode">
        <el-input
          v-model="newCustomerForm.socialCreditCode"
          placeholder="请输入 统一社会信用代码"
        />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="newCustomerForm.phone" placeholder="请输入 电话" />
      </el-form-item>
      <el-form-item label="邮编" prop="postalCode">
        <el-input v-model="newCustomerForm.postalCode" placeholder="请输入 邮编" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="newCustomerForm.address" placeholder="请输入 地址" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
<!--      <el-button @click="diaClose">取 消</el-button>-->
    </div>
  </el-dialog>
</template>

<script>
import {
  listPost,
  getPost,
  delPost,
  updatePost,
  listAdd,
  customerAdd,
} from "@/api/business/customer";
import { getToken } from "@/utils/auth";
export default {
  name: "AddCustomer",
  props: {
    diaShow: {
      type: Boolean,
      default: false,
    },
    newCustomerForm: {
      type: Object,
      default: () =>{},
      require: false
    },
    title: {
      type: String,
      default: '新增客户',
      require: false
    }
  },
  data() {
    return {
      loadingA: false,
      baseUrl: process.env.VUE_APP_BASE_API + "/common/storage/uploadImage",
      myHeaders: { Authorization: "Bearer " + getToken() },
      // 表单校验
      rules: {
        name: [{ required: true, message: "客户名称 不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.newCustomerForm.id != undefined) {
            updatePost(this.newCustomerForm).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.reset();
              this.$parent.diaClose();
              this.$parent.getCustomerList();
            });
          } else {
            listAdd(this.newCustomerForm).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.reset();
              this.$parent.diaClose();
              this.$parent.getCustomerList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.newCustomerForm = {
        name: '',
        enName: '',
        logoUrl: '',
        socialCreditCode: '',
        phone: "",
        postalCode: '',
        address:''
      };
      this.resetForm("form");
    },
    diaClose() {
      this.reset();
      this.$parent.diaClose();
    },
    // 身份证正面
    beforeAvatarUploadA() {
      this.loadingA = true;
    },
    handleAvatarSuccessA(res, file) {
      if (res.code === 200) {
        this.newCustomerForm.logoUrl = res.data;
      } else {
        this.$message.error("上传失败");
      }
      this.loadingA = false;
    },
  },
};
</script>

<style>
</style>
