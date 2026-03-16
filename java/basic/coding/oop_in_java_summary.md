# Object-Oriented Programming (OOP) in Java

## 1. What is OOP?

Object-Oriented Programming (OOP) is a programming paradigm based on the
concept of **objects**, which bundle:

-   Data (fields / attributes)
-   Behavior (methods / functions)

In Java, everything is organized around classes and objects (except
primitives).

------------------------------------------------------------------------

## 2. The Four Core Principles of OOP

Java OOP is built on four fundamental principles:

1.  Encapsulation\
2.  Abstraction\
3.  Inheritance\
4.  Polymorphism

------------------------------------------------------------------------

## 3. Encapsulation

Encapsulation means:

> Hiding internal state and exposing behavior through controlled
> interfaces.

We use `private` fields and `public` methods (getters/setters).

### Example:

``` java
public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setAge(int age) {
        if (age > 0) {
            this.age = age;
        }
    }

    public void introduce() {
        System.out.println("Hi, I'm " + name + ", age " + age);
    }
}
```

Encapsulation ensures:

-   Internal data cannot be modified directly.
-   Validation logic can be enforced.

------------------------------------------------------------------------

## 4. Abstraction

Abstraction means:

> Exposing only essential behavior while hiding implementation details.

We commonly use **interfaces** or **abstract classes**.

### Example with Interface:

``` java
public interface PaymentService {
    void pay(double amount);
}
```

Implementation:

``` java
public class CreditCardPayment implements PaymentService {
    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using credit card.");
    }
}
```

The caller does not need to know HOW payment works internally.

------------------------------------------------------------------------

## 5. Inheritance

Inheritance allows one class to reuse and extend another class.

> "is-a" relationship

### Example:

``` java
public class Animal {
    public void eat() {
        System.out.println("Animal is eating");
    }
}

public class Dog extends Animal {
    public void bark() {
        System.out.println("Dog is barking");
    }
}
```

Usage:

``` java
Dog dog = new Dog();
dog.eat();  // inherited method
dog.bark(); // own method
```

Inheritance promotes reuse and hierarchical modeling.

------------------------------------------------------------------------

## 6. Polymorphism

Polymorphism means:

> One interface, multiple implementations.

It allows flexible and extensible design.

### Example:

``` java
public class Main {
    public static void main(String[] args) {
        PaymentService payment = new CreditCardPayment();
        payment.pay(100.0);
    }
}
```

Even though the variable type is `PaymentService`,\
the actual object is `CreditCardPayment`.

This enables runtime behavior selection.

------------------------------------------------------------------------

## 7. Why OOP Matters in Java

OOP helps:

-   Organize large systems
-   Separate responsibilities
-   Improve maintainability
-   Enable extensibility
-   Model real-world entities

Enterprise frameworks like:

-   Spring Boot
-   Hibernate
-   JPA

are heavily built on OOP principles.

------------------------------------------------------------------------

## 8. Simple Mental Model

Think of:

-   Class → Blueprint
-   Object → Instance of blueprint
-   Field → Data
-   Method → Behavior

Example:

``` java
User user = new User("Sam", 30);
user.introduce();
```

The object combines state and behavior.

------------------------------------------------------------------------

## 9. Final Summary

OOP in Java is about:

-   Encapsulation → Protect data
-   Abstraction → Hide complexity
-   Inheritance → Reuse logic
-   Polymorphism → Flexible behavior

It is the foundation of most Java backend systems and enterprise
applications.
