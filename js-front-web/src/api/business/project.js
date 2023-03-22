import request from '@/utils/request'

// 列表
export function listPost(params) {
    return request({
        url: '/project/list',
        method: 'get',
        params
    })
}

// 新增商业项目
export function listAdd(data) {
    return request({
        url: '/project/add',
        method: 'post',
        data: data
    })
}

// 项目正式立项
export function setProjectInitiation(data) {
    return request({
        url: '/project/setProjectInitiation',
        method: 'post',
        data: data
    })
}

//详情
export function projectDetails(params) {
    return request({
        url: '/project/query',
        method: 'get',
        params
    })
}