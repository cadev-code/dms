export type DocumentType =
  | 'pdf'
  | 'word'
  | 'excel'
  | 'image'
  | 'powerpoint'
  | 'other';

export interface Document {
  id: number;
  documentName: string;
  fileName: string;
  type: DocumentType;
  size: number;
}
