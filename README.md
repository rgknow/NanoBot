<div align="center"><a name="readme-top"></a>

[![][image-banner]][vercel-link]

# 🤖 NanoBot

**The Next-Generation Educational AI Platform**

An open-source, educational AI platform with comprehensive safety guardrails, supporting STEAM learning, maker workbench integration, and extensible plugin systems with age-appropriate content filtering.

One-click **FREE** deployment of your private educational AI assistant with multi-grade support and parental controls.

**English** · [简体中文](./README.zh-CN.md) · [Official Site][official-site] · [Changelog][changelog] · [Documents][docs] · [Blog][blog] · [Feedback][github-issues-link]

<!-- SHIELD GROUP -->

[![][github-release-shield]][github-release-link]
[![][docker-release-shield]][docker-release-link]
[![][vercel-shield]][vercel-link]
[![][discord-shield]][discord-link]<br/>
[![][codecov-shield]][codecov-link]
[![][github-action-test-shield]][github-action-test-link]
[![][github-action-release-shield]][github-action-release-link]
[![][github-releasedate-shield]][github-releasedate-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]<br>
[![][sponsor-shield]][sponsor-link]

**Share NanoBot Repository**

[![][share-x-shield]][share-x-link]
[![][share-telegram-shield]][share-telegram-link]
[![][share-whatsapp-shield]][share-whatsapp-link]
[![][share-reddit-shield]][share-reddit-link]
[![][share-weibo-shield]][share-weibo-link]
[![][share-mastodon-shield]][share-mastodon-link]
[![][share-linkedin-shield]][share-linkedin-link]

<sup>🎓 Pioneering safe educational AI for students K-12. Built for learning, creating, and exploring with confidence.</sup>

[![][github-trending-shield]][github-trending-url] <br /> <br /> <a href="https://vercel.com/oss"> <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" /> </a>

![][image-overview]

</div>

---

## 📋 Table of Contents

<details>
<summary><kbd>Expand Table of Contents</kbd></summary>

#### TOC

