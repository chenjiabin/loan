import { ProductDailyStatRepository } from "../repositories";

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
import { repository, CountSchema, Count } from '@loopback/repository';
import { get, param } from '@loopback/rest';


export class ProductDailyStatController {
  constructor(
    @repository(ProductDailyStatRepository)
    public productDailyStatRepository: ProductDailyStatRepository,
  ) { }

  @get('/product-daily-stats/count', {
    responses: {
      '200': {
        description: 'ProductDailyStat model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    }
  })
  async count(
    @param.query.string('name') name: string,
    @param.query.string('startTime') startTime: string,
    @param.query.string('endTime') endTime: string,
    @param.query.string('page') page: number,
  ): Promise<Count> {
    let whereName = ""
    if (name) {
      whereName = `AND P.name LIKE '%${name}%' `
    }

    let whereTime = ""
    if (startTime && endTime) {
      whereTime = `AND S.dateTime>='${startTime}' and S.dateTime<='${endTime}'`
    }

    let result = [{ count: 0 }]
    result = await this.productDailyStatRepository.dataSource.execute(`
      SELECT
        COUNT(*) AS count
      FROM
        LoanProduct P,
        (
          SELECT
            productId,
            uvCnt,
            applyCnt,
            dateTime
          FROM
            ProductDailyStat
          UNION ALL
          SELECT
            A.id,
            COALESCE(B.uvCnt, 0) AS uvCnt,
            COALESCE(C.applyCnt, 0) AS applyCnt,
            (
              date_format(now(), '%Y-%m-%d')
            ) AS dateTime
          FROM
            LoanProduct A
            LEFT JOIN (
              SELECT
                loanProductId AS productId,
                COUNT(
                  DISTINCT(viewRecord.userId)
                ) AS uvCnt
              FROM
                ViewRecord viewRecord
              WHERE
                viewRecord.createTime < unix_timestamp(
                  date_format(now(), '%Y-%m-%d')
                )+ 86400
                AND viewRecord.createTime >= unix_timestamp(
                  date_format(now(), '%Y-%m-%d')
                )
              GROUP BY
                productId
            ) B ON A.id = B.productId
            LEFT JOIN (
              SELECT
                loanProductId AS productId,
                COUNT(
                  DISTINCT(applyRecord.userId)
                ) AS applyCnt
              FROM
                ApplyRecord applyRecord
              WHERE
                applyRecord.createTime < unix_timestamp(
                  date_format(now(), '%Y-%m-%d')
                )+ 86400
                AND applyRecord.createTime >= unix_timestamp(
                  date_format(now(), '%Y-%m-%d')
                )
              GROUP BY
                productId
            ) C ON A.id = C.productId
        ) S
      WHERE
        P.id=S.productId
        ${whereName}
        ${whereTime}
      ORDER BY
        dateTime DESC
    `)

    if (!result || result.length == 0) {
      return { count: 0 }
    }
    return result[0]
  }

  @get('/product-daily-stats', {
    responses: {
      '200': {
        description: 'Array of ProductDailyStat model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Object } },
          },
        },
      },
    },
  })
  async find(
    @param.query.string('name') name: string,
    @param.query.string('startTime') startTime: string,
    @param.query.string('endTime') endTime: string,
    @param.query.string('page') page: number,
    @param.query.string('limit') limit: number,
  ): Promise<any> {
    let whereName = ""
    if (name) {
      whereName = `AND P.name LIKE '%${name}%' `
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 20
    }

    let whereTime = ""
    if (startTime && endTime) {
      whereTime = `AND S.dateTime>='${startTime}' and S.dateTime<='${endTime}'`
    }
    return await this.productDailyStatRepository.dataSource.execute(`
      SELECT
        DATE_FORMAT(S.dateTime, '%Y-%m-%d')  AS dateTime,
        P.name AS name,
        S.uvCnt AS uvCnt,
        S.applyCnt AS applyCnt
      FROM
        LoanProduct P,
        (
          SELECT
            productId,
            uvCnt,
            applyCnt,
            dateTime
          FROM
            ProductDailyStat
          UNION ALL
          SELECT
            A.id,
            COALESCE(B.uvCnt, 0) AS uvCnt,
            COALESCE(C.applyCnt, 0) AS applyCnt,
            (
              date_format(now(), '%Y-%m-%d')
            ) AS dateTime
          FROM
            LoanProduct A
            LEFT JOIN (
              SELECT
                loanProductId AS productId,
                COUNT(
                  DISTINCT(viewRecord.userId)
                ) AS uvCnt
              FROM
                ViewRecord viewRecord
              WHERE
                viewRecord.createTime < unix_timestamp(
                  date_format(now(), '%Y-%m-%d')
                )+ 86400
                AND viewRecord.createTime >= unix_timestamp(
                  date_format(now(), '%Y-%m-%d')
                )
              GROUP BY
                productId
            ) B ON A.id = B.productId
            LEFT JOIN (
              SELECT
                loanProductId AS productId,
                COUNT(
                  DISTINCT(applyRecord.userId)
                ) AS applyCnt
              FROM
                ApplyRecord applyRecord
              WHERE
                applyRecord.createTime < unix_timestamp(
                  date_format(now(), '%Y-%m-%d')
                )+ 86400
                AND applyRecord.createTime >= unix_timestamp(
                  date_format(now(), '%Y-%m-%d')
                )
              GROUP BY
                productId
            ) C ON A.id = C.productId
        ) S
      WHERE
        P.id=S.productId
        ${whereName}
        ${whereTime}
      ORDER BY
        dateTime DESC
      LIMIT ${(page - 1) * limit}, ${limit}
    `)
  }
}
