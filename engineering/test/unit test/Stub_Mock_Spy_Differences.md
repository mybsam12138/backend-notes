# Difference Between Stub, Mock, and Spy (Java / Mockito)

------------------------------------------------------------------------

## 1. Overview

In unit testing, **stub**, **mock**, and **spy** are types of *test
doubles*. They are used to replace real dependencies during testing.

Important clarification (Mockito context):

-   `mock()` creates a **mock object**
-   A "stub" is not a separate object type
-   Stub is a **way of using a mock**
-   `spy()` wraps a **real object**

------------------------------------------------------------------------

## 2. Stub

### Definition

A stub is used to **provide predefined return values** for methods.

It focuses on controlling output, not verifying interaction.

### Example

``` java
UserService service = mock(UserService.class);

when(service.getUser(1L))
        .thenReturn(new User(1L, "Sam"));
```

### Characteristics

-   Returns predefined data
-   Does not execute real logic
-   Usually does not verify method calls
-   Used for state/result verification

------------------------------------------------------------------------

## 3. Mock

### Definition

A mock is a fake object used to **verify interactions** between
components.

It can also be stubbed.

### Example

``` java
UserService service = mock(UserService.class);

when(service.getUser(1L))
        .thenReturn(new User(1L, "Sam"));

controller.getUser(1L);

verify(service).getUser(1L);
```

### Characteristics

-   Does not execute real logic
-   Can stub behavior
-   Can verify method calls
-   Used for behavior verification

------------------------------------------------------------------------

## 4. Spy

### Definition

A spy wraps a real object and allows **partial mocking**.

By default, real methods are executed.

### Example

``` java
Calculator real = new Calculator();
Calculator spyCalc = spy(real);

spyCalc.add(2, 3); // real logic runs

doReturn(100).when(spyCalc).multiply(2, 3);
```

### Characteristics

-   Real logic runs by default
-   Can override specific methods
-   Can verify method calls
-   Risk of real side effects

------------------------------------------------------------------------

## 5. Comparison Table

  -------------------------------------------------------------------------
  Feature                   Stub            Mock            Spy
  ------------------------- --------------- --------------- ---------------
  Real logic executed       No              No              Yes (default)

  Can stub behavior         Yes             Yes             Yes

  Can verify calls          Usually No      Yes             Yes

  Used for                  State           Behavior        Partial mocking
                            verification    verification    

  Risk of side effects      Low             Low             High
  -------------------------------------------------------------------------

------------------------------------------------------------------------

## 6. Clean Architecture Guidance

Recommended usage:

-   Domain logic → No mocking
-   Service layer → Mock repository
-   Controller layer → Mock service
-   Avoid spy unless testing legacy code

Overuse of mocks or spies may indicate poor design.

------------------------------------------------------------------------

## 7. Key Insight

-   Mock = fake object
-   Stub = defining return behavior on a mock
-   Spy = real object with optional partial override

Understanding these differences improves test design quality and
architecture clarity.
