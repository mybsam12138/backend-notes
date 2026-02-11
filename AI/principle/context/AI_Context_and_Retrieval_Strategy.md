# AI Context Window, Retrieval Strategy, and Accuracy Optimization

## 1. Maximum Token Context Explained

Modern large language models (LLMs) operate within a **context window**,
typically around:

-   \~128,000 tokens (for GPT-5 class models, common configuration)

### What Is Included in the Context Window?

The total context includes:

-   System instructions
-   Conversation history
-   Current user input
-   Retrieved code snippets or documents
-   Model output

All of these combined must fit within the model's maximum token limit.

### Important Distinction

-   **Input + Output ≤ Context Window**
-   Output is usually capped (often \~4k--8k tokens)
-   Large inputs reduce available output space

------------------------------------------------------------------------

## 2. Why Large Codebases Cannot Be Fully Loaded

If a repository contains:

-   500k+ tokens
-   Multiple modules
-   Large Java enterprise code

It cannot fit entirely inside a 128k token window.

Therefore, tools must selectively choose what to send to the model.

------------------------------------------------------------------------

## 3. How Cursor / Claude Code Analyze Large Projects

They use a technique called:

> Retrieval-Augmented Generation (RAG)

### Step 1 --- Indexing

-   Split files into chunks (200--800 tokens)
-   Convert each chunk into an embedding vector
-   Store in a vector database

### Step 2 --- Query Embedding

-   Your question is converted into a vector
-   Similarity search finds the most relevant chunks

### Step 3 --- Ranking

Chunks are ranked using: - Semantic similarity - File proximity - Recent
edits - Open files - Directory context

### Step 4 --- Token Budget Packing

The tool selects top-ranked chunks until: - Token budget limit is
reached - Space is preserved for output

Only selected snippets are sent to the model.

------------------------------------------------------------------------

## 4. Why Retrieval Is Not Perfect

Embedding retrieval is statistical, not logical.

Limitations include:

-   Missing indirect dependencies
-   Weak semantic signals in vague naming
-   Cross-module logic not retrieved
-   Hidden configuration not included

The model only reasons over what it sees.

------------------------------------------------------------------------

## 5. Strategies for Getting Accurate Responses

### Strategy 1 --- Explicit Scope Definition

Instead of:

> Why is premium wrong?

Use:

> In quotation-module, using wf_bmnfl_entity table and rule R-2024-03,
> premium is expected to be prorated for short-term policies, but it is
> not.

This reduces ambiguity.

------------------------------------------------------------------------

### Strategy 2 --- Mention Specific Entities

Include:

-   Module name
-   Class name
-   Table name
-   Business rule ID
-   Expected vs actual behavior

This improves retrieval accuracy.

------------------------------------------------------------------------

### Strategy 3 --- Provide Snippets When Critical

If reasoning depends on:

-   Configuration
-   Wiring
-   Bean injection
-   SQL definition

Manually include those snippets.

------------------------------------------------------------------------

### Strategy 4 --- Keep Boundaries Clean

AI retrieval works best when:

-   File names are descriptive
-   One file ≈ one responsibility
-   Business rules are documented
-   Modules have clear separation

Poor naming reduces embedding accuracy.

------------------------------------------------------------------------

## 6. Key Insight for AI-Era Engineering

AI accuracy depends more on:

-   Context clarity
-   Boundary definition
-   Structured problem framing

Than on:

-   Microservice vs monolith
-   Larger model size
-   Bigger token window

------------------------------------------------------------------------

## 7. Final Summary

-   Context window is limited (\~128k tokens)
-   Large repos require chunking + retrieval
-   Tools send only relevant snippets
-   Precision improves when scope is explicit
-   Accurate prompts = structured reasoning boundaries

AI does not understand your whole project.

It understands only what you choose (or retrieval chooses) to show it.
