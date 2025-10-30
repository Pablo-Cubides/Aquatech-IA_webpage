import React from "react"

interface ErrorModalProps {
  message: string
  onClose: () => void
}

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full flex flex-col items-center">
        <div className="text-red-600 text-3xl mb-2">❌</div>
        <div className="text-gray-800 mb-4 text-center">{message}</div>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={onClose}
          autoFocus
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
