<template>
  <div>
    <el-button style="margin-left: 10px" size="mini" type="primary" @click="visible = true">发起质疑</el-button>
    <el-dialog title="发起质疑" :visible.sync="visible" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="质疑类型：" prop="secondCategoryId">
          <el-cascader v-model="form.secondCategoryId" :options="options" :props="props" style="width: 90%" clearable />
        </el-form-item>
        <el-form-item label="质疑内容：" prop="content">
          <el-input
            v-model="form.content"
            style="width: 90%"
            type="textarea"
            :rows="2"
            maxlength="200"
            placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否加急：" prop="isUrgent">
          <el-select v-model="form.isUrgent" placeholder="请选择" style="width: 90%" clearable>
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片：" prop="imageUrlList">
          <!-- <i class="el-icon-picture-outline" style="font-size: 22px" /> -->
          <div class="section" style="text-align: center;overflow: hidden;">
            <div style="float:left;">
              <FileUpload :limit="9" :file-type="fileType" :title="uploadTitle" @updateFileList="updateFileList" />
            </div>
          </div>
          <div v-if="form.imageUrlList && form.imageUrlList.length > 0" class="img-sty-box">
            <img v-for="(item,index) in form.imageUrlList" :key="index" :src="item" class="img-sty" @click="previewImg(item)">
          </div>
        </el-form-item>
        <el-form-item style="display: flex; justify-content: end">
          <el-button type="primary" @click="handleSubmit">确认</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 图片放大 -->
    <el-dialog :visible.sync="showPreview" width="90%" height="500px" append-to-body style="text-align: center;overflow: hidden;">
      <div style="height: 600px;overflow: scroll;">
        <img :src="imgPreview" style="max-width: 100%; max-height: 100%; object-fit: contain;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getQuestionCategoryList, addQuestion } from '@/api/audit/data'
import FileUpload from '@/views/components/FileUpload/commonUpload'
export default {
  components: { FileUpload },
  props: ['visitId'],
  data() {
    return {
      visible: false,
      // 表单参数
      form: {
        secondCategoryId: '',
        content: '',
        imageUrlList: [],
        isUrgent: '' //0-不加急 1-加急
      },
      // 表单校验
      rules: {
        secondCategoryId: [{ required: true, message: '质疑类型不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '质疑内容不能为空', trigger: 'blur' }],
        isUrgent: [{ required: true, message: '请选择是否加急', trigger: 'blur' }]
        // imageUrlList: [{ required: true, message: '请上传图片', trigger: 'blur' }]
      },
      options: [],
      props: {
        value: 'id',
        label: 'name',
        children: 'child'
      },
      fileType: ['jpg', 'png'],
      uploadTitle: '支持jpg,png格式，最多上传9张',
      showPreview: false,
      imgPreview: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    previewImg(url) {
      this.showPreview = true
      this.imgPreview = url
    },
    // 获取质疑类型列表
    getList() {
      getQuestionCategoryList().then((res) => {
        if (res.data && res.data.length > 0) {
          // this.options = res.data
          this.options = this.getTreeData(res.data)
        }
      })
    },
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].child.length < 1) {
          // sub若为空数组，则将sub设为undefined
          data[i].child = undefined
        } else {
          // sub若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].child)
        }
      }
      return data
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    // 接受上传数据
    updateFileList(fileList) {
      this.form.imageUrlList = fileList.map(item => item.url)
    },
    async handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.visitId = this.visitId
          this.form.secondCategoryId = this.form.secondCategoryId[1]
          addQuestion(this.form).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.cancel()
            }
          })
        }
      })
    },
    cancel() {
      this.$refs.form.resetFields()
      this.form.imageUrlList = []
      this.visible = false
    }
  }
}
</script>

<style  lang="scss" scoped>
.img-sty-box{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.img-sty{
  width: 148px;
  height: 148px;
  margin: 15px;
  cursor: pointer;
}
</style>
