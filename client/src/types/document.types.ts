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
  previewFileName: string | null;
  type: DocumentType;
  size: number;
  ticketNumber: string;
}
