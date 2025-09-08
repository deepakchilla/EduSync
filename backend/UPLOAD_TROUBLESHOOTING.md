# File Upload Troubleshooting Guide

## Issues Fixed

1. **CORS Configuration**: Replaced individual @CrossOrigin annotations with a global CORS configuration
2. **File Storage Paths**: Fixed upload directory configuration to use proper paths
3. **Error Handling**: Improved error messages and validation
4. **Directory Creation**: Enhanced directory creation with better error handling

## How to Test

1. **Start the Backend**: Run the Spring Boot application
2. **Check Logs**: Look for these messages in the console:
   - "Created profile pictures directory: [path]"
   - "Created resources directory: [path]"
   - "File stored successfully: [filename] at [path]"

## Common Issues and Solutions

### Issue: "Could not create the directory where the uploaded files will be stored"
**Solution**: Check if the application has write permissions to the uploads directory

### Issue: CORS errors in browser console
**Solution**: The global CORS configuration should handle this. Restart the application after changes.

### Issue: File upload fails silently
**Solution**: Check the backend console logs for detailed error messages

### Issue: Files not appearing in uploads directory
**Solution**: Verify the file.upload-dir property in application.properties points to the correct path

## File Structure
```
uploads/
├── profile-pictures/     # Profile picture uploads
└── resources/           # Resource file uploads
```

## Testing the Upload

1. Use the frontend ResourceUpload component
2. Select a file (max 500MB)
3. Fill in title and description
4. Submit the form
5. Check backend logs for success/error messages
6. Verify file appears in the uploads/resources directory

## Debug Information

The application now logs:
- File upload requests with details
- Directory creation status
- File storage success/failure
- Detailed error messages

## Restart Required

After making configuration changes, restart the Spring Boot application for changes to take effect.
