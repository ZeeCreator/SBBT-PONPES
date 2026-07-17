import { Controller, Post, Get, Body, Param, Headers, ForbiddenException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Auth, Roles } from '../common/roles.guard'
import { RegisterDto, SetRoleDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  @Auth()
  async verifyToken(@Headers('authorization') authHeader: string) {
    const idToken = authHeader.split('Bearer ')[1]
    return this.authService.verifyToken(idToken)
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('set-role')
  @Roles('super_admin')
  async setRole(@Body() dto: SetRoleDto) {
    return this.authService.setUserRole(dto.uid, dto.role)
  }

  @Post('bootstrap/set-admin')
  async bootstrapSetAdmin(@Body() body: { uid: string }) {
    if (process.env.VERCEL_ENV !== 'development' && process.env.NODE_ENV !== 'development') {
      throw new ForbiddenException('Bootstrap only available in development')
    }
    await this.authService.setUserRole(body.uid, 'super_admin')
    return { message: `Admin role assigned to ${body.uid}` }
  }

  @Get('bootstrap/users')
  async bootstrapListUsers() {
    if (process.env.VERCEL_ENV !== 'development' && process.env.NODE_ENV !== 'development') {
      throw new ForbiddenException('Bootstrap only available in development')
    }
    return this.authService.listUsers()
  }

  @Get('bootstrap/users/:uid')
  async bootstrapGetUser(@Param('uid') uid: string) {
    if (process.env.VERCEL_ENV !== 'development' && process.env.NODE_ENV !== 'development') {
      throw new ForbiddenException('Bootstrap only available in development')
    }
    return this.authService.getUser(uid)
  }

  @Get('users')
  @Roles('super_admin')
  async listUsers() {
    return this.authService.listUsers()
  }

  @Get('users/:uid')
  @Roles('super_admin')
  async getUser(@Param('uid') uid: string) {
    return this.authService.getUser(uid)
  }
}
