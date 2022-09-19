import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../auth";
import { UploadService } from "./upload.service";
import { UploadPayload, UploadUpdatePayload } from "./uploadPayload";
import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { Upload } from "./upload.entity";


@Controller("api/upload")
@ApiTags("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService
  ) {
  }

  @Get("get")
  @ApiBearerAuth()
  // @UseGuards(AuthGuard())

  @ApiResponse({ status: 200, description: "Successful Response" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async get(@Query("id") id: number): Promise<Upload> {

    return await this.uploadService.get(id);

  }

  @Post("update")
  @ApiBearerAuth()
  // @UseGuards(AuthGuard())

  @ApiResponse({ status: 200, description: "Successful Response" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async update(@Body() payload: UploadUpdatePayload): Promise<any> {

    return await this.uploadService.update(payload);
  }

  @Post("upload")
  @ApiBearerAuth()
  // @UseGuards(AuthGuard())

  @ApiResponse({ status: 200, description: "Successful Response" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async upload(@Body() payload: UploadPayload): Promise<any> {

    try {
      return await this.uploadService.create(payload);
    } catch (e) {
      return { errorMessage: e.message };
    }
  }

  @Post("list")
  @ApiBearerAuth()
  // @UseGuards(AuthGuard())

  @ApiResponse({ status: 200, description: "Successful Response" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async list(@Body() options: IPaginationOptions): Promise<any> {

    return await this.uploadService.paginate(options);
  }
}
