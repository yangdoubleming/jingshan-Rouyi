

// 项目类型
export const optionsProjectType = [
    'BICR',
    '咨询项目',
    '演示项目',
    '测试项目',
    '其他',
]

// 评估标准
export const optionsEvaluationType = [
    'RECIST1.1',
    'Lugano2014',
    'RANO',
    'Choi',
    '其他',
]

// 项目状态
export const optionsStatus = [
    {value:0, name:'进行中'},
    {value:1, name:'已关闭'},
    {value:2, name:'已删除'},
    {value:3, name:'其他'},
]

// 受试者-入组筛选评估状态
export const testerStatus = [
    {value:'0', name:'正常'},
    {value:'1', name:'出组'},
    {value:'2', name:'筛选失败'},
]