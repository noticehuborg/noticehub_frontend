import { useState, useCallback } from 'react'

const MAX_SIZE_MB = 10

const ALLOWED_TYPES = {
  'application/pdf': 'pdf',
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'docx',
}

/**
 * Manages file attachment state for notice/post creation forms.
 * Validates file type and size, simulates upload progress.
 * TODO: Replace mock upload with filesService.upload(valid, setProgress)
 */
export function useFileUpload() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const addFiles = useCallback(async (rawFiles) => {
    setError(null)
    const valid = []

    for (const f of Array.from(rawFiles)) {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`"${f.name}" exceeds the ${MAX_SIZE_MB} MB limit`)
        continue
      }
      if (!ALLOWED_TYPES[f.type]) {
        setError(`"${f.name}" — unsupported file type (PDF, image, DOCX only)`)
        continue
      }
      valid.push(f)
    }

    if (!valid.length) return

    setUploading(true)
    setProgress(0)

    try {
      // TODO: swap mock with → const { data } = await filesService.upload(valid, setProgress)
      // Mock: simulate upload progress
      await new Promise((resolve) => {
        let p = 0
        const tick = setInterval(() => {
          p += 25
          setProgress(p)
          if (p >= 100) { clearInterval(tick); resolve() }
        }, 120)
      })

      // Mock: build local attachment objects (replace with server response)
      const uploaded = valid.map((f, i) => ({
        id: `local-${Date.now()}-${i}`,
        name: f.name,
        type: ALLOWED_TYPES[f.type],
        size: f.size < 1024 * 1024
          ? `${(f.size / 1024).toFixed(0)} KB`
          : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        url: URL.createObjectURL(f),
      }))

      setFiles((prev) => [...prev, ...uploaded])
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [])

  const removeFile = useCallback((fileId) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === fileId)
      if (file?.url?.startsWith('blob:')) URL.revokeObjectURL(file.url)
      // TODO: also call filesService.delete(fileId) for server-stored files
      return prev.filter((f) => f.id !== fileId)
    })
  }, [])

  const reset = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => { if (f.url?.startsWith('blob:')) URL.revokeObjectURL(f.url) })
      return []
    })
    setError(null)
    setProgress(0)
  }, [])

  return { files, uploading, progress, error, addFiles, removeFile, reset }
}