- [🌟 What is NanoBot?](#-what-is-nanobot)
- [🎯 Key Features](#-key-features)
- [🏗️ Platform Architecture](#%EF%B8%8F-platform-architecture)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [📚 User Guide](#-user-guide)
- [🛡️ Safety & Security](#%EF%B8%8F-safety--security)
- [🎓 Educational Features](#-educational-features)
- [🔌 Plugin Ecosystem](#-plugin-ecosystem)
- [⚙️ Configuration](#%EF%B8%8F-configuration)
- [🏫 Institutional Deployment](#-institutional-deployment)
- [🔧 Development & Contributing](#-development--contributing)
- [📖 API Documentation](#-api-documentation)
- [❓ FAQ](#-faq)
- [🤝 Community & Support](#-community--support)

</details>

---

## 🌟 What is NanoBot?

**NanoBot** is a cutting-edge educational AI platform designed specifically for K-12 learning environments. Unlike general-purpose AI chatbots, NanoBot prioritizes **educational safety**, **age-appropriate content**, and **STEAM learning** through comprehensive safety guardrails and educational-first design.

### 🎯 Mission Statement

> Empowering the next generation of learners through safe, intelligent, and engaging AI-powered educational experiences.

### 🏆 Core Values

- **🛡️ Safety First**: Comprehensive content filtering and age-appropriate responses
- **🎓 Educational Excellence**: STEAM-focused curriculum integration
- **🌍 Accessibility**: Multi-language support and inclusive design
- **👥 Community-Driven**: Open-source with educator input
- **🔬 Innovation**: Cutting-edge AI with educational best practices

---

## 🎯 Key Features

### 🛡️ **Advanced Safety Guardrails**
- **Content Filtering**: Real-time inappropriate content detection and blocking
- **Age-Appropriate Responses**: Grade-level specific language and complexity
- **Parental Controls**: Comprehensive monitoring and usage restrictions
- **Violation Tracking**: Detailed safety incident reporting and analytics

### 🎓 **Educational Excellence**
- **STEAM Integration**: Science, Technology, Engineering, Arts, and Mathematics focus
- **Curriculum Alignment**: Standards-based content for K-12 grades
- **Progress Tracking**: Individual student learning analytics
- **Assessment Tools**: Built-in quizzes, assignments, and evaluation systems

### 🔧 **Maker Workbench Integration**
- **Hardware Projects**: ESP32, Arduino, Raspberry Pi integration
- **Block Coding**: Visual programming interface for beginners
- **3D Design**: CAD integration for design thinking projects
- **IoT Learning**: Internet of Things educational modules

### 🌐 **Multi-Modal Learning**
- **Text Conversations**: Natural language educational discussions
- **Voice Interaction**: Age-appropriate text-to-speech and speech-to-text
- **Visual Learning**: Image analysis and generation for educational content
- **Document Processing**: PDF, Office files, and educational resource integration

### 🔌 **Extensible Plugin System**
- **Educational Plugins**: Curated marketplace of learning tools
- **MCP Protocol**: Model Context Protocol for seamless integrations
- **Custom Tools**: Institution-specific educational applications
- **Third-Party APIs**: Safe integration with educational services

---

## 🏗️ Platform Architecture

### 🎯 **High-Level Architecture**

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web App - Next.js 15]
        B[Desktop App - Electron]
        C[Mobile App - PWA]
    end
    
    subgraph "API Gateway Layer"
        D[tRPC Router]
        E[Authentication]
        F[Rate Limiting]
    end
    
    subgraph "Safety Layer"
        G[Guardrail Engine]
        H[Content Filter]
        I[Age Verification]
        J[Violation Tracker]
    end
    
    subgraph "AI Processing Layer"
        K[Model Router]
        L[Context Engine]
        M[Educational RAG]
        N[Response Processor]
    end
    
    subgraph "Data Layer"
        O[(PostgreSQL)]
        P[(PGLite - Client)]
        Q[Vector Store]
        R[File Storage]
    end
    
    subgraph "External Services"
        S[OpenAI/Anthropic]
        T[Educational APIs]
        U[Maker Tools]
        V[Assessment Platforms]
    end
    
    A --> D
    B --> D
    C --> D
    D --> G
    G --> K
    K --> S
    K --> O
    O --> Q
```

### 🧱 **Core Components**

#### **Frontend Architecture**
- **Framework**: Next.js 15 with React 19 and TypeScript
- **UI Library**: Ant Design with educational-themed components
- **State Management**: Zustand with educational slices
- **Styling**: antd-style with CSS-in-JS for theming
- **Build Tools**: Turbopack (dev) / Webpack (production)

#### **Backend Architecture**
- **API Layer**: tRPC with type-safe educational endpoints
- **Database**: Dual-mode PostgreSQL (server) + PGLite (client)
- **ORM**: Drizzle with educational schema definitions
- **Authentication**: NextAuth with role-based access control
- **File Processing**: Multi-format loaders with safety scanning

#### **Safety & Security**
- **Guardrail Engine**: Real-time content analysis and filtering
- **Role-Based Access**: Student, Teacher, Parent, Admin permissions
- **Audit Logging**: Comprehensive interaction tracking
- **Privacy Protection**: COPPA and FERPA compliance features

---

## 🚀 Quick Start Guide

### 📋 **Prerequisites**

- **Node.js** 18+ 
- **pnpm** 8+ (package manager)
- **PostgreSQL** 14+ (for production) or **Docker**
- **Git** for version control

### ⚡ **1-Minute Deployment**

```bash
# Clone repository
git clone https://github.com/rgknow/nanobot.git
cd nanobot

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
pnpm dev
```

Visit `http://localhost:3010` to start your educational AI journey!

### 🐳 **Docker Deployment**

```bash
# Quick start with Docker Compose
docker-compose -f docker-compose/local/docker-compose.yml up -d

# Or build from source
docker build -t nanobot:local .
docker run -p 3010:3010 nanobot:local
```

### 🌍 **Environment Variables**

Create `.env.local` with essential configurations:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/nanobot"

# AI Model Providers
OPENAI_API_KEY="your_openai_key"
ANTHROPIC_API_KEY="your_anthropic_key"

# Educational Platform Settings
EDUCATION_MODE="true"
GRADE_LEVEL_DEFAULT="middle"
SAFETY_LEVEL="strict"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3010"

# Parental Controls
PARENTAL_CONTROLS_ENABLED="true"
CONTENT_FILTER_LEVEL="educational"
```

---

## 📚 User Guide

### 👩‍🎓 **For Students**

#### **Getting Started**
1. **Create Account**: Sign up with grade level and interests
2. **Complete Profile**: Set learning preferences and goals
3. **Start Learning**: Begin conversations with your AI tutor
4. **Track Progress**: Monitor your learning journey and achievements

#### **Learning Features**
- **📝 Homework Help**: Get explanations without direct answers
- **🧪 Science Projects**: Interactive STEAM learning modules
- **💻 Coding Tutorials**: Programming lessons with guided practice
- **🎨 Creative Projects**: Art and design with AI assistance
- **📊 Progress Dashboard**: Visual learning analytics and goals

### 👨‍🏫 **For Teachers**

#### **Classroom Management**
1. **Create Classes**: Set up virtual classrooms with student rosters
2. **Assign Projects**: Create AI-assisted learning assignments
3. **Monitor Progress**: Track individual and class-wide learning metrics
4. **Safety Oversight**: Review AI interactions and safety reports

#### **Curriculum Integration**
- **📚 Lesson Plans**: AI-generated curriculum-aligned content
- **🧮 Assessments**: Automated quiz and assignment generation
- **👥 Collaboration**: Student group projects with AI facilitation
- **📈 Analytics**: Detailed learning outcome analysis

### 👨‍👩‍👧‍👦 **For Parents**

#### **Parental Controls**
1. **Account Setup**: Link to your child's learning account
2. **Safety Settings**: Configure age-appropriate content filters
3. **Usage Monitoring**: Track learning time and interactions
4. **Progress Reports**: Receive weekly learning summaries

#### **Safety Features**
- **🛡️ Content Filtering**: Automatic inappropriate content blocking
- **⏰ Time Limits**: Set daily/weekly usage restrictions
- **📊 Activity Reports**: Detailed interaction summaries
- **🚨 Alert System**: Immediate notifications for safety concerns

### 🏫 **For Administrators**

#### **Institution Management**
1. **School Setup**: Configure institution-wide settings
2. **User Management**: Bulk user creation and role assignment
3. **Policy Configuration**: Set safety and usage policies
4. **Integration Setup**: Connect with existing school systems

#### **Advanced Features**
- **📊 Analytics Dashboard**: Institution-wide learning metrics
- **🔧 Custom Plugins**: Deploy school-specific educational tools
- **🛡️ Compliance Tools**: COPPA, FERPA, and GDPR compliance features
- **💾 Data Management**: Backup, export, and data retention controls

---

## 🛡️ Safety & Security

### 🎯 **Safety-First Design**

NanoBot is built with educational safety as the primary concern, implementing multiple layers of protection:

#### **Content Safety**
- **Real-time Filtering**: Advanced AI-powered content analysis
- **Age Appropriateness**: Grade-level specific response filtering
- **Topic Boundaries**: Educational context enforcement
- **Harmful Content Blocking**: Automatic detection and prevention

#### **Privacy Protection**
- **Data Minimization**: Collect only necessary educational data
- **Encryption**: End-to-end encryption for sensitive information
- **Access Controls**: Role-based permission system
- **Audit Trails**: Comprehensive logging for compliance

#### **Compliance Standards**
- **COPPA Compliance**: Children's Online Privacy Protection Act
- **FERPA Alignment**: Family Educational Rights and Privacy Act
- **GDPR Ready**: European data protection regulations
- **SOC 2 Type II**: Security and availability controls

### 🚨 **Safety Monitoring**

```typescript
// Example: Safety Guardrail Implementation
interface SafetyCheck {
  contentType: 'text' | 'image' | 'file';
  gradeLevel: 'elementary' | 'middle' | 'high';
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'allow' | 'filter' | 'block' | 'escalate';
}

const safetyResult = await checkContent({
  content: userMessage,
  gradeLevel: student.gradeLevel,
  context: 'mathematics_homework'
});
```

---

## 🎓 Educational Features

### 📚 **STEAM Learning Modules**

#### **🔬 Science**
- **Interactive Experiments**: Virtual lab simulations
- **Concept Explanations**: Grade-appropriate scientific concepts
- **Research Projects**: Guided scientific inquiry
- **Data Analysis**: Statistical and scientific data interpretation

#### **💻 Technology**
- **Programming Basics**: Scratch, Python, JavaScript tutorials
- **Digital Literacy**: Safe internet usage and digital citizenship
- **AI Understanding**: How AI works and ethical considerations
- **Cybersecurity**: Age-appropriate security awareness

#### **⚙️ Engineering**
- **Design Thinking**: Problem-solving methodology
- **3D Modeling**: CAD software integration
- **Robotics**: Arduino and Raspberry Pi projects
- **Structural Engineering**: Building and testing designs

#### **🎨 Arts**
- **Digital Art**: AI-assisted creative projects
- **Music Theory**: Composition and analysis tools
- **Storytelling**: Creative writing with AI collaboration
- **Visual Design**: Principles of design and aesthetics

#### **🧮 Mathematics**
- **Problem Solving**: Step-by-step solution guidance
- **Visual Mathematics**: Graphing and geometric visualizations
- **Real-world Applications**: Math in everyday contexts
- **Assessment Tools**: Adaptive testing and progress tracking

### 🏆 **Achievement System**

```typescript
interface EducationalAchievement {
  id: string;
  name: string;
  description: string;
  category: 'stem' | 'creativity' | 'collaboration' | 'problem_solving';
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirements: AchievementCriteria[];
  rewards: BadgeReward[];
}
```

---

## 🔌 Plugin Ecosystem

### 🛍️ **Educational Plugin Marketplace**

Browse a growing library of educational MCP plugins to expand your AI's capabilities and streamline your learning workflows effortlessly. Visit [nanobot.edu/mcp](https://nanobot.edu/mcp) to explore the Educational MCP Marketplace.

#### **Featured Educational Plugins**

| Plugin | Description | Grade Level | Safety Rating |
|--------|-------------|-------------|---------------|
| 🧪 **Lab Simulator** | Virtual chemistry and physics experiments | 6-12 | ⭐⭐⭐⭐⭐ |
| 📐 **Geometry Helper** | Interactive geometric problem solving | 4-12 | ⭐⭐⭐⭐⭐ |
| 🌍 **Geography Explorer** | Interactive world exploration and mapping | K-12 | ⭐⭐⭐⭐⭐ |
| 💻 **Code Coach** | Programming tutorials and debugging help | 6-12 | ⭐⭐⭐⭐⭐ |
| 📚 **Literature Analyzer** | Text analysis and literary device identification | 6-12 | ⭐⭐⭐⭐⭐ |

#### **Plugin Development**

Create custom educational plugins using the MCP protocol:

```typescript
// Example Educational Plugin
export interface EducationalPlugin {
  name: string;
  version: string;
  gradeLevel: GradeLevel[];
  subjects: Subject[];
  safetyRating: number;
  capabilities: PluginCapability[];
  
  execute(request: EducationalRequest): Promise<EducationalResponse>;
  validateSafety(content: any): Promise<SafetyResult>;
}
```

---

## ⚙️ Configuration

### 🎛️ **Educational Settings**

#### **Grade Level Configuration**
```typescript
interface GradeLevelConfig {
  level: 'elementary' | 'middle' | 'high';
  vocabularyComplexity: 1-10;
  conceptDepth: 'basic' | 'intermediate' | 'advanced';
  safetyRestrictions: SafetyRule[];
  allowedTopics: string[];
  blockedTopics: string[];
}
```

#### **Safety Configuration**
```env
# Safety Settings
SAFETY_LEVEL=strict           # strict, moderate, relaxed
CONTENT_FILTER_ENABLED=true
AGE_VERIFICATION_REQUIRED=true
PARENTAL_CONSENT_REQUIRED=true

# Content Filtering
BLOCK_VIOLENCE=true
BLOCK_ADULT_CONTENT=true
BLOCK_PROFANITY=true
EDUCATIONAL_CONTEXT_ONLY=true

# Monitoring
CONVERSATION_LOGGING=true
SAFETY_INCIDENT_ALERTS=true
USAGE_ANALYTICS=true
```

### 🔧 **Advanced Configuration**

#### **AI Model Settings**
```typescript
interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  model: string;
  temperature: number;
  maxTokens: number;
  educationalPrompts: boolean;
  safetyOverrides: SafetyOverride[];
}
```

#### **Database Configuration**
```typescript
interface DatabaseConfig {
  mode: 'client' | 'server' | 'hybrid';
  encryption: boolean;
  backupSchedule: string;
  retentionPolicy: DataRetentionPolicy;
}
```

---

## 🏫 Institutional Deployment

### 🎓 **School District Setup**

#### **1. Infrastructure Requirements**
- **Minimum**: 4 CPU cores, 8GB RAM, 100GB storage
- **Recommended**: 8 CPU cores, 16GB RAM, 500GB SSD
- **Network**: 100 Mbps internet connection
- **Security**: SSL certificate, firewall configuration

#### **2. Deployment Options**

##### **Cloud Deployment**
```bash
# Vercel Deployment
vercel --prod

# AWS Deployment
aws ecs create-cluster --cluster-name nanobot-cluster
```

##### **On-Premises Setup**
```bash
# Docker Compose for schools
docker-compose -f docker-compose/school/docker-compose.yml up -d
```

##### **Hybrid Configuration**
- **Local AI Processing**: On-premises model inference
- **Cloud Safety Services**: Centralized content filtering
- **Data Sovereignty**: Local data storage with cloud backups

#### **3. Student Information System Integration**

```typescript
interface SISIntegration {
  provider: 'schoology' | 'canvas' | 'google_classroom' | 'custom';
  sync: {
    students: boolean;
    classes: boolean;
    assignments: boolean;
    grades: boolean;
  };
  sso: boolean;
  dataMapping: SISDataMapping;
}
```

### 📊 **Analytics & Reporting**

#### **Learning Analytics Dashboard**
- **Student Progress**: Individual learning trajectories
- **Class Performance**: Aggregate classroom metrics
- **Curriculum Alignment**: Standards-based reporting
- **Safety Incidents**: Violation tracking and trends

#### **Administrative Reports**
- **Usage Statistics**: Platform adoption metrics
- **Safety Summary**: Monthly safety incident reports
- **ROI Analysis**: Educational outcome improvements
- **Compliance Audits**: COPPA/FERPA compliance status

---

## 🔧 Development & Contributing

### 🛠️ **Development Environment**

#### **Prerequisites**
- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Git

#### **Development Setup**
```bash
# Clone and install
git clone https://github.com/rgknow/nanobot.git
cd nanobot
pnpm install

# Database setup
pnpm db:generate
pnpm db:migrate

# Start development
pnpm dev
```

#### **Project Structure**
```
nanobot/
├── apps/
│   └── desktop/              # Electron desktop app
├── packages/
│   ├── database/            # Drizzle ORM schemas
│   ├── guardrails/          # Safety enforcement
│   ├── education/           # Educational components
│   └── types/               # TypeScript definitions
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── store/               # Zustand state management
│   └── services/            # API services
└── docs/                    # Documentation
```

### 🧪 **Testing**

#### **Test Categories**
- **Unit Tests**: Component and function testing
- **Integration Tests**: API and database testing
- **Safety Tests**: Guardrail and content filtering
- **E2E Tests**: Complete user workflow testing

#### **Running Tests**
```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# Safety tests
pnpm test:safety

# E2E tests
pnpm test:e2e
```

### 🤝 **Contributing Guidelines**

#### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Educational coding standards
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

#### **Pull Request Process**
1. **Fork & Branch**: Create feature branch from main
2. **Develop**: Implement changes with tests
3. **Safety Review**: Ensure educational safety compliance
4. **Submit PR**: Detailed description and testing evidence
5. **Review**: Community and maintainer feedback
6. **Merge**: Automated deployment to staging

---

## 📖 API Documentation

### 🔌 **tRPC Educational API**

#### **Student Management**
```typescript
// Get student profile
const student = await trpc.education.student.get.query({
  studentId: 'student_123'
});

// Update learning preferences
await trpc.education.student.updatePreferences.mutate({
  studentId: 'student_123',
  subjects: ['mathematics', 'science'],
  difficulty: 'intermediate'
});
```

#### **Safety & Guardrails**
```typescript
// Check content safety
const safetyResult = await trpc.safety.checkContent.query({
  content: 'User message',
  gradeLevel: 'middle',
  context: 'homework_help'
});

// Report safety incident
await trpc.safety.reportIncident.mutate({
  type: 'inappropriate_content',
  severity: 'medium',
  description: 'Detected profanity in chat'
});
```

#### **Educational Content**
```typescript
// Generate learning content
const lesson = await trpc.education.content.generate.mutate({
  subject: 'mathematics',
  topic: 'algebra',
  gradeLevel: 'high',
  difficulty: 'beginner'
});

// Track learning progress
await trpc.education.progress.update.mutate({
  studentId: 'student_123',
  lessonId: 'lesson_456',
  progress: 0.75,
  timeSpent: 1800 // seconds
});
```

### 🛡️ **Safety API Endpoints**

#### **Content Filtering**
```http
POST /api/safety/filter
Content-Type: application/json

{
  "content": "Student message",
  "gradeLevel": "middle",
  "context": "science_homework"
}
```

#### **Parental Controls**
```http
GET /api/safety/parental/controls/:studentId
Authorization: Bearer parent_token

Response:
{
  "timeLimit": 3600,
  "allowedSubjects": ["math", "science"],
  "blockedTopics": ["violence", "adult_content"],
  "supervisionLevel": "strict"
}
```

---

## ❓ FAQ

### 🔒 **Safety & Privacy**

<details>
<summary><strong>How does NanoBot ensure student safety?</strong></summary>

NanoBot implements multiple layers of safety protection:
- **Content Filtering**: Real-time AI-powered inappropriate content detection
- **Age Verification**: Grade-level appropriate responses
- **Violation Tracking**: Comprehensive safety incident monitoring
- **Parental Controls**: Parent oversight and usage restrictions
- **Educational Context**: Strict educational purpose enforcement

</details>

<details>
<summary><strong>What student data is collected and how is it protected?</strong></summary>

NanoBot follows strict privacy principles:
- **Minimal Collection**: Only educationally necessary data
- **Encryption**: All data encrypted in transit and at rest
- **Access Control**: Role-based permissions (student, teacher, parent, admin)
- **Compliance**: COPPA, FERPA, and GDPR aligned
- **Retention**: Configurable data retention policies
- **Transparency**: Clear privacy policies and data usage

</details>

### 🎓 **Educational Features**

<details>
<summary><strong>Which grade levels does NanoBot support?</strong></summary>

NanoBot supports comprehensive K-12 education:
- **Elementary (K-5)**: Basic concepts with visual learning
- **Middle School (6-8)**: Intermediate complexity and project-based learning
- **High School (9-12)**: Advanced topics and college preparation
- **Adaptive**: Automatic difficulty adjustment based on student performance

</details>

<details>
<summary><strong>How does NanoBot integrate with existing curriculum?</strong></summary>

NanoBot aligns with educational standards:
- **Standards Alignment**: Common Core, NGSS, and state standards
- **Curriculum Mapping**: Integration with lesson plans and pacing guides
- **Assessment Integration**: Compatible with existing testing platforms
- **LMS Integration**: Works with Google Classroom, Canvas, Schoology
- **Custom Content**: Institution-specific curriculum support

</details>

### 🔧 **Technical Questions**

<details>
<summary><strong>What are the system requirements for deployment?</strong></summary>

**Minimum Requirements:**
- 4 CPU cores, 8GB RAM, 100GB storage
- PostgreSQL 14+ database
- SSL certificate and domain
- 50 Mbps internet connection

**Recommended for Schools:**
- 8+ CPU cores, 16GB+ RAM, 500GB+ SSD
- Load balancer for high availability
- 100+ Mbps dedicated internet
- Backup and disaster recovery systems

</details>

<details>
<summary><strong>Can NanoBot work offline?</strong></summary>

NanoBot supports hybrid offline/online functionality:
- **Client-side Database**: PGLite for offline data storage
- **Local AI Models**: Optional on-premises model deployment
- **Sync Capability**: Automatic sync when connectivity restored
- **Safety Caching**: Pre-cached safety rules for offline operation
- **Progressive Web App**: Mobile offline functionality

</details>

---

## 🤝 Community & Support

### 💬 **Get Help**

- **📖 Documentation**: [docs.nanobot.edu](https://docs.nanobot.edu)
- **💬 Discord Community**: [discord.gg/nanobot](https://discord.gg/nanobot)
- **📧 Email Support**: support@rgknow.com
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/rgknow/nanobot/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/rgknow/nanobot/discussions)

### 🌟 **Contributing**

We welcome contributions from educators, developers, and the community:

- **🔀 Code Contributions**: Submit pull requests with educational features
- **📝 Documentation**: Help improve guides and tutorials
- **🧪 Testing**: Report bugs and test new features
- **🎨 Design**: UI/UX improvements for educational usability
- **🌍 Translation**: Multi-language support for global education

### 🏆 **Recognition**

Special thanks to our contributors and supporters:

- **🏫 Educational Partners**: Schools and districts using NanoBot
- **👨‍💻 Open Source Contributors**: Community developers and maintainers
- **🎓 Educators**: Teachers providing feedback and guidance
- **👨‍👩‍👧‍👦 Families**: Parents and students helping improve safety features

---

## 📊 **Platform Statistics**

<div align="center">

### 🎯 **Star History**

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=rgknow%2Fnanobot&theme=dark&type=Date">
    <img width="100%" src="https://api.star-history.com/svg?repos=rgknow%2Fnanobot&type=Date">
</picture>

</div>

---

## 🚀 **What's Next**

Transform your educational AI experience with NanoBot's powerful features designed for safe STEAM learning, comprehensive safety guardrails, and creative exploration.

### 🔌 **Educational MCP Integration**

Unlock the full potential of educational AI by enabling safe, secure, and dynamic interactions with maker workbench tools, educational resources, and STEAM learning services. NanoBot's MCP (Model Context Protocol) plugin system creates safe pathways between educational AI and learning ecosystems, enabling unprecedented educational connectivity while maintaining comprehensive safety guardrails.

[![][image-mcp]][mcp-url]

### 📱 **Cross-Platform Educational Experience**

Get the full NanoBot educational experience without browser limitations—comprehensive, focused, and always safe for learning. Our desktop application provides a dedicated environment for educational AI interactions, ensuring optimal performance and minimal distractions for focused learning.

[![][image-desktop]][desktop-url]

### 🎨 **Educational Content Creation**

Experience the power of Claude Artifacts, now integrated into NanoBot with educational safety guardrails. This revolutionary feature expands the boundaries of educational AI interaction, enabling safe real-time creation and visualization of diverse educational content formats.

### 📚 **Educational Knowledge Base**

NanoBot supports educational file upload and knowledge base functionality with comprehensive safety filtering. You can upload various types of educational files including documents, images, audio, and video, as well as create educational knowledge bases, making it convenient for learners to manage and search for educational content. Additionally, you can utilize files and knowledge base features during learning conversations, enabling a richer educational dialogue experience.

> Learn more on [📘 NanoBot Educational Knowledge Base — Safe Learning Resources for STEAM Education](https://rgknow.com/blog/educational-knowledge-base)

### 🤖 **AI Model Provider Support**

In the continuous development of NanoBot, we deeply understand the importance of diversity in model service providers for meeting the educational needs of the learning community when providing safe AI educational services. Therefore, we have expanded our support to multiple model service providers with comprehensive safety filtering, rather than being limited to a single one, in order to offer educators and learners a more diverse and rich selection of educational AI interactions.

In this way, NanoBot can more flexibly adapt to the needs of different educational contexts, while also providing educators and developers with a wider range of choices for safe learning environments.

#### Supported Educational AI Providers

- **[OpenAI](https://nanobot.edu/discover/provider/openai)**: OpenAI is a global leader in artificial intelligence research, with models like the GPT series pushing the frontiers of natural language processing. OpenAI is committed to transforming educational industries through innovative and efficient AI solutions. Their products demonstrate significant performance and cost-effectiveness, widely used in educational research, STEAM learning, and innovative educational applications.

- **[Ollama](https://nanobot.edu/discover/provider/ollama)**: Ollama provides models that cover a wide range of educational fields, including code generation, mathematical operations, multilingual processing, and educational conversational interaction, catering to diverse educational institution-level and localized deployment needs.

- **[Anthropic](https://nanobot.edu/discover/provider/anthropic)**: Anthropic is a company focused on AI research and development, offering a range of advanced language models such as Claude 3.5 Sonnet, Claude 3 Sonnet, Claude 3 Opus, and Claude 3 Haiku. These models achieve an ideal balance between intelligence, speed, and educational cost-effectiveness, suitable for various educational applications from institutional learning workloads to rapid-response educational scenarios.

- **[Google](https://nanobot.edu/discover/provider/google)**: Google's Gemini series represents its most advanced, versatile AI models, developed by Google DeepMind, designed for multimodal educational capabilities, supporting seamless understanding and processing of educational text, code, images, audio, and video.

- **[DeepSeek](https://nanobot.edu/discover/provider/deepseek)**: DeepSeek is a company focused on AI technology research and application, with its latest model DeepSeek-V2.5 integrating educational dialogue and safe code processing capabilities, achieving significant improvements in educational preference alignment, educational writing tasks, and safe instruction following.

- **[Moonshot](https://nanobot.edu/discover/provider/moonshot)**: Moonshot is an open-source platform providing various natural language processing models with a wide range of educational applications, including educational content creation, academic research, intelligent educational recommendations, and safe STEAM learning support.

- **[HuggingFace](https://nanobot.edu/discover/provider/huggingface)**: The HuggingFace Inference API provides a fast and safe way for educators to explore thousands of models for various educational tasks, giving instant access to high-performance educational models across multiple STEAM learning domains.

- **[Cloudflare Workers AI](https://nanobot.edu/discover/provider/cloudflare)**: Run serverless GPU-powered educational machine learning models on Cloudflare's global network with comprehensive safety guardrails.

---

## 💝 Acknowledgments

NanoBot builds upon the excellent foundation of LobeChat and is grateful to the open-source community for their contributions to AI and education.

### 🏆 Special Recognition

- **🏫 Educational Partners**: Forward-thinking schools and districts pioneering AI in education
- **👨‍🏫 Educators**: Teachers worldwide providing invaluable feedback for educational AI
- **👨‍👩‍👧‍👦 Families**: Parents and students helping shape safe AI learning experiences  
- **🔧 Open Source Community**: Developers contributing to the future of educational technology

---

<div align="center">

### 🌟 Built with Love for Education

**NanoBot** - Empowering the next generation through safe, intelligent, and engaging AI-powered learning.

[**🚀 Start Learning →**][vercel-link] · [**📖 Documentation**][docs] · [**🤝 Community**][discord-link]

---

<sup>© 2025 RGKnow. Licensed under the RGKnow Community License.</sup>

</div>

<!-- LINK GROUP -->

- **[OpenAI](https://nanobot.edu/discover/provider/openai)**: OpenAI is a global leader in artificial intelligence research, with models like the GPT series pushing the frontiers of natural language processing. OpenAI is committed to transforming educational industries through innovative and efficient AI solutions. Their products demonstrate significant performance and cost-effectiveness, widely used in educational research, STEAM learning, and innovative educational applications.
- **[Ollama](https://nanobot.edu/discover/provider/ollama)**: Ollama provides models that cover a wide range of educational fields, including code generation, mathematical operations, multilingual processing, and educational conversational interaction, catering to diverse educational institution-level and localized deployment needs.
- **[Anthropic](https://nanobot.edu/discover/provider/anthropic)**: Anthropic is a company focused on AI research and development, offering a range of advanced language models such as Claude 3.5 Sonnet, Claude 3 Sonnet, Claude 3 Opus, and Claude 3 Haiku. These models achieve an ideal balance between intelligence, speed, and educational cost-effectiveness, suitable for various educational applications from institutional learning workloads to rapid-response educational scenarios. Claude 3.5 Sonnet, as their latest model, has excelled in multiple educational evaluations while maintaining comprehensive safety features.
- **[Google](https://nanobot.edu/discover/provider/google)**: Google's Gemini series represents its most advanced, versatile AI models, developed by Google DeepMind, designed for multimodal educational capabilities, supporting seamless understanding and processing of educational text, code, images, audio, and video. Suitable for various educational environments from institutional data centers to mobile educational devices, it significantly enhances the efficiency and educational applicability of AI models.
- **[DeepSeek](https://nanobot.edu/discover/provider/deepseek)**: DeepSeek is a company focused on AI technology research and application, with its latest model DeepSeek-V2.5 integrating educational dialogue and safe code processing capabilities, achieving significant improvements in educational preference alignment, educational writing tasks, and safe instruction following.
- **[Moonshot](https://nanobot.edu/discover/provider/moonshot)**: Moonshot is an open-source platform launched by Beijing Dark Side Technology Co., Ltd., providing various natural language processing models with a wide range of educational applications, including but not limited to educational content creation, academic research, intelligent educational recommendations, and safe STEAM learning support, supporting long educational text processing and complex educational generation tasks.
- **[HuggingFace](https://nanobot.edu/discover/provider/huggingface)**: The HuggingFace Inference API provides a fast and safe way for educators to explore thousands of models for various educational tasks. Whether you are prototyping for a new educational application or experimenting with the capabilities of machine learning in education, this API gives you instant access to high-performance educational models across multiple STEAM learning domains.
- **[Cloudflare Workers AI](https://nanobot.edu/discover/provider/cloudflare)**: Run serverless GPU-powered educational machine learning models on Cloudflare's global network with comprehensive safety guardrails.

---

## 💝 Acknowledgments

NanoBot builds upon the excellent foundation of LobeChat and is grateful to the open-source community for their contributions to AI and education.

### 🏆 Special Recognition

- **🎓 Educational Partners**: Forward-thinking schools and districts pioneering AI in education
- **👨‍🏫 Educators**: Teachers worldwide providing invaluable feedback for educational AI
- **👨‍👩‍👧‍👦 Families**: Parents and students helping shape safe AI learning experiences
- **🔧 Open Source Community**: Developers contributing to the future of educational technology

---

<div align="center">

### 🌟 Built with Love for Education

**NanoBot** - Empowering the next generation through safe, intelligent, and engaging AI-powered learning.

[**🚀 Start Learning →**][vercel-link] · [**📖 Documentation**][docs] · [**🤝 Community**][discord-link]

---

<sup>© 2025 RGKnow. Licensed under the RGKnow Community License.</sup>

</div>

- [👋🏻 Getting Started & Join Our Community](#-getting-started--join-our-community)
- [✨ Features](#-features)
  - [✨ MCP Plugin One-Click Installation](#-mcp-plugin-one-click-installation)
  - [🏪 MCP Marketplace](#-mcp-marketplace)
  - [🖥️ Desktop App](#️-desktop-app)
  - [🌐 Smart Internet Search](#-smart-internet-search)
  - [Chain of Thought](#chain-of-thought)
  - [Branching Conversations](#branching-conversations)
  - [Artifacts Support](#artifacts-support)
  - [File Upload /Knowledge Base](#file-upload-knowledge-base)
  - [Multi-Model Service Provider Support](#multi-model-service-provider-support)
  - [Local Large Language Model (LLM) Support](#local-large-language-model-llm-support)
  - [Model Visual Recognition](#model-visual-recognition)
  - [TTS & STT Voice Conversation](#tts--stt-voice-conversation)
  - [Text to Image Generation](#text-to-image-generation)
  - [Plugin System (Function Calling)](#plugin-system-function-calling)
  - [Agent Market (GPTs)](#agent-market-gpts)
  - [Support Local / Remote Database](#support-local--remote-database)
  - [Support Multi-User Management](#support-multi-user-management)
  - [Progressive Web App (PWA)](#progressive-web-app-pwa)
  - [Mobile Device Adaptation](#mobile-device-adaptation)
  - [Custom Themes](#custom-themes)
  - [`*` What's more](#-whats-more)
- [⚡️ Performance](#️-performance)
- [🛳 Self Hosting](#-self-hosting)
  - [`A` Deploying with Vercel, Zeabur , Sealos or Alibaba Cloud](#a-deploying-with-vercel-zeabur--sealos-or-alibaba-cloud)
  - [`B` Deploying with Docker](#b-deploying-with-docker)
  - [Environment Variable](#environment-variable)
- [📦 Ecosystem](#-ecosystem)
- [🧩 Plugins](#-plugins)
- [⌨️ Local Development](#️-local-development)
- [🤝 Contributing](#-contributing)
- [❤️ Sponsor](#️-sponsor)
- [🔗 More Products](#-more-products)

####

<br/>

</details>

## 👋🏻 Getting Started & Join Our Community

We are a group of e/acc design-engineers, hoping to provide modern design components and tools for AIGC.
By adopting the Bootstrapping approach, we aim to provide developers and users with a more open, transparent, and user-friendly product ecosystem.

Whether for educators, students, or professional developers, RGKnow will be your educational AI playground with comprehensive safety guardrails. Please be aware that NanoBot is currently under active development for educational excellence, and feedback is welcome for any [issues][issues-link] encountered.

| [![][vercel-shield-badge]][vercel-link]   | No installation or registration necessary! Visit our website to experience it firsthand.                           |
| :---------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| [![][discord-shield-badge]][discord-link] | Join our Discord community! This is where you can connect with developers and other enthusiastic users of LobeHub. |

> \[!IMPORTANT]
>
> **Star Us**, You will receive all release notifications from GitHub without any delay \~ ⭐️

[![][image-star]][github-stars-link]

<details>
  <summary><kbd>Star History</kbd></summary>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=rgknow%2Fnanobot&theme=dark&type=Date">
    <img width="100%" src="https://api.star-history.com/svg?repos=rgknow%2Fnanobot&type=Date">
  </picture>
</details>

## ✨ Features

Transform your educational AI experience with NanoBot's powerful features designed for safe STEAM learning, comprehensive safety guardrails, and creative exploration.

![][image-feat-mcp]

### ✨ MCP Plugin One-Click Installation

**Seamlessly Connect Your AI to the World**

Unlock the full potential of educational AI by enabling safe, secure, and dynamic interactions with maker workbench tools, educational resources, and STEAM learning services. NanoBot's MCP (Model Context Protocol) plugin system creates safe pathways between educational AI and learning ecosystems, enabling unprecedented educational connectivity while maintaining comprehensive safety guardrails.

Transform your conversations into powerful workflows by connecting to databases, APIs, file systems, and more. Experience the freedom of AI that truly understands and interacts with your world.

[![][back-to-top]](#readme-top)

![][image-feat-mcp-market]

### 🏪 MCP Marketplace

**Discover, Connect, Extend**

Browse a growing library of educational MCP plugins to expand your educational AI's capabilities and streamline your learning workflows effortlessly. Visit [nanobot.edu/mcp](https://nanobot.edu/mcp) to explore the Educational MCP Marketplace, which offers a curated collection of safe educational integrations that enhance your AI's ability to work with various educational tools and services.

From productivity tools to development environments, discover new ways to extend your AI's reach and effectiveness. Connect with the community and find the perfect plugins for your specific needs.

[![][back-to-top]](#readme-top)

![][image-feat-desktop]

### 🖥️ Desktop App

**Peak Performance, Zero Distractions**

Get the full NanoBot educational experience without browser limitations—comprehensive, focused, and always safe for learning. Our desktop application provides a dedicated environment for educational AI interactions, ensuring optimal performance and minimal distractions for focused learning.

Experience faster response times, better resource management, and a more stable connection to your AI assistant. The desktop app is designed for users who demand the best performance from their AI tools.

[![][back-to-top]](#readme-top)

![][image-feat-web-search]

### 🌐 Smart Internet Search

**Online Knowledge On Demand**

With real-time internet access, your AI keeps up with the world—news, data, trends, and more. Stay informed and get the most current information available, enabling your AI to provide accurate and up-to-date responses.

Access live information, verify facts, and explore current events without leaving your conversation. Your AI becomes a gateway to the world's knowledge, always current and comprehensive.

[![][back-to-top]](#readme-top)

[![][image-feat-cot]][docs-feat-cot]

### [Chain of Thought][docs-feat-cot]

Experience AI reasoning like never before. Watch as complex problems unfold step by step through our innovative Chain of Thought (CoT) visualization. This breakthrough feature provides unprecedented transparency into AI's decision-making process, allowing you to observe how conclusions are reached in real-time.

By breaking down complex reasoning into clear, logical steps, you can better understand and validate the AI's problem-solving approach. Whether you're debugging, learning, or simply curious about AI reasoning, CoT visualization transforms abstract thinking into an engaging, interactive experience.

[![][back-to-top]](#readme-top)

[![][image-feat-branch]][docs-feat-branch]

### [Branching Conversations][docs-feat-branch]

Introducing a more natural and flexible way to chat with AI. With Branch Conversations, your discussions can flow in multiple directions, just like human conversations do. Create new conversation branches from any message, giving you the freedom to explore different paths while preserving the original context.

Choose between two powerful modes:

- **Continuation Mode:** Seamlessly extend your current discussion while maintaining valuable context
- **Standalone Mode:** Start fresh with a new topic based on any previous message

This groundbreaking feature transforms linear conversations into dynamic, tree-like structures, enabling deeper exploration of ideas and more productive interactions.

[![][back-to-top]](#readme-top)

[![][image-feat-artifacts]][docs-feat-artifacts]

### [Artifacts Support][docs-feat-artifacts]

Experience the power of Claude Artifacts, now integrated into NanoBot with educational safety guardrails. This revolutionary feature expands the boundaries of educational AI interaction, enabling safe real-time creation and visualization of diverse educational content formats.

Create and visualize with unprecedented flexibility:

- Generate and display dynamic SVG graphics
- Build and render interactive HTML pages in real-time
- Produce professional documents in multiple formats

[![][back-to-top]](#readme-top)

[![][image-feat-knowledgebase]][docs-feat-knowledgebase]

### [File Upload /Knowledge Base][docs-feat-knowledgebase]

NanoBot supports educational file upload and knowledge base functionality with comprehensive safety filtering. You can upload various types of educational files including documents, images, audio, and video, as well as create educational knowledge bases, making it convenient for learners to manage and search for educational content. Additionally, you can utilize files and knowledge base features during learning conversations, enabling a richer educational dialogue experience.

<https://github.com/user-attachments/assets/faa8cf67-e743-4590-8bf6-ebf6ccc34175>

> \[!TIP]
>
> Learn more on [📘 NanoBot Educational Knowledge Base — Safe Learning Resources for STEAM Education](https://rgknow.com/blog/educational-knowledge-base)

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-privoder]][docs-feat-provider]

### [Multi-Model Service Provider Support][docs-feat-provider]

In the continuous development of NanoBot, we deeply understand the importance of diversity in model service providers for meeting the educational needs of the learning community when providing safe AI educational services. Therefore, we have expanded our support to multiple model service providers with comprehensive safety filtering, rather than being limited to a single one, in order to offer educators and learners a more diverse and rich selection of educational AI interactions.

In this way, NanoBot can more flexibly adapt to the needs of different educational contexts, while also providing educators and developers with a wider range of choices for safe learning environments.

#### Supported Model Service Providers

We have implemented support for the following model service providers:

<!-- PROVIDER LIST -->

- **[OpenAI](https://nanobot.edu/discover/provider/openai)**: OpenAI is a global leader in artificial intelligence research, with models like the GPT series pushing the frontiers of natural language processing. OpenAI is committed to transforming education through innovative and efficient AI solutions. Their products demonstrate significant performance and cost-effectiveness, widely used in educational research, STEAM learning, and innovative educational applications.
- **[Ollama](https://nanobot.edu/discover/provider/ollama)**: Ollama provides models that cover a wide range of educational fields, including code generation, mathematical operations, multilingual processing, and educational conversational interaction, catering to diverse educational institutions and localized STEAM learning deployment needs.
- **[Anthropic](https://lobechat.com/discover/provider/anthropic)**: Anthropic is a company focused on AI research and development, offering a range of advanced language models such as Claude 3.5 Sonnet, Claude 3 Sonnet, Claude 3 Opus, and Claude 3 Haiku. These models achieve an ideal balance between intelligence, speed, and cost, suitable for various applications from enterprise workloads to rapid-response scenarios. Claude 3.5 Sonnet, as their latest model, has excelled in multiple evaluations while maintaining a high cost-performance ratio.
- **[Bedrock](https://nanobot.edu/discover/provider/bedrock)**: Bedrock is a service provided by Amazon AWS, focusing on delivering advanced AI language and visual models for educational institutions. Its model family includes Anthropic's Claude series, Meta's Llama 3.1 series, and more, offering a range of options from lightweight to high-performance, supporting educational tasks such as text generation, educational conversation, and safe image processing for educational institutions of varying scales and needs.
- **[Google](https://nanobot.edu/discover/provider/google)**: Google's Gemini series represents its most advanced, versatile AI models, developed by Google DeepMind, designed for multimodal educational capabilities, supporting seamless understanding and processing of educational text, code, images, audio, and video. Suitable for various educational environments from institutional data centers to mobile educational devices, it significantly enhances the efficiency and educational applicability of AI models.
- **[DeepSeek](https://nanobot.edu/discover/provider/deepseek)**: DeepSeek is a company focused on AI technology research and application, with its latest model DeepSeek-V2.5 integrating educational dialogue and safe code processing capabilities, achieving significant improvements in educational preference alignment, educational writing tasks, and safe instruction following.
- **[Moonshot](https://nanobot.edu/discover/provider/moonshot)**: Moonshot is an open-source platform launched by Beijing Dark Side Technology Co., Ltd., providing various natural language processing models with a wide range of educational applications, including but not limited to educational content creation, academic research, intelligent educational recommendations, and safe STEAM learning support, supporting long educational text processing and complex educational generation tasks.
- **[OpenRouter](https://nanobot.edu/discover/provider/openrouter)**: OpenRouter is a service platform providing access to various cutting-edge large model interfaces with educational safety filtering, supporting OpenAI, Anthropic, LLaMA, and more, suitable for diverse educational development and learning application needs. Educators can flexibly choose the optimal model and pricing based on their educational requirements, enhancing the safe educational AI experience.
- **[HuggingFace](https://nanobot.edu/discover/provider/huggingface)**: The HuggingFace Inference API provides a fast and safe way for educators to explore thousands of models for various educational tasks. Whether you are prototyping for a new educational application or experimenting with the capabilities of machine learning in education, this API gives you instant access to high-performance educational models across multiple STEAM learning domains.
- **[Cloudflare Workers AI](https://nanobot.edu/discover/provider/cloudflare)**: Run serverless GPU-powered educational machine learning models on Cloudflare's global network with comprehensive safety guardrails.

<details><summary><kbd>See more providers (+32)</kbd></summary>

- **[GitHub](https://nanobot.edu/discover/provider/github)**: With GitHub Models, educators and students can become AI engineers and leverage the industry's leading AI models for safe educational purposes.
- **[Novita](https://nanobot.edu/discover/provider/novita)**: Novita AI is a platform providing a variety of large language models and AI image generation API services, flexible, reliable, and cost-effective for education. It supports the latest open-source models like Llama3 and Mistral, offering a comprehensive, user-friendly, and auto-scaling API solution for educational AI application development, suitable for educational institutions and STEAM learning environments.
- **[PPIO](https://nanobot.edu/discover/provider/ppio)**: PPIO supports stable and cost-efficient open-source LLM APIs for education, such as DeepSeek, Llama, Qwen etc., with comprehensive safety filtering for educational environments.
- **[302.AI](https://nanobot.edu/discover/provider/ai302)**: 302.AI is an on-demand AI application platform offering the most comprehensive educational AI APIs and online AI applications available for safe learning environments.
- **[Together AI](https://nanobot.edu/discover/provider/togetherai)**: Together AI is dedicated to achieving leading performance through innovative educational AI models, offering extensive customization capabilities for educational institutions, including rapid scaling support and intuitive deployment processes to meet various educational needs.
- **[Fireworks AI](https://lobechat.com/discover/provider/fireworksai)**: Fireworks AI is a leading provider of advanced language model services, focusing on functional calling and multimodal processing. Its latest model, Firefunction V2, is based on Llama-3, optimized for function calling, conversation, and instruction following. The visual language model FireLLaVA-13B supports mixed input of images and text. Other notable models include the Llama series and Mixtral series, providing efficient multilingual instruction following and generation support.
- **[Groq](https://nanobot.edu/discover/provider/groq)**: Groq's LPU inference engine has excelled in the latest independent large language model (LLM) benchmarks, redefining the standards for educational AI solutions with its remarkable speed and efficiency. Groq represents instant inference speed, demonstrating strong performance in cloud-based educational deployments.
- **[Perplexity](https://nanobot.edu/discover/provider/perplexity)**: Perplexity is a leading provider of conversational generation models for education, offering various advanced Llama 3.1 models with educational safety filtering that support both online and offline educational applications, particularly suited for complex educational natural language processing tasks.
- **[Mistral](https://lobechat.com/discover/provider/mistral)**: Mistral provides advanced general, specialized, and research models widely used in complex reasoning, multilingual tasks, and code generation. Through functional calling interfaces, users can integrate custom functionalities for specific applications.
- **[ModelScope](https://lobechat.com/discover/provider/modelscope)**: ModelScope is a model-as-a-service platform launched by Alibaba Cloud, offering a wide range of AI models and inference services.
- **[Ai21Labs](https://lobechat.com/discover/provider/ai21)**: AI21 Labs builds foundational models and AI systems for enterprises, accelerating the application of generative AI in production.
- **[Upstage](https://lobechat.com/discover/provider/upstage)**: Upstage focuses on developing AI models for various business needs, including Solar LLM and document AI, aiming to achieve artificial general intelligence (AGI) for work. It allows for the creation of simple conversational agents through Chat API and supports functional calling, translation, embedding, and domain-specific applications.
- **[xAI (Grok)](https://lobechat.com/discover/provider/xai)**: xAI is a company dedicated to building artificial intelligence to accelerate human scientific discovery. Our mission is to advance our collective understanding of the universe.
- **[Aliyun Bailian](https://lobechat.com/discover/provider/qwen)**: Tongyi Qianwen is a large-scale language model independently developed by Alibaba Cloud, featuring strong natural language understanding and generation capabilities. It can answer various questions, create written content, express opinions, and write code, playing a role in multiple fields.
- **[Wenxin](https://lobechat.com/discover/provider/wenxin)**: An enterprise-level one-stop platform for large model and AI-native application development and services, providing the most comprehensive and user-friendly toolchain for the entire process of generative artificial intelligence model development and application development.
- **[Hunyuan](https://lobechat.com/discover/provider/hunyuan)**: A large language model developed by Tencent, equipped with powerful Chinese creative capabilities, logical reasoning abilities in complex contexts, and reliable task execution skills.
- **[ZhiPu](https://lobechat.com/discover/provider/zhipu)**: Zhipu AI offers an open platform for multimodal and language models, supporting a wide range of AI application scenarios, including text processing, image understanding, and programming assistance.
- **[SiliconCloud](https://lobechat.com/discover/provider/siliconcloud)**: SiliconFlow is dedicated to accelerating AGI for the benefit of humanity, enhancing large-scale AI efficiency through an easy-to-use and cost-effective GenAI stack.
- **[01.AI](https://lobechat.com/discover/provider/zeroone)**: 01.AI focuses on AI 2.0 era technologies, vigorously promoting the innovation and application of 'human + artificial intelligence', using powerful models and advanced AI technologies to enhance human productivity and achieve technological empowerment.
- **[Spark](https://lobechat.com/discover/provider/spark)**: iFlytek's Spark model provides powerful AI capabilities across multiple domains and languages, utilizing advanced natural language processing technology to build innovative applications suitable for smart hardware, smart healthcare, smart finance, and other vertical scenarios.
- **[SenseNova](https://lobechat.com/discover/provider/sensenova)**: SenseNova, backed by SenseTime's robust infrastructure, offers efficient and user-friendly full-stack large model services.
- **[Stepfun](https://lobechat.com/discover/provider/stepfun)**: StepFun's large model possesses industry-leading multimodal and complex reasoning capabilities, supporting ultra-long text understanding and powerful autonomous scheduling search engine functions.
- **[Baichuan](https://lobechat.com/discover/provider/baichuan)**: Baichuan Intelligence is a company focused on the research and development of large AI models, with its models excelling in domestic knowledge encyclopedias, long text processing, and generative creation tasks in Chinese, surpassing mainstream foreign models. Baichuan Intelligence also possesses industry-leading multimodal capabilities, performing excellently in multiple authoritative evaluations. Its models include Baichuan 4, Baichuan 3 Turbo, and Baichuan 3 Turbo 128k, each optimized for different application scenarios, providing cost-effective solutions.
- **[Minimax](https://lobechat.com/discover/provider/minimax)**: MiniMax is a general artificial intelligence technology company established in 2021, dedicated to co-creating intelligence with users. MiniMax has independently developed general large models of different modalities, including trillion-parameter MoE text models, voice models, and image models, and has launched applications such as Conch AI.
- **[InternLM](https://lobechat.com/discover/provider/internlm)**: An open-source organization dedicated to the research and development of large model toolchains. It provides an efficient and user-friendly open-source platform for all AI developers, making cutting-edge large models and algorithm technologies easily accessible.
- **[Higress](https://lobechat.com/discover/provider/higress)**: Higress is a cloud-native API gateway that was developed internally at Alibaba to address the issues of Tengine reload affecting long-lived connections and the insufficient load balancing capabilities for gRPC/Dubbo.
- **[Gitee AI](https://lobechat.com/discover/provider/giteeai)**: Gitee AI's Serverless API provides AI developers with an out of the box large model inference API service.
- **[Taichu](https://lobechat.com/discover/provider/taichu)**: The Institute of Automation, Chinese Academy of Sciences, and Wuhan Artificial Intelligence Research Institute have launched a new generation of multimodal large models, supporting comprehensive question-answering tasks such as multi-turn Q\&A, text creation, image generation, 3D understanding, and signal analysis, with stronger cognitive, understanding, and creative abilities, providing a new interactive experience.
- **[360 AI](https://lobechat.com/discover/provider/ai360)**: 360 AI is an AI model and service platform launched by 360 Company, offering various advanced natural language processing models, including 360GPT2 Pro, 360GPT Pro, 360GPT Turbo, and 360GPT Turbo Responsibility 8K. These models combine large-scale parameters and multimodal capabilities, widely applied in text generation, semantic understanding, dialogue systems, and code generation. With flexible pricing strategies, 360 AI meets diverse user needs, supports developer integration, and promotes the innovation and development of intelligent applications.
- **[Search1API](https://lobechat.com/discover/provider/search1api)**: Search1API provides access to the DeepSeek series of models that can connect to the internet as needed, including standard and fast versions, supporting a variety of model sizes.
- **[InfiniAI](https://lobechat.com/discover/provider/infiniai)**: Provides high-performance, easy-to-use, and secure large model services for application developers, covering the entire process from large model development to service deployment.
- **[Qiniu](https://lobechat.com/discover/provider/qiniu)**: Qiniu, as a long-established cloud service provider, delivers cost-effective and reliable AI inference services for both real-time and batch processing, with a simple and user-friendly experience.

</details>

> 📊 Total providers: [<kbd>**42**</kbd>](https://lobechat.com/discover/providers)

 <!-- PROVIDER LIST -->

At the same time, we are also planning to support more model service providers. If you would like LobeChat to support your favorite service provider, feel free to join our [💬 community discussion](https://github.com/lobehub/lobe-chat/discussions/1284).

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-local]][docs-feat-local]

### [Local Large Language Model (LLM) Support][docs-feat-local]

To meet the specific needs of users, LobeChat also supports the use of local models based on [Ollama](https://ollama.ai), allowing users to flexibly use their own or third-party models.

> \[!TIP]
>
> Learn more about [📘 Using Ollama in LobeChat][docs-usage-ollama] by checking it out.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-vision]][docs-feat-vision]

### [Model Visual Recognition][docs-feat-vision]

LobeChat now supports OpenAI's latest [`gpt-4-vision`](https://platform.openai.com/docs/guides/vision) model with visual recognition capabilities,
a multimodal intelligence that can perceive visuals. Users can easily upload or drag and drop images into the dialogue box,
and the agent will be able to recognize the content of the images and engage in intelligent conversation based on this,
creating smarter and more diversified chat scenarios.

This feature opens up new interactive methods, allowing communication to transcend text and include a wealth of visual elements.
Whether it's sharing images in daily use or interpreting images within specific industries, the agent provides an outstanding conversational experience.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-tts]][docs-feat-tts]

### [TTS & STT Voice Conversation][docs-feat-tts]

LobeChat supports Text-to-Speech (TTS) and Speech-to-Text (STT) technologies, enabling our application to convert text messages into clear voice outputs,
allowing users to interact with our conversational agent as if they were talking to a real person. Users can choose from a variety of voices to pair with the agent.

Moreover, TTS offers an excellent solution for those who prefer auditory learning or desire to receive information while busy.
In LobeChat, we have meticulously selected a range of high-quality voice options (OpenAI Audio, Microsoft Edge Speech) to meet the needs of users from different regions and cultural backgrounds.
Users can choose the voice that suits their personal preferences or specific scenarios, resulting in a personalized communication experience.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-t2i]][docs-feat-t2i]

### [Text to Image Generation][docs-feat-t2i]

With support for the latest text-to-image generation technology, LobeChat now allows users to invoke image creation tools directly within conversations with the agent. By leveraging the capabilities of AI tools such as [`DALL-E 3`](https://openai.com/dall-e-3), [`MidJourney`](https://www.midjourney.com/), and [`Pollinations`](https://pollinations.ai/), the agents are now equipped to transform your ideas into images.

This enables a more private and immersive creative process, allowing for the seamless integration of visual storytelling into your personal dialogue with the agent.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-plugin]][docs-feat-plugin]

### [Plugin System (Function Calling)][docs-feat-plugin]

The plugin ecosystem of LobeChat is an important extension of its core functionality, greatly enhancing the practicality and flexibility of the LobeChat assistant.

<video controls src="https://github.com/lobehub/lobe-chat/assets/28616219/f29475a3-f346-4196-a435-41a6373ab9e2" muted="false"></video>

By utilizing plugins, LobeChat assistants can obtain and process real-time information, such as searching for web information and providing users with instant and relevant news.

In addition, these plugins are not limited to news aggregation, but can also extend to other practical functions, such as quickly searching documents, generating images, obtaining data from various platforms like Bilibili, Steam, and interacting with various third-party services.

> \[!TIP]
>
> Learn more about [📘 Plugin Usage][docs-usage-plugin] by checking it out.

<!-- PLUGIN LIST -->

| Recent Submits                                                                                                               | Description                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [PortfolioMeta](https://lobechat.com/discover/plugin/StockData)<br/><sup>By **portfoliometa** on **2025-09-27**</sup>        | Analyze stocks and get comprehensive real-time investment data and analytics.<br/>`stock`                               |
| [Web](https://lobechat.com/discover/plugin/web)<br/><sup>By **Proghit** on **2025-01-24**</sup>                              | Smart web search that reads and analyzes pages to deliver comprehensive answers from Google results.<br/>`web` `search` |
| [Bing_websearch](https://lobechat.com/discover/plugin/Bingsearch-identifier)<br/><sup>By **FineHow** on **2024-12-22**</sup> | Search for information from the internet base BingApi<br/>`bingsearch`                                                  |
| [Google CSE](https://lobechat.com/discover/plugin/google-cse)<br/><sup>By **vsnthdev** on **2024-12-02**</sup>               | Searches Google through their official CSE API.<br/>`web` `search`                                                      |

> 📊 Total plugins: [<kbd>**42**</kbd>](https://lobechat.com/discover/plugins)

 <!-- PLUGIN LIST -->

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-agent]][docs-feat-agent]

### [Agent Market (GPTs)][docs-feat-agent]

In LobeChat Agent Marketplace, creators can discover a vibrant and innovative community that brings together a multitude of well-designed agents,
which not only play an important role in work scenarios but also offer great convenience in learning processes.
Our marketplace is not just a showcase platform but also a collaborative space. Here, everyone can contribute their wisdom and share the agents they have developed.

> \[!TIP]
>
> By [🤖/🏪 Submit Agents][submit-agents-link], you can easily submit your agent creations to our platform.
> Importantly, LobeChat has established a sophisticated automated internationalization (i18n) workflow,
> capable of seamlessly translating your agent into multiple language versions.
> This means that no matter what language your users speak, they can experience your agent without barriers.

> \[!IMPORTANT]
>
> We welcome all users to join this growing ecosystem and participate in the iteration and optimization of agents.
> Together, we can create more interesting, practical, and innovative agents, further enriching the diversity and practicality of the agent offerings.

<!-- AGENT LIST -->

| Recent Submits                                                                                                                                                                 | Description                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Turtle Soup Host](https://lobechat.com/discover/assistant/lateral-thinking-puzzle)<br/><sup>By **[CSY2022](https://github.com/CSY2022)** on **2025-06-19**</sup>              | A turtle soup host needs to provide the scenario, the complete story (truth of the event), and the key point (the condition for guessing correctly).<br/>`turtle-soup` `reasoning` `interaction` `puzzle` `role-playing` |
| [Gourmet Reviewer🍟](https://lobechat.com/discover/assistant/food-reviewer)<br/><sup>By **[renhai-lab](https://github.com/renhai-lab)** on **2025-06-17**</sup>                | Food critique expert<br/>`gourmet` `review` `writing`                                                                                                                                                                    |
| [Academic Writing Assistant](https://lobechat.com/discover/assistant/academic-writing-assistant)<br/><sup>By **[swarfte](https://github.com/swarfte)** on **2025-06-17**</sup> | Expert in academic research paper writing and formal documentation<br/>`academic-writing` `research` `formal-style`                                                                                                      |
| [Minecraft Senior Developer](https://lobechat.com/discover/assistant/java-development)<br/><sup>By **[iamyuuk](https://github.com/iamyuuk)** on **2025-06-17**</sup>           | Expert in advanced Java development and Minecraft mod and server plugin development<br/>`development` `programming` `minecraft` `java`                                                                                   |

> 📊 Total agents: [<kbd>**505**</kbd> ](https://lobechat.com/discover/assistants)

 <!-- AGENT LIST -->

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-database]][docs-feat-database]

### [Support Local / Remote Database][docs-feat-database]

LobeChat supports the use of both server-side and local databases. Depending on your needs, you can choose the appropriate deployment solution:

- **Local database**: suitable for users who want more control over their data and privacy protection. LobeChat uses CRDT (Conflict-Free Replicated Data Type) technology to achieve multi-device synchronization. This is an experimental feature aimed at providing a seamless data synchronization experience.
- **Server-side database**: suitable for users who want a more convenient user experience. LobeChat supports PostgreSQL as a server-side database. For detailed documentation on how to configure the server-side database, please visit [Configure Server-side Database](https://lobehub.com/docs/self-hosting/advanced/server-database).

Regardless of which database you choose, LobeChat can provide you with an excellent user experience.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-auth]][docs-feat-auth]

### [Support Multi-User Management][docs-feat-auth]

LobeChat supports multi-user management and provides two main user authentication and management solutions to meet different needs:

- **next-auth**: LobeChat integrates `next-auth`, a flexible and powerful identity verification library that supports multiple authentication methods, including OAuth, email login, credential login, etc. With `next-auth`, you can easily implement user registration, login, session management, social login, and other functions to ensure the security and privacy of user data.

- [**Clerk**](https://go.clerk.com/exgqLG0): For users who need more advanced user management features, LobeChat also supports `Clerk`, a modern user management platform. `Clerk` provides richer functions, such as multi-factor authentication (MFA), user profile management, login activity monitoring, etc. With `Clerk`, you can get higher security and flexibility, and easily cope with complex user management needs.

Regardless of which user management solution you choose, LobeChat can provide you with an excellent user experience and powerful functional support.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-pwa]][docs-feat-pwa]

### [Progressive Web App (PWA)][docs-feat-pwa]

We deeply understand the importance of providing a seamless experience for users in today's multi-device environment.
Therefore, we have adopted Progressive Web Application ([PWA](https://support.google.com/chrome/answer/9658361)) technology,
a modern web technology that elevates web applications to an experience close to that of native apps.

Through PWA, LobeChat can offer a highly optimized user experience on both desktop and mobile devices while maintaining high-performance characteristics.
Visually and in terms of feel, we have also meticulously designed the interface to ensure it is indistinguishable from native apps,
providing smooth animations, responsive layouts, and adapting to different device screen resolutions.

> \[!NOTE]
>
> If you are unfamiliar with the installation process of PWA, you can add LobeChat as your desktop application (also applicable to mobile devices) by following these steps:
>
> - Launch the Chrome or Edge browser on your computer.
> - Visit the LobeChat webpage.
> - In the upper right corner of the address bar, click on the <kbd>Install</kbd> icon.
> - Follow the instructions on the screen to complete the PWA Installation.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-mobile]][docs-feat-mobile]

### [Mobile Device Adaptation][docs-feat-mobile]

We have carried out a series of optimization designs for mobile devices to enhance the user's mobile experience. Currently, we are iterating on the mobile user experience to achieve smoother and more intuitive interactions. If you have any suggestions or ideas, we welcome you to provide feedback through GitHub Issues or Pull Requests.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[![][image-feat-theme]][docs-feat-theme]

### [Custom Themes][docs-feat-theme]

As a design-engineering-oriented application, LobeChat places great emphasis on users' personalized experiences,
hence introducing flexible and diverse theme modes, including a light mode for daytime and a dark mode for nighttime.
Beyond switching theme modes, a range of color customization options allow users to adjust the application's theme colors according to their preferences.
Whether it's a desire for a sober dark blue, a lively peach pink, or a professional gray-white, users can find their style of color choices in LobeChat.

> \[!TIP]
>
> The default configuration can intelligently recognize the user's system color mode and automatically switch themes to ensure a consistent visual experience with the operating system.
> For users who like to manually control details, LobeChat also offers intuitive setting options and a choice between chat bubble mode and document mode for conversation scenarios.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

### `*` What's more

Beside these features, LobeChat also have much better basic technique underground:

- [x] 💨 **Quick Deployment**: Using the Vercel platform or docker image, you can deploy with just one click and complete the process within 1 minute without any complex configuration.
- [x] 🌐 **Custom Domain**: If users have their own domain, they can bind it to the platform for quick access to the dialogue agent from anywhere.
- [x] 🔒 **Privacy Protection**: All data is stored locally in the user's browser, ensuring user privacy.
- [x] 💎 **Exquisite UI Design**: With a carefully designed interface, it offers an elegant appearance and smooth interaction. It supports light and dark themes and is mobile-friendly. PWA support provides a more native-like experience.
- [x] 🗣️ **Smooth Conversation Experience**: Fluid responses ensure a smooth conversation experience. It fully supports Markdown rendering, including code highlighting, LaTex formulas, Mermaid flowcharts, and more.

> ✨ more features will be added when LobeChat evolve.

---

> \[!NOTE]
>
> You can find our upcoming [Roadmap][github-project-link] plans in the Projects section.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⚡️ Performance

> \[!NOTE]
>
> The complete list of reports can be found in the [📘 Lighthouse Reports][docs-lighthouse]

|                   Desktop                   |                   Mobile                   |
| :-----------------------------------------: | :----------------------------------------: |
|              ![][chat-desktop]              |              ![][chat-mobile]              |
| [📑 Lighthouse Report][chat-desktop-report] | [📑 Lighthouse Report][chat-mobile-report] |

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🛳 Self Hosting

LobeChat provides Self-Hosted Version with Vercel, Alibaba Cloud, and [Docker Image][docker-release-link]. This allows you to deploy your own chatbot within a few minutes without any prior knowledge.

> \[!TIP]
>
> Learn more about [📘 Build your own LobeChat][docs-self-hosting] by checking it out.

### `A` Deploying with Vercel, Zeabur , Sealos or Alibaba Cloud

"If you want to deploy this service yourself on Vercel, Zeabur or Alibaba Cloud, you can follow these steps:

- Prepare your [OpenAI API Key](https://platform.openai.com/account/api-keys).
- Click the button below to start deployment: Log in directly with your GitHub account, and remember to fill in the `OPENAI_API_KEY`(required) and `ACCESS_CODE` (recommended) on the environment variable section.
- After deployment, you can start using it.
- Bind a custom domain (optional): The DNS of the domain assigned by Vercel is polluted in some areas; binding a custom domain can connect directly.

<div align="center">

|           Deploy with Vercel            |                     Deploy with Zeabur                      |                     Deploy with Sealos                      |                       Deploy with RepoCloud                       |                         Deploy with Alibaba Cloud                         |
| :-------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------------: | :-----------------------------------------------------------------------: |
| [![][deploy-button-image]][deploy-link] | [![][deploy-on-zeabur-button-image]][deploy-on-zeabur-link] | [![][deploy-on-sealos-button-image]][deploy-on-sealos-link] | [![][deploy-on-repocloud-button-image]][deploy-on-repocloud-link] | [![][deploy-on-alibaba-cloud-button-image]][deploy-on-alibaba-cloud-link] |

</div>

#### After Fork

After fork, only retain the upstream sync action and disable other actions in your repository on GitHub.

#### Keep Updated

If you have deployed your own project following the one-click deployment steps in the README, you might encounter constant prompts indicating "updates available." This is because Vercel defaults to creating a new project instead of forking this one, resulting in an inability to detect updates accurately.

> \[!TIP]
>
> We suggest you redeploy using the following steps, [📘 Auto Sync With Latest][docs-upstream-sync]

<br/>

### `B` Deploying with Docker

[![][docker-release-shield]][docker-release-link]
[![][docker-size-shield]][docker-size-link]
[![][docker-pulls-shield]][docker-pulls-link]

We provide a Docker image for deploying the LobeChat service on your own private device. Use the following command to start the LobeChat service:

1. create a folder to for storage files

```fish
$ mkdir lobe-chat-db && cd lobe-chat-db
```

2. init the LobeChat infrastructure

```fish
bash <(curl -fsSL https://lobe.li/setup.sh)
```

3. Start the LobeChat service

```fish
docker compose up -d
```

> \[!NOTE]
>
> For detailed instructions on deploying with Docker, please refer to the [📘 Docker Deployment Guide][docs-docker]

<br/>

### Environment Variable

This project provides some additional configuration items set with environment variables:

| Environment Variable | Required | Description                                                                                                                                                               | Example                                                                                                              |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`     | Yes      | This is the API key you apply on the OpenAI account page                                                                                                                  | `sk-xxxxxx...xxxxxx`                                                                                                 |
| `OPENAI_PROXY_URL`   | No       | If you manually configure the OpenAI interface proxy, you can use this configuration item to override the default OpenAI API request base URL                             | `https://api.chatanywhere.cn` or `https://aihubmix.com/v1` <br/>The default value is<br/>`https://api.openai.com/v1` |
| `ACCESS_CODE`        | No       | Add a password to access this service; you can set a long password to avoid leaking. If this value contains a comma, it is a password array.                              | `awCTe)re_r74` or `rtrt_ewee3@09!` or `code1,code2,code3`                                                            |
| `OPENAI_MODEL_LIST`  | No       | Used to control the model list. Use `+` to add a model, `-` to hide a model, and `model_name=display_name` to customize the display name of a model, separated by commas. | `qwen-7b-chat,+glm-6b,-gpt-3.5-turbo`                                                                                |

> \[!NOTE]
>
> The complete list of environment variables can be found in the [📘 Environment Variables][docs-env-var]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 📦 Ecosystem

| NPM                               | Repository                              | Description                                                                                           | Version                                   |
| --------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [@lobehub/ui][lobe-ui-link]       | [lobehub/lobe-ui][lobe-ui-github]       | Open-source UI component library dedicated to building AIGC web applications.                         | [![][lobe-ui-shield]][lobe-ui-link]       |
| [@lobehub/icons][lobe-icons-link] | [lobehub/lobe-icons][lobe-icons-github] | Popular AI / LLM Model Brand SVG Logo and Icon Collection.                                            | [![][lobe-icons-shield]][lobe-icons-link] |
| [@lobehub/tts][lobe-tts-link]     | [lobehub/lobe-tts][lobe-tts-github]     | High-quality & reliable TTS/STT React Hooks library                                                   | [![][lobe-tts-shield]][lobe-tts-link]     |
| [@lobehub/lint][lobe-lint-link]   | [lobehub/lobe-lint][lobe-lint-github]   | Configurations for ESlint, Stylelint, Commitlint, Prettier, Remark, and Semantic Release for LobeHub. | [![][lobe-lint-shield]][lobe-lint-link]   |

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🧩 Plugins

Plugins provide a means to extend the [Function Calling][docs-function-call] capabilities of LobeChat. They can be used to introduce new function calls and even new ways to render message results. If you are interested in plugin development, please refer to our [📘 Plugin Development Guide][docs-plugin-dev] in the Wiki.

- [lobe-chat-plugins][lobe-chat-plugins]: This is the plugin index for LobeChat. It accesses index.json from this repository to display a list of available plugins for LobeChat to the user.
- [chat-plugin-template][chat-plugin-template]: This is the plugin template for LobeChat plugin development.
- [@lobehub/chat-plugin-sdk][chat-plugin-sdk]: The LobeChat Plugin SDK assists you in creating exceptional chat plugins for Lobe Chat.
- [@lobehub/chat-plugins-gateway][chat-plugins-gateway]: The LobeChat Plugins Gateway is a backend service that provides a gateway for LobeChat plugins. We deploy this service using Vercel. The primary API POST /api/v1/runner is deployed as an Edge Function.

> \[!NOTE]
>
> The plugin system is currently undergoing major development. You can learn more in the following issues:
>
> - [x] [**Plugin Phase 1**](https://github.com/lobehub/lobe-chat/issues/73): Implement separation of the plugin from the main body, split the plugin into an independent repository for maintenance, and realize dynamic loading of the plugin.
> - [x] [**Plugin Phase 2**](https://github.com/lobehub/lobe-chat/issues/97): The security and stability of the plugin's use, more accurately presenting abnormal states, the maintainability of the plugin architecture, and developer-friendly.
> - [x] [**Plugin Phase 3**](https://github.com/lobehub/lobe-chat/issues/149): Higher-level and more comprehensive customization capabilities, support for plugin authentication, and examples.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

You can use GitHub Codespaces for online development:

[![][codespaces-shield]][codespaces-link]

Or clone it for local development:

```fish
$ git clone https://github.com/lobehub/lobe-chat.git
$ cd lobe-chat
$ pnpm install
$ pnpm dev
```

If you would like to learn more details, please feel free to look at our [📘 Development Guide][docs-dev-guide].

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤝 Contributing

Contributions of all types are more than welcome; if you are interested in contributing code, feel free to check out our GitHub [Issues][github-issues-link] and [Projects][github-project-link] to get stuck in to show us what you're made of.

> \[!TIP]
>
> We are creating a technology-driven forum, fostering knowledge interaction and the exchange of ideas that may culminate in mutual inspiration and collaborative innovation.
>
> Help us make LobeChat better. Welcome to provide product design feedback, user experience discussions directly to us.
>
> **Principal Maintainers:** [@arvinxx](https://github.com/arvinxx) [@canisminor1990](https://github.com/canisminor1990)

[![][pr-welcome-shield]][pr-welcome-link]
[![][submit-agents-shield]][submit-agents-link]
[![][submit-plugin-shield]][submit-plugin-link]

<a href="https://github.com/lobehub/lobe-chat/graphs/contributors" target="_blank">
  <table>
    <tr>
      <th colspan="2">
        <br><img src="https://contrib.rocks/image?repo=lobehub/lobe-chat"><br><br>
      </th>
    </tr>
    <tr>
      <td>
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://next.ossinsight.io/widgets/official/compose-org-active-contributors/thumbnail.png?activity=active&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=2x3&color_scheme=dark">
          <img src="https://next.ossinsight.io/widgets/official/compose-org-active-contributors/thumbnail.png?activity=active&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=2x3&color_scheme=light">
        </picture>
      </td>
      <td rowspan="2">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://next.ossinsight.io/widgets/official/compose-org-participants-growth/thumbnail.png?activity=active&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=4x7&color_scheme=dark">
          <img src="https://next.ossinsight.io/widgets/official/compose-org-participants-growth/thumbnail.png?activity=active&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=4x7&color_scheme=light">
        </picture>
      </td>
    </tr>
    <tr>
      <td>
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://next.ossinsight.io/widgets/official/compose-org-active-contributors/thumbnail.png?activity=new&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=2x3&color_scheme=dark">
          <img src="https://next.ossinsight.io/widgets/official/compose-org-active-contributors/thumbnail.png?activity=new&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=2x3&color_scheme=light">
        </picture>
      </td>
    </tr>
  </table>
</a>

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ❤️ Sponsor

Every bit counts and your one-time donation sparkles in our galaxy of support! You're a shooting star, making a swift and bright impact on our journey. Thank you for believing in us – your generosity guides us toward our mission, one brilliant flash at a time.

<a href="https://opencollective.com/lobehub" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/lobehub/.github/blob/main/static/sponsor-dark.png?raw=true">
    <img  src="https://github.com/lobehub/.github/blob/main/static/sponsor-light.png?raw=true">
  </picture>
</a>

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🔗 More Products

- **[🅰️ Lobe SD Theme][lobe-theme]:** Modern theme for Stable Diffusion WebUI, exquisite interface design, highly customizable UI, and efficiency-boosting features.
- **[⛵️ Lobe Midjourney WebUI][lobe-midjourney-webui]:** WebUI for Midjourney, leverages AI to quickly generate a wide array of rich and diverse images from text prompts, sparking creativity and enhancing conversations.
- **[🌏 Lobe i18n][lobe-i18n] :** Lobe i18n is an automation tool for the i18n (internationalization) translation process, powered by ChatGPT. It supports features such as automatic splitting of large files, incremental updates, and customization options for the OpenAI model, API proxy, and temperature.
- **[💌 Lobe Commit][lobe-commit]:** Lobe Commit is a CLI tool that leverages Langchain/ChatGPT to generate Gitmoji-based commit messages.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

<details><summary><h4>📝 License</h4></summary>

[![][fossa-license-shield]][fossa-license-link]

</details>

Copyright © 2025 [LobeHub][profile-link]. <br />
This project is [LobeHub Community License](./LICENSE) licensed.

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
[blog]: https://lobehub.com/blog
[changelog]: https://lobehub.com/changelog
[chat-desktop]: https://raw.githubusercontent.com/lobehub/lobe-chat/lighthouse/lighthouse/chat/desktop/pagespeed.svg
[chat-desktop-report]: https://lobehub.github.io/lobe-chat/lighthouse/chat/desktop/chat_preview_lobehub_com_chat.html
[chat-mobile]: https://raw.githubusercontent.com/lobehub/lobe-chat/lighthouse/lighthouse/chat/mobile/pagespeed.svg
[chat-mobile-report]: https://lobehub.github.io/lobe-chat/lighthouse/chat/mobile/chat_preview_lobehub_com_chat.html
[chat-plugin-sdk]: https://github.com/lobehub/chat-plugin-sdk
[chat-plugin-template]: https://github.com/lobehub/chat-plugin-template
[chat-plugins-gateway]: https://github.com/lobehub/chat-plugins-gateway
[codecov-link]: https://codecov.io/gh/lobehub/lobe-chat
[codecov-shield]: https://img.shields.io/codecov/c/github/lobehub/lobe-chat?labelColor=black&style=flat-square&logo=codecov&logoColor=white
[codespaces-link]: https://codespaces.new/lobehub/lobe-chat
[codespaces-shield]: https://github.com/codespaces/badge.svg
[deploy-button-image]: https://vercel.com/button
[deploy-link]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat&env=OPENAI_API_KEY,ACCESS_CODE&envDescription=Find%20your%20OpenAI%20API%20Key%20by%20click%20the%20right%20Learn%20More%20button.%20%7C%20Access%20Code%20can%20protect%20your%20website&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys&project-name=lobe-chat&repository-name=lobe-chat
[deploy-on-alibaba-cloud-button-image]: https://service-info-public.oss-cn-hangzhou.aliyuncs.com/computenest-en.svg
[deploy-on-alibaba-cloud-link]: https://computenest.console.aliyun.com/service/instance/create/default?type=user&ServiceName=LobeChat%E7%A4%BE%E5%8C%BA%E7%89%88
[deploy-on-repocloud-button-image]: https://d16t0pc4846x52.cloudfront.net/deploylobe.svg
[deploy-on-repocloud-link]: https://repocloud.io/details/?app_id=248
[deploy-on-sealos-button-image]: https://raw.githubusercontent.com/labring-actions/templates/main/Deploy-on-Sealos.svg
[deploy-on-sealos-link]: https://template.usw.sealos.io/deploy?templateName=lobe-chat-db
[deploy-on-zeabur-button-image]: https://zeabur.com/button.svg
[deploy-on-zeabur-link]: https://zeabur.com/templates/VZGGTI
[discord-link]: https://discord.gg/AYFPHvv2jT
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=flat-square
[discord-shield-badge]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=for-the-badge
[docker-pulls-link]: https://hub.docker.com/r/lobehub/lobe-chat-database
[docker-pulls-shield]: https://img.shields.io/docker/pulls/lobehub/lobe-chat?color=45cc11&labelColor=black&style=flat-square&sort=semver
[docker-release-link]: https://hub.docker.com/r/lobehub/lobe-chat-database
[docker-release-shield]: https://img.shields.io/docker/v/lobehub/lobe-chat-database?color=369eff&label=docker&labelColor=black&logo=docker&logoColor=white&style=flat-square&sort=semver
[docker-size-link]: https://hub.docker.com/r/lobehub/lobe-chat-database
[docker-size-shield]: https://img.shields.io/docker/image-size/lobehub/lobe-chat-database?color=369eff&labelColor=black&style=flat-square&sort=semver
[docs]: https://lobehub.com/docs/usage/start
[docs-dev-guide]: https://github.com/lobehub/lobe-chat/wiki/index
[docs-docker]: https://lobehub.com/docs/self-hosting/server-database/docker-compose
[docs-env-var]: https://lobehub.com/docs/self-hosting/environment-variables
[docs-feat-agent]: https://lobehub.com/docs/usage/features/agent-market
[docs-feat-artifacts]: https://lobehub.com/docs/usage/features/artifacts
[docs-feat-auth]: https://lobehub.com/docs/usage/features/auth
[docs-feat-branch]: https://lobehub.com/docs/usage/features/branching-conversations
[docs-feat-cot]: https://lobehub.com/docs/usage/features/cot
[docs-feat-database]: https://lobehub.com/docs/usage/features/database
[docs-feat-knowledgebase]: https://lobehub.com/blog/knowledge-base
[docs-feat-local]: https://lobehub.com/docs/usage/features/local-llm
[docs-feat-mobile]: https://lobehub.com/docs/usage/features/mobile
[docs-feat-plugin]: https://lobehub.com/docs/usage/features/plugin-system
[docs-feat-provider]: https://lobehub.com/docs/usage/features/multi-ai-providers
[docs-feat-pwa]: https://lobehub.com/docs/usage/features/pwa
[docs-feat-t2i]: https://lobehub.com/docs/usage/features/text-to-image
[docs-feat-theme]: https://lobehub.com/docs/usage/features/theme
[docs-feat-tts]: https://lobehub.com/docs/usage/features/tts
[docs-feat-vision]: https://lobehub.com/docs/usage/features/vision
[docs-function-call]: https://lobehub.com/blog/openai-function-call
[docs-lighthouse]: https://github.com/lobehub/lobe-chat/wiki/Lighthouse
[docs-plugin-dev]: https://lobehub.com/docs/usage/plugins/development
[docs-self-hosting]: https://lobehub.com/docs/self-hosting/start
[docs-upstream-sync]: https://lobehub.com/docs/self-hosting/advanced/upstream-sync
[docs-usage-ollama]: https://lobehub.com/docs/usage/providers/ollama
[docs-usage-plugin]: https://lobehub.com/docs/usage/plugins/basic
[fossa-license-link]: https://app.fossa.com/projects/git%2Bgithub.com%2Flobehub%2Flobe-chat
[fossa-license-shield]: https://app.fossa.com/api/projects/git%2Bgithub.com%2Flobehub%2Flobe-chat.svg?type=large
[github-action-release-link]: https://github.com/rgknow/nanobot/actions/workflows/release.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/rgknow/nanobot/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/rgknow/nanobot/actions/workflows/test.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/rgknow/nanobot/test.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-contributors-link]: https://github.com/rgknow/nanobot/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/rgknow/nanobot?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/rgknow/nanobot/network/members
[github-forks-shield]: https://img.shields.io/github/forks/rgknow/nanobot?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/rgknow/nanobot/issues
[github-issues-shield]: https://img.shields.io/github/issues/rgknow/nanobot?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/rgknow/nanobot/blob/main/LICENSE
[github-license-shield]: https://img.shields.io/github/license/rgknow/nanobot?color=white&labelColor=black&style=flat-square
[github-project-link]: https://github.com/rgknow/nanobot/projects
[github-release-link]: https://github.com/rgknow/nanobot/releases
[github-release-shield]: https://img.shields.io/github/v/release/rgknow/nanobot?color=369eff&labelColor=black&logo=github&style=flat-square
[github-releasedate-link]: https://github.com/rgknow/nanobot/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/rgknow/nanobot?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/rgknow/nanobot/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/rgknow/nanobot?color=ffcb47&labelColor=black&style=flat-square
[github-trending-shield]: https://trendshift.io/api/badge/repositories/11430
[github-trending-url]: https://trendshift.io/repositories/11430
[image-banner]: https://github.com/rgknow/nanobot/assets/banner.png
[image-feat-agent]: https://github.com/rgknow/nanobot/assets/features/agent.png
[image-feat-artifacts]: https://github.com/rgknow/nanobot/assets/features/artifacts.png
[image-feat-auth]: https://github.com/rgknow/nanobot/assets/features/auth.png
[image-feat-branch]: https://github.com/rgknow/nanobot/assets/features/branch.png
[image-feat-cot]: https://github.com/rgknow/nanobot/assets/features/cot.png
[image-feat-database]: https://github.com/rgknow/nanobot/assets/features/database.png
[image-feat-desktop]: https://github.com/rgknow/nanobot/assets/features/desktop.png
[image-feat-knowledgebase]: https://github.com/rgknow/nanobot/assets/features/knowledgebase.png
[image-feat-local]: https://github.com/rgknow/nanobot/assets/features/local.png
[image-feat-mcp]: https://github.com/rgknow/nanobot/assets/features/mcp.png
[image-feat-mcp-market]: https://github.com/rgknow/nanobot/assets/features/mcp-market.png
[image-feat-mobile]: https://github.com/rgknow/nanobot/assets/features/mobile.png
[image-feat-plugin]: https://github.com/rgknow/nanobot/assets/features/plugin.png
[image-feat-privoder]: https://github.com/rgknow/nanobot/assets/features/provider.png
[image-feat-pwa]: https://github.com/rgknow/nanobot/assets/features/pwa.png
[image-feat-t2i]: https://github.com/rgknow/nanobot/assets/features/t2i.png
[image-feat-theme]: https://github.com/rgknow/nanobot/assets/features/theme.png
[image-feat-tts]: https://github.com/rgknow/nanobot/assets/features/tts.png
[image-feat-vision]: https://github.com/rgknow/nanobot/assets/features/vision.png
[image-feat-web-search]: https://github.com/rgknow/nanobot/assets/features/web-search.png
[image-overview]: https://github.com/rgknow/nanobot/assets/overview.png
[image-star]: https://github.com/rgknow/nanobot/assets/star.png
[issues-link]: https://github.com/rgknow/nanobot/issues
[mcp-url]: https://nanobot.edu/mcp
[official-site]: https://nanobot.edu
[share-linkedin-link]: https://linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Frgknow%2Fnanobot
[share-linkedin-shield]: https://img.shields.io/badge/-share%20on%20linkedin-black?labelColor=black&logo=linkedin&logoColor=white&style=flat-square
[share-mastodon-link]: https://mastodon.social/share?text=Check%20out%20this%20awesome%20educational%20AI%20platform%20https%3A%2F%2Fgithub.com%2Frgknow%2Fnanobot
[share-mastodon-shield]: https://img.shields.io/badge/-share%20on%20mastodon-black?labelColor=black&logo=mastodon&logoColor=white&style=flat-square
[share-reddit-link]: https://www.reddit.com/submit?title=%F0%9F%A4%96%20NanoBot%20-%20Educational%20AI%20Platform&url=https%3A%2F%2Fgithub.com%2Frgknow%2Fnanobot
[share-reddit-shield]: https://img.shields.io/badge/-share%20on%20reddit-black?labelColor=black&logo=reddit&logoColor=white&style=flat-square
[share-telegram-link]: https://t.me/share/url?text=%F0%9F%A4%96%20NanoBot%20-%20Educational%20AI%20Platform&url=https%3A%2F%2Fgithub.com%2Frgknow%2Fnanobot
[share-telegram-shield]: https://img.shields.io/badge/-share%20on%20telegram-black?labelColor=black&logo=telegram&logoColor=white&style=flat-square
[share-weibo-link]: http://service.weibo.com/share/share.php?sharesource=weibo&title=%F0%9F%A4%96%20NanoBot%20-%20Educational%20AI%20Platform&url=https%3A%2F%2Fgithub.com%2Frgknow%2Fnanobot
[share-weibo-shield]: https://img.shields.io/badge/-share%20on%20weibo-black?labelColor=black&logo=sinaweibo&logoColor=white&style=flat-square
[share-whatsapp-link]: https://api.whatsapp.com/send?text=%F0%9F%A4%96%20NanoBot%20-%20Educational%20AI%20Platform%20https%3A%2F%2Fgithub.com%2Frgknow%2Fnanobot
[share-whatsapp-shield]: https://img.shields.io/badge/-share%20on%20whatsapp-black?labelColor=black&logo=whatsapp&logoColor=white&style=flat-square
[share-x-link]: https://x.com/intent/tweet?hashtags=chatbot%2CchatGPT%2CopenAI&text=%F0%9F%A4%98%20NanoBot%20-%20Educational%20AI%20Platform&url=https%3A%2F%2Fgithub.com%2Frgknow%2Fnanobot
[share-x-shield]: https://img.shields.io/badge/-share%20on%20x-black?labelColor=black&logo=x&logoColor=white&style=flat-square
[sponsor-link]: https://opencollective.com/nanobot
[sponsor-shield]: https://img.shields.io/badge/-Sponsor%20NanoBot-f04f88?logo=opencollective&logoColor=white&style=flat-square
[vercel-link]: https://nanobot.edu
[vercel-shield]: https://img.shields.io/website?down_message=offline&label=vercel&labelColor=black&logo=vercel&style=flat-square&up_message=online&url=https%3A%2F%2Fnanobot.edu
[vercel-shield-badge]: https://img.shields.io/website?down_message=offline&label=try%20nanobot&labelColor=black&logo=vercel&style=for-the-badge&up_message=online&url=https%3A%2F%2Fnanobot.edu
[desktop-url]: https://nanobot.edu/desktop
[lobe-commit]: https://github.com/lobehub/lobe-commit/tree/master/packages/lobe-commit
[lobe-i18n]: https://github.com/lobehub/lobe-commit/tree/master/packages/lobe-i18n
[lobe-icons-github]: https://github.com/lobehub/lobe-icons
[lobe-icons-link]: https://www.npmjs.com/package/@lobehub/icons
[lobe-icons-shield]: https://img.shields.io/npm/v/@lobehub/icons?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[lobe-lint-github]: https://github.com/lobehub/lobe-lint
[lobe-lint-link]: https://www.npmjs.com/package/@lobehub/lint
[lobe-lint-shield]: https://img.shields.io/npm/v/@lobehub/lint?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[lobe-midjourney-webui]: https://github.com/lobehub/lobe-midjourney-webui
[lobe-theme]: https://github.com/lobehub/sd-webui-lobe-theme
[lobe-tts-github]: https://github.com/lobehub/lobe-tts
[lobe-tts-link]: https://www.npmjs.com/package/@lobehub/tts
[lobe-tts-shield]: https://img.shields.io/npm/v/@lobehub/tts?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[lobe-ui-github]: https://github.com/lobehub/lobe-ui
[lobe-ui-link]: https://www.npmjs.com/package/@lobehub/ui
[lobe-ui-shield]: https://img.shields.io/npm/v/@lobehub/ui?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[official-site]: https://lobehub.com
[pr-welcome-link]: https://github.com/lobehub/lobe-chat/pulls
[pr-welcome-shield]: https://img.shields.io/badge/🤯_pr_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/lobehub
[share-linkedin-link]: https://linkedin.com/feed
[share-linkedin-shield]: https://img.shields.io/badge/-share%20on%20linkedin-black?labelColor=black&logo=linkedin&logoColor=white&style=flat-square
[share-mastodon-link]: https://mastodon.social/share?text=Check%20this%20GitHub%20repository%20out%20%F0%9F%A4%AF%20LobeChat%20-%20An%20open-source,%20extensible%20%28Function%20Calling%29,%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20https://github.com/lobehub/lobe-chat%20#chatbot%20#chatGPT%20#openAI
[share-mastodon-shield]: https://img.shields.io/badge/-share%20on%20mastodon-black?labelColor=black&logo=mastodon&logoColor=white&style=flat-square
[share-reddit-link]: https://www.reddit.com/submit?title=Check%20this%20GitHub%20repository%20out%20%F0%9F%A4%AF%20LobeChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20%23chatbot%20%23chatGPT%20%23openAI&url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat
[share-reddit-shield]: https://img.shields.io/badge/-share%20on%20reddit-black?labelColor=black&logo=reddit&logoColor=white&style=flat-square
[share-telegram-link]: https://t.me/share/url"?text=Check%20this%20GitHub%20repository%20out%20%F0%9F%A4%AF%20LobeChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20%23chatbot%20%23chatGPT%20%23openAI&url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat
[share-telegram-shield]: https://img.shields.io/badge/-share%20on%20telegram-black?labelColor=black&logo=telegram&logoColor=white&style=flat-square
[share-weibo-link]: http://service.weibo.com/share/share.php?sharesource=weibo&title=Check%20this%20GitHub%20repository%20out%20%F0%9F%A4%AF%20LobeChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20%23chatbot%20%23chatGPT%20%23openAI&url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat
[share-weibo-shield]: https://img.shields.io/badge/-share%20on%20weibo-black?labelColor=black&logo=sinaweibo&logoColor=white&style=flat-square
[share-whatsapp-link]: https://api.whatsapp.com/send?text=Check%20this%20GitHub%20repository%20out%20%F0%9F%A4%AF%20LobeChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat%20%23chatbot%20%23chatGPT%20%23openAI
[share-whatsapp-shield]: https://img.shields.io/badge/-share%20on%20whatsapp-black?labelColor=black&logo=whatsapp&logoColor=white&style=flat-square
[share-x-link]: https://x.com/intent/tweet?hashtags=chatbot%2CchatGPT%2CopenAI&text=Check%20this%20GitHub%20repository%20out%20%F0%9F%A4%AF%20LobeChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.&url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat
[share-x-shield]: https://img.shields.io/badge/-share%20on%20x-black?labelColor=black&logo=x&logoColor=white&style=flat-square
[sponsor-link]: https://opencollective.com/lobehub 'Become ❤️ LobeHub Sponsor'
[sponsor-shield]: https://img.shields.io/badge/-Sponsor%20LobeHub-f04f88?logo=opencollective&logoColor=white&style=flat-square
[submit-agents-link]: https://github.com/lobehub/lobe-chat-agents
[submit-agents-shield]: https://img.shields.io/badge/🤖/🏪_submit_agent-%E2%86%92-c4f042?labelColor=black&style=for-the-badge
[submit-plugin-link]: https://github.com/lobehub/lobe-chat-plugins
[submit-plugin-shield]: https://img.shields.io/badge/🧩/🏪_submit_plugin-%E2%86%92-95f3d9?labelColor=black&style=for-the-badge
[vercel-link]: https://chat-preview.lobehub.com
[vercel-shield]: https://img.shields.io/badge/vercel-online-55b467?labelColor=black&logo=vercel&style=flat-square
[vercel-shield-badge]: https://img.shields.io/badge/TRY%20NANOBOT-ONLINE-55b467?labelColor=black&logo=vercel&style=for-the-badge
