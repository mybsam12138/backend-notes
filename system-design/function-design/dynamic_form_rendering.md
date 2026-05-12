# Dynamic Form Rendering — Implementation Guide

## The Problem

In a PAS system, every insurance product has different risk fields:

- **Motor** — vehicle make, model, engine cc, driver age, NCD
- **Fire** — building address, construction type, occupancy type
- **Marine** — vessel name, voyage route, cargo type

The naive approach is to build a dedicated form for each product:

```
MotorRiskForm.vue      ← hardcoded Motor fields
FireRiskForm.vue       ← hardcoded Fire fields
MarineRiskForm.vue     ← hardcoded Marine fields
```

This creates real pain:
- Every new product needs a new frontend component, a new ticket, a new deployment
- Every field change (new option, new field) needs frontend code change
- Business cannot move without waiting for dev

**The goal:** one form component that renders correctly for any product, driven entirely by configuration from the backend.

---

## The Solution — Dynamic Form Rendering

The backend exposes a **field config API** per product. The frontend calls it and renders the correct UI component per field type — no hardcoded form per product.

```
product_risk_field     ← configured once at product launch by dev / admin
                         tells frontend what fields to show, what type, what options

DynamicRiskForm.vue    ← one component, reads config, renders form
                         works for Motor, Fire, Marine — any product
                         zero frontend change when new product launches
```

---

## 1. Database — Product Risk Field Config

Configured once per product at launch. Not a user-facing CRUD — just a reference table set up when a product is onboarded.

```sql
product_risk_field
  ├── field_id
  ├── product_code          MOTOR / FIRE
  ├── field_code            ENGINE_CC
  ├── field_label           Engine Capacity (cc)
  ├── field_type            TEXT / NUMBER / SELECT / RADIO / CHECKBOX / DATE
  ├── data_type             STRING / NUMBER / BOOLEAN / DATE
  ├── is_required           true / false
  ├── min_value             500
  ├── max_value             5000
  ├── max_length            null
  ├── placeholder           e.g. Enter engine capacity
  ├── help_text             Engine capacity in cubic centimetres
  ├── display_order         3
  ├── group_code            VEHICLE_INFO / DRIVER_INFO / COVERAGE
  └── is_active             true

product_risk_field_option       ← options for SELECT, RADIO, CHECKBOX fields
  ├── option_id
  ├── field_id              FK to product_risk_field
  ├── option_code           SALOON
  ├── option_label          Saloon
  └── display_order         1
```

---

## 2. Backend — Field Config API (Java / Spring Boot)

```java
// Field config response DTO
public class RiskFieldConfig {
    private String fieldCode;
    private String fieldLabel;
    private String fieldType;       // TEXT, NUMBER, SELECT, RADIO, CHECKBOX, DATE
    private String dataType;        // STRING, NUMBER, BOOLEAN, DATE
    private boolean isRequired;
    private Integer minValue;
    private Integer maxValue;
    private Integer maxLength;
    private String placeholder;
    private String helpText;
    private int displayOrder;
    private String group;
    private List<FieldOption> options;

    // getters and setters...
}

public class FieldOption {
    private String code;
    private String label;

    // getters and setters...
}

// Service
@Service
public class ProductRiskFieldService {

    private final ProductRiskFieldRepository fieldRepo;
    private final ProductRiskFieldOptionRepository optionRepo;

    public List<RiskFieldConfig> getActiveFields(String productCode) {
        List<ProductRiskField> fields =
            fieldRepo.findByProductCodeAndIsActiveOrderByDisplayOrder(productCode, true);

        return fields.stream().map(field -> {
            RiskFieldConfig config = new RiskFieldConfig();
            config.setFieldCode(field.getFieldCode());
            config.setFieldLabel(field.getFieldLabel());
            config.setFieldType(field.getFieldType());
            config.setDataType(field.getDataType());
            config.setRequired(field.isRequired());
            config.setMinValue(field.getMinValue());
            config.setMaxValue(field.getMaxValue());
            config.setMaxLength(field.getMaxLength());
            config.setPlaceholder(field.getPlaceholder());
            config.setHelpText(field.getHelpText());
            config.setDisplayOrder(field.getDisplayOrder());
            config.setGroup(field.getGroupCode());

            // load options for SELECT, RADIO, CHECKBOX
            List<FieldOption> options = optionRepo
                .findByFieldIdOrderByDisplayOrder(field.getFieldId())
                .stream()
                .map(opt -> new FieldOption(opt.getOptionCode(), opt.getOptionLabel()))
                .collect(Collectors.toList());
            config.setOptions(options);

            return config;
        }).collect(Collectors.toList());
    }
}

// Controller
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRiskFieldService fieldService;

    @GetMapping("/{productCode}/risk-fields")
    public ResponseEntity<List<RiskFieldConfig>> getRiskFields(
            @PathVariable String productCode) {
        return ResponseEntity.ok(fieldService.getActiveFields(productCode));
    }
}
```

