# Markdown Grammar Cheat Sheet

This document summarizes **common Markdown (MD) syntax**, suitable for GitHub, blogs, and technical documentation.

---

## 1. Headings

```md
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

---

## 2. Paragraphs & Line Breaks

- Separate paragraphs with a **blank line**
- Line break:
  - End a line with **two spaces**
  - Or use `<br>`

---

## 3. Emphasis

```md
*italic*
_italic_

**bold**
__bold__

***bold italic***
~~strikethrough~~
```

---

## 4. Blockquotes

```md
> This is a quote
>> Nested quote
```

---

## 5. Lists

### Unordered List
```md
- Item
- Item
  - Sub item
* Item
```

### Ordered List
```md
1. First
2. Second
3. Third
```

### Task List (GitHub)
```md
- [x] Done
- [ ] Todo
```

---

## 6. Code

### Inline Code
```md
`inline code`
```

### Code Block
```md
```java
System.out.println("Hello Markdown");
```
```

---

## 7. Links

```md
[Link text](https://example.com)
```

### Reference Links
```md
[Google][1]

[1]: https://google.com
```

---

## 8. Images

```md
![Alt text](image.png)
![Alt text](https://example.com/img.png)
```

---

## 9. Tables

```md
| Name | Age | City |
|------|-----|------|
| Sam  | 30  | SZ   |
| Tom  | 28  | BJ   |
```

Alignment:
```md
| Left | Center | Right |
|:-----|:------:|------:|
```

---

## 10. Horizontal Rule

```md
---
***
___
```

---

## 11. Escaping Characters

```md
\* \_ \# \- \`
```

---

## 12. HTML Support

Markdown allows inline HTML:

```md
<div style="color:red">HTML works</div>
```

---

## 13. Footnotes (Extended Markdown)

```md
This is a footnote[^1].

[^1]: Footnote text
```

---

## 14. Definition List (Extended)

```md
Term
: Definition
```

---

## 15. Common GitHub Extensions

- Task lists
- Tables
- Strikethrough
- Emoji 😄

```md
:rocket: :bug:
```

---

## 16. Markdown Best Practices

- One sentence per line (good for diff)
- Use fenced code blocks with language
- Prefer `-` for lists (GitHub style)
- Keep line length readable

---

## 17. Markdown vs HTML (Quick View)

| Markdown | HTML |
|--------|------|
| Simple | Powerful |
| Readable | Verbose |
| Docs | Layout-heavy pages |

---

## 18. File Extensions

- `.md`
- `.markdown`

---

## 19. Typical Use Cases

- README
- Blog posts
- Technical docs
- Notes

---

**End of Markdown Cheat Sheet**
