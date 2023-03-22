<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb v-if="!topNav" id="breadcrumb-container" class="breadcrumb-container" />
    <top-nav v-if="topNav" id="topmenu-container" class="topmenu-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <span
          v-show="show"
          style="color:#5a5e66;display: inline-block;height: 100%;line-height: 50px;vertical-align: text-bottom;margin-right:15px;color:#1890ff;cursor: pointer;"
          @click="showProject"
        >{{ projectNameAndOwner }}</span>
        <search id="header-search" class="right-menu-item" />

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <span style="margin-left: 10px">{{ nickName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="请选择项目"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="getSelectProjectShowCloseRole()"
    >
      <el-form
        ref="form"
        :model="queryParams"
        label-width="90px"
        size="small"
        :inline="true"
      >
        <el-form-item label="项目编号">
          <el-input v-model="queryParams.no" placeholder="请输入项目编号" />
        </el-form-item>
        <el-form-item label="方案编号">
          <el-input v-model="queryParams.planNo" placeholder="请输入方案编号" />
        </el-form-item>
        <!--        <el-form-item label="适应症">-->
        <!--          <el-input v-model="queryParams.indication" placeholder="请输入适应症" />-->
        <!--        </el-form-item>-->
        <el-form-item label="申办者">
          <el-input v-model="queryParams.customerName" placeholder="请输入申办者" />
        </el-form-item>
        <!--        <el-form-item label="项目状态">-->
        <!--          <el-select v-model="queryParams.status">-->
        <!--            <el-option label="进行中" value="0" />-->
        <!--            <el-option label="已关闭" value="1" />-->
        <!--            <el-option label="已删除" value="2" />-->
        <!--            <el-option label="其他" value="3" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="项目类型">-->
        <!--          <el-input v-model="queryParams.projectType" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="是否商务项目">-->
        <!--          <el-select v-model="queryParams.isBusinessProject">-->
        <!--            <el-option label="否" value="0" />-->
        <!--            <el-option label="是" value="1" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label=" ">
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button @click="resetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="postList">
        <el-table-column label="项目编号" align="center" prop="no" />
        <el-table-column label="方案编号" align="center" prop="planNo" />
        <el-table-column label="适应症" align="center" prop="indication" />
        <el-table-column label="申办者" align="center" prop="customerName" />
        <el-table-column label="类型" align="center" prop="projectType" />
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)">选择
            </el-button>&nbsp;&nbsp;
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import {
  listPost
} from '@/api/business/project'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      show: true,
      projectNameAndOwner: '',
      loading: false,
      dialogTableVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isBusinessProject: '0'
      },
      // 总条数
      total: 0,
      postList: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'userRoles',
      'nickName'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  mounted() {
    if (localStorage['chooseProject']) {
      this.show = true
      var item = JSON.parse(localStorage['chooseProject'])
      this.projectNameAndOwner = `${item.planNo}-${item.customerName}`
    } else {
      this.dialogTableVisible = true
    }
    this.getList()
  },
  methods: {
    showProject() {
      this.getList()
      this.dialogTableVisible = true
    },
    getSelectProjectShowCloseRole() {
      return this.userRoles.filter((item) => ['BD', 'admin'].includes(item.roleKey)).length >= 1;
    },
    resetQueryParams() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        isBusinessProject: '0'
      }
      this.getList()
    },
    /** 查询项目列表 */
    getList() {
      listPost(this.queryParams).then((response) => {
        this.postList = response.rows
        this.total = response.total
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index'
        })
      }).catch(() => { })
    },
    handleUpdate(item) {
      this.$confirm(`是否将项目切换为${item.planNo}-${item.customerName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage['chooseProject'] = JSON.stringify(item)
        this.projectNameAndOwner = `${item.planNo}-${item.customerName}`
        this.dialogTableVisible = false
        this.$store.dispatch('tagsView/delAllVisitedViews')
        this.$router.push({ path: '/' })
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
