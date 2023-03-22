<template>
    <div style="margin: 20px 0">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="font-size: large">上传详情</span>
            </div>
            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick" v-loading="loading">
                    <el-tab-pane label="DICOM" name="dicom" v-if="visitDicomList.length > 0">
                        <!-- <el-button type="danger" style="margin-bottom: 15px">批量删除</el-button> -->
                        <el-table :data="visitDicomList" border show-summary style="width: 100%">
                            <el-table-column type="selection" />
                            <el-table-column prop="studyDate" label="检查日期" />
                            <el-table-column prop="modalityInStudy" label="检查方式" />
                            <el-table-column prop="studyDescription" label="检查描述" />
                            <el-table-column prop="seriesCount" label="序列数量" />
                            <el-table-column prop="imageCount" label="图像数量" />
                            <el-table-column v-if="buttonName === '质控'" label="操作" fixed="right" width="130"
                                align="center" class-name="small-padding fixed-width">
                                <template slot-scope="scope">
                                    <el-button v-hasPermi="['system:post:edit']" size="mini" type="text"
                                        @click="deleteFile(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="图片集" name="pic" v-if="visitPicList[0].imageNum > 0">
                        <el-table :data="visitPicList" border style="width: 100%">
                            <el-table-column type="selection" />
                            <el-table-column prop="imageNum" label="图片数量" />
                            <el-table-column label="操作" align="center"
                                class-name="small-padding fixed-width">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="text" @click="seePicFile">查看</el-button>
                                    <el-button v-hasPermi="['system:post:edit']" size="mini" type="text"
                                        v-if="buttonName === '质控'" @click="deleteFile(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="PDF" name="pdf" v-if="visitPdfList.length > 0">
                        <!-- <el-button type="danger" style="margin-bottom: 15px"
                >批量删除</el-button
              > -->
                        <el-table :data="visitPdfList" border style="width: 100%">
                            <el-table-column type="selection" />
                            <el-table-column prop="fileName" label="文件名称" />
                            <el-table-column label="操作" align="center"
                                class-name="small-padding fixed-width">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="text"
                                        @click="seeFile(scope.row.filePath)">查看</el-button>
                                    <el-button v-hasPermi="['system:post:edit']" size="mini" type="text"
                                    v-if="buttonName === '质控'" @click="deleteFile(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="视频" name="video" v-if="visitVideoList.length > 0">
                        <!-- <el-button type="danger" style="margin-bottom: 15px"
                >批量删除</el-button
              > -->
                        <el-table :data="visitVideoList" border style="width: 100%">
                            <el-table-column type="selection" />
                            <el-table-column prop="fileName" label="文件名称" />
                            <el-table-column label="操作" align="center"
                                class-name="small-padding fixed-width">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="text"
                                        @click="seeFile(scope.row.filePath)">查看</el-button>
                                    <el-button v-hasPermi="['system:post:edit']" size="mini" type="text"
                                    v-if="buttonName === '质控'" @click="deleteFile(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
        <!-- 删除 -->
        <el-dialog title="删除数据" :visible.sync="dialogFormVisible" width="600px" :close-on-click-modal="false"
            append-to-body modal-append-to-body>
            <el-form :model="form" label-width="100px" ref="form" :rules="rules">
                <el-form-item label="删除原因" prop="delReason">
                    <el-select v-model="form.delReason" placeholder="请选择" multiple="" style="width: 100%">
                        <el-option label="包含受试者隐私" value="包含受试者隐私"></el-option>
                        <el-option label="数据不可用" value="数据不可用"></el-option>
                        <el-option label="其它" value="其它"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 图片、PDF显示 -->
        <el-dialog title="图片集" :visible.sync="showPicDia" width="60%" :close-on-click-modal="false" append-to-body>
            <div class="show-block">
                <el-carousel style="height: 520px" :autoplay="false" indicator-position="none" arrow="always">
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
import { getVisitDicomList, dicomStudyList } from "@/api/image/tester";
import {
    getVisitOtherListNew,
    getVisitImageFiles,
    getVisitPdfFiles,
    getVisitVideoFiles,
    removeVisitImageFiles,
    removeVisitPdfFile,
    removeVisitVideoFile,
    uploadDicomBatchRemove,
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
            activeName: "dicom",
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
                delReason: [
                    { required: true, message: "请输入删除原因", trigger: "blur" },
                ],
            },
            // 第一次进来
            firstInto: false
        };
    },
    watch: {
        examineId: {
            handler (newVal) {
                this.getDicomStudyList();
            },
            deep: true,
	        immediate: true,
        },
    },
    mounted() {},
    methods: {
        // 获取dicom
        async getDicomStudyList() {
            this.loading = true;
            const response = await dicomStudyList({
                visitId: this.visitId,
                pageNum: 1,
                pageSize: 1000
            });
            if (response.code === 200) {
                this.visitDicomList = response.rows
            }
            this.loading = false
            this.firstInto ? '' : this.getVisitImageFiles()
        },
        // 获取图片
        async getVisitImageFiles() {
            this.loading = true;
            await getVisitImageFiles({ visitId: this.visitId }).then((response) => {
                this.visitPicList[0].imageNum = response.data.length || 0;
                this.visitPicUrlList = response.data || [];
                this.loading = false;
            }).catch(err => {
                this.loading = false;
            });
            this.firstInto ? '' : this.getVisitPdfFiles()
        },
        // 获取pdf
        async getVisitPdfFiles() {
            this.loading = true;
            await getVisitPdfFiles({ visitId: this.visitId }).then((response) => {
                this.visitPdfList = response.data;
                this.loading = false;
            }).catch(err => {
                this.loading = false;
            });
            this.firstInto ? '' : this.getVisitVideoFiles()
        },
        // 获取视频
        async getVisitVideoFiles() {
            this.loading = true;
            await getVisitVideoFiles({ visitId: this.visitId }).then((response) => {
                this.visitVideoList = response.data;
                this.loading = false;
            }).catch(err => {
                this.loading = false;
            });
            this.firstInto ? '' : this.showWhichTab()
        },
        // tab展开哪一个
        showWhichTab() {
            if (this.visitDicomList.length > 0) {
                this.activeName = 'dicom'
            } else {
                if (this.visitPicList[0].imageNum > 0) {
                    this.activeName = 'pic'
                } else {
                    if (this.visitPdfList.length > 0) {
                        this.activeName = 'pdf'
                    } else {
                        if (this.visitVideoList.length > 0) {
                            this.activeName = 'video'
                        }
                    }
                }
            }
            this.firstInto = true
        },
        // 删除dicom
        uploadDicomBatchRemove(obj) {
            this.loading = true;
            uploadDicomBatchRemove(obj)
                .then((response) => {
                    this.loading = false;
                    this.getDicomStudyList();
                    this.form = {
                        remark: "",
                        delReason: "",
                    };
                    this.dialogFormVisible = false;
                })
                .catch((err) => {
                    this.loading = false;
                });
        },
        // 删除图片
        removeVisitImageFiles(obj) {
            this.loading = true;
            removeVisitImageFiles(obj)
                .then((response) => {
                    this.loading = false;
                    this.getVisitImageFiles();
                    this.form = {
                        remark: "",
                        delReason: "",
                    };
                    this.dialogFormVisible = false;
                })
                .catch((err) => {
                    this.loading = false;
                });
        },
        // 删除pdf
        removeVisitPdfFile(obj) {
            this.loading = true;
            removeVisitPdfFile(obj)
                .then((response) => {
                    this.loading = false;
                    this.getVisitPdfFiles();
                    this.form = {
                        remark: "",
                        delReason: "",
                    };
                    this.dialogFormVisible = false;
                })
                .catch((err) => {
                    this.loading = false;
                });
        },
        // 删除视频
        removeVisitVideoFile(obj) {
            this.loading = true;
            removeVisitVideoFile(obj)
                .then((response) => {
                    this.getVisitVideoFiles();
                    this.loading = false;
                    this.form = {
                        remark: "",
                        delReason: "",
                    };
                    this.dialogFormVisible = false;
                })
                .catch((err) => {
                    this.loading = false;
                });
        },
        // tab切换-查看
        handleClick() {
            switch (this.activeName) {
                case "dicom":
                    this.getDicomStudyList();
                    break;
                case "pic":
                    this.getVisitImageFiles();
                    break;
                case "pdf":
                    this.getVisitPdfFiles();
                    break;
                case "video":
                    this.getVisitVideoFiles();
                    break;
            }
        },
        // 删除-接口
        handleDelete() {
            let obj = {
                id: this.nowFileId,
                delReason: this.form.delReason.join(","),
                remark: this.form.remark,
            };
            switch (this.activeName) {
                case "dicom":
                    this.uploadDicomBatchRemove({
                        ids: [this.nowFileId],
                        delReason: this.form.delReason.join(","),
                        remark: this.form.remark,
                    });
                    break;
                case "pic":
                    this.removeVisitImageFiles(obj);
                    break;
                case "pdf":
                    this.removeVisitPdfFile(obj);
                    break;
                case "video":
                    this.removeVisitVideoFile(obj);
                    break;
            }
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
        // 获取其它文件
        async queryVisitOtherList() {
            const response = await getVisitOtherListNew({ visitId: this.visitId });
            if (response.code === 200) {
                this.visitOtherList = response.data.filter(
                    (item) => item.type === this.activeName
                );
            }
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
}
</script>

<style>

</style>