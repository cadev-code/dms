export interface Folder {
  id: number;
  folderName: string;
  parentId: number | null;
  children: Folder[];
}
