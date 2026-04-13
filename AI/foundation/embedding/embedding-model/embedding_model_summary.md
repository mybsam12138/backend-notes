# Embedding Model Summary

## Overview

An **Embedding Model** converts text into a numerical vector that
represents its semantic meaning.

> text → vector (semantic representation)

This vector can be used for: - similarity search (RAG) - clustering -
retrieval - semantic matching

------------------------------------------------------------------------

## 1. Text to Vector Mapping

### Step 1 --- Tokenization

Text is split into tokens:

"I love AI" → \["I", "love", "AI"\]

------------------------------------------------------------------------

### Step 2 --- Token to ID

Each token is mapped to an integer:

\["I", "love", "AI"\] → \[101, 2057, 9932\]

------------------------------------------------------------------------

### Step 3 --- Embedding Layer

Each token ID is converted into a vector:

101 → v1\
2057 → v2\
9932 → v3

Result:

\[v1, v2, v3\]

------------------------------------------------------------------------

## 2. Transformer Layers (Context Understanding)

Embedding models use Transformer layers to make token vectors
**context-aware**.

### What Transformer Does

Each token: - looks at all other tokens - assigns importance
(attention) - updates its vector

------------------------------------------------------------------------

### Example

"AI" attends to: - "I" (low importance) - "love" (high importance)

New vector becomes a weighted combination.

------------------------------------------------------------------------

### Output

\[v1', v2', v3'\]\
(contextualized token vectors)

------------------------------------------------------------------------

## 3. Pooling (Sentence Representation)

After Transformer layers, we convert multiple token vectors into **one
sentence vector**.

------------------------------------------------------------------------

### Common Pooling Methods

#### Mean Pooling

Average all token vectors:

sentence_vector = (v1' + v2' + v3') / 3

------------------------------------------------------------------------

#### CLS Token (BERT-style)

Use special \[CLS\] token as sentence representation.

------------------------------------------------------------------------

#### Learned Pooling (Modern)

Model learns how to combine token vectors optimally.

------------------------------------------------------------------------

## 4. Final Output

Input: "I love AI"

Output: \[0.12, -0.45, 0.88, ...\]

This is a **dense vector** representing the meaning of the sentence.

------------------------------------------------------------------------

## 5. Key Properties

-   Similar meaning → similar vectors\
-   Works in high-dimensional space\
-   Supports cosine similarity for comparison

------------------------------------------------------------------------

## 6. Embedding vs LLM

  Aspect   Embedding Model     LLM
  -------- ------------------- ------------------
  Goal     represent meaning   generate text
  Input    text                text
  Output   vector              tokens
  Usage    RAG, search         chat, generation

------------------------------------------------------------------------

## 7. Full Pipeline

text\
↓\
tokenization\
↓\
token IDs\
↓\
embedding layer (token → vector)\
↓\
Transformer layers (context understanding)\
↓\
pooling (combine vectors)\
↓\
final sentence vector

------------------------------------------------------------------------

## One Sentence Summary

> An embedding model converts text into a semantic vector by mapping
> tokens to vectors, processing them through Transformer layers, and
> combining them into a single representation using pooling.
