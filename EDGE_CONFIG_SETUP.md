# Edge Config Setup Guide

## Required Configuration Values

To display your personal information on the website, you need to configure the following values in your Vercel Edge Config:

### Required Fields:
- `name` - Your full name (e.g., "John Doe")
- `title` - Your professional title (e.g., "Software Engineer", "Product Manager")

### Optional Social Links:
- `linkedin` - Your LinkedIn profile URL (e.g., "https://linkedin.com/in/yourusername")
- `github` - Your GitHub profile URL (e.g., "https://github.com/yourusername")
- `youtube` - Your YouTube channel URL (e.g., "https://youtube.com/@yourchannel")

## How to Set Up Edge Config

1. **Go to your Vercel Dashboard**
   - Navigate to your project
   - Go to Settings → Edge Config

2. **Add Configuration Values**
   ```json
   {
     "name": "Your Name",
     "title": "Your Professional Title",
     "linkedin": "https://linkedin.com/in/yourusername",
     "github": "https://github.com/yourusername",
     "youtube": "https://youtube.com/@yourchannel"
   }
   ```

3. **Deploy Changes**
   - The changes will be automatically deployed
   - Your website will update with the new information

## Notes
- Only social links that are provided will be displayed
- Empty or missing values will be ignored
- The website will show placeholder text if name or title are not provided
- All links open in new tabs for better user experience 