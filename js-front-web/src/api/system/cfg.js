import request from '@/utils/request'

// 查询项目评估流程配置列表
export function listCfg(query) {
  return request({
    url: '/assess/list',
    method: 'get',
    params: query
  })
}

// 查询项目评估流程配置详细
export function getCfg(id) {
  return request({
    url: '/system/cfg/' + id,
    method: 'get'
  })
}

// 新增项目评估流程配置
export function addCfg(data) {
  return request({
    url: `/assess/add`,
    method: 'post',
    data: data
  })
}

// 修改项目评估流程配置
export function updateCfg(data) {
  return request({
    url: '/system/cfg',
    method: 'put',
    data: data
  })
}

// 修改项目评估流程配置
export function setAssessFlowStatus(params) {
  return request({
    url: '/assess/setAssessFlowStatus',
    method: 'put',
    params
  })
}

// 删除项目评估流程配置
export function delCfg(id) {
  return request({
    url: '/system/cfg/' + id,
    method: 'delete'
  })
}
