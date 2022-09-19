import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Upload } from "./upload.entity";
import { ProcessDocument } from "./googleDocumentAi";
import { UploadPayload, UploadUpdatePayload } from "./uploadPayload";
import {
  paginate,
  Pagination,
  IPaginationOptions
} from "nestjs-typeorm-paginate";

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>
  ) {
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Upload>> {
    return paginate<Upload>(this.uploadRepository, options);
  }

  async get(id: number) {
    return this.uploadRepository.findOne({ id });
  }


  async update(payload: UploadUpdatePayload) {
    return await this.uploadRepository.update({ id: payload.id }, { jsonResult: payload.data });
  }

  async create(payload: UploadPayload) {
    try {
      const upload = new Upload();
      upload.imageData = payload.imageData;
      const json = await ProcessDocument(payload.processId, payload.imageData);
      upload.jsonResult = JSON.stringify(json);
      return await this.uploadRepository.save(upload);
    } catch (e) {
      console.log(e)
    }
  }
}