---

## 3. Example — API Response

```
GET /products/MOTOR/risk-fields
```

```json
[
  {
    "fieldCode": "MAKE",
    "fieldLabel": "Vehicle Make",
    "fieldType": "SELECT",
    "dataType": "STRING",
    "isRequired": true,
    "displayOrder": 1,
    "group": "VEHICLE_INFO",
    "options": [
      { "code": "TOYOTA", "label": "Toyota" },
      { "code": "BYD",    "label": "BYD" },
      { "code": "HONDA",  "label": "Honda" }
    ]
  },
  {
    "fieldCode": "MODEL",
    "fieldLabel": "Vehicle Model",
    "fieldType": "TEXT",
    "dataType": "STRING",
    "isRequired": true,
    "maxLength": 50,
    "placeholder": "e.g. Camry",
    "displayOrder": 2,
    "group": "VEHICLE_INFO",
    "options": []
  },
  {
    "fieldCode": "ENGINE_CC",
    "fieldLabel": "Engine Capacity (cc)",
    "fieldType": "NUMBER",
    "dataType": "NUMBER",
    "isRequired": true,
    "minValue": 500,
    "maxValue": 5000,
    "placeholder": "e.g. 2000",
    "helpText": "Engine capacity in cubic centimetres",
    "displayOrder": 3,
    "group": "VEHICLE_INFO",
    "options": []
  },
  {
    "fieldCode": "VEHICLE_TYPE",
    "fieldLabel": "Vehicle Type",
    "fieldType": "RADIO",
    "dataType": "STRING",
    "isRequired": true,
    "displayOrder": 4,
    "group": "VEHICLE_INFO",
    "options": [
      { "code": "SALOON",     "label": "Saloon" },
      { "code": "SUV",        "label": "SUV" },
      { "code": "TRUCK",      "label": "Truck" },
      { "code": "MOTORCYCLE", "label": "Motorcycle" }
    ]
  },
  {
    "fieldCode": "IS_EV",
    "fieldLabel": "Is Electric Vehicle?",
    "fieldType": "CHECKBOX",
    "dataType": "BOOLEAN",
    "isRequired": false,
    "displayOrder": 5,
    "group": "VEHICLE_INFO",
    "options": []
  },
  {
    "fieldCode": "MANUFACTURE_YEAR",
    "fieldLabel": "Manufacture Year",
    "fieldType": "NUMBER",
    "dataType": "NUMBER",
    "isRequired": true,
    "minValue": 1990,
    "maxValue": 2026,
    "displayOrder": 6,
    "group": "VEHICLE_INFO",
    "options": []
  }
]
```

---

## 4. Frontend — One Dynamic Form Component (Vue 3)

### RiskField.vue — Single Field Renderer

Handles all field types. Receives a field config object and renders the correct UI element.

