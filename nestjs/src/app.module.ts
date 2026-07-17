import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { KeuanganModule } from './keuangan/keuangan.module'
import { AkademikModule } from './akademik/akademik.module'
import { KesantrianModule } from './kesantrian/kesantrian.module'
import { LaporanModule } from './laporan/laporan.module'
import { GuruModule } from './guru/guru.module'
import { MasterDataModule } from './master-data/master-data.module'
import { PsbModule } from './psb/psb.module'
import { AlumniModule } from './alumni/alumni.module'
import { IbadahModule } from './ibadah/ibadah.module'
import { ExtracurricularModule } from './extracurricular/extracurricular.module'
import { KesehatanModule } from './kesehatan/kesehatan.module'

@Module({
  imports: [
    AuthModule,
    KeuanganModule,
    AkademikModule,
    KesantrianModule,
    LaporanModule,
    GuruModule,
    MasterDataModule,
    PsbModule,
    AlumniModule,
    IbadahModule,
    ExtracurricularModule,
    KesehatanModule,
  ],
})
export class AppModule {}
