import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { Upload } from "./upload.entity";

export class UploadPayload {
  @ApiProperty({
    required: true
  })
  @IsNotEmpty()
  imageData: string;
  @ApiProperty({
    required: true
  })
  @IsNotEmpty()
  @MinLength(5)
  processId: string;
}

export class UploadUpdatePayload {
  @ApiProperty({
    required: true
  })
  @IsNotEmpty()
  data: string;
  @ApiProperty({
    required: true
  })
  @IsNotEmpty()

  id: number;
}
