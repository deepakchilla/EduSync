import { FileText, File, FileImage, FileVideo, FileSpreadsheet, FileCode } from 'lucide-react';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  
  switch (type) {
    case 'pdf':
      return FileText;
    case 'doc':
    case 'docx':
      return FileText;
    case 'ppt':
    case 'pptx':
      return FileText;
    case 'xls':
    case 'xlsx':
      return FileSpreadsheet;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return FileImage;
    case 'mp4':
    case 'avi':
    case 'mov':
      return FileVideo;
    case 'html':
    case 'css':
    case 'js':
    case 'ts':
      return FileCode;
    default:
      return File;
  }
};

export const getFileTypeColor = (fileType: string): string => {
  const type = fileType.toLowerCase();
  
  switch (type) {
    case 'pdf':
      return 'text-red-600 bg-red-100';
    case 'doc':
    case 'docx':
      return 'text-blue-600 bg-blue-100';
    case 'ppt':
    case 'pptx':
      return 'text-orange-600 bg-orange-100';
    case 'xls':
    case 'xlsx':
      return 'text-green-600 bg-green-100';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'text-purple-600 bg-purple-100';
    case 'mp4':
    case 'avi':
    case 'mov':
      return 'text-pink-600 bg-pink-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};