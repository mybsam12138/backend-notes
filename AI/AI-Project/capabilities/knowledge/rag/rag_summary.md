# Retrieval-Augmented Generation (RAG) — Summary

## What is RAG?

Retrieval-Augmented Generation (RAG) is a technique that combines:

- A large language model (LLM) for reasoning and generation
- A retrieval system (often powered by a vector database) for fetching relevant information

Instead of relying only on the model’s internal knowledge, RAG retrieves external information and uses it to answer questions.

---

## Core Idea

RAG answers questions by:

1. Embedding the query into a vector
2. Finding similar content in a knowledge base
3. Adding that content to the prompt
4. Asking the LLM to generate an answer using that context

---

## How RAG Works (Step by Step)

### 1. Prepare the Knowledge Base

You start with documents such as:

- Source code
- Documentation
- Policies
- Articles

These are split into smaller chunks:

- Functions
- Paragraphs
- Sections

---

### 2. Embed Each Chunk

Each chunk is converted into a vector using an embedding model.

Example:

```
"Calculate premium based on risk"
→ [0.12, -0.33, 0.77, ...]
```

These vectors are stored in a vector database along with metadata (file name, location, etc.).

---

### 3. Store in a Vector Database

Each stored item looks like:

```
{
  id: "chunk_001",
  vector: [...],
  metadata: {
    source: "PolicyService.java",
    line: 10-40
  }
}
```

The vector DB builds an index (e.g. HNSW) to enable fast similarity search.

---

### 4. User Query

When a user asks a question:

```
"Where is the premium calculation logic?"
```

The query is also converted into an embedding:

```
Query → [0.11, -0.30, 0.80, ...]
```

---

### 5. Similarity Search

The vector DB compares the query vector with stored vectors using similarity metrics such as:

- Cosine similarity
- Dot product
- Euclidean distance

It retrieves the top-K most similar chunks.

---

### 6. Add Retrieved Content to the Prompt

The retrieved chunks are inserted into the prompt:

```
Context:
<relevant chunk 1>
<relevant chunk 2>

Question:
Where is the premium calculation logic?
```

---

### 7. Generate the Answer

The LLM uses:

- The original question
- The retrieved context

to generate a grounded and accurate response.

---

## Why RAG Matters

- Reduces hallucinations
- Keeps answers grounded in real data
- Allows use of private or updated knowledge
- Enables large systems to work with custom data

---

## One-Sentence Summary

RAG works by embedding both the knowledge base and the user query, retrieving the most relevant chunks using vector similarity, and providing those chunks to the LLM to generate an informed answer.
