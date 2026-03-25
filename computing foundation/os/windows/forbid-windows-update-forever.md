# How to (Almost) Permanently Disable Windows Update

> **Target audience**: developers / power users who value system stability  
> **Goal**: prevent Windows from auto-downloading, auto-installing, and auto-restarting due to updates

⚠️ **Reality check**  
Windows does not officially allow a *100% permanent* shutdown of updates.  
But with the steps below, you can reach **"updates only happen when I explicitly allow them"**.

---

## 1. Core Principle

- ❌ Do NOT delete system files (WinSxS, TrustedInstaller)
- ❌ Do NOT use random "optimizer" tools
- ✅ Disable update *entry points*
- ✅ Keep the system repairable

---

## 2. Disable Windows Update Services (Most Important)

### Open Services Manager
```
Win + R → services.msc
```

### Disable the following services (Chinese UI names)

| Service (Chinese) | Internal Name | Action |
|------------------|---------------|--------|
| Windows 更新 | wuauserv | 禁用 + 停止 |
| 更新协调器服务 | UsoSvc | 禁用 + 停止 |
| 后台智能传送服务 | BITS | 禁用 + 停止 |
| 传递优化 | DoSvc | 禁用 + 停止（可选） |
| Windows更新医疗服务 | Windows Update Medic Service | 禁用 + 停止 |

📌 This alone blocks **most automatic updates**.

---

## 3. Group Policy (Windows Pro / Enterprise)

### Open Group Policy Editor
```
Win + R → gpedit.msc
```

### Path
```
计算机配置
 → 管理模板
   → Windows 组件
     → Windows 更新
```

### Set the following
- **配置自动更新** → 已禁用
- **不允许自动重启** → 已启用

✅ This is the **highest officially supported block**.

---

## 4. Registry Method (Windows Home Compatible)

Create or modify:

```
HKEY_LOCAL_MACHINE
\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU
```

Add:
```
NoAutoUpdate = 1 (DWORD)
```

Reboot required.

---

## 5. Metered Network (Soft Block)

```
设置 → 网络 → 当前网络
 → 设为“按流量计费”
```

- Prevents silent downloads
- Can be bypassed by major updates
- Useful as a **secondary defense**

---

## 6. Windows Update Medic Service (Advanced)

- Service name: **Windows 更新医务服务**
- Purpose: re-enable Windows Update automatically

⚠️ Microsoft intentionally protects this service.
You usually **do NOT need to disable it** unless Windows keeps reactivating updates.

Best practice:
- Let it exist
- Disable core update services instead

---

## 7. What NOT to Disable

❌ These are **not update-related** and may cause instability:

- Windows 推送通知系统服务
- Plug and Play
- Windows Event Log
- User Profile Service

---

## 8. Recommended Real-World Strategy (Engineer Style)

### Daily Work Mode
- Updates disabled
- Stable input method only
- No background changes

### When You Want to Update
1. Enable Windows Update + 更新协调器服务
2. Manually run Windows Update
3. Reboot
4. Disable services again

> **Updates should be opt-in, not surprise events.**

---

## 9. Summary

| Goal | Result |
|----|----|
| No auto download | ✅ |
| No auto install | ✅ |
| No forced reboot | ✅ |
| Manual update possible | ✅ |
| System repairable | ✅ |

---

**Final Advice**  
For a development / production machine:  
> **Stability > Immediate updates**

Use updates like a tool — not like a boss.
