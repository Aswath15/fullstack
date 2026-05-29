import { useState, useRef } from 'react'
import { uploadFiles } from '../services/api'
import FileUploadItem from './FileUploadItem'

function UploadArea({ onUploadSuccess }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({})
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    )
    if (selectedFiles.length === 0) {
      alert('Please select PDF files only')
      return
    }
    setFiles(prev => [...prev, ...selectedFiles])
    e.target.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('drag-over')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('drag-over')
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    )
    if (droppedFiles.length === 0) {
      alert('Please drop PDF files only')
      return
    }
    setFiles(prev => [...prev, ...droppedFiles])
  }

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload')
      return
    }

    setUploading(true)
    const isBulkUpload = files.length > 3

    try {
      // Initialize status for all files
      const initialStatus = {}
      files.forEach((file, index) => {
        initialStatus[index] = { progress: 0, status: 'pending' }
      })
      setUploadStatus(initialStatus)

      // Simulate upload progress (in real scenario, this would track actual upload)
      const progressInterval = setInterval(() => {
        setUploadStatus(prev => {
          const newStatus = { ...prev }
          let allComplete = true
          
          Object.keys(newStatus).forEach(key => {
            if (newStatus[key].status === 'uploading') {
              newStatus[key].progress = Math.min(newStatus[key].progress + 10, 90)
            } else if (newStatus[key].status === 'pending') {
              newStatus[key].status = 'uploading'
              newStatus[key].progress = 10
              allComplete = false
            }
          })

          if (allComplete && Object.values(newStatus).every(s => s.status === 'completed')) {
            clearInterval(progressInterval)
          }

          return newStatus
        })
      }, 300)

      // Upload files
      await uploadFiles(files)

      // Complete the upload
      setUploadStatus(prev => {
        const newStatus = { ...prev }
        Object.keys(newStatus).forEach(key => {
          newStatus[key].status = 'completed'
          newStatus[key].progress = 100
        })
        return newStatus
      })

      setTimeout(() => {
        setFiles([])
        setUploadStatus({})
        setUploading(false)
        onUploadSuccess()
      }, 1500)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus(prev => {
        const newStatus = { ...prev }
        Object.keys(newStatus).forEach(key => {
          if (newStatus[key].status !== 'completed') {
            newStatus[key].status = 'failed'
          }
        })
        return newStatus
      })
      setUploading(false)
    }
  }

  const isBulkUpload = files.length > 3
  const allUploaded = files.every((_, i) => uploadStatus[i]?.status === 'completed')

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className="upload-zone border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-all"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-gray-700 font-semibold">Drag and drop your PDFs here</p>
          <p className="text-gray-500 text-sm mt-1">or click to browse</p>
          <p className="text-gray-400 text-xs mt-2">Supports PDF files only</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">
              Selected Files ({files.length})
            </h3>
            {isBulkUpload && !uploading && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                Bulk Upload
              </span>
            )}
          </div>

          {files.map((file, index) => (
            <FileUploadItem
              key={index}
              file={file}
              progress={uploadStatus[index]?.progress || 0}
              status={uploadStatus[index]?.status || 'pending'}
              onRemove={() => handleRemoveFile(index)}
              disabled={uploading}
            />
          ))}
        </div>
      )}

      {/* Upload Status Message */}
      {uploading && isBulkUpload && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            ✓ Upload in progress — processing {files.length} files in background
          </p>
        </div>
      )}

      {allUploaded && files.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">
            ✓ {files.length} {files.length === 1 ? 'file' : 'files'} uploaded successfully
          </p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin-custom mr-2">⟳</span>
            Uploading...
          </span>
        ) : (
          `Upload ${files.length > 0 ? `(${files.length})` : ''}`
        )}
      </button>

      {files.length > 0 && !uploading && (
        <button
          onClick={() => setFiles([])}
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Clear All
        </button>
      )}
    </div>
  )
}

export default UploadArea
