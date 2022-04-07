"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaEntity = void 0;
const commonEntity_abstract_1 = require("../common/commonEntity.abstract");
const sucursal_entity_1 = require("../sucursales/sucursal.entity");
const typeorm_1 = require("typeorm");
const pagos_entity_1 = require("../pagos/pagos.entity");
const cajas_entity_1 = require("../cajas/cajas.entity");
const facturas_entity_1 = require("../facturas/facturas.entity");
const estadosVentas_enum_1 = require("./estadosVentas.enum");
const zona_enum_1 = require("../sucursales/zona.enum");
const estadosCancelacion_enum_1 = require("./estadosCancelacion.enum");
const users_entity_1 = require("../users/users.entity");
const pacientes_entity_1 = require("../pacientes/pacientes.entity");
const clientes_entity_1 = require("../clientes/clientes.entity");
const direccionesFiscales_entity_1 = require("./direcciones-fiscales/direccionesFiscales.entity");
const medico_entity_1 = require("../medicos/medico.entity");
const tipoPrecio_enum_1 = require("./tipoPrecio.enum");
let VentaEntity = class VentaEntity extends commonEntity_abstract_1.CommonEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => sucursal_entity_1.SucursalEntity, { nullable: true }),
    __metadata("design:type", sucursal_entity_1.SucursalEntity)
], VentaEntity.prototype, "sucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "sucursalId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => medico_entity_1.MedicoEntity, { nullable: true }),
    __metadata("design:type", medico_entity_1.MedicoEntity)
], VentaEntity.prototype, "medico", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "medicoId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cajas_entity_1.CajaEntity, { nullable: true }),
    __metadata("design:type", cajas_entity_1.CajaEntity)
], VentaEntity.prototype, "caja", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "cajaId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => clientes_entity_1.ClienteEntity, { nullable: true }),
    __metadata("design:type", clientes_entity_1.ClienteEntity)
], VentaEntity.prototype, "cliente", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "clienteId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => direccionesFiscales_entity_1.DireccionFiscalEntity, { nullable: true }),
    __metadata("design:type", direccionesFiscales_entity_1.DireccionFiscalEntity)
], VentaEntity.prototype, "direccionFiscal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "direccionFiscalId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => pacientes_entity_1.PacienteEntity, { nullable: true }),
    __metadata("design:type", pacientes_entity_1.PacienteEntity)
], VentaEntity.prototype, "paciente", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "pacienteId", void 0);
__decorate([
    typeorm_1.OneToMany(() => pagos_entity_1.PagoEntity, (pago) => pago.venta),
    __metadata("design:type", pagos_entity_1.PagoEntity)
], VentaEntity.prototype, "pagos", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], VentaEntity.prototype, "fecha", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        default: null,
    }),
    __metadata("design:type", String)
], VentaEntity.prototype, "notas", void 0);
__decorate([
    typeorm_1.Column('float', {
        default: 0,
    }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "efectivoRecibido", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "cambio", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "descuento", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "descuentoPesos", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    }),
    __metadata("design:type", String)
], VentaEntity.prototype, "zona", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 1,
        default: estadosVentas_enum_1.EstadosVentas.BORRADOR,
    }),
    __metadata("design:type", String)
], VentaEntity.prototype, "estatus", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 10,
        nullable: true,
    }),
    __metadata("design:type", String)
], VentaEntity.prototype, "estatusCancelacion", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], VentaEntity.prototype, "motivoCancelacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 16, default: null }),
    __metadata("design:type", String)
], VentaEntity.prototype, "folio", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "total", void 0);
__decorate([
    typeorm_1.Column({
        type: 'float',
        default: 0,
    }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "saldo", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], VentaEntity.prototype, "pagado", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], VentaEntity.prototype, "facturado", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], VentaEntity.prototype, "credito", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "diasCredito", void 0);
__decorate([
    typeorm_1.OneToOne(() => facturas_entity_1.FacturaEntity, { nullable: true }),
    __metadata("design:type", facturas_entity_1.FacturaEntity)
], VentaEntity.prototype, "factura", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "facturaId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], VentaEntity.prototype, "usuarioCancelo", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "usuarioCanceloId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], VentaEntity.prototype, "fechaLimiteCredito", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 8, nullable: true }),
    __metadata("design:type", String)
], VentaEntity.prototype, "folioPxLab", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], VentaEntity.prototype, "estudioPx", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], VentaEntity.prototype, "autorizoDescuento", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "autorizoDescuentoId", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], VentaEntity.prototype, "notaDescuento", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], VentaEntity.prototype, "captador", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "captadorId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], VentaEntity.prototype, "vendedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "vendedorId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_entity_1.UsersEntity, { nullable: true }),
    __metadata("design:type", users_entity_1.UsersEntity)
], VentaEntity.prototype, "maquilador", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VentaEntity.prototype, "maquiladorId", void 0);
__decorate([
    typeorm_1.Column({ type: 'date', nullable: true, default: null }),
    __metadata("design:type", Date)
], VentaEntity.prototype, "fechaUltimaRegla", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', default: null, nullable: true }),
    __metadata("design:type", String)
], VentaEntity.prototype, "observaciones", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', default: null, nullable: true }),
    __metadata("design:type", String)
], VentaEntity.prototype, "diagnostico", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 8, default: '' }),
    __metadata("design:type", String)
], VentaEntity.prototype, "acceso", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 10, default: tipoPrecio_enum_1.TipoPrecio.REGULAR }),
    __metadata("design:type", String)
], VentaEntity.prototype, "tipoPrecio", void 0);
VentaEntity = __decorate([
    typeorm_1.Entity('ventas')
], VentaEntity);
exports.VentaEntity = VentaEntity;
//# sourceMappingURL=ventas.entity.js.map