# Java Access Modifiers Summary

## Overview

Java provides four access modifiers to control visibility:

- `public`
- `protected`
- `default` (package-private, no keyword)
- `private`

They define how classes, methods, fields, and constructors can be accessed.

---

## 1. public

### Definition
Accessible from **anywhere**.

### Example
```java
public class A {
    public int x = 10;

    public void test() {}
}
```

### Access Scope
- same class ✅
- same package ✅
- subclass (different package) ✅
- anywhere (global) ✅

---

## 2. protected

### Definition
Accessible within:
- same package
- subclasses (even in different packages)

### Example
```java
public class A {
    protected int x;
}
```

### Access Scope
- same class ✅
- same package ✅
- subclass (different package) ✅ (via inheritance)
- other classes (different package) ❌

---

## 3. default (package-private)

### Definition
No modifier keyword.

Accessible **only within the same package**.

### Example
```java
class A {
    int x;
}
```

### Access Scope
- same class ✅
- same package ✅
- subclass (different package) ❌
- other packages ❌

---

## 4. private

### Definition
Accessible **only within the same class**.

### Example
```java
public class A {
    private int x;

    private void test() {}
}
```

### Access Scope
- same class ✅
- same package ❌
- subclass ❌
- anywhere else ❌

---

## Access Level Comparison Table

| Modifier   | Same Class | Same Package | Subclass (Different Package) | Other Packages |
|------------|-----------|-------------|------------------------------|---------------|
| public     | ✅        | ✅          | ✅                           | ✅            |
| protected  | ✅        | ✅          | ✅ (via inheritance)         | ❌            |
| default    | ✅        | ✅          | ❌                           | ❌            |
| private    | ✅        | ❌          | ❌                           | ❌            |

---

## Key Notes

### 1. default means "package-private"
- No keyword is written
- Visible only within the same package

---

### 2. protected is NOT simply "package + subclass"
- In different packages, access must be through inheritance

Example:
```java
package pkg1;
public class A {
    protected int x = 10;
}

package pkg2;
import pkg1.A;

public class B extends A {
    public void test() {
        System.out.println(x); // ✅ OK
    }
}

public class C {
    public void test() {
        A a = new A();
        // System.out.println(a.x); ❌ NOT allowed
    }
}
```

---

### 3. private is class-level only
- Not visible even to subclasses
- Often used for encapsulation

---

### 4. Constructors can also use access modifiers

```java
public class A {
    private A() {}
}
```

---

### 5. Top-level class restriction

- Only `public` or `default` allowed

```java
public class A {}   // ✅
class B {}          // ✅ (default)
private class C {}  // ❌ NOT allowed
```

---

## Best Practices

- Use **private** for fields → encapsulation
- Use **public** for APIs
- Use **protected** for inheritance design
- Use **default** for internal package usage

---

## Final Summary

Access modifiers in Java control visibility and encapsulation:

- `public` → accessible everywhere
- `protected` → same package + subclasses
- `default` → same package only
- `private` → same class only

Choosing the right modifier is essential for building maintainable and secure systems.
