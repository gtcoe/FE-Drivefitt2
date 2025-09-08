# CDN to Base64 Conversion Scripts

These scripts convert CDN image references in SVG files to embedded base64 data, making the SVGs self-contained and eliminating CORS issues.

## Scripts

### 1. `convert-cdn-to-base64.js`

**Purpose**: Convert a specific SVG file with a known CDN reference.

**Usage**:

```bash
node scripts/convert-cdn-to-base64.js
```

**What it does**:

- Takes `photoCircle2.svg` as input
- Looks for CDN reference to `photoCircle2-extracted-1.webp`
- Converts the local `photoCircle2-extracted-1.webp` to base64
- Replaces CDN reference with base64 data
- Saves as `photoCircle2-embedded.svg`

### 2. `convert-cdn-to-base64-generic.js`

**Purpose**: Process all SVG files in a directory and convert any CDN references found.

**Usage**:

```bash
node scripts/convert-cdn-to-base64-generic.js
```

**What it does**:

- Scans all SVG files in `public/images/pilates-c/`
- Finds any CDN references (cloudfront.net URLs)
- Extracts filenames from CDN URLs
- Checks if corresponding local files exist
- Converts local images to base64
- Replaces CDN references with base64 data
- Saves as `{original-name}-embedded.svg`

### 3. `convert-all-cdn-to-base64.js`

**Purpose**: Comprehensive script to process all SVG files in multiple directories and convert CDN references to base64.

**Usage**:

```bash
node scripts/convert-all-cdn-to-base64.js
```

**What it does**:

- Scans all SVG files in `public/images/aboutUs-c/`, `public/images/personal-training-c/`, and `public/images/pilates-c/`
- Looks for CDN references to extracted images using pattern: `{filename}-extracted-{count}.webp`
- Handles multiple extracted images per SVG (extracted-1, extracted-2, etc.)
- Converts local extracted images to base64
- Replaces CDN references with base64 data
- Saves as `{original-name}-embedded.svg`
- Provides detailed logging and summary statistics

## Benefits

1. **Eliminates CORS Issues**: SVGs with embedded base64 images work everywhere
2. **Self-Contained**: No external dependencies
3. **IDE Compatibility**: Images display properly in IDEs and editors
4. **Offline Support**: SVGs work without internet connection

## File Structure

```
public/images/pilates-c/
├── photoCircle2.svg                    # Original SVG with CDN reference
├── photoCircle2-extracted-1.webp       # Local image file
├── photoCircle2-embedded.svg           # New SVG with embedded base64
└── ... (other files)
```

## Notes

- Original files are never modified
- New files are created with `-embedded` suffix
- Base64 conversion increases file size significantly
- Only processes files that have corresponding local images
