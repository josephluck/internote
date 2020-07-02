import {
  CreateExportDTO,
  ExportResponseDTO,
} from "@internote/export-service/types";
import { ApiResponse } from "@internote/lib/lambda";

import { Session } from "../auth/storage";
import { MakeSignedRequest } from "./api";

export function exportNote(makeRequest: MakeSignedRequest) {
  return {
    async markdown(
      session: Session,
      request: CreateExportDTO
    ): ApiResponse<ExportResponseDTO> {
      return makeRequest({
        path: `/export/markdown`,
        method: "POST",
        session,
        body: request,
      });
    },
    async html(
      session: Session,
      request: CreateExportDTO
    ): ApiResponse<ExportResponseDTO> {
      return makeRequest({
        path: `/export/html`,
        method: "POST",
        session,
        body: request,
      });
    },
  };
}
