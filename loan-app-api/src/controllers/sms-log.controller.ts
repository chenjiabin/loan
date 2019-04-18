import { repository } from '@loopback/repository';
import { param, get, HttpErrors } from '@loopback/rest';
import { SmsLog } from '../models';
import { SmsLogRepository, UserRepository, ConfigRepository } from '../repositories';
import { getRandomNum, sendSms, getCurTimestamp } from '../utils/utils';

export class SmsLogController {
  constructor(
    @repository(SmsLogRepository)
    public smsLogRepository: SmsLogRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ConfigRepository)
    public configRepository: ConfigRepository,
  ) { }

  @get('/sendVerifyCode', {
    responses: {
      '200': {
        description: 'SmsLog model instance',
        content: { 'application/json': { schema: { 'x-ts-type': SmsLog } } },
      },
    },
  })
  async create(
    @param.query.string('phone') phone: string,
    @param.query.string('type') type: number,
  ): Promise<string> {
    // type: 1注册 其他类型登录
    if (type == 1) {
      let foundUser = await this.userRepository.findOne({
        where: { phone: phone },
      });

      if (foundUser) {
        throw new HttpErrors.Forbidden('您已经注册过了');
      }
    }

    let configs = {
      AccessKeyID: "",
      AccessKeySecret: "",
      SignName: "",
      TempCode: ""
    }
    let conf = await this.configRepository.findOne({ where: { key: 'AccessKeyID' } })
    if (conf) {
      configs.AccessKeyID = conf.value
    }
    conf = await this.configRepository.findOne({ where: { key: 'AccessKeySecret' } })
    if (conf) {
      configs.AccessKeySecret = conf.value
    }
    conf = await this.configRepository.findOne({ where: { key: 'SignName' } })
    if (conf) {
      configs.SignName = conf.value
    }
    conf = await this.configRepository.findOne({ where: { key: 'TempCode' } })
    if (conf) {
      configs.TempCode = conf.value
    }

    let smsLog = new SmsLog();
    smsLog.phone = phone;
    smsLog.code = getRandomNum(1000, 9999);
    smsLog.createTime = getCurTimestamp();
    await this.smsLogRepository.create(smsLog);
    // 调用短信接口发送验证码
    sendSms(configs, phone, smsLog.code);
    return 'ok';
  }
}
