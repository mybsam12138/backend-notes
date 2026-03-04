
# AI Code Review Context Builder – Architecture Summary

## Overview
This project implements a **context-builder system for AI-assisted code review**.  
Its goal is to automatically gather the **relevant code context around a Git diff** so that a Large Language Model (LLM) can produce higher-quality code review feedback.

Instead of sending the entire repository to the LLM, the system **retrieves the most relevant code fragments** and constructs a prompt containing:

- The **Git diff**
- **Related code chunks**
- Structured **review instructions**

This significantly improves review quality while controlling token usage.

---

# Architecture

The pipeline follows a typical **Code RAG (Retrieval Augmented Generation)** workflow.

```
Git Repository
      │
      ▼
Compute Diff (HEAD~1 vs HEAD)
      │
      ▼
Extract Changed Files
      │
      ▼
Parse Java AST (JavaParser)
      │
      ▼
Extract Symbols
(class names, method names, imports)
      │
      ▼
Retrieve Related Code Chunks
(similarity search)
      │
      ▼
Prompt Builder
      │
      ▼
LLM Code Review
```

---

# Core Components

## 1. Git Diff Service
Responsible for computing the code changes.

Main tasks:
- Compare `HEAD~1` and `HEAD`
- Produce unified diff text
- Identify changed Java files

Example responsibilities:

```
getUnifiedDiff()
getChangedJavaFiles()
```

---

## 2. JavaParser Integration

The system parses Java source code using **JavaParser AST**.

Purpose:

- Extract methods
- Extract symbols
- Build searchable chunks

Example usage:

```
CompilationUnit cu = javaParserProvider.parse(file);
cu.findAll(MethodDeclaration.class);
```

Parser configuration supports modern Java syntax using:

```
LanguageLevel.BLEEDING_EDGE
```

---

## 3. Symbol Extraction

For each changed file, the system extracts:

- Class names
- Method names
- Import statements

Example:

```
symbols.add(type.getNameAsString());
symbols.add(method.getNameAsString());
symbols.add(import.getNameAsString());
```

These symbols are used as **queries to retrieve relevant code** from the indexed repository.

---

## 4. Code Indexer

The repository is indexed at **method-level granularity**.

Each method becomes a **retrievable code chunk**.

Example chunk:

```
public User getUser(Long id) {
    return repository.findById(id);
}
```

Chunks are stored along with a **tokenized representation** for similarity search.

---

## 5. Code Retriever

Given the extracted symbols, the retriever finds the most relevant code chunks.

Example process:

```
symbols -> similarity search -> top K code chunks
```

These chunks provide the **context needed for the LLM to understand the change**.

---

## 6. Prompt Builder

The system constructs a structured prompt containing:

- Review instructions
- Git diff
- Retrieved code context

Example structure:

```
You are a senior Java engineer performing a code review.

Changed diff:
<diff>

Relevant code context:
<retrieved chunks>

Instructions:
...
```

The prompt also enforces a structured output format.

---

# Strengths of the System

## Efficient Context Selection
Only **relevant code snippets** are sent to the LLM instead of the full repository.

Benefits:

- Lower token usage
- Faster responses
- More focused review

---

## AST-Based Code Understanding

Using JavaParser allows the system to:

- Understand Java structure
- Extract meaningful symbols
- Avoid naive text parsing

---

## Modular Architecture

Components are separated:

- Git parsing
- AST parsing
- Symbol extraction
- Retrieval
- Prompt building

This makes the system extensible.

---

# Limitations

Current retrieval is **symbol-based**, which means:

- It finds code with matching names
- It does not fully understand semantic relationships

Examples of missed cases:

- Hidden dependencies
- Cross-module logic
- Complex architectural flows

---

# Comparison with Cursor AI Code Review

| Feature | Context Builder (Current Project) | Cursor |
|-------|-----------------------------------|-------|
Diff Awareness | Yes | Yes |
AST Parsing | Yes | Yes |
Symbol Extraction | Yes | Yes |
Repository Indexing | Method-level | Advanced |
Vector Embedding Search | Partial / Optional | Yes |
Dependency Graph Analysis | No | Yes |
Semantic Code Understanding | Limited | Strong |
Prompt Optimization | Basic | Advanced |
IDE Integration | No | Yes |
Incremental Context Retrieval | Partial | Yes |

---

# System Maturity Level

This system currently represents an **Intermediate AI Code Review Architecture**.

Level breakdown:

### Level 1 – Basic LLM Review
Send raw diff to LLM.

### Level 2 – Context-Aware Review (Current System)
Add relevant code context through retrieval.

Features:
- Symbol extraction
- AST parsing
- Chunk retrieval
- Structured prompt building

### Level 3 – Semantic Code Intelligence
Used by advanced tools.

Features:
- Vector embeddings
- Dependency graphs
- Call graph analysis
- Semantic ranking

Examples:
- Cursor
- Sourcegraph Cody

### Level 4 – Autonomous Code Agents
Future systems.

Features:
- Code reasoning
- Multi-step analysis
- Automated fixes

Examples:
- Devin-like agents

---

# Estimated Capability Level

Your current system is approximately:

**Level 2.5 / 4**

Meaning:

- Stronger than basic LLM review
- Architecturally similar to early RAG-based code assistants
- Missing deeper semantic analysis used by state-of-the-art tools

---

# Potential Future Improvements

To approach Cursor-level capability:

### Add Vector Embeddings
Index code chunks with embeddings.

```
code -> embedding -> vector DB
```

---

### Add Call Graph Analysis

Identify relationships such as:

```
Controller -> Service -> Repository
```

---

### Add Semantic Retrieval

Combine:

```
symbol search
+ embedding search
```

---

### Improve Chunking Strategy

Instead of full methods only:

- class-level chunks
- dependency-aware chunks
- semantic boundaries

---

# Conclusion

The context-builder project successfully implements a **structured pipeline for AI-assisted code review** using:

- Git diff analysis
- Java AST parsing
- Symbol extraction
- Context retrieval
- Prompt generation

This architecture aligns with modern **Retrieval-Augmented Code Review systems** and represents a strong foundation for building more advanced AI development tools.
