# EPIC Payment Gateway Documentation

![EPIC Logo](static/img/epic-logo.svg)

> **Electronic Payment Integrated Console (EPIC)** - Official Developer Documentation for DBKL's payment gateway system.

[![Deploy Status](https://github.com/DBKL/epic-payment-docs/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/DBKL/epic-payment-docs/actions)
[![Documentation](https://img.shields.io/badge/docs-live-green.svg)](https://dbkl.github.io/epic-payment-docs/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🚀 **Quick Links**

- **📖 [Live Documentation](https://dbkl.github.io/epic-payment-docs/)**
- **🔧 [Getting Started Guide](https://dbkl.github.io/epic-payment-docs/getting-started/overview)**
- **💻 [PHP Integration Example](https://dbkl.github.io/epic-payment-docs/examples/php)**
- **📋 [API Reference](https://dbkl.github.io/epic-payment-docs/api/overview)**
- **💼 [Business Guide](https://dbkl.github.io/epic-payment-docs/business/overview)**

## 📋 **About EPIC**

EPIC (Electronic Payment Integrated Console) is DBKL's comprehensive payment gateway solution that enables:

- **🏦 FPX Integration** - Direct online banking payments
- **💳 Credit Card Processing** - Via MIGS gateway
- **🔒 Enterprise Security** - Bank-grade encryption and validation
- **📊 Real-time Reconciliation** - Automated transaction matching
- **🔄 Multi-language Support** - PHP, ASP.NET, Java, Ruby libraries

## 🎯 **Documentation Features**

### **For Developers** 👨‍💻
- Complete integration guides
- Production-ready code examples
- API reference with examples
- Security best practices
- Testing and debugging guides

### **For Business Teams** 💼
- Executive summaries and business cases
- Implementation roadmaps
- Cost-benefit analysis
- Compliance and regulatory guidance
- Success metrics and KPIs

### **For Project Managers** 📊
- Technical requirements
- Timeline estimates
- Resource planning
- Risk assessment
- Go-live checklists

## 🏗️ **Built With**

This documentation is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### **Features**
- 🎨 **Modern Design** - Clean, professional interface
- 📱 **Mobile Responsive** - Perfect on all devices
- 🔍 **Search Functionality** - Fast, client-side search
- 🌙 **Dark Mode** - Eye-friendly reading
- 📊 **Mermaid Diagrams** - Visual workflow representations
- 🎯 **Multiple Audiences** - Tailored content sections

## 🚀 **Local Development**

### **Prerequisites**
- Node.js (v18.0 or higher)
- npm or yarn package manager
- Git for version control

### **Installation**

```bash
# Clone the repository
git clone https://github.com/DBKL/epic-payment-docs.git
cd epic-payment-docs

# Install dependencies
npm install

# Start development server
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### **Building for Production**

```bash
# Generate static files
npm run build

# Serve locally
npm run serve
```

The `build` command generates static content into the `build` directory and can be served using any static contents hosting service.

## 📝 **Contributing to Documentation**

We welcome contributions to improve our documentation! Here's how you can help:

### **Documentation Structure**

```
docs/
├── intro.md                 # Main landing page
├── getting-started/         # Onboarding guides
│   ├── overview.md
│   ├── requirements.md
│   ├── sandbox-setup.md
│   └── first-integration.md
├── integration/             # Technical guides
│   ├── architecture.md
│   ├── flow-diagrams.md
│   ├── payment-modes.md
│   ├── security.md
│   └── testing.md
├── examples/                # Code examples
│   ├── php.md
│   ├── aspnet.md
│   ├── java.md
│   └── ruby.md
├── api/                     # API reference
│   ├── overview.md
│   ├── request-parameters.md
│   ├── response-parameters.md
│   └── error-codes.md
├── business/                # Business guides
│   ├── overview.md
│   ├── executive-summary.md
│   ├── cost-analysis.md
│   └── compliance.md
└── banking/                 # Banking & reconciliation
    ├── bank-list.md
    ├── reconciliation.md
    └── reports.md
```

### **Contributing Guidelines**

1. **Fork the Repository**
   ```bash
   git fork https://github.com/DBKL/epic-payment-docs.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/improve-php-examples
   ```

3. **Make Your Changes**
   - Follow our writing style guide
   - Include code examples where applicable
   - Test your changes locally

4. **Submit a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all checks pass

### **Writing Guidelines**

- **Use Clear Headers** - Structure content with descriptive headings
- **Include Code Examples** - Provide working, tested code samples
- **Add Visual Aids** - Use Mermaid diagrams for complex flows
- **Write for Your Audience** - Consider both technical and business readers
- **Test Everything** - Ensure all links and code examples work

## 🔧 **Customization**

### **Theme Configuration**

The documentation theme can be customized in `docusaurus.config.ts`:

```typescript
const config: Config = {
  title: 'EPIC Payment Gateway',
  tagline: 'Electronic Payment Integrated Console - Developer Documentation',
  // ... other configurations
};
```

### **Adding New Sections**

To add a new documentation section:

1. Create a new directory in `docs/`
2. Add your markdown files
3. Update `sidebars.ts` to include the new section
4. Update navigation in `docusaurus.config.ts`

### **Custom Styling**

CSS customizations can be added to `src/css/custom.css`.

## 📊 **Deployment**

### **Automatic Deployment**

The documentation automatically deploys to GitHub Pages when changes are pushed to the `main` branch using GitHub Actions.

### **Manual Deployment**

```bash
# Deploy to GitHub Pages
npm run deploy
```

## 🤝 **Support & Community**

### **Getting Help**

- **📧 Technical Support**: [tech.support@dbkl.gov.my](mailto:tech.support@dbkl.gov.my)
- **💼 Business Inquiries**: [business@dbkl.gov.my](mailto:business@dbkl.gov.my)
- **📖 Documentation Issues**: [docs@dbkl.gov.my](mailto:docs@dbkl.gov.my)

### **Response Times**

- **Critical Issues**: 2 hours (business hours)
- **General Support**: 4 hours (business hours)
- **Documentation Updates**: 24 hours

### **Business Hours**

- **Malaysia Time**: Monday - Friday, 9:00 AM - 6:00 PM
- **Emergency Support**: Available for production issues

## 📈 **Analytics & Monitoring**

We track documentation usage to improve content quality:

- **Page Views** - Most popular documentation sections
- **Search Queries** - What developers are looking for
- **User Feedback** - Ratings and comments on articles
- **Integration Success** - Metrics from successful implementations

## 🔐 **Security**

### **Reporting Security Issues**

If you discover a security vulnerability in the EPIC payment gateway or documentation, please report it to:

- **Security Team**: [security@dbkl.gov.my](mailto:security@dbkl.gov.my)
- **Response Time**: 24 hours for acknowledgment
- **Disclosure Policy**: Coordinated disclosure with 90-day timeline

### **Documentation Security**

- All code examples are reviewed for security best practices
- Sensitive information is never included in public documentation
- Regular security audits of documentation content

## 📄 **License**

This documentation is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **Attribution**

When using or referencing this documentation:

```
EPIC Payment Gateway Documentation
Copyright (c) 2024 Dewan Bandaraya Kuala Lumpur (DBKL)
Licensed under MIT License
```

## 🎉 **Acknowledgments**

- **DBKL Development Team** - Core platform development
- **Technical Writers** - Documentation creation and maintenance
- **Community Contributors** - Feedback and improvements
- **Docusaurus Team** - Amazing documentation platform

---

## 🚀 **Get Started Today**

Ready to integrate with EPIC? Choose your path:

| Audience | Starting Point | Time Required |
|----------|----------------|---------------|
| **Developers** | [Getting Started Guide](https://dbkl.github.io/epic-payment-docs/getting-started/overview) | 2-4 hours |
| **Business Teams** | [Business Overview](https://dbkl.github.io/epic-payment-docs/business/overview) | 30 minutes |
| **Project Managers** | [Implementation Roadmap](https://dbkl.github.io/epic-payment-docs/business/overview#implementation-roadmap) | 1 hour |

---

<div align="center">

**[🚀 Start Building](https://dbkl.github.io/epic-payment-docs/getting-started/overview) • [💻 View Code Examples](https://dbkl.github.io/epic-payment-docs/examples/php) • [📋 API Reference](https://dbkl.github.io/epic-payment-docs/api/overview)**

Made with ❤️ by the DBKL Development Team

</div>
