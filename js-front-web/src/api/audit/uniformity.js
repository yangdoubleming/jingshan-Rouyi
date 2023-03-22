import request from '@/utils/request'

// 一致性核查列表
export function list(params) {
  return request({
    url: '/visit/check/list',
    method: 'get',
    params
  })
}

// 查看检查列表
export function inspectList(params) {
  return request({
    url: '/visit/check/inspectList',
    method: 'get',
    params
  })
}

// 一致性核查通过不通过
export function changeCheckStatus(params) {
  return request({
    url: '/visit/check/changeCheckStatus',
    method: 'get',
    params
  })
}
