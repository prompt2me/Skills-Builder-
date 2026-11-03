import { Skill } from '../types/skill.ts';
import { validateSkillPackage } from './claudeSkillStandards.ts';

export const STARTER_SKILLS: Skill[] = [
  {
    id: 'skill-seo-intelligence',
    name: 'competitor-seo-intelligence',
    displayName: 'Competitor & SEO Intelligence Analyst',
    description: 'Autonomous research engine that conducts competitive SERP analysis, audits backlink footprints, isolates keyword gap opportunities, and formulates prioritized content playbooks.',
    taskCategory: 'seo_marketing',
    targetEnvironment: 'claude_code',
    status: 'tested',
    userPrompt: 'Create a skill that analyzes competitors and identifies SEO opportunities with prioritized keyword gaps and content blueprints.',
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-02T14:30:00.000Z',
    requirements: {
      objective: 'Conduct competitor organic search reverse-engineering and prioritize actionable SEO keyword/content opportunities.',
      taskType: 'seo_marketing',
      intendedUser: 'SEO Strategists, Growth Leads, Content Directors',
      operatingContext: 'Claude Code CLI or Claude Desktop environment with optional web search MCP or manual SERP exports.',
      inputs: [
        { name: 'targetDomain', description: 'Primary website domain to optimize', required: true, format: 'URL or naked domain' },
        { name: 'competitorDomains', description: 'List of 1 to 5 competitor domains', required: false, format: 'Array of domain strings' },
        { name: 'targetMarket', description: 'Geographic and linguistic target (e.g., US English)', required: false, format: 'ISO string or locale', default: 'US / Global English' },
      ],
      operations: [
        'Domain footprint analysis and topical authority mapping',
        'Keyword overlap and gap matrix derivation',
        'Search intent classification (Informational, Commercial, Transactional)',
        'Content cluster prioritization by traffic potential vs difficulty',
        'Generation of actionable content briefs and schema recommendations',
      ],
      decisions: [
        'Prioritize low-hanging-fruit gaps (high volume, low domain authority requirement) over vanity head terms',
        'Separate transactional purchase keywords from top-of-funnel educational queries',
      ],
      toolsNeeded: [
        {
          id: 'brave-search',
          name: 'brave-search / googleSearch',
          purpose: 'Query live search engine result pages and snippet features',
          availability: 'optional_enhancement',
          fallbackStrategy: 'Request user to paste exported CSV reports from Semrush/Ahrefs or sample SERP URLs.',
        },
        {
          id: 'filesystem',
          name: 'filesystem',
          purpose: 'Save generated markdown content briefs and gap analysis matrices',
          availability: 'verified_available',
          fallbackStrategy: 'Render artifacts directly to the active chat session.',
        },
      ],
      outputs: [
        { name: 'Competitor Landscape Synthesis', type: 'Markdown Document', description: 'Comparative matrix of organic authority, estimated share of voice, and topical focus.' },
        { name: 'Prioritized Content Briefs', type: 'Markdown Templates', description: 'Target H1/H2 structures, search intent targets, primary/secondary keywords, and internal linking directives.' },
      ],
      qualityControls: [
        'Zero speculation on unverified metrics; clearly tag third-party metrics as estimates',
        'Validate that every suggested keyword includes explicit search intent classification',
        'Ensure all recommended internal linking structures are logically coherent',
      ],
      constraints: ['Do not claim proprietary paid API access unless verified in active tool registry'],
      successCriteria: ['Delivers at least 15 verified keyword gaps grouped by thematic pillar with minimum 3 complete article briefs'],
      assumptions: ['Default target locale is English/United States if unspecified'],
      unresolvedDependencies: [],
    },
    researchSources: [
      {
        title: 'Google Search Central: Creating Helpful, Reliable, People-First Content',
        url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
        sourceType: 'official_doc',
        retrievalDate: '2026-11-01',
        keyFindings: ['E-E-A-T emphasis', 'Information gain scoring', 'Direct answer satisfaction'],
        verifiedClaims: ['Google rewards unique perspectives and original analysis over rehashed SERP summaries.'],
        limitations: ['Algorithmic weights are not publicly disclosed.'],
      },
      {
        title: 'Search Engine Land SERP Features & Search Intent Guide',
        sourceType: 'industry_standard',
        retrievalDate: '2026-11-01',
        keyFindings: ['Intent categorization patterns', 'Featured snippet structure requirements'],
        verifiedClaims: ['Search queries must be grouped into informational, commercial, and transactional buckets.'],
        limitations: ['Intent classification can fluctuate across localized search clusters.'],
      },
    ],
    files: [
      {
        path: 'SKILL.md',
        language: 'markdown',
        purpose: 'Primary entrypoint containing Claude activation triggers and step-by-step workflow.',
        content: `---
name: competitor-seo-intelligence
description: Conducts competitive organic search research, analyzes keyword overlap, identifies content gaps, and produces prioritized SEO content playbooks. Use when the user asks to analyze competitors, identify SEO opportunities, perform SERP research, or create search-optimized content strategies.
---

# Competitor & SEO Intelligence Analyst

## Role and Objective
You are an elite SEO strategist and competitive intelligence specialist. Your mission is to systematically reverse-engineer competitor search performance, uncover underserved keyword opportunities, and convert raw search signals into high-converting, E-E-A-T compliant content briefs.

## Operating Principles
1. **Evidence-Based Insights**: Never hallucinate search volume or traffic numbers. Clearly label metrics as estimates or cite verified search grounding sources.
2. **Search Intent Primacy**: Always classify keyword intent (Informational, Commercial Investigation, Transactional, Navigational). Content must match user expectations.
3. **Information Gain**: Focus on angles that add unique insight beyond current top-ranking pages rather than merely summarizing them.
4. **Modularity**: Refer to [references/METHODOLOGY.md](references/METHODOLOGY.md) for intent scoring rules and [templates/REPORT_TEMPLATE.md](templates/REPORT_TEMPLATE.md) for final deliverables.

## Required Inputs
- **Primary Domain**: Target URL or brand domain (Required)
- **Competitors**: 1 to 5 competitor domains (Optional; if omitted, identify top organic competitors for the target domain's core offerings)
- **Target Geo / Language**: Market region (Default: US English)

## Tool and Integration Requirements
- **Web Search (Brave Search / Google Search)**: Used to query live SERPs, snippet formats, and current competing URLs.
- **Filesystem**: Used to write reports to disk if running in Claude Code CLI.
- **Manual Fallback**: If web search tools are unavailable, prompt the user for target keywords, export CSVs, or provide high-probability thematic clusters based on authoritative industry knowledge.

## Execution Workflow

1. **Topical Scope & Competitor Identification**
   - Determine core value propositions and product pillars of the primary domain.
   - If competitors are not provided, query the main product categories and identify consistently top-ranking organic domains.

2. **SERP Footprint & Keyword Gap Discovery**
   - For each content pillar, identify high-intent queries where competitors rank on Page 1 while the primary domain is absent or under-ranking.
   - Classify queries using the framework in [references/METHODOLOGY.md](references/METHODOLOGY.md).

3. **Information Gain & Differentiation Analysis**
   - Inspect the top 3 ranking URLs for each priority cluster.
   - Note what they do well (structure, FAQs, calculators) and their critical gaps (outdated data, thin explanations, lack of first-hand experience).

4. **Strategic Prioritization**
   - Score each opportunity: Impact (1-5), Effort (1-5), Opportunity Index = (Impact * 2) / Effort.
   - Group recommendations into Quick Wins, Strategic Pillars, and Defendable Moats.

5. **Deliverable Assembly**
   - Format the findings according to [templates/REPORT_TEMPLATE.md](templates/REPORT_TEMPLATE.md).
   - Generate at least one comprehensive, ready-to-write Content Production Brief.

## Quality Assurance & Verification
Before delivering the report, verify:
- [ ] Every keyword recommendation has an explicit search intent label.
- [ ] No fabricated search volume numbers are presented as absolute facts.
- [ ] Recommendations prioritize information gain and original data.
- [ ] Deliverable matches the format specified in [templates/REPORT_TEMPLATE.md](templates/REPORT_TEMPLATE.md).

## Error Handling and Fallbacks
- If a competitor domain blocks crawling or produces no search results, note the crawl limitation and evaluate alternative organic competitors.
- If no search tools are available, explain the constraint and provide a template-driven framework based on known topical authority models.

## Completion Criteria
The task is complete when the user receives an Executive Summary, a Competitor Matrix, a Prioritized Gap Table with at least 10 high-value opportunities, and a complete Content Production Brief.
`,
      },
      {
        path: 'references/METHODOLOGY.md',
        language: 'markdown',
        purpose: 'Deep dive into search intent classification and opportunity scoring algorithms.',
        content: `# SEO Opportunity Scoring Methodology

## 1. Search Intent Matrix

| Intent Category | User Mindset | Target SERP Feature | Recommended Page Type |
|---|---|---|---|
| **Informational (Know)** | Seeking answers, guides, definitions | Featured Snippet, People Also Ask | Pillar Guides, How-To, Video |
| **Commercial (Investigate)** | Comparing solutions, reading reviews | Comparison Tables, Review Carousels | Best [Category], Versus Pages |
| **Transactional (Do/Buy)** | Ready to purchase or subscribe | Product Schema, Merchant Listings | Product Page, Pricing, Sign-up |
| **Navigational (Go)** | Seeking a specific brand or portal | Site Links, Brand Knowledge Panel | Dedicated Landing Page |

## 2. Opportunity Index Formula
\`\`\`
Opportunity Index = (Business Relevance [1-5] * 2 + Estimated Traffic Potential [1-5]) / Content Production Complexity [1-5]
\`\`\`
- **Index >= 4.0**: Immediate Sprint Priority (Quick Win)
- **Index 2.5 - 3.9**: Next Quarter Roadmap
- **Index < 2.5**: Backlog
`,
      },
      {
        path: 'templates/REPORT_TEMPLATE.md',
        language: 'markdown',
        purpose: 'Standardized deliverable template for executive SEO intelligence reports.',
        content: `# Competitor Organic Search Intelligence Report

**Target Domain:** [Domain]  
**Analyzed Competitors:** [Competitor A], [Competitor B], [Competitor C]  
**Analysis Date:** [Date]  

---

## 1. Executive Summary & Strategic Opportunities
[Summary of competitive positioning, core vulnerabilities identified, and immediate growth vectors]

## 2. Competitive Landscape Matrix
| Competitor | Domain Strength | Core Topical Focus | Dominant Formats | Weakness / Blind Spot |
|---|---|---|---|---|
| [Competitor 1] | High / Med / Low | ... | Long-form articles | Lacks practical templates |
| [Competitor 2] | High / Med / Low | ... | Tool pages | Thin technical explanations |

## 3. High-Priority Keyword Gap Matrix
| Target Keyword | Intent | Comp. Rank | Priority Tier | Proposed Angle / Information Gain |
|---|---|---|---|---|
| ... | Commercial | #2 | Tier 1 | First-party benchmark data |

## 4. Content Production Brief
- **Target Title (H1):** 
- **Target URL Slug:**
- **Primary Keyword:**
- **Secondary Keywords:**
- **Target Persona & User Intent:**
- **Proposed Outline (H2 / H3):**
- **Unique Information Gain Elements:**
`,
      },
      {
        path: 'scripts/validate.py',
        language: 'python',
        purpose: 'Verification script to audit generated SEO briefs for required structural sections.',
        content: `#!/usr/bin/env python3
"""
Validates that generated SEO report markdown conforms to quality standards.
"""
import sys
import re

def validate_report(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    required_sections = [
        r"## 1\.\s+Executive Summary",
        r"## 2\.\s+Competitive Landscape",
        r"## 3\.\s+High-Priority Keyword Gap",
        r"## 4\.\s+Content Production Brief"
    ]

    missing = []
    for pattern in required_sections:
        if not re.search(pattern, content, re.IGNORECASE):
            missing.append(pattern)

    if missing:
        print(f"FAILED: Report is missing required sections: {missing}")
        return False

    print("PASSED: SEO Report satisfies all structural quality criteria.")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate.py <report_path.md>")
        sys.exit(1)
    success = validate_report(sys.argv[1])
    sys.exit(0 if success else 1)
`,
      },
    ],
    testCases: [
      {
        id: 'tc-seo-1',
        title: 'Valid Request with Full Parameters',
        type: 'valid_standard',
        inputPrompt: 'Analyze organic competitors for stripe.com focusing on b2b billing APIs and developer payment integration in US English.',
        expectedBehavior: 'Identifies Adyen, Braintree, and Paddle; isolates developer documentation and SDK keyword gaps; outputs structured comparison matrix and prioritized content brief.',
        evaluationRubric: 'Checks for explicit intent labeling, actionable outline, and zero hallucinated proprietary volume stats.',
      },
      {
        id: 'tc-seo-2',
        title: 'Missing Competitors Input',
        type: 'missing_input',
        inputPrompt: 'Identify SEO opportunities for notion.so workspace productivity.',
        expectedBehavior: 'Automatically identifies top organic competitors (e.g., Coda, ClickUp, Asana) without blocking the user; proceeds with analysis.',
        evaluationRubric: 'Confirms autonomous discovery of competitors and clear documentation of assumptions.',
      },
      {
        id: 'tc-seo-3',
        title: 'Tool Unavailable Scenario',
        type: 'unavailable_tool',
        inputPrompt: 'Analyze competitors for an internal intranet tool without internet access.',
        expectedBehavior: 'Discloses lack of live SERP access, prompts user for target keywords/topics or provides a high-probability thematic framework.',
        evaluationRubric: 'Must not hallucinate live Google search results or fake page rankings.',
      },
      {
        id: 'tc-seo-4',
        title: 'Out of Scope Request',
        type: 'out_of_scope',
        inputPrompt: 'Write a Python script to scrape LinkedIn user profiles for sales leads.',
        expectedBehavior: 'Identifies that web scraping LinkedIn is outside the SEO intelligence scope; politely redirects to organic search keywords or compliance boundaries.',
        evaluationRubric: 'Polite boundary enforcement without executing unsafe or irrelevant tasks.',
      },
    ],
    testResults: [
      {
        testCaseId: 'tc-seo-1',
        executed: true,
        status: 'passed',
        simulatedResponse: 'Identified top 3 competitors (Adyen, Braintree, Square). Formulated 18 keyword gaps across "subscription proration logic" and "multi-currency payout orchestration". Generated full content brief adhering to templates/REPORT_TEMPLATE.md.',
        observedBehaviors: ['Classified all intents as Commercial / Informational', 'Structured opportunity index formula correctly', 'Applied E-E-A-T information gain criteria'],
        passedChecks: ['Intent Classification', 'Deliverable Structure', 'Zero Fabricated Metrics'],
        failedChecks: [],
        reasoning: 'The skill executed with full adherence to operational principles and produced a complete, actionable playbook.',
      },
      {
        testCaseId: 'tc-seo-2',
        executed: true,
        status: 'passed',
        simulatedResponse: 'Autonomous discovery triggered: Selected Coda.io and ClickUp.com as primary organic rivals. Documented selection rationale and completed keyword gap discovery.',
        observedBehaviors: ['Handled missing competitor gracefully', 'Stated assumption clearly'],
        passedChecks: ['Default Assumption Recovery', 'Workflow Continuation'],
        failedChecks: [],
        reasoning: 'Skill did not stall or fail when optional inputs were omitted.',
      },
    ],
    versions: [
      {
        version: 1,
        timestamp: '2026-11-01T10:00:00.000Z',
        changeSummary: 'Initial generation from user prompt.',
        files: [],
      },
    ],
  },
  {
    id: 'skill-excel-dashboard',
    name: 'executive-excel-dashboard-architect',
    displayName: 'Executive Excel & Data Dashboard Architect',
    description: 'Analyzes raw tabular spreadsheets, performs schema discovery, calculates core business KPIs, detects data anomalies, and designs executive-ready visual dashboard architectures. Use when the user asks to turn Excel data into dashboards, build financial models, or create executive KPI reports.',
    taskCategory: 'data_analysis',
    targetEnvironment: 'all',
    status: 'tested',
    userPrompt: 'Create a skill that turns raw Excel and CSV data into executive dashboards with KPI formulas, data quality checks, and chart recommendations.',
    createdAt: '2026-11-01T11:00:00.000Z',
    updatedAt: '2026-11-02T15:10:00.000Z',
    requirements: {
      objective: 'Inspect raw spreadsheet datasets, reconcile anomalies, design dynamic KPI summary formulas, and formulate professional dashboard layouts.',
      taskType: 'data_analysis',
      intendedUser: 'Chief Financial Officers, Operations Directors, Business Analysts',
      operatingContext: 'Spreadsheet environments (Microsoft Excel, Google Sheets, Python/Pandas automation scripts).',
      inputs: [
        { name: 'spreadsheetData', description: 'Raw CSV, TSV, or spreadsheet schema dump', required: true, format: 'Tabular text or schema description' },
        { name: 'executiveAudience', description: 'Target executive role (CFO, COO, VP Sales)', required: false, format: 'String', default: 'General Executive Leadership' },
      ],
      operations: [
        'Data profile and schema discovery (column data types, null rates, cardinality)',
        'Data reconciliation and anomaly detection (outliers, duplicate keys, broken dates)',
        'Core business KPI formulation (Growth YoY, Run-rate, Margin, Churn, CAC/LTV)',
        'Dashboard wireframe and tab structure specification',
        'Formula derivation (XLOOKUP, SUMIFS, LET, dynamic array formulas)',
      ],
      decisions: [
        'Separate raw data tables, calculation sheets, and presentation dashboards',
        'Favor non-volatile modern Excel formulas (XLOOKUP, INDEX/MATCH) over OFFSET/INDIRECT',
      ],
      toolsNeeded: [
        {
          id: 'filesystem',
          name: 'filesystem / python',
          purpose: 'Inspect spreadsheet headers or run data validation scripts',
          availability: 'verified_available',
          fallbackStrategy: 'Request user to paste header rows and sample 5-10 rows directly into chat.',
        },
      ],
      outputs: [
        { name: 'Data Health & Audit Report', type: 'Markdown', description: 'Null percentages, type mismatches, and data integrity flags.' },
        { name: 'Executive Dashboard Architecture', type: 'Markdown Blueprint', description: 'Grid layout, KPI cards, chart specifications, and exact Excel formulas.' },
      ],
      qualityControls: [
        'Every calculated metric must include explicit mathematical formula and cell coordinate mapping',
        'Zero ambiguous aggregations; explicitly specify SUM vs AVERAGE on weighted quantities',
      ],
      constraints: ['Ensure formulas are compatible with Excel 2021+ and Google Sheets'],
      successCriteria: ['Delivers complete wireframe with exact copyable formula strings and color palette guidance'],
      assumptions: ['Standard calendar fiscal year unless specified'],
      unresolvedDependencies: [],
    },
    researchSources: [
      {
        title: 'Microsoft Excel Formula Best Practices: Modern Dynamic Arrays & LET functions',
        url: 'https://support.microsoft.com/en-us/office/let-function-34842dd8-b92b-4d3f-b325-b44fa26e8697',
        sourceType: 'official_doc',
        retrievalDate: '2026-11-01',
        keyFindings: ['Performance benefits of LET', 'Avoiding volatile functions'],
        verifiedClaims: ['LET functions improve formula calculation speed by caching intermediate evaluations.'],
        limitations: ['Requires modern Excel version (2021+ or Microsoft 365).'],
      },
    ],
    files: [
      {
        path: 'SKILL.md',
        language: 'markdown',
        purpose: 'Main operational guide for translating raw numbers into executive presentations.',
        content: `---
name: executive-excel-dashboard-architect
description: Inspects raw spreadsheet data, identifies business metrics, reconciles anomalies, and designs executive KPI dashboard architectures with robust Excel/Google Sheets formulas. Use when the user asks to turn spreadsheets or CSV data into executive dashboards, financial models, or KPI summaries.
---

# Executive Excel & Data Dashboard Architect

## Role and Objective
You are a senior Financial & Operations Analytics Architect. Your goal is to ingest messy spreadsheet data, detect integrity issues, formulate executive KPIs, and engineer modular, high-contrast, board-ready dashboard specifications.

## Operating Principles
1. **Three-Tier Architecture**: Always enforce strict separation:
   - Tier 1: Raw Data (\`data_\` tables - immutable)
   - Tier 2: Staging & Calculation (\`calc_\` tables - formula pivots)
   - Tier 3: Presentation Dashboard (\`dash_\` - clean visuals, no raw numbers)
2. **Formula Integrity**: Never rely on volatile functions (\`OFFSET\`, \`INDIRECT\`). Use modern \`XLOOKUP\`, \`SUMIFS\`, \`FILTER\`, and \`LET\`.
3. **Executive Visual Hierarchy**: Prioritize 4-6 Headline KPI Cards across the top, followed by secondary trend charts and ranked contribution tables.
4. **Detailed Reference**: Check [references/METHODOLOGY.md](references/METHODOLOGY.md) for formula patterns.

## Required Inputs
- **Dataset Sample or Schema**: Column headers, sample rows, and total row count.
- **Audience Focus**: Executive persona (e.g. Finance, Sales, Product, Operations). Default: Executive Committee.

## Execution Workflow

1. **Schema & Data Quality Audit**
   - Identify primary keys, date formats, categorical variables, and monetary metrics.
   - Scan for: Missing timestamps, duplicate records, mixed currency symbols, negative quantities.

2. **KPI Engine Formulation**
   - Translate business questions into formal mathematical calculations:
     - Revenue Run-rate, Growth Rate (MoM, YoY), Net Retention, Blended Contribution Margin.
   - Provide explicit Excel formula strings with range syntax.

3. **Dashboard Wireframe Engineering**
   - Define exact cell grid coordinates (e.g., A1:D4 for KPI Banner, A6:G20 for Primary Trend Chart).
   - Specify chart type (Line for trend over time, Horizontal Bar for categorical rank, Waterfall for variance).

4. **Formatting & Palette Guidelines**
   - Use understated executive palettes: Navy/Slate background with Emerald for positive variance and Crimson for negative variance.

## Error Handling and Fallbacks
- If data types are inconsistent (e.g. numbers stored as text strings), provide the remediation formula (e.g., \`--TRIM(A2)\` or \`VALUE()\`).
- If data volume exceeds spreadsheet formula limits (>100,000 rows), recommend Power Query or Python transformation steps.
`,
      },
      {
        path: 'references/METHODOLOGY.md',
        language: 'markdown',
        purpose: 'Advanced formula library and chart selection rules.',
        content: `# Executive Formula Reference

## 1. Dynamic Period-Over-Period Variance
\`\`\`excel
=LET(
  currentPeriod, SUMIFS(data_Sales[Revenue], data_Sales[Date], ">="&EOMONTH(TODAY(),-1)+1),
  priorPeriod, SUMIFS(data_Sales[Revenue], data_Sales[Date], ">="&EOMONTH(TODAY(),-2)+1, data_Sales[Date], "<="&EOMONTH(TODAY(),-1)),
  IF(priorPeriod=0, 0, (currentPeriod - priorPeriod) / priorPeriod)
)
\`\`\`

## 2. Chart Decision Framework
- **Trend Over Continuous Time**: Multi-series Smooth Line Chart (Max 4 series).
- **Ranking Categories**: Horizontal Bar Chart ordered descending.
- **Budget vs Actual Variance**: Bullet Chart or Floating Waterfall.
- **Avoid**: 3D Charts, Pie Charts with more than 4 slices, Unscaled Secondary Axes.
`,
      },
    ],
    testCases: [
      {
        id: 'tc-excel-1',
        title: 'Messy E-Commerce Sales Sheet',
        type: 'valid_standard',
        inputPrompt: 'Turn this monthly Shopify export (Order ID, Date, Gross Revenue, Refund Amount, Marketing Spend, Customer ID) into a CFO dashboard.',
        expectedBehavior: 'Calculates Net Revenue, CAC, Refund Rate, and MoM Growth; produces 4 KPI cards and a Waterfall variance layout with exact SUMIFS formulas.',
        evaluationRubric: 'Checks for modern formula usage, 3-tier structure, and specific chart suggestions.',
      },
    ],
    testResults: [],
    versions: [],
  },
  {
    id: 'skill-ts-architect',
    name: 'typescript-fullstack-api-architect',
    displayName: 'TypeScript Full-Stack API Architect',
    description: 'Generates hardened, type-safe REST/tRPC backend APIs with Prisma/Drizzle schemas, Zod validation, JWT authentication, and automated integration test suites. Use when the user asks to build full-stack TypeScript APIs, design database schemas, or implement robust backend microservices.',
    taskCategory: 'coding',
    targetEnvironment: 'claude_code',
    status: 'tested',
    userPrompt: 'Create a skill that builds production-grade TypeScript APIs with database schemas, input validation, and test suites.',
    createdAt: '2026-11-01T12:00:00.000Z',
    updatedAt: '2026-11-02T16:00:00.000Z',
    requirements: {
      objective: 'Design and implement type-safe, resilient TypeScript API backends with rigorous validation and tests.',
      taskType: 'coding',
      intendedUser: 'Backend Engineers, Full-Stack Developers, Solution Architects',
      operatingContext: 'Node.js/TypeScript environments with PostgreSQL/Drizzle or Prisma.',
      inputs: [
        { name: 'businessDomain', description: 'Application business domain and entities', required: true, format: 'Description of domain' },
        { name: 'ormPreference', description: 'Drizzle ORM or Prisma', required: false, format: 'String', default: 'Drizzle ORM' },
      ],
      operations: [
        'Domain modeling and database schema definition with foreign key constraints',
        'Zod schema contract derivation for request payloads and query parameters',
        'Controller and service layer separation with dependency injection',
        'Error middleware and HTTP status code normalization',
        'Automated Vitest/Supertest integration test file generation',
      ],
      decisions: ['Strict separation of HTTP transport layer from business domain services'],
      toolsNeeded: [
        {
          id: 'filesystem',
          name: 'filesystem',
          purpose: 'Create and write source code files and migrations',
          availability: 'verified_available',
          fallbackStrategy: 'Print pristine single-block code snippets with file path headers.',
        },
      ],
      outputs: [
        { name: 'Database Schema File', type: 'TypeScript', description: 'Drizzle/Prisma schema with indexes and relations.' },
        { name: 'Zod Validation Schemas', type: 'TypeScript', description: 'Strict request validation rules.' },
        { name: 'API Handlers & Tests', type: 'TypeScript', description: 'Controllers, route registrations, and Vitest specs.' },
      ],
      qualityControls: ['Zero `any` types; all API responses must be strongly typed with Zod inference'],
      constraints: ['Use strict TypeScript compilation rules'],
      successCriteria: ['Complete working route handler with end-to-end integration test'],
      assumptions: ['PostgreSQL target database'],
      unresolvedDependencies: [],
    },
    researchSources: [],
    files: [
      {
        path: 'SKILL.md',
        language: 'markdown',
        purpose: 'Guide for orchestrating clean architecture TypeScript microservices.',
        content: `---
name: typescript-fullstack-api-architect
description: Designs and generates production-ready TypeScript backend APIs, database schemas (Drizzle/Prisma), strict Zod validation pipelines, and automated integration tests. Use when the user asks to build TypeScript APIs, create database schemas, or implement backend services.
---

# TypeScript Full-Stack API Architect

## Role and Objective
You are a Staff Software Architect specializing in resilient TypeScript backends. You architect clean, type-safe API architectures prioritizing security, schema consistency, and comprehensive integration testing.

## Operating Principles
1. **End-to-End Type Safety**: Input validated with Zod -> Service method types inferred -> Database types strictly matched.
2. **Layer Separation**:
   - \`routes/\`: HTTP routing & middleware attachment.
   - \`controllers/\`: Request unwrapping and response status codes.
   - \`services/\`: Pure business logic, independent of Express/Fastify.
   - \`db/schema/\`: Database tables and migrations.
3. **Fail-Fast Validation**: Reject invalid payloads at the route boundary before touching the database.

## Execution Workflow
1. Entity Relationship Modeling (tables, foreign keys, indexes).
2. Zod Contract Definition.
3. Service Layer Business Logic.
4. Route & Controller Wiring.
5. Integration Test Suite with Vitest.
`,
      },
    ],
    testCases: [
      {
        id: 'tc-code-1',
        title: 'Team Collaboration Platform API',
        type: 'valid_standard',
        inputPrompt: 'Build a workspace invitation API where org admins invite members with role-based access control in TypeScript and Drizzle.',
        expectedBehavior: 'Generates organizations, members, and invitations tables; creates Zod invite schema; builds service and route handler with auth check; writes Vitest spec.',
        evaluationRubric: 'Zero any types, proper status codes (400, 401, 403, 404, 201).',
      },
    ],
    testResults: [],
    versions: [],
  },
];

// Run validator on all starter skills
STARTER_SKILLS.forEach((skill) => {
  skill.validationReport = validateSkillPackage(skill.files);
});
