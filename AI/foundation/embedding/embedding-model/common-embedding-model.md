# Common Embedding Models (Embedding Tables) Overview

## 📌 What is an Embedding Model?

An embedding model converts text into a vector (a list of numbers) that represents its meaning.

- Input: sentence / paragraph
- Output: vector (e.g., 768 / 1024 / 1536 dimensions)

These vectors are used for:
- Semantic search (RAG)
- Similarity comparison
- Clustering
- Recommendation systems

---

## 🥇 1. OpenAI Embeddings

### Model Examples
- text-embedding-3-small
- text-embedding-3-large

### Features
- High quality semantic understanding
- Strong performance for RAG and search
- Easy API usage
- Multilingual support

### Vector Dimensions
- small: 1536
- large: 3072

### Use Cases
- RAG (Retrieval-Augmented Generation)
- Chatbot memory
- Document search

### Pros
- Very accurate
- Stable and widely used

### Cons
- Paid API
- Requires internet access

---

## 🥈 2. Sentence Transformers (SBERT)

### Model Examples
- all-MiniLM-L6-v2
- all-mpnet-base-v2

### Features
- Open-source (based on BERT)
- Can run locally
- Fast and lightweight

### Vector Dimensions
- MiniLM: 384
- mpnet: 768

### Use Cases
- Local RAG systems
- Offline semantic search
- Embedding in backend services (Java/Python)

### Pros
- Free and open-source
- No API cost
- Good performance

### Cons
- Slightly lower accuracy than top commercial models
- Need to manage deployment

---

## 🥉 3. BGE (BAAI Embedding)

### Model Examples
- bge-small-en
- bge-base-en
- bge-large-en

### Features
- Developed by BAAI (Beijing Academy of AI)
- Strong performance in retrieval benchmarks
- Optimized for search tasks

### Vector Dimensions
- small: 384
- base: 768
- large: 1024

### Use Cases
- RAG systems
- Chinese + English retrieval
- High-performance semantic search

### Pros
- Excellent retrieval performance
- Open-source
- Strong multilingual support

### Cons
- Requires GPU for best performance (large model)
- Slightly more complex setup

---

## ⚠️ Important Rule

You MUST use the same embedding model for:

- Query embedding
- Document embedding

Otherwise:
- Vectors are in different spaces
- Similarity comparison becomes meaningless

---

## 🧠 Final Summary

| Model              | Type        | Best For              | Cost     | Deployment |
|------------------|------------|----------------------|----------|------------|
| OpenAI           | API        | Best quality RAG     | Paid     | Cloud      |
| SBERT            | Open-source| Local/offline usage  | Free     | Local      |
| BGE              | Open-source| High retrieval tasks | Free     | Local/GPU  |

---

## 🚀 Recommendation

- Beginner / Fast setup → OpenAI
- Local system / privacy → SBERT
- High-performance retrieval → BGE