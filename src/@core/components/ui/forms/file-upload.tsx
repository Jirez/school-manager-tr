import { useEffect, useState, useCallback } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import type { Accept } from 'react-dropzone'
import { FileText, X, Upload } from 'lucide-react'
import { styled } from 'styled-components'

import Button from '@/@core/components/button'

interface UploaderProps {
  imageURL?: string
  onChange: () => void
  multiple?: boolean
  showActionButtons?: boolean
  accept?: string
  label?: string
  error?: string
  hint?: string
}

const DropzoneContainer = styled.div<{
  $isDragActive?: boolean
  $error?: boolean
}>`
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
`

const DropzoneWrapper = styled.div<{
  $isDragActive?: boolean
  $error?: boolean
}>`
  position: relative;
  width: 100%;
  padding: 2rem;
  border: 2px dashed
    ${({ $error, $isDragActive }) =>
      $error ? '#ea5455' : $isDragActive ? '#7367f0' : '#d0d7de'};
  border-radius: 12px;
  background-color: ${({ $isDragActive }) =>
    $isDragActive ? 'rgba(115, 103, 240, 0.05)' : '#f8f9fa'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: ${({ $error }) => ($error ? '#ea5455' : '#7367f0')};
    background-color: ${({ $isDragActive }) =>
      $isDragActive ? 'rgba(115, 103, 240, 0.1)' : 'rgba(115, 103, 240, 0.03)'};
  }

  .dark-layout & {
    background-color: ${({ $isDragActive }) =>
      $isDragActive ? 'rgba(115, 103, 240, 0.1)' : '#283046'};
    border-color: ${({ $error, $isDragActive }) =>
      $error
        ? '#ea5455'
        : $isDragActive
          ? '#7367f0'
          : 'rgba(115, 103, 240, 0.3)'};

    &:hover {
      border-color: ${({ $error }) => ($error ? '#ea5455' : '#7367f0')};
      background-color: ${({ $isDragActive }) =>
        $isDragActive
          ? 'rgba(115, 103, 240, 0.15)'
          : 'rgba(115, 103, 240, 0.05)'};
    }
  }
`

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`

const IconWrapper = styled.div<{ $error?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $error }) => ($error ? '#ea5455' : '#7367f0')};
  transition: transform 0.2s ease;

  ${DropzoneWrapper}:hover & {
    transform: scale(1.05);
  }

  svg {
    width: 64px;
    height: 64px;
  }
`

const DropzoneTitle = styled.h5`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const DropzoneSubtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
  text-align: center;

  .dark-layout & {
    color: #9ca3af;
  }
`

const FileListContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .dark-layout & {
    background-color: #283046;
    border-color: rgba(115, 103, 240, 0.2);

    &:hover {
      background-color: #2f3648;
      border-color: rgba(115, 103, 240, 0.3);
    }
  }
`

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`

const FilePreview = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f3f4f6;

  .dark-layout & {
    background-color: #1b1e2b;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #6c757d;

    .dark-layout & {
      color: #9ca3af;
    }
  }
`

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const FileName = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const FileSize = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`

const RemoveButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background-color: transparent;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fee2e2;
    color: #dc2626;
  }

  .dark-layout & {
    color: #9ca3af;

    &:hover {
      background-color: rgba(220, 38, 38, 0.2);
      color: #f87171;
    }
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`

const HintText = styled.p`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`

const ErrorText = styled.div`
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: #ea5455;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const FileUpload: FC<UploaderProps> = ({
  onChange,
  imageURL,
  multiple = false,
  showActionButtons = false,
  accept = '*/*',
  label,
  error,
  hint,
}) => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<any[]>(
    imageURL ? [{ name: 'student preview', preview: imageURL }] : [],
  )

  // Parse accept prop to react-dropzone format
  const getAcceptConfig = (): Accept | undefined => {
    if (!accept || accept === '*/*') {
      return undefined
    }

    const types: Accept = {}

    // Handle comma-separated values (can be MIME types or extensions)
    accept.split(',').forEach((item) => {
      const trimmed = item.trim()
      if (!trimmed) return

      // If it starts with a dot, it's a file extension
      if (trimmed.startsWith('.')) {
        // Map common extensions to MIME types
        const extMap: { [key: string]: string } = {
          '.txt': 'text/plain',
          '.json': 'application/json',
          '.pdf': 'application/pdf',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.doc': 'application/msword',
          '.docx':
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          '.xls': 'application/vnd.ms-excel',
          '.xlsx':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }

        const mimeType = extMap[trimmed.toLowerCase()]
        if (mimeType) {
          types[mimeType] = []
        }
      } else {
        // It's a MIME type
        types[trimmed] = []
      }
    })

    return Object.keys(types).length > 0 ? types : undefined
  }

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: getAcceptConfig(),
      multiple,
      onDrop: useCallback(
        (acceptedFiles: any[]) => {
          if (acceptedFiles.length === 0) {
            // No files accepted (likely due to MIME type rejection)
            return
          }

          const newFiles = acceptedFiles.map((file: any) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          )

          if (multiple) {
            setFiles((prev) => [...prev, ...newFiles])
            onChange([...files, ...newFiles])
          } else {
            // Clear previous files first
            files.forEach((file) => {
              if (file.preview && file.preview.startsWith('blob:')) {
                URL.revokeObjectURL(file.preview)
              }
            })
            setFiles(newFiles)
            onChange(newFiles)
          }
        },
        [onChange, multiple, files],
      ),
    })

  const renderFilePreview = (file: any) => {
    // Check if it's an image file (by type or by checking the preview)
    const isImage =
      file.type?.startsWith('image/') ||
      (file.preview &&
        (file.preview.startsWith('blob:') ||
          file.preview.startsWith('data:image')))

    if (isImage && file.preview) {
      return <img alt={file.name} src={file.preview} />
    } else {
      return <FileText size={24} />
    }
  }

  const handleRemoveFile = (file: any) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i) => i.name !== file.name)
    setFiles([...filtered])
    onChange([...filtered])
  }

  const renderFileSize = (size: number) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} MB`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} KB`
    }
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
    onChange([])
  }

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => {
        if (file.preview && file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview)
        }
      })
    },
    [files],
  )

  const hasError = !!error

  return (
    <DropzoneContainer $error={hasError}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: hasError ? '#ea5455' : '#374151',
          }}
        >
          {label}
        </label>
      )}
      <DropzoneWrapper
        {...getRootProps()}
        $isDragActive={isDragActive}
        $error={hasError}
      >
        <input {...getInputProps()} />
        <DropzoneContent>
          <IconWrapper $error={hasError}>
            <Upload size={64} />
          </IconWrapper>
          <DropzoneTitle>{t('label-uploadTitle')}</DropzoneTitle>
          <DropzoneSubtitle>{t('label-uploadSubTitle')}</DropzoneSubtitle>
        </DropzoneContent>
      </DropzoneWrapper>

      {files.length > 0 && (
        <FileListContainer>
          {files.map((file: any, index) => (
            <FileItem key={`${file.name}-${index}`}>
              <FileDetails>
                <FilePreview>{renderFilePreview(file)}</FilePreview>
                <FileInfo>
                  <FileName>{file.name}</FileName>
                  {file.size && (
                    <FileSize>{renderFileSize(file.size)}</FileSize>
                  )}
                </FileInfo>
              </FileDetails>
              <RemoveButton
                type="button"
                onClick={() => handleRemoveFile(file)}
                aria-label="Remove file"
              >
                <X size={16} />
              </RemoveButton>
            </FileItem>
          ))}
        </FileListContainer>
      )}

      {/* Display file rejection errors for debugging */}
      {fileRejections.length > 0 && (
        <FileListContainer>
          {fileRejections.map(({ file, errors }, index) => (
            <FileItem key={`${file.name}-error-${index}`}>
              <FileDetails>
                <FilePreview>
                  <FileText size={24} style={{ color: '#ea5455' }} />
                </FilePreview>
                <FileInfo>
                  <FileName style={{ color: '#ea5455' }}>
                    {file.name} - Rejected
                  </FileName>
                  <FileSize>{errors.map((e) => e.message).join(', ')}</FileSize>
                </FileInfo>
              </FileDetails>
            </FileItem>
          ))}
        </FileListContainer>
      )}

      {showActionButtons && files.length > 0 && (
        <ActionButtonsContainer>
          <Button color="danger" outline onClick={handleRemoveAllFiles}>
            {t('label-removeAll')}
          </Button>
          <Button color="primary">{t('label-uploadFiles')}</Button>
        </ActionButtonsContainer>
      )}

      {hint && !hasError && <HintText>{hint}</HintText>}

      {hasError && error && <ErrorText>{error}</ErrorText>}
    </DropzoneContainer>
  )
}

export default FileUpload
