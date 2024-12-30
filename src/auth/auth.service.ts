import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register.user.dto';

@Injectable()
export class AuthService {
  /*  
  RegsiterWithEmail => email, nickname, password => accessToken, refreshToken
  회원가입 후 다시 로그인 방지
  LoginwWithEmail => email, password => accessToken, refreshToken
  로그인 후 사용자 검증 진행
  LoginUser => 1, 2 에서 필요한 acceessToken and refreshToken 반환
  SignToken=> 토큰을 생성하는로직
  AuthenticateWIthEmailAndPassword => 이메일과 비밀번호를 검증하는 로직 => If use is exist, throw err   => return user inof if user is exist
  */
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const SplitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';
    if (SplitToken.length !== 2 || SplitToken[0] !== prefix) {
      throw new UnauthorizedException('Invalid token');
    }
    const token = SplitToken[1];
    return token;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const split = decoded.split(':');
    if (split.length !== 2) {
      throw new UnauthorizedException('Invalid token');
    }
    return { email: split[0], password: split[1] };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: JWT_SECRET });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new UnauthorizedException('token is expired or invalid');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('token is not refresh token');
    }
    return this.signToken(
      { ...decoded, type: 'access', isRefreshToken },
      false,
    );
  }

  signToken(user: Pick<UsersModel, 'id' | 'email'>, isRefreshToken: boolean) {
    const payload = {
      sub: user.id,
      email: user.email,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'id' | 'email'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const foundUser = await this.usersService.getUserByEmail(user.email);
    if (!foundUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('password is not valid');
    }

    return foundUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const foundUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(foundUser);
  }

  async registerWithEmail(user: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, HASH_ROUNDS);
    const newUser = await this.usersService.createUser({
      ...user,
      password: hashedPassword,
    });
    return this.loginUser(newUser);
  }
}
