import { Module, Global, APP_GUARD } from '@nestjs/common'
import { FirebaseAdminService } from './firebase-admin.service'
import { RolesGuard } from './roles.guard'

@Global()
@Module({
  providers: [
    FirebaseAdminService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [FirebaseAdminService],
})
export class CommonModule {}
