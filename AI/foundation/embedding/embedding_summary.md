# Embedding — Summary

## 🧠 What is an Embedding?

An **embedding** is a way to represent data (words, sentences, images, etc.) as **numerical vectors** so that a machine learning model can understand and compare them.

Instead of treating data as raw text or symbols, embeddings convert them into numbers that capture **meaning and relationships**.

---

## 🎯 Why Embeddings Matter

Embeddings make it possible to:

- Measure semantic similarity (e.g., “dog” is closer to “puppy” than to “car”)
- Search by meaning, not exact words
- Power recommendation systems
- Enable Retrieval-Augmented Generation (RAG)
- Provide meaningful input to neural networks

---

## ⚙️ How Embeddings Are Learned

1. Start with large amounts of text data.
2. Train a model to predict surrounding words (or the center word).
3. Each word starts with a random vector.
4. During training, vectors are adjusted to improve predictions.
5. Words used in similar contexts end up with similar vectors.

The vectors are stored as weights in an **embedding matrix** inside the model.

---

## 🧩 Input and Output During Training

Training examples look like:

- Input: a word (or context words)
- Output: surrounding words (or target word)

The embedding vector is not the output itself.  
It is the **internal representation** learned during training.

---

## 📦 What the Embedding Actually Is

An embedding is:

- A row in the model’s embedding weight matrix
- A dense vector of real numbers
- A compact representation of meaning

Example:

```text
"apple" → [0.12, -0.33, 0.78, ...]
```

---

## 📐 Similarity and Geometry

Embeddings live in a vector space where:

- Similar meanings → close vectors
- Different meanings → distant vectors

Similarity is often measured using cosine similarity.

---

## 🚀 Common Uses

- Semantic search
- Clustering and classification
- Recommendation systems
- Question answering and RAG
- Large language models

---

## 🧠 Key Insight

Embeddings are learned representations that capture semantic meaning through patterns in data, not through manually defined rules.

---

## 🧾 Summary

- Embeddings turn data into meaningful vectors.
- They are learned by training on large datasets.
- Similar items have similar vectors.
- They are the foundation of modern AI systems.
