submission-checklist.md
# Firefox Add-on Submission Checklist

## Pre-submission Testing
- [ ] Test on Firefox Release version
- [ ] Test on Firefox ESR version
- [ ] Test in Private Browsing mode
- [ ] Verify all permissions are necessary
- [ ] Test with different OS themes (light/dark)
- [ ] Verify memory usage is reasonable
- [ ] Test with various screen sizes

## Code Security
- [ ] Remove all uses of innerHTML
- [ ] Use textContent or createElement instead
- [ ] Validate all user inputs
- [ ] Sanitize regex patterns
- [ ] Use CSP headers
- [ ] Avoid eval() and similar functions
- [ ] Use strict mode in JavaScript files

## Manifest Requirements
- [ ] Correct manifest_version
- [ ] Valid gecko ID
- [ ] Proper version number
- [ ] Accurate permissions list
- [ ] Icons in correct sizes (48px, 96px)
- [ ] Content security policy

## Documentation
- [ ] Clear version notes
- [ ] Usage instructions
- [ ] Known limitations
- [ ] Support contact
- [ ] Privacy policy (if required)
- [ ] Test account details (if required)

## Submission Notes
Version 1.0.0:
- Initial release
- Features:
  - Domain pattern matching and replacement
  - Per-domain configuration
  - Real-time URL redirection
  - Secure pattern storage
- Known limitations:
  - Only works with HTTP/HTTPS URLs
  - Requires page reload for pattern changes
- Testing notes:
  - Test domain: example.com
  - Test pattern: ^example\.com$
  - Expected result: redirects to testexample.com

## Privacy Policy
Domain Swap collects no personal data. All configuration data is stored locally in the browser using the storage API. No data is transmitted to external servers.

## Content Security Policy
```json
"content_security_policy": "script-src 'self'; object-src 'self';"
```

## Required Permissions Justification
- webRequest: Required for URL redirection
- webRequestBlocking: Required for synchronous URL modification
- storage: Required for saving user patterns
- <all_urls>: Required to match and modify any URL

## Version Notes Template
```markdown
Version X.Y.Z
- New features:
  - Feature 1
  - Feature 2
- Bug fixes:
  - Fix 1
  - Fix 2
- Performance improvements:
  - Improvement 1
  - Improvement 2