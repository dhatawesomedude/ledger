import { Service } from 'typedi'
import { Get, JsonController, QueryParams } from 'routing-controllers'
import { LedgerFactory, LineItem } from '../services/Ledger'
import { LedgerRequestDto } from '../dto/LedgerDto'

@Service()
@JsonController()
export class LedgerController {

    public constructor() {
    }
    @Get('/')
    public getAll() {
        return [{a: 'a'}]
    }
    @Get('/ledger')
    public getLedger(@QueryParams() {start_date, end_date, frequency, timezone, weekly_rent}: LedgerRequestDto): LineItem[] {
        // return this.ledgerService.LedgerFactory(start_date, end_date, timezone, weekly_rent)
        return LedgerFactory({start_date, end_date, frequency, timezone, weekly_rent}).ledger
    }
}