```vue
<template>
  <div class="risk-field">

    <!-- TEXT -->
    <input
      v-if="field.fieldType === 'TEXT'"
      type="text"
      :name="field.fieldCode"
      :placeholder="field.placeholder"
      :maxlength="field.maxLength"
      :required="field.isRequired"
      v-model="localValue"
      @change="emit('update:modelValue', localValue)"
    />

    <!-- NUMBER -->
    <input
      v-else-if="field.fieldType === 'NUMBER'"
      type="number"
      :name="field.fieldCode"
      :min="field.minValue"
      :max="field.maxValue"
      :placeholder="field.placeholder"
      :required="field.isRequired"
      v-model="localValue"
      @change="emit('update:modelValue', localValue)"
    />

    <!-- SELECT -->
    <select
      v-else-if="field.fieldType === 'SELECT'"
      :name="field.fieldCode"
      :required="field.isRequired"
      v-model="localValue"
      @change="emit('update:modelValue', localValue)"
    >
      <option value="">-- Select --</option>
      <option
        v-for="opt in field.options"
        :key="opt.code"
        :value="opt.code"
      >
        {{ opt.label }}
      </option>
    </select>

    <!-- RADIO -->
    <div v-else-if="field.fieldType === 'RADIO'" class="radio-group">
      <label
        v-for="opt in field.options"
        :key="opt.code"
        class="radio-option"
      >
        <input
          type="radio"
          :name="field.fieldCode"
          :value="opt.code"
          v-model="localValue"
          @change="emit('update:modelValue', localValue)"
        />
        {{ opt.label }}
      </label>
    </div>

    <!-- CHECKBOX -->
    <input
      v-else-if="field.fieldType === 'CHECKBOX'"
      type="checkbox"
      :name="field.fieldCode"
      v-model="localValue"
      @change="emit('update:modelValue', localValue)"
    />

    <!-- DATE -->
    <input
      v-else-if="field.fieldType === 'DATE'"
      type="date"
      :name="field.fieldCode"
      :required="field.isRequired"
      v-model="localValue"
      @change="emit('update:modelValue', localValue)"
    />

    <!-- Help text -->
    <small v-if="field.helpText" class="help-text">{{ field.helpText }}</small>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  field: Object,
  modelValue: [String, Number, Boolean]
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue ?? '')

watch(() => props.modelValue, val => {
  localValue.value = val
})
</script>
```

---

### DynamicRiskForm.vue — Main Form Component

One component for all products. Loads field config, groups fields, renders, validates, and submits.

```vue
<template>
  <form @submit.prevent="handleSubmit" class="dynamic-risk-form">

    <!-- Render each group -->
    <div
      v-for="(groupFields, groupName) in groupedFields"
      :key="groupName"
      class="field-group"
    >
      <h3>{{ groupName.replace(/_/g, ' ') }}</h3>

      <div
        v-for="field in groupFields"
        :key="field.fieldCode"
        class="field-row"
      >
        <label :for="field.fieldCode">
          {{ field.fieldLabel }}
          <span v-if="field.isRequired" class="required">*</span>
        </label>

        <RiskField
          :field="field"
          v-model="formValues[field.fieldCode]"
        />

        <span v-if="errors[field.fieldCode]" class="error">
          {{ errors[field.fieldCode] }}
        </span>
      </div>
    </div>

    <button type="submit" :disabled="submitting">
      {{ submitting ? 'Saving...' : 'Save Risk' }}
    </button>

  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RiskField from './RiskField.vue'
import axios from 'axios'

const props = defineProps({
  productCode: String,     // e.g. 'MOTOR'
  endorsementId: Number
})

const emit = defineEmits(['saved'])

const fields      = ref([])
const formValues  = ref({})
const errors      = ref({})
const submitting  = ref(false)

// Load field config on mount
onMounted(async () => {
  const res = await axios.get(`/products/${props.productCode}/risk-fields`)
  fields.value = res.data

  // initialise formValues with empty values
  fields.value.forEach(f => {
    formValues.value[f.fieldCode] = f.fieldType === 'CHECKBOX' ? false : ''
  })
})

// Group fields by group_code, sorted by displayOrder
const groupedFields = computed(() => {
  return fields.value
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .reduce((acc, field) => {
      const group = field.group || 'GENERAL'
      if (!acc[group]) acc[group] = []
      acc[group].push(field)
      return acc
    }, {})
})

// Validate required fields
function validate() {
  const newErrors = {}
  fields.value.forEach(field => {
    const value = formValues.value[field.fieldCode]
    if (field.isRequired && (value === '' || value === null || value === undefined)) {
      newErrors[field.fieldCode] = `${field.fieldLabel} is required.`
    }
  })
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Submit — POST flat JSON keyed by fieldCode
async function handleSubmit() {
  if (!validate()) return

  submitting.value = true
  try {
    await axios.post(
      `/policies/endorsements/${props.endorsementId}/risk`,
      {
        productCode: props.productCode,
        riskData: formValues.value
      }
    )
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>
```

---

### Usage in Parent Page

```vue
<template>
  <DynamicRiskForm
    productCode="MOTOR"
    :endorsementId="123"
    @saved="onRiskSaved"
  />
</template>

<script setup>
import DynamicRiskForm from '@/components/DynamicRiskForm.vue'

function onRiskSaved() {
  console.log('Risk saved successfully')
}
</script>
```

