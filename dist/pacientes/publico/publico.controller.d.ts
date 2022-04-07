import { JwtService } from '@nestjs/jwt';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { VentasService } from '@sanfrancisco/ventas/ventas.service';
import { LoginVentaDTO } from './login-venta.dto';
export declare class PublicoController {
    private readonly ventasService;
    private readonly jwtService;
    constructor(ventasService: VentasService, jwtService: JwtService);
    private logger;
    loginPorVenta(loginVenta: LoginVentaDTO): Promise<{
        access_token: string;
    }>;
    getInfoVenta(ventaSesion: Partial<VentaEntity>): Promise<Partial<VentaEntity>>;
    descargarPdfVenta(ventaSesion: Partial<VentaEntity>, res: any): Promise<void>;
    descargarPdfFactura(): void;
    descargarXmlFactura(): void;
    guardarDatosFacturacion(): void;
}
