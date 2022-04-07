import { MigrationInterface, QueryRunner } from 'typeorm';

export class procCalculoIngresosSucursalesPeriodo1628711031742
  implements MigrationInterface
{
  name = 'procCalculoIngresosSucursalesPeriodo1628711031742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP PROCEDURE IF EXISTS CalculoIngresosSucursalesPeriodo;`,
    );
    await queryRunner.query(`
        CREATE PROCEDURE \`CalculoIngresosSucursalesPeriodo\`(IN fini varchar(50), IN ffin varchar(50))
BEGIN
        DECLARE finished INTEGER DEFAULT 0;
        DECLARE sid int(6) DEFAULT 0;
        DEClARE curId CURSOR FOR SELECT id FROM sucursales WHERE active=1;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;
        
        DROP TABLE IF EXISTS \`tmpReporteVentas\`;
        CREATE TABLE IF NOT EXISTS \`tmpReporteVentas\` (
          \`Num\` INT NOT NULL,
          \`Sucursal\` VARCHAR(45) NULL,
          \`Ingreso\` FLOAT NULL DEFAULT 0,
          \`Gastos\` FLOAT NULL DEFAULT 0,
          \`Voucher\` FLOAT NULL DEFAULT 0,
          \`Caja\` VARCHAR(45) NULL DEFAULT 0,
          \`NumPX\` INT NULL DEFAULT 0,
          \`Estudios\` INT NULL DEFAULT 0
          ) ENGINE=MEMORY;
        
        OPEN curId;
        getId: LOOP
            FETCH curId INTO sid;
            IF finished = 1 THEN 
                LEAVE getId;
            END IF;
            SET @totalCaja=(select sum(p.monto) as totalCaja from pagos p 
                    left join ventas v on p.ventaId = v.id 
                        where 
                            p.estatus = 1 and 
                            p.tipo='EF' and
                            v.sucursalId = sid and
                            p.createdAt between fini and ffin);
                    
            set @totalVoucher = ifnull((select sum(p.monto) from pagos p 
                left join ventas v on p.ventaId = v.id 
                    where 
                        p.estatus = 1 and 
                        p.tipo='TA' and
                        v.sucursalId = sid and
                        p.createdAt between fini and ffin),0);
            set @totalGastos = ifnull((select sum(m.monto) as totalGastos from movimientoscaja m
                left join cajas c on m.cajaId = c.id 
                    where 
                        m.estatus = 1 and 
                        m.tipoMovimiento ='R' and
                        c.sucursalId = sid and
                        m.createdAt between fini and ffin),0);
            set @numEstudios = ifnull((select count(*) as totalEstudios from detalleVentas dv
                left join ventas v on v.id = dv.ventaId
                    where 
                        v.sucursalId = sid and 
                        v.fecha between fini and ffin and
                        v.estatus = 'P'),0);
            set @totalPacientes = ifnull((select count(*) as totalPacientes from ventas 
                where 
                    sucursalId = sid and 
                    fecha between fini and ffin and
                    estatus = 'P'),0);
            set @sucursalNombre = (select nombre from sucursales where id = sid);
            /*Estructura a retornar*/
            insert into tmpReporteVentas select 
                sid as Num,
                @sucursalNombre as Sucursal,
                cast(@totalCaja + @totalVoucher as decimal(10,2)) as Ingreso,
                cast(@totalGastos as decimal(10,2)) as Gastos,
                cast(@totalVoucher as decimal(10,2))as Voucher,
                cast(@totalCaja as decimal(10,2)) as Caja,
                @totalPacientes  as NumPX, 
                @numEstudios as Estudios WHERE @numEstudios > 0;
        END LOOP getId;
        CLOSE curId;
        select * from tmpReporteVentas;
    END
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP PROCEDURE IF EXISTS CalculoIngresosSucursalesPeriodo;`,
    );
  }
}
