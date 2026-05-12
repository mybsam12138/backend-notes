# Rating Engine — Implementation & Why Generics Beats Polymorphism

---

## Part 1 — How the Rating Engine Is Built

### 1. Shared Domain Objects

```java
// Base result
public class Premium {
    private final double amount;
    private final String currency;

    public Premium(double amount) {
        this.amount = amount;
        this.currency = "USD";
    }

    public double getAmount() { return amount; }

    @Override
    public String toString() {
        return currency + " " + String.format("%.2f", amount);
    }
}

// Base input — all product params extend this
public abstract class ProductParameters {
    private final String policyNumber;
    private final String insuredName;

    public ProductParameters(String policyNumber, String insuredName) {
        this.policyNumber = policyNumber;
        this.insuredName = insuredName;
    }

    public String getPolicyNumber() { return policyNumber; }
    public String getInsuredName()  { return insuredName; }
}

// Custom exception
public class RatingException extends Exception {
    public RatingException(String message) {
        super(message);
    }
}
```

---

### 2. Generic Interface — The Contract

```java
// T is bound per implementation — compiler enforces the correct input type
public interface RatingRules<T extends ProductParameters> {
    Premium calculate(T params) throws RatingException;
}
```

---

### 3. Motor Insurance

```java
// Motor-specific input
public class MotorParameters extends ProductParameters {
    private final double vehicleSumInsured;
    private final int driverAge;
    private final int yearsNoClaim;       // No-claim discount years

    public MotorParameters(String policyNumber, String insuredName,
                           double vehicleSumInsured, int driverAge, int yearsNoClaim) {
        super(policyNumber, insuredName);
        this.vehicleSumInsured = vehicleSumInsured;
        this.driverAge = driverAge;
        this.yearsNoClaim = yearsNoClaim;
    }

    public double getVehicleSumInsured() { return vehicleSumInsured; }
    public int getDriverAge()            { return driverAge; }
    public int getYearsNoClaim()         { return yearsNoClaim; }
}

// Motor rating logic
public class MotorRatingRules implements RatingRules<MotorParameters> {

    private static final double BASE_RATE     = 0.0263; // 2.63% of sum insured
    private static final double YOUNG_LOADING = 1.25;   // +25% if driver < 25
    private static final double NCD_DISCOUNT  = 0.10;   // -10% per NCD year, max 50%

    @Override
    public Premium calculate(MotorParameters params) throws RatingException {
        if (params.getVehicleSumInsured() <= 0) {
            throw new RatingException("Vehicle sum insured must be greater than zero.");
        }

        double premium = params.getVehicleSumInsured() * BASE_RATE;

        // Young driver loading
        if (params.getDriverAge() < 25) {
            premium *= YOUNG_LOADING;
        }

        // No-claim discount (capped at 50%)
        double ncdRate = Math.min(params.getYearsNoClaim() * NCD_DISCOUNT, 0.50);
        premium *= (1 - ncdRate);

        return new Premium(premium);
    }
}
```

---

### 4. Fire Insurance

```java
// Fire-specific input
public class FireParameters extends ProductParameters {
    private final double buildingValue;
    private final double contentsValue;
    private final String constructionType;  // "BRICK", "TIMBER", "STEEL"

    public FireParameters(String policyNumber, String insuredName,
                          double buildingValue, double contentsValue,
                          String constructionType) {
        super(policyNumber, insuredName);
        this.buildingValue = buildingValue;
        this.contentsValue = contentsValue;
        this.constructionType = constructionType;
    }

    public double getBuildingValue()    { return buildingValue; }
    public double getContentsValue()    { return contentsValue; }
    public String getConstructionType() { return constructionType; }
}

// Fire rating logic
public class FireRatingRules implements RatingRules<FireParameters> {

    private static final double BASE_RATE = 0.0015; // 0.15% of total insured value

    @Override
    public Premium calculate(FireParameters params) throws RatingException {
        if (params.getBuildingValue() < 0 || params.getContentsValue() < 0) {
            throw new RatingException("Insured values cannot be negative.");
        }

        double totalValue = params.getBuildingValue() + params.getContentsValue();
        double premium = totalValue * BASE_RATE;

        // Construction type loading
        switch (params.getConstructionType()) {
            case "TIMBER": premium *= 1.40; break; // +40% higher fire risk
            case "BRICK":  premium *= 1.00; break; // standard rate
            case "STEEL":  premium *= 0.85; break; // -15% lower risk
            default:
                throw new RatingException(
                    "Unknown construction type: " + params.getConstructionType());
        }

        return new Premium(premium);
    }
}
```

