export type FileType = "image" | "video" | "audio" | "unknown-file";

export type CreateExportDTO = {
  title: string;
  content: {
    object: "value";
    document: Schema;
  };
};

export interface ExportResponseDTO {
  /**
   * A public-read URL pointing to the output
   * that has been made
   */
  src: string;
}

// TODO: extract FE types from there to lib. Deprecate from here.
export interface Schema {
  object: "document";
  data: {};
  nodes: SchemaBlock[];
}

export type SchemaBlock =
  | HeadingOneBlock
  | HeadingTwoBlock
  | ParagraphBlock
  | BulletedListBlock
  | NumberedListBlock
  | ListItemBlock
  | BlockQuoteBlock
  | MediaBlock;

export type SchemaBlockType = Pick<SchemaBlock, "type">["type"];

export type SchemaInline = TextInline | EmojiInline | TagInline;
export type SchemaNoneTextInline = EmojiInline | TagInline;

export type SchemaInlineType = Pick<SchemaInline, "type">["type"];

export type SchemaMark = BoldMark | ItalicMark | UnderlineMark | CodeMark;

export type SchemaMarkType = Pick<SchemaMark, "type">["type"];

/** Blocks */

export interface HeadingOneBlock {
  object: "block";
  type: "heading-one";
  nodes: SchemaInline[];
}

export interface HeadingTwoBlock {
  object: "block";
  type: "heading-two";
  nodes: SchemaInline[];
}

export interface ParagraphBlock {
  object: "block";
  type: "paragraph";
  data: {
    className: null;
  };
  nodes: SchemaInline[];
}

export interface BulletedListBlock {
  object: "block";
  type: "bulleted-list";
  data: {
    className: null;
  };
  nodes: ListItemBlock[];
}

export interface NumberedListBlock {
  object: "block";
  type: "numbered-list";
  data: {
    className: null;
  };
  nodes: ListItemBlock[];
}

export interface ListItemBlock {
  object: "block";
  type: "list-item";
  data: {
    className: null;
  };
  nodes: SchemaInline[];
}

export interface BlockQuoteBlock {
  object: "block";
  type: "block-quote";
  data: {
    className: null;
  };
  nodes: SchemaInline[];
}

/**
 * NOTE THAT THE BLOCK BELOW IS A MEDIA UPLOAD.
 * The types here refer to strings defined in FileType.
 */

export interface MediaBlock {
  object: "block";
  type: FileType;
  data: {
    /** The file name */
    name: string;
    /** The file key (relative to the root of the service that hosts it) */
    key: string;
    /** The source of the file (full path of the URL to view the file) */
    src: string;
    /** Whether the file has finished uploading or not */
    uploaded: boolean;
  };
  nodes: SchemaInline[]; // TODO: Media blocks should not have child nodes
}

/** Inlines */

export interface TextInline {
  object: "text";
  type: "";
  text: string;
  marks: SchemaMark[];
}

export interface EmojiInline {
  object: "inline";
  type: "emoji";
  data: {
    code: string;
  };
  // TODO: Emojis for some reason have an empty text node child... this should be removed when inserted
}

export interface TagInline {
  object: "inline";
  type: "tag";
  data: {
    tag: string;
  };
  // TODO: Tags for some reason have an empty text node child... this should be removed when inserted
}

/** Marks */

export interface BoldMark {
  object: "mark";
  type: "bold";
  data: {};
}

export interface ItalicMark {
  object: "mark";
  type: "italic";
  data: {};
}

export interface UnderlineMark {
  object: "mark";
  type: "underlined";
  data: {};
}

export interface CodeMark {
  object: "mark";
  type: "code";
  data: {};
}
