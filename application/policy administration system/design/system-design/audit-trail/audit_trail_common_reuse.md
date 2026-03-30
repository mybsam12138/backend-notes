# Audit Framework Design (Monolith, Multi-Module, Single-Table)

## 1. Overview

This document describes a lightweight audit framework for a monolithic
system with multiple subsystems.

### Key Characteristics

-   Annotation-driven (`@Audit`)
-   AOP-based interception
-   Mapper-based entity loading (MyBatis / MyBatis-Flex)
-   Field-level diff logging
-   Each subsystem has its own `audit_log` table
-   No microservices / MQ (simple and practical)

------------------------------------------------------------------------

## 2. Architecture

    common-audit
     ├── annotation
     ├── aspect
     ├── mapper registry
     ├── diff engine
     └── audit model

    subsystem (policy/product)
     ├── service (@Audit)
     ├── mapper
     └── audit_log table

------------------------------------------------------------------------

## 3. Annotation

``` java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Audit {

    String entity();                 // e.g. "Policy"

    String action();                 // CREATE / UPDATE / DELETE

    String idParam() default "id";   // parameter name
}
```

------------------------------------------------------------------------

## 4. Mapper Registry

``` java
@Component
public class MapperRegistry {

    @Autowired
    private Map<String, BaseMapper<?>> mapperMap;

    public BaseMapper<?> getMapper(String entity) {

        String beanName =
            Character.toLowerCase(entity.charAt(0)) + entity.substring(1) + "Mapper";

        BaseMapper<?> mapper = mapperMap.get(beanName);

        if (mapper == null) {
            throw new RuntimeException("No mapper found for " + entity);
        }

        return mapper;
    }
}
```

------------------------------------------------------------------------

## 5. Diff Engine

``` java
@Component
public class DiffEngine {

    public List<FieldChange> diff(Object oldObj, Object newObj) throws Exception {

        List<FieldChange> list = new ArrayList<>();

        if (oldObj == null || newObj == null) return list;

        for (Field f : oldObj.getClass().getDeclaredFields()) {
            f.setAccessible(true);

            Object oldVal = f.get(oldObj);
            Object newVal = f.get(newObj);

            if (!Objects.equals(oldVal, newVal)) {
                list.add(new FieldChange(
                        f.getName(),
                        oldVal,
                        newVal
                ));
            }
        }

        return list;
    }
}
```

------------------------------------------------------------------------

## 6. Models

### FieldChange

``` java
public class FieldChange {
    private String field;
    private Object oldValue;
    private Object newValue;
}
```

### AuditLog

``` java
public class AuditLog {

    private String entity;
    private String entityId;
    private String field;
    private String oldValue;
    private String newValue;
    private String action;
    private String user;
    private LocalDateTime time;
}
```

------------------------------------------------------------------------

## 7. AOP Core Logic

``` java
@Aspect
@Component
public class AuditAspect {

    @Autowired
    private MapperRegistry mapperRegistry;

    @Autowired
    private DiffEngine diffEngine;

    @Autowired
    private ApplicationContext applicationContext;

    @Around("@annotation(audit)")
    public Object around(ProceedingJoinPoint jp, Audit audit) throws Throwable {

        String entity = audit.entity();
        String action = audit.action();

        Object id = extractId(jp, audit.idParam());

        BaseMapper mapper = mapperRegistry.getMapper(entity);

        Object oldObj = null;
        Object newObj = null;

        if ("UPDATE".equals(action) || "DELETE".equals(action)) {
            oldObj = mapper.selectById(id);
        }

        Object result = jp.proceed();

        if ("CREATE".equals(action)) {

            id = resolveIdAfterCreate(jp, result, audit.idParam());
            newObj = mapper.selectById(id);

            saveCreate(entity, id, newObj);
        }

        else if ("UPDATE".equals(action)) {

            newObj = mapper.selectById(id);

            List<FieldChange> changes = diffEngine.diff(oldObj, newObj);

            saveChanges(entity, id, changes, action);
        }

        else if ("DELETE".equals(action)) {

            saveDelete(entity, id, oldObj);
        }

        return result;
    }
}
```

------------------------------------------------------------------------

## 8. ID Extraction

``` java
private Object extractId(ProceedingJoinPoint jp, String idParam) {

    MethodSignature sig = (MethodSignature) jp.getSignature();
    String[] names = sig.getParameterNames();
    Object[] args = jp.getArgs();

    for (int i = 0; i < names.length; i++) {
        if (names[i].equals(idParam)) {
            return args[i];
        }
    }

    return null;
}
```

------------------------------------------------------------------------

## 9. CREATE / UPDATE / DELETE Handling

### CREATE

``` java
private void saveCreate(String entity, Object id, Object newObj) {

    for (Field f : newObj.getClass().getDeclaredFields()) {

        f.setAccessible(true);
        Object val = f.get(newObj);

        AuditLog log = build(entity, id, f.getName(), null, val, "CREATE");

        save(log);
    }
}
```

### UPDATE

``` java
private void saveChanges(String entity, Object id,
                         List<FieldChange> changes, String action) {

    for (FieldChange c : changes) {

        AuditLog log = build(entity, id,
                c.getField(),
                c.getOldValue(),
                c.getNewValue(),
                action);

        save(log);
    }
}
```

### DELETE

``` java
private void saveDelete(String entity, Object id, Object oldObj) {

    AuditLog log = build(entity, id, "DELETE", null, null, "DELETE");

    save(log);
}
```

------------------------------------------------------------------------

## 10. Subsystem Implementation

### Service Example

``` java
@Audit(entity = "Policy", action = "UPDATE", idParam = "policyId")
public void updatePolicy(Long policyId, PolicyDTO dto) {
    policyMapper.updateById(dto);
}
```

### CREATE

``` java
@Audit(entity = "Policy", action = "CREATE", idParam = "id")
public Policy createPolicy(Policy entity) {
    policyMapper.insert(entity);
    return entity;
}
```

### DELETE

``` java
@Audit(entity = "Policy", action = "DELETE", idParam = "policyId")
public void deletePolicy(Long policyId) {
    policyMapper.deleteById(policyId);
}
```

------------------------------------------------------------------------

## 11. AuditLog Persistence per Subsystem

Each subsystem implements its own persistence:

``` java
public interface AuditLogService {
    void save(AuditLog log);
}
```

Example:

``` java
@Service("auditLogService")
public class PolicyAuditLogService implements AuditLogService {

    @Autowired
    private PolicyAuditLogMapper mapper;

    @Override
    public void save(AuditLog log) {
        mapper.insert(log);
    }
}
```

------------------------------------------------------------------------

## 12. Best Practices

-   Use mapper for simple single-table scenarios
-   Ensure transactions are properly committed before reading new data
-   Ignore non-business fields (e.g., updateTime)
-   Handle BigDecimal comparison carefully
-   Ensure CREATE operations return or populate ID
-   Keep audit logic centralized in AOP

------------------------------------------------------------------------

## 13. Summary

This design provides a simple, extensible audit mechanism:

-   Annotation-driven
-   Mapper-based entity loading
-   Field-level change tracking
-   Subsystem-level storage

It is ideal for monolithic systems and can evolve into more advanced
architectures later.
