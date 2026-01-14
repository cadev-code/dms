export type DocumentType = 'pdf' | 'word' | 'excel' | 'image' | 'other';

export interface Document {
  id: number;
  documentName: string;
  fileName: string;
  type: DocumentType;
  size: number;
}
