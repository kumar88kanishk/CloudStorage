// 
import commonIcon from 'assets/images/object-icons/file-icon.svg'
import imagesIcon from 'assets/images/object-icons/image-icon.svg'
import folderIcon from 'assets/images/object-icons/folder-icon.svg'
import xlsxIcon from 'assets/images/object-icons/xlsx-icon.svg'
import docsIcon from 'assets/images/object-icons/word-icon.svg'
import pptIcon from 'assets/images/object-icons/ppt-icon.svg'

export const getIconFromType = (type) => {
  if(!type) return folderIcon;
  switch(type) {
    case "application/pdf":
      return commonIcon;
    case "image/jpeg":
    case "image/vnd.microsoft.icon":
    case "image/gif":
    case "image/bmp":
    case "image/webp":
    case "image/tiff":
    case "image/svg+xml":
    case "image/png":
      return imagesIcon;
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return xlsxIcon;
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return docsIcon;  
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return pptIcon;
    default:
      return commonIcon;
  }
};