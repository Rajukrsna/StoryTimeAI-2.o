'use client';

import React, { useState,useEffect } from 'react';
import { X, Edit3, FileText, AlertCircle } from 'lucide-react';
import {submitStoryToBattle} from '@/api/battle';
import type { Submission } from '@/api/battle';
import { createPortal } from 'react-dom';
interface BattleSubmissionModalProps {
  battleId: string;
  battleTitle: string;
  onClose: () => void;
  onSubmissionSuccess: (newSubmission: Submission) => void;
}
const BattleSubmissionModal: React.FC<BattleSubmissionModalProps> = ({
  battleId,
  battleTitle,
  onClose,
  onSubmissionSuccess
}) => {
    const [mounted, setMounted] = useState(false);
     const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  
  useEffect(() => {
    setMounted(true);
    // ✅ Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted) return null;
  
 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update word count for content
    if (name === 'content') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Story content is required';
    } else if (wordCount < 50) {
      newErrors.content = 'Story must be at least 50 words';
    } else if (wordCount > 2000) {
      newErrors.content = 'Story must be less than 2000 words';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting story:', formData);
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
       const response = await submitStoryToBattle(battleId, formData);  
       console.log('Submission response:', response);    
      if (response.success) {
        onSubmissionSuccess(response.submission);
        alert('Story submitted successfully!');
      }
    } catch (error: unknown) {
  if (error instanceof Error) {
    alert(error.message);
  } else {
    alert('Failed to submit story');
  }
} finally {
      setLoading(false);
    }
  };

  const getWordCountColor = () => {
    if (wordCount < 50) return 'text-red-600';
    if (wordCount > 1800) return 'text-yellow-600';
    if (wordCount > 2000) return 'text-red-600';
    return 'text-green-600';
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Edit3 className="w-6 h-6 mr-2" />
              Submit Your Story
            </h2>
            <p className="text-gray-600 mt-1">Battle: {battleTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-2">Submission Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Story must be between 50-2000 words</li>
                  <li>• Must follow the battle theme and requirements</li>
                  <li>• Original content only - no plagiarism</li>
                  <li>• You can only submit once per battle</li>
                  <li>• Submissions cannot be edited after submission</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a compelling title for your story..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Content Textarea */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Story Content *
              </label>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1 text-gray-400" />
                <span className={`text-sm font-medium ${getWordCountColor()}`}>
                  {wordCount} words
                </span>
              </div>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your story here... Let your creativity flow!"
              rows={20}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
            
            {/* Word Count Indicator */}
            <div className="mt-2 flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4">
                <span className={wordCount >= 50 ? 'text-green-600' : 'text-red-600'}>
                  Min: 50 words {wordCount >= 50 ? '✓' : '✗'}
                </span>
                <span className={wordCount <= 2000 ? 'text-green-600' : 'text-red-600'}>
                  Max: 2000 words {wordCount <= 2000 ? '✓' : '✗'}
                </span>
              </div>
              <span className="text-gray-500">
                {wordCount < 50 && `${50 - wordCount} words needed`}
                {wordCount > 2000 && `${wordCount - 2000} words over limit`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    wordCount < 50 ? 'bg-red-400' :
                    wordCount <= 1800 ? 'bg-green-400' :
                    wordCount <= 2000 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min((wordCount / 2000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
           disabled={
              loading ||
              !formData.title.trim() ||
              formData.title.length < 3 ||
              formData.title.length > 100 ||
              !formData.content.trim() ||
              wordCount < 50 ||
              wordCount > 2000
            }
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Submit Story
                </>
              )}
            </button>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> Once you submit your story, you cannot edit or delete it. 
                Please review your work carefully before submitting.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(
    modalContent, document.body
  );

};

export default BattleSubmissionModal;