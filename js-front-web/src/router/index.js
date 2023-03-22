import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/business',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'projectDetails',
        component: () => import('@/views/business/project/details'),
        name: 'ProjectDetails',
        meta: { title: '项目详情', icon: 'user' }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'listDetails',
        component: () => import('@/views/project/list/details'),
        name: 'ListDetails',
        meta: { title: '项目详情', icon: 'user' }
      },
      {
        path: 'listSetting',
        component: () => import('@/views/project/list/setting'),
        name: 'ListSetting',
        meta: { title: '项目配置', icon: 'user' }
      }
    ]
  },
  {
    path: '/image',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'testerDetails',
        component: () => import('@/views/image/tester/details'),
        name: 'TesterDetails',
        meta: { title: '访视详情', icon: 'user' }
      }
    ]
  },
  {
    path: '/assess',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'heart/baseline',
        component: () => import('@/views/assess/heart/baseline'),
        name: 'heartBaseline',
        meta: { title: '心脏毒性基线期评估', icon: 'user' }
      },
      {
        path: 'heart/visit',
        component: () => import('@/views/assess/heart/visit'),
        name: 'heartVisit',
        meta: { title: '心脏毒性访视期评估', icon: 'user' }
      },
      {
        path: 'heart/ruling',
        component: () => import('@/views/assess/heart/ruling'),
        name: 'heartRuling',
        meta: { title: '心脏毒性裁定评估', icon: 'user' }
      },
      {
        path: 'heart/compareBaseLine',
        component: () => import('@/views/assess/heart/compareBaseLine'),
        name: 'compareBaseLine',
        meta: { title: '心脏毒性基线期评估对比', icon: 'user' }
      },
      {
        path: 'heart/compareVisit',
        component: () => import('@/views/assess/heart/compareVisit'),
        name: 'compareVisit',
        meta: { title: '心脏毒性访视期评估对比', icon: 'user' }
      },
      {
        path: 'list/base',
        component: () => import('@/views/assess/taskList/components/base/IndependentEvaluation'),
        name: 'BaseIndependentEvaluation',
        meta: { title: '基线期 -- 独立影像评估表单', icon: 'user' }
      },
      {
        path: 'list/visit',
        component: () => import('@/views/assess/taskList/components/visit/IndependentEvaluation'),
        name: 'VisitIndependentEvaluation',
        meta: { title: '访视期 -- 独立影像评估表单', icon: 'user' }
      },
      {
        path: 'list/global',
        component: () => import('@/views/assess/taskList/components/GlobalEvaluation'),
        name: 'GlobalEvaluation',
        meta: { title: '全局评估表单', icon: 'user' }
      },
      {
        path: 'list/arbitrament',
        component: () => import('@/views/assess/taskList/components/ArbitramentEvaluation'),
        name: 'ArbitramentEvaluation',
        meta: { title: '仲裁评估表单', icon: 'user' }
      },
    ]
  },


  //=========================================================
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
