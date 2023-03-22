import SparkMD5 from "spark-md5";

export function uploadMedia(file) {
    return new Promise((resolve, reject) => {
        // 分片读取文件
        const fileReader = new FileReader()
        const chunkSize = 1024 * 1024 * 2 //每个分片的大小 2MB
        const chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        var spark = new SparkMD5.ArrayBuffer()
        const loadFile = (e) => {
            spark.append(e.target.result)
            currentChunk++
            if (currentChunk < chunks) { //未读取完继续读取
                loadNext()
            } else { // 文件读取完
                const md5 = spark.end() // 获取文件的md5值
                resolve(md5)
                // checkFileMd5() //服务器端实现的接口
            }
        }
        const loadError = () => { // 读取文件失败
          reject('compute file md5 error')
        }
        const loadNext = () => {
          fileReader.onload = loadFile
          fileReader.onerror = loadError
          const start = currentChunk * chunkSize
          const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
          const data = file.slice(start, end)
          fileReader.readAsArrayBuffer(data)
        }
        loadNext()
    })
}
