import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { FirebaseAdminService } from '../common/firebase-admin.service'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async verifyToken(idToken: string) {
    try {
      const decoded = await this.firebaseAdmin.verifyIdToken(idToken)
      const role = await this.firebaseAdmin.getUserRole(decoded.uid)
      return {
        uid: decoded.uid,
        email: decoded.email,
        role,
        displayName: decoded.name || '',
      }
    } catch {
      throw new UnauthorizedException('Invalid Firebase ID token')
    }
  }

  async register(dto: RegisterDto) {
    const auth = this.firebaseAdmin.getAuth()
    try {
      const userRecord = await auth.createUser({
        email: dto.email,
        password: dto.password,
        displayName: dto.displayName,
      })
      const assignedRole = dto.role || 'wali_santri'
      await this.firebaseAdmin.setUserRole(userRecord.uid, assignedRole)
      const rtdb = this.firebaseAdmin.getRtdb()
      await rtdb.ref(`roles/${userRecord.uid}`).update({
        email: dto.email,
        displayName: dto.displayName,
      })
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: assignedRole,
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException('Email already registered')
      }
      throw error
    }
  }

  async setUserRole(uid: string, role: string) {
    await this.firebaseAdmin.setUserRole(uid, role)
    return { message: `Role ${role} assigned to user ${uid}` }
  }

  async listUsers() {
    const auth = this.firebaseAdmin.getAuth()
    const rtdb = this.firebaseAdmin.getRtdb()
    const result = await auth.listUsers(100)
    const rolesSnap = await rtdb.ref('roles').once('value')
    const rolesMap = rolesSnap.val() || {}
    return result.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      role: rolesMap[u.uid]?.role || 'wali_santri',
      disabled: u.disabled,
      createdAt: u.metadata.creationTime,
    }))
  }

  async getUser(uid: string) {
    const auth = this.firebaseAdmin.getAuth()
    const u = await auth.getUser(uid)
    const role = await this.firebaseAdmin.getUserRole(uid)
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      role,
      disabled: u.disabled,
      createdAt: u.metadata.creationTime,
    }
  }
}
