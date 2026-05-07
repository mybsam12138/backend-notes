# 4 Query Methods in the MyBatis Ecosystem

## Overview

| Method | SQL Location | Dynamic SQL | Type-safe | Null-check style | Best for |
|---|---|---|---|---|---|
| XML Mapper | `.xml` file | `<if>`, `<foreach>` tags | ✗ | XML conditions | Complex, reusable SQL |
| Annotation | Java interface | Limited | ✗ | Manual `if` in provider | Simple, short queries |
| SQL Provider | Java class | Full Java logic | ✗ | Manual `if` blocks | Highly dynamic SQL |
| DSL / Wrapper | Java chain | DSL methods | ✓ | Built-in condition arg | Rapid development |

---

## 1. XML Mapper

SQL lives in a separate `.xml` file. The classic MyBatis approach.

**Mapper interface:**
```java
@Mapper
public interface UserMapper {
    List<User> findByCondition(UserQuery query);
}
```

**XML file (`UserMapper.xml`):**
```xml
<mapper namespace="com.example.UserMapper">
  <select id="findByCondition" resultType="User">
    SELECT * FROM user
    <where>
      <if test="name != null">AND name = #{name}</if>
      <if test="age != null">AND age > #{age}</if>
      <if test="status != null">AND status = #{status}</if>
    </where>
    ORDER BY name ASC
  </select>
</mapper>
```

**Supported by:** MyBatis, MyBatis-Plus, MyBatis-Flex (all inherit this)

**Pros:**
- Full SQL control
- Easy to read for complex queries
- Great for joins and subqueries

**Cons:**
- SQL is separated from Java code
- Verbose for simple CRUD
- No type safety on column names

---

## 2. Annotation (`@Select`, `@Insert`, `@Update`, `@Delete`)

SQL written inline on the mapper interface using annotations. No XML file needed.

```java
@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Long id);

    @Insert("INSERT INTO user (name, email, age) VALUES (#{name}, #{email}, #{age})")
    int insert(User user);

    @Update("UPDATE user SET name = #{name} WHERE id = #{id}")
    int update(User user);

    @Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(Long id);
}
```

**Supported by:** MyBatis, MyBatis-Plus, MyBatis-Flex (all inherit this)

**Pros:**
- No XML files — SQL stays close to the Java code
- Simple and easy for basic queries

**Cons:**
- Hard to manage dynamic conditions (no `<if>` tags)
- SQL strings become messy for multi-line queries
- No type safety

---

## 3. SQL Provider (`@SelectProvider`, `@InsertProvider`, etc.)

Dynamic SQL built in a Java class. Combines full Java logic with annotation-style mapping.

**Provider class:**
```java
public class UserSqlProvider {

    public String findByCondition(UserQuery query) {
        return new SQL() {{
            SELECT("id, name, email, age");
            FROM("user");
            if (query.getName() != null) {
                WHERE("name = #{name}");
            }
            if (query.getAge() != null) {
                WHERE("age > #{age}");
            }
            if (query.getStatus() != null) {
                WHERE("status = #{status}");
            }
            ORDER_BY("name ASC");
        }}.toString();
    }
}
```

**Mapper interface:**
```java
@Mapper
public interface UserMapper {

    @SelectProvider(type = UserSqlProvider.class, method = "findByCondition")
    List<User> findByCondition(UserQuery query);
}
```

**Supported by:** MyBatis, MyBatis-Plus, MyBatis-Flex (all inherit this)

**Pros:**
- Full Java logic for dynamic SQL — loops, conditionals, anything
- No XML files
- Good for highly variable query shapes

**Cons:**
- Verbose — manual `if` null checks everywhere
- No type safety on column names (still plain strings)
- Provider class can grow large and hard to maintain

---

## 4. DSL / Wrapper (MyBatis-Plus & MyBatis-Flex only)

A fluent Java API that builds SQL without writing SQL strings or XML. Null checks are built into the API.

