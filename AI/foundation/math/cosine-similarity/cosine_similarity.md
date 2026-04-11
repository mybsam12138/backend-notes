# Cosine Similarity — Summary & Example

## 📌 What is Cosine Similarity?

Cosine Similarity measures the **similarity between two vectors** by calculating the cosine of the angle between them.

👉 It focuses on **direction**, not magnitude.

---

## 🧠 Intuition

- Same direction → similarity = **1**
- Perpendicular → similarity = **0**
- Opposite direction → similarity = **-1**

---

## 📐 Formula

cosine_similarity(A, B) = (A · B) / (||A|| × ||B||)

Where:
- A · B = dot product
- ||A|| = magnitude of A
- ||B|| = magnitude of B

---

## 🔢 Step-by-Step Example

Given:

A = [1, 2, 3]  
B = [4, 5, 6]

### 1️⃣ Dot Product

A · B = (1×4) + (2×5) + (3×6) = 32

### 2️⃣ Magnitudes

||A|| = sqrt(1² + 2² + 3²) = sqrt(14)  
||B|| = sqrt(4² + 5² + 6²) = sqrt(77)

### 3️⃣ Final Result

cosine_similarity = 32 / (sqrt(14) × sqrt(77)) ≈ 0.974

---

## ✅ Result

👉 Cosine Similarity ≈ **0.974** (high similarity)

---

## 🧩 Why It’s Useful

- Semantic similarity (embeddings)
- RAG retrieval
- Recommendation systems
- Clustering

---

## 🧠 Key Insight

Vectors with same direction are identical in meaning:

[1, 2, 3] vs [2, 4, 6] → similarity = 1

---

## 🚀 Summary

- Measures angle between vectors
- Range: [-1, 1]
- Ignores magnitude
- Core for vector search in AI
