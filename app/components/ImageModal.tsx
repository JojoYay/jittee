'use client'

import { useState } from 'react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
  title: string
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt, title }: ImageModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 max-w-4xl max-h-[90vh] mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Title */}
        <div className="absolute top-4 left-4 z-20">
          <h3 className="text-white text-lg font-semibold bg-black bg-opacity-50 px-3 py-1 rounded">
            {title}
          </h3>
        </div>
        
        {/* Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </div>
  )
} 