import React, { useState, useEffect } from 'react';
import { CheckCircle, RefreshCw, X } from 'lucide-react';

interface ProgressModalProps {
  onClose: () => void;
  onViewGeneratedItems: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({ onClose, onViewGeneratedItems }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    'Initializing generation process...',
    'Loading template configurations...',
    'Processing selected documents...',
    'Applying template parameters...',
    'Generating document content...',
    'Finalizing and saving documents...',
    'Generation completed successfully!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          setCurrentStep('Generation completed successfully!');
          clearInterval(interval);
          return 100;
        }
        
        const newProgress = prev + Math.random() * 15;
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(steps[Math.min(stepIndex, steps.length - 1)]);
        
        return Math.min(newProgress, 100);
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isComplete ? 'Generation Complete' : 'Generating Documents'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            {isComplete ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            )}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-2">
                {currentStep}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {isComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-700 font-medium">
                  5 documents have been generated successfully
                </span>
              </div>
              <div className="mt-2 text-sm text-green-600">
                All selected templates have been processed and are ready for review.
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            {isComplete ? '100%' : `${Math.round(progress)}%`} complete
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200 space-x-3">
          {isComplete && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
              <button
                onClick={onViewGeneratedItems}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Generated Items
              </button>
            </>
          )}
          {!isComplete && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};