import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: String(process.env.JWT_SECRET), // Mismo secreto
        });
      }
    
      async validate(payload: any) {
        return { name: payload.sub, isAdmin: payload.isAdmin };
      }
}
