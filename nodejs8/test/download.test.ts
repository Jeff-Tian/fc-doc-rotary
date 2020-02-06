import { download } from '../download'
import assert = require('assert');

const promisify = handler => async (...args: any) => new Promise((resolve, reject) => handler(...args, (err, res) => err ? reject(err) : resolve(res)))

describe('downloads', () => {
    it('downloads', async () => {
        const res = await promisify(download)('http://libre-office.oss-cn-shanghai.aliyuncs.com/10.28%20T%26D%20%E7%94%B0%E6%9D%B0%20WeeklyReport.docx')

        assert(res === 'hello world, from typescript')
    })
})
