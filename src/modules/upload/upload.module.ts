import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { AuthModule, AuthService } from "../auth";
import { UserModule } from "../user";
import { PassportModule } from "@nestjs/passport";


@Module({
  imports: [TypeOrmModule.forFeature([Upload]), UserModule,    PassportModule.register({ defaultStrategy: 'jwt' }),],
  exports: [UploadService],
  providers: [ UploadService],
  controllers:[UploadController]
})
export class UploadModule {}
