import fs from 'fs';

export const removeUploadedFile = (path: string) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
