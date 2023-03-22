const OSS = require('ali-oss');

const client = new OSS({
  region: process.env.VUE_APP_REGION,
  accessKeyId: process.env.VUE_APP_ACCESSKEYID,
  accessKeySecret: process.env.VUE_APP_ACCESSKEYSECRET,
  bucket: process.env.VUE_APP_BUCKET,
});

const headers = {
    'Access-Control-Allow-Origin': '*',
};

export async function put (file, path) {
    let fullPath = path ? '/'+path.join('/') : '/images'
    try {
      const r1 = await client.put( fullPath + '/' + file.name , file.raw, headers);
      return r1
    } catch (e) {
      console.error('error: %j', e);
    }
  }
