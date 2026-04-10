# What Is RAG (Retrieval-Augmented Generation)?

## Overview

RAG (Retrieval-Augmented Generation) is an architecture pattern that
enhances large language models (LLMs) by dynamically retrieving relevant
knowledge and injecting it into the model's context before generating a
response.

RAG does not retrain or modify the model's weights.\
Instead, it improves responses by controlling what information the model
sees at runtime.

------------------------------------------------------------------------

## What RAG Is NOT

RAG is NOT:

-   Dumping the entire knowledge base into the prompt
-   Fine-tuning the model
-   Updating neural weights
-   Giving the model permanent memory

Throwing the entire knowledge base into context leads to:

-   Token overflow
-   Higher cost
-   Lower precision
-   Increased noise

That is not real RAG.

------------------------------------------------------------------------

## Core Steps of RAG

RAG consists of four major stages:

### 1. Chunking

The knowledge base is split into smaller semantic units (chunks).

Example:

A document about premium calculation might be split into:

-   Base rate logic
-   Age factor rule
-   Risk multiplier rule
-   Discount conditions

Each chunk typically contains 200--1000 tokens.

------------------------------------------------------------------------

### 2. Embedding (Vectorization)

Each chunk is converted into a numerical vector using an embedding
model.

Example vector:

\[0.182, -0.094, 0.337, ...\]

This vector represents semantic meaning, not the original text.

All chunk vectors are stored in a vector database.

------------------------------------------------------------------------

### 3. Similarity Retrieval

When a user submits a prompt:

1.  The prompt is converted into a vector.
2.  The system compares it with stored chunk vectors.
3.  Similarity scores are calculated (often cosine similarity).
4.  The top K most relevant chunks are selected.

------------------------------------------------------------------------

### 4. Context Injection

Only the selected relevant chunks are inserted into the model's context.

Example:

Context: - Age factor rule - Base rate logic

User question: How does age affect premium calculation?

The LLM then generates the final answer using this focused context.

------------------------------------------------------------------------

## Architecture Flow

Knowledge Base (Markdown, Docs) ↓ Chunking ↓ Embedding Model ↓ Vector
Store ↓ Similarity Search ↓ Top K Relevant Chunks ↓ LLM Context ↓
Generated Response

------------------------------------------------------------------------

## Key Components

RAG typically includes:

-   Embedding Model (text → vector)
-   Vector Database (stores vectors)
-   Retriever (similarity search)
-   Large Language Model (reasoning + generation)

------------------------------------------------------------------------

## Why RAG Is Powerful

RAG provides:

-   Token efficiency
-   Reduced hallucination
-   Domain-specific grounding
-   Scalable knowledge integration
-   Dynamic knowledge updates

The model does not need to "know everything."\
It only needs to see what is relevant for the current request.

------------------------------------------------------------------------

## RAG vs Fine-Tuning

  Aspect                            RAG    Fine-Tuning
  --------------------------------- ------ -------------
  Updates model weights             No     Yes
  Dynamic knowledge updates         Yes    No
  Requires retraining               No     Yes
  Cost efficiency                   High   Lower
  Suitable for changing knowledge   Yes    No

------------------------------------------------------------------------

## Summary

RAG is a structured architecture that improves LLM performance by:

-   Converting knowledge into vectors
-   Retrieving semantically relevant chunks
-   Injecting only relevant context
-   Allowing the model to generate grounded responses

In short:

RAG = Retrieval + Context Injection + Generation

It is not about feeding the entire knowledge base to the model.\
It is about intelligently selecting what the model should see.
