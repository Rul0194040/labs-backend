import { DataResultDTO } from './DTOss/get-data-result.dto';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
export declare class DashboardService {
    getData(user: LoginIdentityDTO): Promise<DataResultDTO>;
    dashboardAdmin(): Promise<DataResultDTO>;
    dashboardCompras(): Promise<DataResultDTO>;
    dashboardAlmacen(): Promise<DataResultDTO>;
    dashboardSucursal(user: LoginIdentityDTO): Promise<DataResultDTO>;
    dashboardVentas(): Promise<DataResultDTO>;
    dashboardTesorero(): Promise<DataResultDTO>;
}
