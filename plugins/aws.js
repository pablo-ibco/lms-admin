import S3 from 'aws-sdk/clients/s3';

export default ({ app }, inject) => {
  const s3 = new S3({
    accessKeyId: "AKIARZJ56O72WLO3WGIE",
    secretAccessKey: "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",
    region: 'sa-east-1'
  });

  inject('getFileAWS', async function (Key) {
    const data = await s3.getObject({Bucket: 'masters-lms-bucket', Key}).promise(),
      contentType = Key.split('.type.')[1].replace('-','/'),
      contentFile = `data:${contentType};base64,${data.Body.toString('base64')}`;

    return new Promise(function(resolve, reject){
      resolve(contentFile)
    })
  });

  inject('postFileAWS', async function (directory, file) {
    const data = s3.putObject({
      Bucket: 'masters-lms-bucket',
      Key: directory,
      Body: file,
      ContentType: file.type
    });

    return data.promise();
  })

  inject('randomString', () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-+-';
    let str = '', i;

    for (i = 32; i-=1;) {
      str += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return str;
  })

  inject('toBase64', (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    })
  })
}