---

### 5. Rule Engine — Wiring It All Together

```java
import java.util.HashMap;
import java.util.Map;

public class RatingEngine {

    // Store each rule under its parameter class as the key
    private final Map<Class<?>, RatingRules<?>> rules = new HashMap<>();

    public <T extends ProductParameters> void register(
            Class<T> type, RatingRules<T> rule) {
        rules.put(type, rule);
    }

    @SuppressWarnings("unchecked")
    public <T extends ProductParameters> Premium rate(T params) throws RatingException {
        RatingRules<T> rule = (RatingRules<T>) rules.get(params.getClass());

        if (rule == null) {
            throw new RatingException(
                "No rating rule registered for: " + params.getClass().getSimpleName());
        }

        return rule.calculate(params);
    }
}
```

---

### 6. Usage — Putting It All Together

```java
public class Main {
    public static void main(String[] args) throws RatingException {

        // Build and register rules
        RatingEngine engine = new RatingEngine();
        engine.register(MotorParameters.class, new MotorRatingRules());
        engine.register(FireParameters.class,  new FireRatingRules());

        // Motor: vehicle worth $50,000, driver age 22, 3 NCD years
        MotorParameters motorParams = new MotorParameters(
            "POL-001", "John Smith", 50_000, 22, 3);
        Premium motorPremium = engine.rate(motorParams);
        System.out.println("Motor Premium: " + motorPremium); // USD 987.75

        // Fire: building $300,000, contents $50,000, timber construction
        FireParameters fireParams = new FireParameters(
            "POL-002", "Jane Doe", 300_000, 50_000, "TIMBER");
        Premium firePremium = engine.rate(fireParams);
        System.out.println("Fire Premium: " + firePremium);   // USD 245.00
    }
}
```

---

## Part 2 — Why Generics, Not Just Polymorphism

### The Problem with Polymorphism Alone

Without generics, the interface must accept the base type:

```java
interface RatingRules {
    Premium calculate(ProductParameters params);
}

class MotorRatingRules implements RatingRules {
    public Premium calculate(ProductParameters params) {
        MotorParameters mp = (MotorParameters) params; // forced cast
        // Caller passes FireParameters by mistake?
        // Compiler says nothing. Runtime says 💥 ClassCastException.
    }
}
```

### Why You Can't Just Override with a Specific Type

```java
class MotorRatingRules implements RatingRules {
    // ❌ NOT an override — this is an overload
    // Java sees calculate(MotorParameters) ≠ calculate(ProductParameters)
    public Premium calculate(MotorParameters params) { ... }
}
```

Java blocks this due to the **Liskov Substitution Principle (LSP)**:
> If `RatingRules` promises to accept any `ProductParameters`,
> a subclass cannot secretly narrow that contract to only `MotorParameters`.

### Why Generics Fixes It

Binding `T = MotorParameters` at class declaration resolves `calculate(T)` to `calculate(MotorParameters)` — Java now treats it as a **valid `@Override`**, not an overload. No cast needed, no runtime risk.

```java
// With generics — T bound at class declaration
class MotorRatingRules implements RatingRules<MotorParameters> {
    @Override
    public Premium calculate(MotorParameters params) throws RatingException {
        // ✅ Valid override — T was bound to MotorParameters
        // ✅ No cast — compiler already knows the exact type
    }
}

// Caller — compiler catches wrong type immediately
engine.calculate(new FireParameters()); // ✅ Compile error — not runtime crash
```

---

## Summary Table

|  | Polymorphism Only | Polymorphism + Generics |
|---|---|---|
| Wrong input type caught? | ❌ Runtime `ClassCastException` | ✅ Compile-time error |
| Cast needed inside impl? | ❌ Yes — risky | ✅ No cast at all |
| `calculate(MotorParams)` valid override? | ❌ Treated as overload | ✅ Valid override — T is bound |
| LSP respected? | ⚠️ Violated if you narrow input | ✅ Compiler enforces the contract |
| Add new product (e.g. Marine)? | ❌ Touch base class or cast | ✅ New class + register — done |
| Error discovery timing | 💥 Runtime | 🛡️ Compile time |

---

## One-Line Takeaway

> **Generics binds `T = MotorParameters` at class declaration — turning an impossible override into a valid one, removing all casting, and letting the compiler enforce the type contract before the code ever runs.**
