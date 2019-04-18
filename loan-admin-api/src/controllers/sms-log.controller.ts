import { repository } from '@loopback/repository';
import { param, get } from '@loopback/rest';
import { SmsLog } from '../models';
import { SmsLogRepository } from '../repositories';
import { getRandomNum, sendSms, getCurTimestamp } from '../utils/utils';

export class SmsLogController {
  constructor(
    @repository(SmsLogRepository)
    public smsLogRepository: SmsLogRepository,
  ) { }

  @get('/sendVerifyCode', {
    responses: {
      '200': {
        description: 'SmsLog model instance',
        content: { 'application/json': { schema: { 'x-ts-type': SmsLog } } },
      },
    },
  })
  async create(@param.query.string('phone') phone: string): Promise<string> {
    let smsLog = new SmsLog();
    smsLog.phone = phone;
    smsLog.code = getRandomNum(1000, 9999);
    smsLog.createTime = getCurTimestamp();
    await this.smsLogRepository.create(smsLog);
    // 调用短信接口发送验证码
    sendSms(phone, smsLog.code);
    return 'ok';
  }
}
