export enum BlockType {
  Heading1 = 'h1',
  Heading2 = 'h2',
  Heading3 = 'h3',
  Paragraph = 'p',
  UnorderedList = 'ul',
  Code = 'code',
  Table = 'table',
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
}

export interface Variable {
  id: string;
  key: string;
  value: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}
