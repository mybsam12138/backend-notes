# jstat -gc Columns Explanation

This table explains the most commonly used output of:

```bash
jstat -gc <pid> <interval>
```

All memory units are **KB** unless otherwise stated.

---

## Memory Areas

| Column | Name | Meaning | How to Read It |
|------|------|--------|--------------|
| S0C | Survivor 0 Capacity | Size of Survivor space 0 | One of the two Survivor spaces |
| S1C | Survivor 1 Capacity | Size of Survivor space 1 | Only one Survivor is active at a time |
| S0U | Survivor 0 Used | Used memory in Survivor 0 | Usually 0 if inactive |
| S1U | Survivor 1 Used | Used memory in Survivor 1 | Normal if > 0 |
| EC | Eden Capacity | Total Eden space size | Main allocation area |
| EU | Eden Used | Used Eden memory | High = allocation pressure |
| OC | Old Capacity | Old generation size | Grows as objects age |
| OU | Old Used | Used Old generation | Rising steadily = warning |

---

## Metaspace (Native Memory)

| Column | Name | Meaning | Notes |
|------|------|--------|------|
| MC | Metaspace Capacity | Committed native memory for Metaspace | Not a hard limit |
| MU | Metaspace Used | Used Metaspace memory | Near MC is normal |
| CCSC | Compressed Class Space Capacity | Reserved space for class metadata | JVM-internal |
| CCSU | Compressed Class Space Used | Used compressed class space | Watch for leaks |

> ⚠️ Metaspace is **native memory**, not heap memory.

---

## Garbage Collection Counters

| Column | Name | Meaning | What to Watch |
|------|------|--------|--------------|
| YGC | Young GC Count | Number of Young GCs | High is OK if fast |
| YGCT | Young GC Time (s) | Total Young GC pause time | Avg pause = YGCT / YGC |
| FGC | Full GC Count | Number of Full GCs | Should be near 0 |
| FGCT | Full GC Time (s) | Total Full GC time | Large values = bad |
| CGC | Concurrent GC Count | Concurrent GC cycles | Normal for G1/CMS |
| CGCT | Concurrent GC Time (s) | Time spent in concurrent GC | Consumes CPU, no STW |
| GCT | Total GC Time (s) | YGCT + FGCT + CGCT | % of runtime matters |

---

## Healthy JVM Reference

| Metric | Healthy Range |
|------|--------------|
| Young GC pause | < 10 ms |
| Full GC frequency | 0 (or 1 at startup) |
| Total GC time | < 5% of runtime |
| Old Gen usage | Stable after GC |

---

## Key Takeaways

- **Young GC is cheap and expected**
- **Full GC should be rare**
- Rising **OU + increasing FGC** usually means trouble
- `jstat` shows trends, not root causes

---

## Recommended Next Steps

- Use **GC logs** for pause analysis
- Use **heap dump** for memory leaks
- Use **Native Memory Tracking (NMT)** for Metaspace issues
