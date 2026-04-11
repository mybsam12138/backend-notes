# Neural Network — Summary

## 🧠 What is a Neural Network?

A neural network is a machine learning model inspired by how the human brain processes information.  
It consists of layers of interconnected nodes (neurons) that transform input data into meaningful output.

---

## 🧩 Core Components

### 1. Neuron (Node)
Each neuron receives input, applies a weight and bias, then passes the result through an activation function.

### 2. Layers
- **Input Layer**: Receives raw data (e.g., numbers, images, text vectors).
- **Hidden Layers**: Extract patterns and features.
- **Output Layer**: Produces the final result (classification, prediction, etc.).

---

## ⚙️ How It Works (Simple View)

1. Input data enters the network.
2. Each layer applies:
   - Linear transformation (weights + bias)
   - Non-linear activation (e.g., ReLU, Sigmoid)
3. The network gradually learns useful representations.

---

## 📐 Simple Mathematical View

A single neuron computes:

    y = f(Wx + b)

Where:
- `x` = input vector
- `W` = weights
- `b` = bias
- `f` = activation function

---

## 🧠 Training Process

Training means adjusting weights to reduce prediction error.

### Steps:
1. Make a prediction (forward pass)
2. Measure error (loss function)
3. Adjust weights (backpropagation)
4. Repeat many times

---

## 🔁 Why Deep Learning?

A single layer can only learn simple patterns.  
Stacking multiple layers enables the model to learn:

- Edges → Shapes → Objects (in images)
- Letters → Words → Meaning (in text)
- Signals → Patterns → Decisions

---

## 📦 Common Types of Neural Networks

- **Feedforward Neural Network** – basic structure
- **Convolutional Neural Network (CNN)** – good for images
- **Recurrent Neural Network (RNN)** – good for sequences
- **Transformer Models** – good for language and modern AI

---

## 🚀 Key Insight

Neural networks do not follow explicit rules written by humans.  
They learn patterns from data automatically.

---

## 🧾 Summary

- Neural networks mimic brain-like processing
- Built from layers of connected neurons
- Learn by adjusting weights based on data
- Enable modern AI systems like vision, speech, and language models
