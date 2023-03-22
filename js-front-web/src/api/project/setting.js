import request from '@/utils/request'

// 中心用户创建
export function addCenterUser(data) {
    return request({
        url: '/center/addCenterUser',
        method: 'post',
        data: data
    })
}

// 中心用户列表
export function getUserCenterJoins(params) {
    return request({
        url: '/center/getUserCenterJoins',
        method: 'get',
        params
    })
}

// 分配用户列表(给项目分配or中心分配)  1=项目分配用户,2=中心分配用户,必须大于0
export function getCanBindUsers(params) {
    return request({
        url: '/project/getCanBindUsers',
        method: 'get',
        params
    })
}

// 项目用户创建
export function addProjectUser(data) {
    return request({
        url: '/project/addProjectUser',
        method: 'post',
        data
    })
}

// 项目用户列表
export function listPost(params) {
    return request({
        url: '/project/listProjectUsers',
        method: 'get',
        params
    })
}

// 项目用户状态禁/启用
export function setProjectUserStatus(data) {
    return request({
        url: '/project/setProjectUserStatus',
        method: 'post',
        data
    })
}

// 项目用户详情
export function getProjectUserDetails(params) {
    return request({
        url: '/project/getProjectUserDetails',
        method: 'get',
        params
    })
}

// 修改项目用户角色
export function setProjectUserRole(data) {
    return request({
        url: '/project/setProjectUserRole',
        method: 'post',
        data
    })
}

// 数据描述配置列表
export function getDescCfgList(params) {
    return request({
        url: '/desc/cfg/list',
        method: 'get',
        params
    })
}

// 数据描述配置状态禁/启用
export function setDataDescCfgStatus(params) {
    return request({
        url: '/desc/cfg/setDataDescCfgStatus',
        method: 'get',
        params
    })
}

// 数据描述配置创建
export function postDescCfgAdd(data) {
    return request({
        url: '/desc/cfg/add',
        method: 'post',
        data
    })
}

// 数据描述配置编辑
export function postDescCfgEdit(data) {
    return request({
        url: '/desc/cfg/edit',
        method: 'post',
        data
    })
}

// 数据描述配置详情
export function getDescCfg(params) {
    return request({
      url: `/desc/cfg/${params.id}`,
      method: 'get',
      params
    })
  }

  // 受试者信息名称配置列表
export function getAliasCfgList(params) {
    return request({
      url: `/alias/cfg/list`,
      method: 'get',
      params
    })
  }

  // 修改受试者信息名称配置
export function postAliasCfgEdit(data) {
    return request({
        url: '/alias/cfg/edit',
        method: 'post',
        data
    })
}

 // 受试者信息名称配置详情
 export function getAliasCfgInfo(params) {
    return request({
      url: `/alias/cfg/${id}`,
      method: 'get',
      params
    })
  }