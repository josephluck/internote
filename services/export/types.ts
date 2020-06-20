import { InternoteEditorValue } from "@internote/lib/editor-types";

export type CreateExportDTO = {
  title: string;
  content: InternoteEditorValue;
};

export interface ExportResponseDTO {
  /**
   * A public-read URL pointing to the output
   * that has been made
   */
  src: string;
}
