import React from 'react';
import { X, Download, Trash2 } from 'lucide-react';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  userName: string;
  onRemove: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  userName,
  onRemove
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${userName}_profile_picture.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemove = () => {
    onRemove();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {userName}'s Profile Picture
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image */}
        <div className="p-6">
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt={`${userName}'s profile picture`}
              className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={handleRemove}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
