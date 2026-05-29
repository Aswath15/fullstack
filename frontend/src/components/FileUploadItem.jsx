function FileUploadItem({ file, progress, status, onRemove, disabled }) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      case 'uploading':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'failed':
        return '✕'
      case 'uploading':
        return '⟳'
      default:
        return '○'
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center flex-1 min-w-0">
          <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <div className={`ml-2 flex-shrink-0 text-lg font-bold ${getStatusColor()}`}>
          {status === 'uploading' ? (
            <span className="animate-spin-custom inline-block">{getStatusIcon()}</span>
          ) : (
            getStatusIcon()
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            status === 'completed'
              ? 'bg-green-500'
              : status === 'failed'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status Text */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-600">
          {status === 'completed'
            ? 'Uploaded'
            : status === 'failed'
            ? 'Failed'
            : status === 'uploading'
            ? `${progress}%`
            : 'Pending'}
        </span>
        {!disabled && status !== 'completed' && (
          <button
            onClick={onRemove}
            className="text-xs text-red-600 hover:text-red-800 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default FileUploadItem
