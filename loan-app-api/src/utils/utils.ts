export function getRandomNum(Min: number, Max: number): string {
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range)).toString();
}

export function getCurTimestamp(): number {
  return Date.parse(new Date().toString()) / 1000
}

export async function sendSms(configs: any, phone: string, code: string) {
  /**
   * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
   * Created on 2017-07-31
   */
  const SMSClient = require('@alicloud/sms-sdk');
  // ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
  const accessKeyId = configs.AccessKeyID;
  const secretAccessKey = configs.AccessKeySecret;
  //初始化sms_client
  let smsClient = new SMSClient({ accessKeyId, secretAccessKey });
  //发送短信
  try {
    let res = await smsClient.sendSMS({
      PhoneNumbers: phone, // 必填: 待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码, 批量调用相对于单条调用及时性稍有延迟, 验证码类型的短信推荐使用单条调用的方式；发送国际/ 港澳台消息时，接收号码格式为：国际区号 + 号码，如“85200000000”
      SignName: configs.SignName, // 必填: 短信签名 - 可在短信控制台中找到
      TemplateCode: configs.TempCode, // 必填: 短信模板 - 可在短信控制台中找到，发送国际 / 港澳台消息时，请使用国际 / 港澳台短信模版
      TemplateParam: '{"code":"' + code + '"}', //可选: 模板中的变量替换JSON串, 如模板内容为"亲爱的${name},您的验证码为${code}"时。
    });
    let { Code } = res;
    if (Code === 'OK') {
      //处理返回参数
      console.log(res);
    }
  } catch (e) {
    console.log(e);
  }
}

// export function getClientIp(req: Request): string {
//   let addr = req.headers.get('X-Real-IP');
//   if (addr) {
//     return addr;
//   }

//   let addrsStr = req.headers.get('X-Forwarded-For');
//   if (addrsStr) {
//     let addrs = addrsStr.split(',');
//     if (addrs.length > 0) {
//       return addrs[0];
//     }
//   }
//   return '';
// }
