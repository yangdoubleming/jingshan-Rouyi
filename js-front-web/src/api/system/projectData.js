import request from '@/utils/request'

// 查询项目数据审核配置列表
export function listCfg(query) {
  return request({
    url: '/dataAudit/list',
    method: 'get',
    params: query
  })
}

// 查询项目数据审核配置详细
export function getCfg(id) {
  return request({
    url: '/system/cfg/' + id,
    method: 'get'
  })
}

// 新增项目数据审核配置
export function addCfg(data) {
  return request({
    url: '/dataAudit/add',
    method: 'post',
    data: data
  })
}

// 修改项目数据审核配置
export function updateCfg(data) {
  return request({
    url: '/dataAudit/edit',
    method: 'put',
    data: data
  })
}

// 修改项目数据审核配置
export function setDataAuditStatus(params) {
  return request({
    url: '/dataAudit/setDataAuditStatus',
    method: 'put',
    params
  })
}

// 删除项目数据审核配置
export function delCfg(id) {
  return request({
    url: '/system/cfg/' + id,
    method: 'delete'
  })
}