### MyBatis-Plus — `LambdaQueryWrapper`

```java
// Select
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .eq(query.getName() != null, User::getName, query.getName())
        .gt(query.getAge() != null, User::getAge, query.getAge())
        .eq(User::getStatus, "ACTIVE")
        .orderByAsc(User::getName)
);

// Insert
userMapper.insert(user);

// Update
userMapper.update(null,
    new LambdaUpdateWrapper<User>()
        .eq(User::getId, 1L)
        .set(User::getName, "John")
);

// Delete
userMapper.delete(
    new LambdaQueryWrapper<User>()
        .eq(User::getId, 1L)
);
```

> The `eq(condition, column, value)` pattern handles null checks inline — no `if` blocks needed.

---

### MyBatis-Flex — `QueryChain`

```java
// Select — reads closest to real SQL, supports joins natively
List<User> users = QueryChain.of(userMapper)
    .select(USER.ID, USER.NAME, USER.EMAIL)
    .from(USER)
    .leftJoin(ORDER).on(USER.ID.eq(ORDER.USER_ID))
    .where(USER.NAME.eq(query.getName()).when(query.getName() != null))
    .and(USER.AGE.gt(query.getAge()).when(query.getAge() != null))
    .orderBy(USER.NAME.asc())
    .list();

// Update
UpdateChain.of(userMapper)
    .set(USER.NAME, "John")
    .where(USER.ID.eq(1L))
    .update();
```

**Supported by:** MyBatis-Plus, MyBatis-Flex only (not plain MyBatis)

**Pros:**
- No SQL strings, no XML
- Type-safe column references (compiler catches typos)
- Built-in null-condition support — no scattered `if` blocks
- MyBatis-Flex DSL supports joins natively

**Cons:**
- Not available in plain MyBatis
- Very complex queries may still need XML as fallback
- Learning curve for the DSL API

---

## Same Query in All 4 Methods

**Goal:** find active users older than 18, order by name

### XML
```xml
<select id="findAdults" resultType="User">
  SELECT * FROM user
  WHERE age > 18 AND status = 'ACTIVE'
  ORDER BY name ASC
</select>
```

### Annotation
```java
@Select("SELECT * FROM user WHERE age > 18 AND status = 'ACTIVE' ORDER BY name ASC")
List<User> findAdults();
```

### SQL Provider
```java
new SQL() {{
    SELECT("*"); FROM("user");
    WHERE("age > 18");
    WHERE("status = 'ACTIVE'");
    ORDER_BY("name ASC");
}}.toString();
```

### DSL — MyBatis-Plus
```java
new LambdaQueryWrapper<User>()
    .gt(User::getAge, 18)
    .eq(User::getStatus, "ACTIVE")
    .orderByAsc(User::getName);
```

### DSL — MyBatis-Flex
```java
QueryChain.of(userMapper)
    .where(USER.AGE.gt(18))
    .and(USER.STATUS.eq("ACTIVE"))
    .orderBy(USER.NAME.asc());
```

---

## Bonus: Getting Copy-Paste Ready SQL in Logs

By default all frameworks log SQL with `?` placeholders. Use **P6Spy** to get real values.

```xml
<!-- pom.xml -->
<dependency>
    <groupId>p6spy</groupId>
    <artifactId>p6spy</artifactId>
    <version>3.9.1</version>
</dependency>
```

```yaml
# application.yml
spring:
  datasource:
    driver-class-name: com.p6spy.engine.spy.P6SpyDriver
    url: jdbc:p6spy:mysql://localhost:3306/mydb
```

```properties
# src/main/resources/spy.properties
appender=com.p6spy.engine.spy.appender.Slf4JLogger
customLogMessageFormat=%(sql)
```

Result — fully substituted SQL you can copy directly into any DB console:
```sql
SELECT * FROM user WHERE age > 18 AND status = 'ACTIVE' ORDER BY name ASC
```
