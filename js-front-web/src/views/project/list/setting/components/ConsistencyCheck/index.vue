<template>
    <div class="app-container">
        <span style="font-weight:bold">一致性核查配置</span>
        <el-divider />

        <el-table v-loading="loading" :data="examineeCfgList" style="width: 100%; margin-top:  20px;">
            <el-table-column prop="fieldNameCn" label="是否启动" />
            <el-table-column prop="isRequired" label="创建人" />
            <el-table-column prop="fieldTypeMsg" label="创建时间" />
            <el-table-column prop="inputModeMsg" label="修改人" />
            <el-table-column prop="fieldLength" label="修改时间" />
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" style="margin-left: 20px" active-color="#13ce66"
                        inactive-color="#ff4949" active-value="0" inactive-value="1" @change="(status) => {
                            switchExamineeStatus(status, scope.$index, scope.row)
                        }" />
                </template>
            </el-table-column>
        </el-table>

        <div style="font-weight:bold;padding-top: 30px;"> 一致性核查字段选择</div>
        <el-divider />
        <div style="display: flex; justify-content: space-between;">
            <Field type="create" :project-id="projectId" @refresh="_getCheckCfgList" />
        </div>

        <el-table v-loading="loading" :data="checkCfgList" style="width: 100%; margin-top:  20px;">
            <!-- <el-table-column prop="fieldSourceTable" label="字段名称" /> -->
            <el-table-column prop="fieldSourceTable" label="字段类型">
                <template slot-scope="scope">
                    {{ fieldSourceTableText[scope.row.fieldSourceTable] }}
                </template>
            </el-table-column>
            <el-table-column prop="category" label="文件类型">
                <template slot-scope="scope">
                    {{ categoryText[scope.row.category] }}
                </template>
            </el-table-column>
            <el-table-column prop="fieldNameCn" label="字段名称" />
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    {{ statusText[scope.row.status] }}
                </template>
            </el-table-column>
            <el-table-column prop="createBy" label="创建人" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="updateBy" label="修改人" />
            <el-table-column prop="updateTime" label="修改时间" width="180" />
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <!-- <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete">44</el-button> -->
                    <!-- <div style="display: flex;align-items: center;"> -->
                    <!-- <Field type="update" :project-id="projectId" :data="scope.row" @refresh="_getCheckCfgList" /> -->
                    <el-switch
                        style="margin-left: 10px;"
                        :value="scope.row.status == '0'"
                        active-color="#13ce66"
                        inactive-color="#909399"
                        @change="changeStatus(scope.row)"
                    />
                    <!-- </div> -->
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script>
import _ from 'lodash'
import { getExamineeCfgList, setExamineeInfoCfgStatus, getCheckCfgList, setCheckCfgStatus } from '@/api/project/list'
import Field from './components/Field'
export default {
    components: { Field },
    props: ['activeName'],
    data() {
        return {
            loading: false,
            projectId: this.$route.query.id,
            checkCfgList: [],
            examineeCfgList: [],
            switchRequest: false,
            statusText: {
                "0": "启用",
                "1": "关闭",
            },
            fieldSourceTableText: {
                "1": "受试者信息",
                "2": "访视信息",
                "3": "数据描述",
            },
            categoryText: {
                '1': 'DICOM',
                '2': 'PDF',
                '3': '图片',
                '4': '视频'
            }
        }
    },
    watch: {
        'activeName': function (newValue, oldValue) {
            if (newValue === 'check') {
                this._getCheckCfgList()
            }
        }
    },
    methods: {
        handleDelete() {
            this.$confirm('确认进行删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
            }).catch(() => {});
        },
        async _getCheckCfgList() {
            try {
                if (this.loading) return
                this.loading = true
                const response = await getCheckCfgList({ projectId: this.projectId })
                if (response.code === 200) {
                    this.checkCfgList = response.rows
                }
            } finally {
                this.loading = false
            }
        },
        async switchExamineeStatus(status, index, item) {
            try {
                if (this.switchRequest) return
                this.switchRequest = true
                const response = await setExamineeInfoCfgStatus({ id: item.id, status })
                if (response.code === 200) {
                    this.$message.success(response.msg)
                }
            } catch (e) {
                const list = _.cloneDeep(this.examineeCfgList)
                list[index].status = status === '1' ? '0' : '1'
                this.examineeCfgList = [...list]
            } finally {
                this.switchRequest = false
            }
        },
        changeStatus(row) {
            console.log('===')
            setCheckCfgStatus({
                id: row.id,
                status: row.status === "0" ? "1" : "0",
            }).then((response) => {
                this._getCheckCfgList()
            })
        }
    }
}
</script>
  
<style scoped></style>
  