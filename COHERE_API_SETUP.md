# Cohere API Integration Setup Guide

This guide explains how to set up and use the Cohere API integration for AI-powered text summarization in your EduSync application.

## Overview

The application now includes AI-powered summarization using Cohere's API. When users view resources, they can generate intelligent summaries that extract key concepts and important details from the content.

## Features

- **Automatic Summary Generation**: Summaries are generated automatically when viewing resources
- **File Content Extraction**: Extracts actual text content from uploaded files (PDFs, Word docs, etc.)
- **Multiple Summary Types**: Support for quick, standard, and detailed summaries
- **Real-time Generation**: Summaries are generated on-demand using Cohere's latest models
- **Educational Focus**: Summaries are tailored for educational content with key concepts and learning objectives
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Security**: API calls are made from the backend to keep API keys secure
- **Fallback Support**: Falls back to metadata if file content extraction fails

## Setup Instructions

### 1. Get a Cohere API Key

1. Visit [Cohere's website](https://cohere.ai/)
2. Sign up for an account
3. Navigate to the API section in your dashboard
4. Generate a new API key
5. Copy the API key for use in your application

### 2. Configure Environment Variables

#### Backend Configuration

Add the following to your backend environment variables or `application.properties`:

```properties
# Cohere API Configuration
cohere.api.key=your_cohere_api_key_here
cohere.api.base-url=https://api.cohere.ai/v1
```

Or set as environment variable:
```bash
export COHERE_API_KEY=your_cohere_api_key_here
```

#### Frontend Configuration (Optional)

If you want to use the frontend service directly (not recommended for production):

```env
VITE_COHERE_API_KEY=your_cohere_api_key_here
```

### 3. Backend Setup

The backend includes the following new components:

- **SummaryController**: REST endpoints for summary generation
- **SummaryService**: Service layer for Cohere API integration
- **FileContentExtractionService**: Service for extracting text from uploaded files
- **Configuration**: Properties for API key and base URL
- **Dependencies**: Apache Tika, PDFBox, and Apache POI for file parsing

### 4. Frontend Setup

The frontend includes:

- **summaryApi.ts**: Service for making API calls to the backend
- **cohereApi.ts**: Direct Cohere API service (for reference)
- **Updated ResourceViewer**: Integration with the summary functionality

## API Endpoints

### Generate Summary for Text
```
POST /api/summary/generate
Content-Type: application/json

{
  "text": "Your text to summarize",
  "type": "standard" // optional: "quick", "standard", "detailed"
}
```

### Generate Summary for Resource
```
POST /api/summary/resource/{resourceId}
```

### Test Content Extraction
```
POST /api/summary/test-extraction/{resourceId}
```

### Health Check
```
GET /api/summary/health
```

## Usage

### In ResourceViewer

1. Navigate to any resource in the application
2. The system will automatically extract content from the uploaded file
3. The AI summary section will generate a summary based on the actual file content
4. If file extraction fails, it will fall back to using the title and description
5. If generation fails, you can click "Regenerate" to try again
6. The summary will appear below the resource viewer with educational insights

### Programmatic Usage

```typescript
import { summaryApi } from '@/services/summaryApi';

// Generate a summary for text
const summary = await summaryApi.generateSummary({
  text: "Your text here",
  type: "standard"
});

// Generate a summary for a resource
const resourceSummary = await summaryApi.generateResourceSummary(resourceId);
```

## Supported File Types

The system can extract text content from the following file types:

- **PDF Documents**: `.pdf`
- **Microsoft Word**: `.doc`, `.docx`
- **Microsoft Excel**: `.xls`, `.xlsx`
- **Microsoft PowerPoint**: `.ppt`, `.pptx`
- **Rich Text Format**: `.rtf`
- **Plain Text**: `.txt`
- **Other text-based formats** supported by Apache Tika

## Configuration Options

### Summary Types

- **Quick**: Short, concise summaries (200 tokens)
- **Standard**: Balanced summaries (500 tokens)
- **Detailed**: Comprehensive summaries (800 tokens)

### Model Parameters

The integration uses Cohere's `command` model with the following default parameters:

- **Temperature**: 0.3 (standard), 0.2 (quick), 0.4 (detailed)
- **Max Tokens**: 500 (standard), 200 (quick), 800 (detailed)
- **Top P**: 0.75
- **Frequency Penalty**: 0.0
- **Presence Penalty**: 0.0

## Error Handling

The integration includes comprehensive error handling for:

- Invalid API keys
- Rate limiting
- Network errors
- Invalid responses
- Resource not found errors

## Security Considerations

1. **API Key Security**: API keys are stored securely on the backend
2. **Input Validation**: All inputs are validated before processing
3. **Rate Limiting**: Consider implementing rate limiting for production use
4. **Error Messages**: Sensitive information is not exposed in error messages

## Troubleshooting

### Common Issues

1. **"Cohere API key is not configured"**
   - Ensure the `COHERE_API_KEY` environment variable is set
   - Check that the API key is valid and active

2. **"Rate limit exceeded"**
   - Wait a few minutes before trying again
   - Consider upgrading your Cohere plan for higher limits

3. **"Network error"**
   - Check your internet connection
   - Verify that Cohere's API is accessible from your server

4. **"Invalid response format"**
   - This usually indicates a temporary API issue
   - Try again after a few minutes

### Debug Mode

Enable debug logging by setting the log level in `application.properties`:

```properties
logging.level.com.edusync.service.SummaryService=DEBUG
```

## Cost Considerations

- Cohere charges based on token usage
- Monitor your usage in the Cohere dashboard
- Consider implementing caching for frequently accessed resources
- Set appropriate limits for production use

## Future Enhancements

Potential improvements for the integration:

1. **Caching**: Cache summaries to reduce API calls
2. **Batch Processing**: Process multiple resources at once
3. **Custom Prompts**: Allow customization of summary prompts
4. **Summary History**: Store and retrieve previous summaries
5. **Multi-language Support**: Support for different languages
6. **File Type Support**: Extract text from various file formats

## Support

For issues related to:

- **Cohere API**: Contact Cohere support
- **Integration**: Check the application logs and error messages
- **Configuration**: Verify environment variables and API keys

## License

This integration follows the same license as the main EduSync application.
