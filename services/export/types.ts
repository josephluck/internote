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
  | IdeBlock;

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

export interface IdeBlock {
  object: "block";
  type: "ide";
  data: {
    // TODO: add language
    content: string;
  };
  nodes: SchemaInline[]; // TODO: IDE blocks have an empty text node that they should not have
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
