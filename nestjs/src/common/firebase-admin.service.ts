import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name)
  private authInstance: admin.auth.Auth
  private rtdb: admin.database.Database

  onModuleInit() {
    if (!admin.apps.length) {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      const databaseURL = process.env.FIREBASE_DATABASE_URL || 'https://alfatahsppt-default-rtdb.firebaseio.com'

      if (serviceAccountPath) {
        try {
          const serviceAccount = JSON.parse(
            Buffer.from(serviceAccountPath, 'base64').toString('utf-8'),
          )
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL,
          })
        } catch {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL,
          })
        }
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          databaseURL,
        })
      }
    }

    this.authInstance = admin.auth()
    this.rtdb = admin.database()
    this.logger.log('Firebase Admin initialized (Auth + RTDB)')
  }

  getAuth(): admin.auth.Auth {
    return this.authInstance
  }

  getRtdb(): admin.database.Database {
    return this.rtdb
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return this.authInstance.verifyIdToken(idToken)
  }

  async getUserRole(uid: string): Promise<string> {
    try {
      const snap = await this.rtdb.ref(`roles/${uid}/role`).once('value')
      if (snap.exists()) return snap.val()
    } catch {}
    return 'wali_santri'
  }

  async setUserRole(uid: string, role: string): Promise<void> {
    await this.rtdb.ref(`roles/${uid}`).set({
      role,
      email: '',
      displayName: '',
      updatedAt: new Date().toISOString(),
    })
    this.logger.log(`Role ${role} set for user ${uid} in RTDB`)
  }

  // ── Helpers ──────────────────────────────────────────────

  generateId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < 20; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
  }

  async getList(path: string, orderBy?: string): Promise<any[]> {
    const snap = await this.rtdb.ref(path).once('value')
    const data = snap.val() || {}
    const items = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))
    if (orderBy) {
      items.sort((a: any, b: any) => String(a[orderBy] || '').localeCompare(String(b[orderBy] || '')))
    }
    return items
  }

  async getById(path: string, id: string): Promise<any | null> {
    const snap = await this.rtdb.ref(`${path}/${id}`).once('value')
    if (!snap.exists()) return null
    return { id, ...snap.val() }
  }

  async add(path: string, data: any): Promise<{ id: string } & any> {
    const id = this.generateId()
    await this.rtdb.ref(`${path}/${id}`).set(data)
    return { id, ...data }
  }

  async update(path: string, id: string, data: any): Promise<void> {
    await this.rtdb.ref(`${path}/${id}`).update(data)
  }

  async remove(path: string, id: string): Promise<void> {
    await this.rtdb.ref(`${path}/${id}`).remove()
  }

  async addSub(parentPath: string, parentId: string, subPath: string, data: any): Promise<{ id: string } & any> {
    const id = this.generateId()
    await this.rtdb.ref(`${parentPath}/${parentId}/${subPath}/${id}`).set(data)
    return { id, ...data }
  }

  async getSubList(parentPath: string, parentId: string, subPath: string, orderBy?: string): Promise<any[]> {
    const snap = await this.rtdb.ref(`${parentPath}/${parentId}/${subPath}`).once('value')
    const data = snap.val() || {}
    const items = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) }))
    if (orderBy) {
      items.sort((a: any, b: any) => String(a[orderBy] || '').localeCompare(String(b[orderBy] || '')))
    }
    return items
  }

  async removeSub(parentPath: string, parentId: string, subPath: string, id: string): Promise<void> {
    await this.rtdb.ref(`${parentPath}/${parentId}/${subPath}/${id}`).remove()
  }

  // ── Activity Logging ──────────────────────────────────────

  async logActivity(action: string, user: string, details?: string): Promise<void> {
    try {
      const id = this.generateId()
      await this.rtdb.ref(`activity_logs/${id}`).set({
        action,
        description: details || action,
        user: user || 'System',
        timestamp: new Date().toISOString(),
        icon: this.getIconForAction(action),
        color: this.getColorForAction(action),
      })
    } catch (err) {
      this.logger.warn(`Failed to log activity: ${err.message}`)
    }
  }

  private getIconForAction(action: string): string {
    if (action.includes('Tambah') || action.includes('Buat') || action.includes('Register')) return 'add_circle'
    if (action.includes('Ubah') || action.includes('Update')) return 'edit'
    if (action.includes('Hapus') || action.includes('Delete')) return 'delete'
    if (action.includes('Login')) return 'login'
    if (action.includes('Bayar') || action.includes('Payment')) return 'credit_card'
    if (action.includes('Lapor')) return 'gavel'
    if (action.includes('Absensi')) return 'calendar_month'
    return 'info'
  }

  private getColorForAction(action: string): string {
    if (action.includes('Hapus') || action.includes('Delete')) return '#ba1a1a'
    if (action.includes('Tambah') || action.includes('Buat') || action.includes('Register')) return '#003527'
    if (action.includes('Ubah') || action.includes('Update')) return '#9b4500'
    if (action.includes('Bayar')) return '#2b6954'
    if (action.includes('Lapor')) return '#ba1a1a'
    return '#003527'
  }
}