To render Fire risk — just change `productCode`:

```vue
<DynamicRiskForm productCode="FIRE" :endorsementId="456" @saved="onRiskSaved" />
```

Zero other changes. Same component, different config.

---

## 5. Payload Submitted to Backend

```json
{
  "productCode": "MOTOR",
  "riskData": {
    "MAKE": "BYD",
    "MODEL": "Atto 3",
    "ENGINE_CC": 0,
    "VEHICLE_TYPE": "SUV",
    "IS_EV": true,
    "MANUFACTURE_YEAR": 2023
  }
}
```

---

## 6. Backend — Validate Against Config Before Saving (Java)

```java
@Service
public class RiskValidator {

    private final ProductRiskFieldRepository fieldRepo;

    public void validate(String productCode, Map<String, Object> riskData)
            throws RiskException {

        List<ProductRiskField> fields =
            fieldRepo.findByProductCodeAndIsActive(productCode, true);

        for (ProductRiskField field : fields) {
            Object value = riskData.get(field.getFieldCode());

            // required check
            if (field.isRequired() && value == null) {
                throw new RiskException(field.getFieldLabel() + " is required.");
            }

            if (value == null) continue;

            // number range check
            if ("NUMBER".equals(field.getDataType())) {
                double num = Double.parseDouble(value.toString());
                if (field.getMinValue() != null && num < field.getMinValue()) {
                    throw new RiskException(
                        field.getFieldLabel() + " must be at least " + field.getMinValue());
                }
                if (field.getMaxValue() != null && num > field.getMaxValue()) {
                    throw new RiskException(
                        field.getFieldLabel() + " must not exceed " + field.getMaxValue());
                }
            }

            // text length check
            if ("STRING".equals(field.getDataType()) && field.getMaxLength() != null) {
                if (value.toString().length() > field.getMaxLength()) {
                    throw new RiskException(
                        field.getFieldLabel() + " must not exceed "
                        + field.getMaxLength() + " characters.");
                }
            }

            // valid option check
            if (!field.getOptions().isEmpty()) {
                boolean valid = field.getOptions().stream()
                    .anyMatch(opt -> opt.getCode().equals(value.toString()));
                if (!valid) {
                    throw new RiskException(
                        "Invalid option for " + field.getFieldLabel());
                }
            }
        }
    }
}
```

---

## 7. Full Flow Summary

```
1. User opens risk entry for product MOTOR
         ↓
2. DynamicRiskForm.vue calls GET /products/MOTOR/risk-fields
   Spring Boot reads product_risk_field + options, returns field config
         ↓
3. Vue renders form dynamically
   SELECT for make, NUMBER for engine cc,
   RADIO for vehicle type, CHECKBOX for IS_EV
   — all driven by fieldType in config, no hardcoded template
         ↓
4. User fills in form
         ↓
5. Vue submits { productCode, riskData: { FIELD_CODE: value } }
         ↓
6. Spring Boot validates riskData against product_risk_field config
         ↓
7. RiskDispatcher routes to MotorRiskHandler
         ↓
8. MotorRiskHandler maps riskData to motor_risk fixed columns and saves
```

---

## 8. Adding a New Product (e.g. Fire)

**Backend (Java):** insert `product_risk_field` records for FIRE — address, construction type, roof type, occupancy type, etc. No code change.

**Frontend (Vue):** zero change.

```vue
<!-- Same component — Fire form renders automatically from config -->
<DynamicRiskForm productCode="FIRE" :endorsementId="789" @saved="onRiskSaved" />
```

---

## Summary

| Concern | Solution |
|---|---|
| What fields to show | `product_risk_field` config table — set up at product launch |
| What UI type to render | `field_type` in config — TEXT, NUMBER, SELECT, RADIO, CHECKBOX, DATE |
| What options to show | `product_risk_field_option` child table |
| Validation rules | `is_required`, `min_value`, `max_value`, `max_length` in config |
| Backend validation | `RiskValidator` reads config and validates submitted JSON |
| Frontend component | One `DynamicRiskForm.vue` + `RiskField.vue` — works for all products |
| New product UI | Zero frontend change — just insert config records and register handler |
| Actual risk data | Saved to fixed columns in `motor_risk`, `fire_risk` per product |
