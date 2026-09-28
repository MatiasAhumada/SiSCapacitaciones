jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Admins } from '../admin/entities/admin.entity';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { AuthService } from './auth.service';

describe('AuthService.login', () => {
  it('returns the user profile together with the signed access token', async () => {
    const admin = {
      id: 'admin-1',
      name: 'Matias Ahumada',
      img: 'https://example.com/profile.png',
      password: 'hashed-password',
    };
    const adminsRepository = {
      findOne: jest.fn().mockResolvedValue(admin),
    } as unknown as Repository<Admins>;
    const vendedorRepository = {
      findOne: jest.fn(),
    } as unknown as Repository<Vendedor>;
    const alumnoRepository = {
      findOne: jest.fn(),
    } as unknown as Repository<Alumno>;
    const sign = jest.fn().mockReturnValue('signed-token');
    const jwtService = { sign } as unknown as JwtService;
    const service = new AuthService(
      adminsRepository,
      vendedorRepository,
      alumnoRepository,
      jwtService,
    );

    const result = await service.login('Matias Ahumada', 'password');

    expect(result).toMatchObject({
      id: admin.id,
      name: admin.name,
      img: admin.img,
      isAdmin: true,
      role: 'admin',
      access_token: 'signed-token',
    });
    expect(sign).toHaveBeenCalledWith({
      sub: admin.id,
      isAdmin: true,
      role: 'admin',
    });
  });
});
