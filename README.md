# Domain Swap

<div align="center">

<img src="assets/icon-light.svg" alt="Domain Swap Logo" width="200"/>

[![Mozilla Add-on](https://img.shields.io/amo/v/domain-swap1)](https://addons.mozilla.org/firefox/addon/domain-swap1/)
[![Mozilla Add-on](https://img.shields.io/amo/users/domain-swap1)](https://addons.mozilla.org/firefox/addon/domain-swap1/)
[![Mozilla Add-on](https://img.shields.io/amo/dw/domain-swap1)](https://addons.mozilla.org/firefox/addon/domain-swap1/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

A Firefox extension that automatically redirects domains based on custom patterns. Perfect for developers working with multiple environments or anyone needing to quickly switch between different domain variations.

## Features

- 🔄 Real-time domain redirection
- 📝 Custom regex pattern matching
- 🎯 Per-domain configuration
- 🔒 Secure local storage
- ⚡ Zero performance impact on non-matching domains
- 🌓 Light/Dark theme support

## Installation

### From Firefox Add-ons

1. Visit [Domain Swap on Mozilla Add-ons](https://addons.mozilla.org/firefox/addon/domain-swap1/)
2. Click "Add to Firefox"

### From Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/domain-swap.git
cd domain-swap
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Firefox:
- Navigate to `about:debugging`
- Click "This Firefox"
- Click "Load Temporary Add-on"
- Select any file in the `dist` directory

## Usage

1. Click the Domain Swap icon in your toolbar
2. Add a domain you want to monitor
3. Configure the match and replace patterns
4. Visit a matching URL - it will automatically redirect

### Example Patterns

| Use Case | Match Pattern | Replace Pattern |
|----------|--------------|-----------------|
| Development to Production | `^dev\.(.+)\.com$` | `$1.com` |
| Staging to Local | `^staging\.(.+)\.com$` | `localhost:3000` |
| Domain Swap | `^example\.com$` | `testexample.com` |

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firefox Browser

### Setup Development Environment

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Building for Production

```bash
# Create production build
npm run build
```

## Security

- Report vulnerabilities to [domain-swap-support@rbkv2.in](mailto:domain-swap-support@rbkv2.in)
- All pattern matching is done locally
- No data is sent to external servers
- All storage is local to the browser

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Icons by [Denali Design](https://github.com/denali-design/denali-icons) licensed under MIT License via [SVG Repo](https://www.svgrepo.com/)

## Support

- 🐛 [Issue Tracker](https://github.com/coherent-cache/domain-swap/issues)
- 💬 [Discussions](https://github.com/coherent-cache/domain-swap/discussions)

## Release Notes

### v1.0.0 (2024-11-20)
- Initial release
- Domain pattern matching and replacement
- Per-domain configuration
- Real-time URL redirection
- Secure pattern storage

---

<div align="center">
Made with ❤️ by <a href="https://github.com/coherent-cache">Coherent Cache</a>
</div>
