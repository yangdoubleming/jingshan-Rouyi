<template>
    <div class="app-container">
        <span style="font-weight:bold">数据描述配置</span>
        <el-divider />
        <div style="display: flex; justify-content: space-between;">
            <CreatDataDescDialog type="create" :projectId="projectId" @refresh="queryVisitUploadCfgList" />
            <el-button plain type="warning" icon="el-icon-download" @click="handleExport">导出</el-button>
        </div>

        <el-table v-loading="loading" :data="visitUploadCfgList" style="width: 100%; margin-top:  20px;">
            <el-table-column prop="categoryMsg" label="类型" />
            <el-table-column prop="fieldNameCn" label="字段名称" />
            <el-table-column prop="isRequired" label="是否必填" />
            <el-table-column prop="s" label="是否显示" />
            <el-table-column prop="fieldType" label="字段类型">
                <template slot-scope="scope">
                    {{ fieldTypeText[scope.row.fieldType]}}
                </template>
            </el-table-column>
            <el-table-column prop="inputMode" label="输入方式">
                <template slot-scope="scope">
                    {{ inputModeText[scope.row.inputMode]}}
                </template>
            </el-table-column>
            <el-table-column prop="fieldLength" label="字段长度" />
            <el-table-column prop="decimalPrecision" label="小数点精度" />
            <el-table-column prop="startNumberValue" label="数值范围" />
            <el-table-column prop="unit" label="单位" />
            <el-table-column prop="sort" label="排序" />
            <el-table-column prop="status" label="状态" >
              <template slot-scope="scope">
                    {{ scope.row.status=='0'?'启用':'禁用' }}
              </template>
            </el-table-column>
            <el-table-column prop="createBy" label="创建人" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="updateBy" label="修改人" />
            <el-table-column prop="updateTime" label="修改时间" />
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <CreatDataDescDialog type="update" :projectId="projectId" :data="scope.row"
                        @refresh="queryVisitUploadCfgList" />
                    <el-switch v-model="scope.row.status" style="margin-left: 20px" active-color="#13ce66"
                        inactive-color="#ff4949" active-value="0" inactive-value="1" @change="(status) => {
                            switchDataDescStatus(status, scope.$index, scope.row)
                        }" />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import _ from 'lodash'
import { getDescCfgList, setDataDescCfgStatus } from '@/api/project/setting'
import CreatDataDescDialog from './components/CreatDataDescDialog.vue'
export default {
    components: { CreatDataDescDialog },
    props: ['activeName'],
    data() {
        return {
            loading: false,
            projectId: this.$route.query.id,
            visitUploadCfgList: [],
            switchRequest: false,
            fieldTypeText: {
                "1": "文本",
                "2": "整数",
                "3": "小数",
                "4": "日期时间",
            },
            inputModeText: {
                "1": "文本框",
                "2": "文本域",
                "3": "单选下拉框",
                "4": "多选下拉框",
            },
        }
    },
    watch: {
        'activeName': function (newValue) {
            if (newValue === 'visit') {
                this.queryVisitUploadCfgList()
            }
        }
    },
    methods: {
        async queryVisitUploadCfgList() {
            if (this.loading) return
            this.loading = true
            const response = await getDescCfgList({ projectId: this.projectId })
            this.loading = false
            if (response.code === 200) {
                this.visitUploadCfgList = response.rows
                console.log(1111,response.rows)
            }
        },
        async switchDataDescStatus(status, index, item) {
            try {
                if (this.switchRequest) return
                this.switchRequest = true
                const response = await setDataDescCfgStatus({
                    id: item.id,
                    status: status == '0' ? '0' : '1'
                })
                if (response.code === 200) {
                    this.$message.success(response.msg)
                }
            } catch (e) {
                const list = _.cloneDeep(this.visitUploadCfgList)
                list[index].status = status == '0' ? '0' : '1'
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

