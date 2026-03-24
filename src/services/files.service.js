import api from './api'

export const filesService = {
  /**
   * Upload one or more files.
   * @param {FileList | File[]} files
   * @param {(percent: number) => void} [onProgress]
   */
  upload: (files, onProgress) => {
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('files', file))
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    })
  },

  delete: (fileId) =>
    api.delete(`/files/${fileId}`),
}
