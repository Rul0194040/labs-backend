import { CreateServicioDTO } from './../src/servicios/DTOs/createServicio.dto';
import { CreateServiciosInsumosDTO } from './../src/servicios/DTOs/createServicioInsumo.dto';
import { CreateInsumoDTO } from '@sanfrancisco/insumos/DTOs/createInsumo.dto';
import { CreateTipoInsumoDTO } from './../src/catalogos/tipos-insumos/DTOs/createTipoInsumo.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoginResponseDTO } from '@sanfrancisco/auth/dto/loginresponse.dto';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { ProfileTypes } from '@sanfrancisco/common/enum/profiles.enum';
import { assert } from 'console';
import { SysAdminRules } from '@sanfrancisco/users/rules/sysAdmin-rules.collection';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { CreateSucursalDTO } from '@sanfrancisco/sucursales/dto/createSucursal.dto';
import { GrupoServicioEntity } from '../src/catalogos/grupos-servicios/grupo-servicio.entity';
import { CreateGrupoServiciosDTO } from '@sanfrancisco/catalogos/grupos-servicios/DTOs/createGrupoServicio.dto';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { CreateTipoMuestraDTO } from '../src/catalogos/tipos-muestras/DTOs/createTiposMuestras.dto';
import { TipoMuestraEntity } from '../src/catalogos/tipos-muestras/tipos-muestras.entity';

/*
##     ##    ###    ########  ####    ###    ########  ##       ########  ######  
##     ##   ## ##   ##     ##  ##    ## ##   ##     ## ##       ##       ##    ## 
##     ##  ##   ##  ##     ##  ##   ##   ##  ##     ## ##       ##       ##       
##     ## ##     ## ########   ##  ##     ## ########  ##       ######    ######  
 ##   ##  ######### ##   ##    ##  ######### ##     ## ##       ##             ## 
  ## ##   ##     ## ##    ##   ##  ##     ## ##     ## ##       ##       ##    ## 
   ###    ##     ## ##     ## #### ##     ## ########  ######## ########  ######  
*/
let super_access_token = '';
let superAdminIdentity: LoginIdentityDTO;
let admin_access_token = '';
let adminAdminIdentity: LoginIdentityDTO;
const superUser = {
  email: 'super@dominio.com',
  password: 'password',
};
const adminUser = {
  email: 'admin@dominio.com',
  password: 'password',
};
const newMatriz: CreateSucursalDTO = {
  nombre: 'Matriz',
  descripcion: 'Descripcion de la Matriz',
  esMatriz: true,
};
const newSucursal: CreateSucursalDTO = {
  nombre: 'Sucursal 1',
  descripcion: 'Descripcion de la sucursal 1',
  esMatriz: false,
};
const newTipoInsumo: CreateTipoInsumoDTO = {
  nombre: 'tipo 1',
};
const newGrupoServicios: CreateGrupoServiciosDTO = {
  nombre: 'Grupo 1',
};

const newTipoMuestra: CreateTipoMuestraDTO = {
  nombre: 'test muestra 1',
};

const newInsumos: CreateInsumoDTO = {
  nombre: 'insumo 1',
  tipoInsumo: 0,
};

const newServicio: CreateServicioDTO = {
  clave: 'clave',
  nombre: 'nombre del Servicio',
  precio: 100,
  precioMaquila: 100,
};

const newInsumosServicio: CreateServiciosInsumosDTO = {
  servicio: 0,
  insumo: 0,
  cantidad: 1,
  descuentaMatriz: false,
};

