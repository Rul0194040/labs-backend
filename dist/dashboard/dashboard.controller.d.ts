import { DashboardService } from './dashboard.service';
import { DataResultDTO } from './DTOss/get-data-result.dto';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
export declare class DashboardController {
    private readonly _dashboardservice;
    constructor(_dashboardservice: DashboardService);
    analytics(user: LoginIdentityDTO): Promise<DataResultDTO>;
}
