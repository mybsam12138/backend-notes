# How TCP Provides Reliable Network Transmission

## 1. What “reliable” means in TCP

TCP (Transmission Control Protocol) is called a **reliable transport protocol** because it tries to ensure that:

- data arrives **without loss**
- data arrives **in the correct order**
- duplicate data is **detected and removed**
- the receiver gets a **continuous byte stream**
- the sender does not overwhelm the receiver or the network

TCP reliability is built on top of IP, because **IP itself is not reliable**.  
IP only tries to deliver packets, but it does not guarantee success, order, or uniqueness.

---

## 2. Core mechanisms TCP uses for reliability

## 2.1 Sequence numbers

Each byte in a TCP stream has a **sequence number**.

This allows TCP to:

- know which data has been sent
- know which data has been received
- detect missing data
- reorder out-of-order segments

Example:

- Sender sends bytes `1-1000`
- Then sends bytes `1001-2000`

If the second segment arrives first, the receiver can see from the sequence number that the first part is still missing.

---

## 2.2 Acknowledgment (ACK)

The receiver sends back an **ACK** to tell the sender what data has been successfully received.

Important idea:

- TCP ACK is usually **cumulative**
- ACK number means: **“I have received everything before this number, and I now expect this byte next.”**

Example:

- Sender sends bytes `1-1000`
- Receiver replies `ACK = 1001`

That means:

- bytes `1-1000` were received successfully
- receiver is waiting for byte `1001`

This lets the sender know what has arrived.

---

## 2.3 Retransmission

If data is lost, TCP will **retransmit** it.

TCP mainly detects loss in two ways:

### a. Timeout retransmission

If the sender does not receive an ACK within a certain time, it assumes the segment may be lost and sends it again.

This timeout is called **RTO (Retransmission Timeout)**.

### b. Fast retransmission

If the sender receives several duplicate ACKs, it can infer that a segment is missing, even before the timeout expires.

Typical rule:

- receive **3 duplicate ACKs**
- retransmit the missing segment immediately

This is faster than waiting for timeout.

---

## 2.4 Checksum

Each TCP segment includes a **checksum**.

The checksum helps detect whether the data was corrupted during transmission.

If corruption is detected:

- the damaged segment is discarded
- the sender will eventually retransmit it

So checksum supports reliability by helping TCP detect transmission errors.

---

## 2.5 Ordered delivery

Because sequence numbers are used, TCP can reorder data before handing it to the application.

Even if packets arrive like this:

- segment 2
- segment 1
- segment 3

TCP can buffer them and deliver to the application in the correct order:

- segment 1
- segment 2
- segment 3

So the application sees an **ordered byte stream**.

---

## 2.6 Duplicate suppression

Sometimes the same segment may arrive more than once, for example due to retransmission.

Because TCP tracks sequence numbers, it can detect duplicates and avoid passing duplicate data to the application.

So the application does not usually need to handle duplicate packets itself.

---

## 2.7 Sliding window

TCP does not send just one packet and wait every time.  
Instead, it uses a **sliding window** mechanism.

This means:

- the sender can send multiple segments before receiving ACKs
- the amount of unacknowledged data is controlled
- transmission is more efficient

The sender keeps moving the window forward as ACKs arrive.

This improves both:

- reliability
- performance

Without a window, TCP would be too slow.

---

## 3. Flow control: protect the receiver

TCP reliability is not only about loss recovery.  
It also means the sender should not send faster than the receiver can process.

TCP uses **flow control** through the **receive window (rwnd)**.

The receiver tells the sender:

- how much buffer space is available
- how much more data it can currently accept

If the receiver is busy, it can advertise a smaller window.  
If the receiver buffer is full, it can advertise a window of zero.

This prevents receiver overflow.

---

## 4. Congestion control: protect the network

Even if the receiver can handle more data, the network itself may be congested.

TCP therefore also uses **congestion control**.

Main idea:

- do not inject too much data into the network too quickly
- reduce sending rate when congestion is detected
- gradually increase sending rate when network conditions improve

Common concepts:

- **cwnd** (congestion window)
- **slow start**
- **congestion avoidance**
- **fast recovery**

Why this matters for reliability:

- if the network is overloaded, packet loss increases
- congestion control reduces overload
- fewer losses means more stable and reliable transmission

So congestion control supports practical reliability.

---

## 5. Connection-oriented communication

TCP is **connection-oriented**.

Before data transfer, TCP performs the **three-way handshake**:

1. client sends SYN
2. server replies SYN-ACK
3. client sends ACK

This process helps both sides:

- confirm that the peer is reachable
- agree on initial sequence numbers
- prepare buffers and state for reliable communication

Because TCP maintains connection state, it can track acknowledgments, retransmissions, windows, and ordering.

---

## 6. Graceful connection closing

TCP also closes connections carefully, usually with a **four-way handshake**.

This helps ensure:

- all remaining data is delivered
- both sides know when transmission is finished

So reliability includes not only sending data correctly, but also ending the session cleanly.

---

## 7. Simple example of TCP reliability

Suppose the sender transmits three segments:

- Segment A: bytes `1-1000`
- Segment B: bytes `1001-2000`
- Segment C: bytes `2001-3000`

Now imagine Segment B is lost.

What happens?

1. Receiver gets Segment A, sends `ACK 1001`
2. Segment B is lost
3. Receiver gets Segment C, but notices bytes `1001-2000` are missing
4. Receiver cannot advance acknowledgment normally, so it keeps sending duplicate `ACK 1001`
5. Sender receives multiple duplicate ACKs
6. Sender fast retransmits Segment B
7. Receiver gets Segment B, now has complete ordered data
8. Receiver sends `ACK 3001`

Result:

- missing data is recovered
- data is delivered in order
- application sees a correct byte stream

---

## 8. Summary

TCP provides reliable transmission mainly through these mechanisms:

- **sequence numbers** → identify and order data
- **ACKs** → confirm successful receipt
- **retransmission** → recover lost data
- **checksum** → detect corruption
- **ordered delivery** → present data in correct order
- **duplicate detection** → avoid repeated data delivery
- **sliding window** → allow efficient controlled sending
- **flow control** → protect the receiver
- **congestion control** → protect the network
- **connection management** → maintain state for reliable communication

In one sentence:

> TCP reliability means that it uses acknowledgments, sequence tracking, retransmission, and window-based control to make sure data is delivered correctly, in order, and as completely as possible.

---

## 9. One more important note

TCP provides reliability at the **transport layer**, but it does **not** mean:

- no delay
- no retransmission cost
- no network congestion
- absolute guarantee under all failures

What TCP really promises is:

- **best-effort reliable delivery with recovery mechanisms**
- as long as the connection remains valid and the network path still works

So TCP is reliable compared with UDP, but it is not “magic” or “perfect.”

---