describe('Pruebas Generales', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('Auth', () => {
    /*
    ##    ###    ##     ## ######## ##     ## 
    ##   ## ##   ##     ##    ##    ##     ## 
    ##  ##   ##  ##     ##    ##    ##     ## 
    ## ##     ## ##     ##    ##    ######### 
    ## ######### ##     ##    ##    ##     ## 
    ## ##     ## ##     ##    ##    ##     ## 
    ## ##     ##  #######     ##    ##     ## 
    */
    it(`Super Login`, (done) => {
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: superUser.email, password: superUser.password })
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response: LoginResponseDTO = res.body;
          superAdminIdentity = response.identity;
          expect(response.access_token).toBeDefined();
          expect(superAdminIdentity.email).toBe(superUser.email);
          expect(superAdminIdentity.profile).toBe(ProfileTypes.SUPER);
          super_access_token = `Bearer ${res.body.access_token}`;
          assert(super_access_token, 'No hay token!');
          return done();
        });
    });
    it(`Admin Login`, (done) => {
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminUser.email, password: adminUser.password })
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response: LoginResponseDTO = res.body;
          adminAdminIdentity = response.identity;
          expect(response.access_token).toBeDefined();
          expect(adminAdminIdentity.email).toBe(adminUser.email);
          expect(adminAdminIdentity.profile).toBe(ProfileTypes.SYSADMIN);
          expect(adminAdminIdentity.rules.length).toBe(SysAdminRules.length);
          admin_access_token = `Bearer ${res.body.access_token}`;
          assert(admin_access_token, 'No hay token!');
          return done();
        });
    });
  });

  describe('Catalogos', () => {
    /*
    ##  ######     ###    ########    ###    ##        #######   ######    #######   ######  
    ## ##    ##   ## ##      ##      ## ##   ##       ##     ## ##    ##  ##     ## ##    ## 
    ## ##        ##   ##     ##     ##   ##  ##       ##     ## ##        ##     ## ##       
    ## ##       ##     ##    ##    ##     ## ##       ##     ## ##   #### ##     ##  ######  
    ## ##       #########    ##    ######### ##       ##     ## ##    ##  ##     ##       ## 
    ## ##    ## ##     ##    ##    ##     ## ##       ##     ## ##    ##  ##     ## ##    ## 
    ##  ######  ##     ##    ##    ##     ## ########  #######   ######    #######   ######  
    */
    describe('Grupos de Servicios', () => {
      it(`Crear grupo de servicios`, (done) => {
        request(app.getHttpServer())
          .post('/grupos-servicios')
          .set('Authorization', admin_access_token)
          .send(newGrupoServicios)
          .expect(201)
          .end(function (err, res: request.Response) {
            if (err) {
              console.error(res.body);
              throw err;
            }
            const response: GrupoServicioEntity = res.body;
            expect(response).toBeInstanceOf(Object);
            expect(response.nombre).toBeDefined();
            expect(response.nombre).toBe(newGrupoServicios.nombre);
            return done();
          });
      });

      it(`Paginar grupos de servicios`, (done) => {
        request(app.getHttpServer())
          .post('/grupos-servicios/paginate')
          .set('Authorization', admin_access_token)
          .send({ skip: 0, take: 10 })
          .expect(201)
          .end(function (err, res: request.Response) {
            if (err) {
              console.error(res.body);
              throw err;
            }
            const response = res.body;
            expect(response).toBeInstanceOf(Object);
            expect(response.data.length).toBeGreaterThan(0);
            return done();
          });
      });
    });

    describe('Tipos de Insumos', () => {
      it(`Crear tipos de insumo`, (done) => {
        request(app.getHttpServer())
          .post('/tipos-insumos')
          .set('Authorization', admin_access_token)
          .send(newTipoInsumo)
          .expect(201)
          .end(function (err, res: request.Response) {
            if (err) {
              console.error(res.body);
              throw err;
            }
            const response: GrupoServicioEntity = res.body;
            expect(response).toBeInstanceOf(Object);
            expect(response.nombre).toBeDefined();
            expect(response.nombre).toBe(newTipoInsumo.nombre);
            return done();
          });
      });

      it(`Paginar grupos de servicios`, (done) => {
        request(app.getHttpServer())
          .post('/tipos-insumos/paginate')
          .set('Authorization', admin_access_token)
          .send({ skip: 0, take: 10 })
          .expect(201)
          .end(function (err, res: request.Response) {
            if (err) {
              console.error(res.body);
              throw err;
            }
            const response = res.body;
            console.log(response);
            newInsumos.tipoInsumo = response.data[0].id;
            expect(response).toBeInstanceOf(Object);
            expect(response.data.length).toBeGreaterThan(0);
            return done();
          });
      });
    });

    describe('Tipos de Muestras', () => {
      it(`Crear tipo de muestra`, (done) => {
        request(app.getHttpServer())
          .post('/tipos-muestras')
          .set('Authorization', admin_access_token)
          .send(newTipoMuestra)
          .expect(201)
          .end(function (err, res: request.Response) {
            if (err) {
              console.error(res.body);
              throw err;
            }
            const response: TipoMuestraEntity = res.body;
            expect(response).toBeInstanceOf(Object);
            expect(response.nombre).toBeDefined();
            expect(response.nombre).toBe(newTipoMuestra.nombre);
            return done();
          });
      });
    });

    describe('Tipos de unidades', () => {
      console.log();
    });
  });

  describe('Sucursales', () => {
    /*
    ##  ######  ##     ##  ######  ##     ## ########   ######     ###    ##       ########  ######  
    ## ##    ## ##     ## ##    ## ##     ## ##     ## ##    ##   ## ##   ##       ##       ##    ## 
    ## ##       ##     ## ##       ##     ## ##     ## ##        ##   ##  ##       ##       ##       
    ##  ######  ##     ## ##       ##     ## ########   ######  ##     ## ##       ######    ######  
    ##       ## ##     ## ##       ##     ## ##   ##         ## ######### ##       ##             ## 
    ## ##    ## ##     ## ##    ## ##     ## ##    ##  ##    ## ##     ## ##       ##       ##    ## 
    ##  ######   #######   ######   #######  ##     ##  ######  ##     ## ######## ########  ######  
    */
    it(`Crear Matriz`, (done) => {
      request(app.getHttpServer())
        .post('/sucursales')
        .set('Authorization', admin_access_token)
        .send(newMatriz)
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response: SucursalEntity = res.body;
          expect(response).toBeInstanceOf(Object);
          expect(response.nombre).toBeDefined();
          expect(response.nombre).toBe(newMatriz.nombre);
          return done();
        });
    });

    it(`Crear Matriz - solo debe haber una`, (done) => {
      request(app.getHttpServer())
        .post('/sucursales')
        .set('Authorization', admin_access_token)
        .send(newMatriz)
        .expect(400)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          return done();
        });
    });

    it(`Crear sucursal`, (done) => {
      request(app.getHttpServer())
        .post('/sucursales')
        .set('Authorization', admin_access_token)
        .send(newSucursal)
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response: SucursalEntity = res.body;
          expect(response).toBeInstanceOf(Object);
          expect(response.nombre).toBeDefined();
          expect(response.nombre).toBe(newSucursal.nombre);
          return done();
        });
    });

    it(`Paginar sucursales`, (done) => {
      request(app.getHttpServer())
        .post('/sucursales/paginate')
        .set('Authorization', admin_access_token)
        .send({ skip: 0, take: 10 })
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response = res.body;
          expect(response).toBeInstanceOf(Object);
          expect(response.data.length).toBeGreaterThan(0);
          return done();
        });
    });
  });

  describe('Insumos', () => {
    /*
    ## #### ##    ##  ######  ##     ## ##     ##  #######   ######  
    ##  ##  ###   ## ##    ## ##     ## ###   ### ##     ## ##    ## 
    ##  ##  ####  ## ##       ##     ## #### #### ##     ## ##       
    ##  ##  ## ## ##  ######  ##     ## ## ### ## ##     ##  ######  
    ##  ##  ##  ####       ## ##     ## ##     ## ##     ##       ## 
    ##  ##  ##   ### ##    ## ##     ## ##     ## ##     ## ##    ## 
    ## #### ##    ##  ######   #######  ##     ##  #######   ######  
    */

    it(`Crear insumos`, (done) => {
      request(app.getHttpServer())
        .post('/insumos')
        .set('Authorization', admin_access_token)
        .send(newInsumos)
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response: InsumoEntity = res.body;
          console.log(response);
          expect(response).toBeInstanceOf(Object);
          expect(response.nombre).toBeDefined();
          expect(response.nombre).toBe(newInsumos.nombre);
          return done();
        });
    });

    it(`Paginar insumos`, (done) => {
      request(app.getHttpServer())
        .post('/insumos/paginate')
        .set('Authorization', admin_access_token)
        .send({ skip: 0, take: 10 })
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response = res.body;
          expect(response).toBeInstanceOf(Object);
          expect(response.data.length).toBeGreaterThan(0);
          return done();
        });
    });
  });

  describe('Servicios', () => {
    /*
    /*
    ##  ######  ######## ########  ##     ## ####  ######  ####  #######   ######  
    ## ##    ## ##       ##     ## ##     ##  ##  ##    ##  ##  ##     ## ##    ## 
    ## ##       ##       ##     ## ##     ##  ##  ##        ##  ##     ## ##       
    ##  ######  ######   ########  ##     ##  ##  ##        ##  ##     ##  ######  
    ##       ## ##       ##   ##    ##   ##   ##  ##        ##  ##     ##       ## 
    ## ##    ## ##       ##    ##    ## ##    ##  ##    ##  ##  ##     ## ##    ## 
    ##  ######  ######## ##     ##    ###    ####  ######  ####  #######   ######  
    */
    it(`crear servicio`, (done) => {
      request(app.getHttpServer())
        .post('/servicios')
        .set('Authorization', admin_access_token)
        .send(newServicio)
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response = res.body;
          expect(response).toBeInstanceOf(Object);
          return done();
        });
    });
    it(`add insumos en un servicio`, (done) => {
      request(app.getHttpServer())
        .post('/servicios/add-insumos-servicios')
        .set('Authorization', admin_access_token)
        .send(newInsumosServicio)
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response = res.body;
          expect(response).toBeInstanceOf(Object);
          return done();
        });
    });
    it(`listar insumos por servcio`, (done) => {
      request(app.getHttpServer())
        .post('/servicios/paginate-insumos-servicio')
        .set('Authorization', admin_access_token)
        .send({ skip: 0, take: 10 })
        .expect(201)
        .end(function (err, res: request.Response) {
          if (err) {
            console.error(res.body);
            throw err;
          }
          const response = res.body;
          expect(response).toBeInstanceOf(Object);
          expect(response.data.length).toBeGreaterThan(0);
          return done();
        });
    });
  });
});
