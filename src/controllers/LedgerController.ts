import { Service } from 'typedi'
import { Get, JsonController, QueryParams } from 'routing-controllers'
import { LedgerFactory, LineItem } from '../services/Ledger'
import { LedgerRequestDto } from '../dto/LedgerDto'

@Service()
@JsonController()
export class LedgerController {
    @Get('/')
    public getAll() {
        return {
            message: 'This is a health check endpoint',
            info: 'The ledger API can be found at /ledger',
        }
    }

    @Get('/ledger')
    public getLedger(
        // eslint-disable-next-line @typescript-eslint/camelcase,camelcase
        @QueryParams() { start_date, end_date, frequency, timezone, weekly_rent }: LedgerRequestDto,
    ): LineItem[] {
        return LedgerFactory({ start_date, end_date, frequency, timezone, weekly_rent }).lineItems
    }
}
