import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FirebaseAdminService } from './firebase-admin.service'

export const ROLES_KEY = 'roles'
export const AUTH_KEY = 'auth'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
export const Auth = () => SetMetadata(AUTH_KEY, true)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const requiresAuth = this.reflector.getAllAndOverride<boolean>(AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles && !requiresAuth) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header')
    }

    const idToken = authHeader.split('Bearer ')[1]

    try {
      const decodedToken = await this.firebaseAdmin.verifyIdToken(idToken)

      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = await this.firebaseAdmin.getUserRole(decodedToken.uid)
        if (!userRole || !requiredRoles.includes(userRole)) {
          throw new ForbiddenException(
            `Access denied. Required role: ${requiredRoles.join(' or ')}`,
          )
        }
      }

      request.user = decodedToken
      return true
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error
      }
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
