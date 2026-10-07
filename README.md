# OhmLab ⚡

## Advanced Interactive Electrical Laboratory

OhmLab is an educational application for EC/EE lab students to learn and experiment with **Ohm's Law** through calculations, virtual experiments, circuit simulation, measurements, graphs, and data analysis.

The goal is to go beyond a simple calculator and create an **interactive virtual electrical laboratory**.

## Project Vision

**Learn → Calculate → Build → Measure → Experiment → Analyze → Diagnose → Practice → Report**

The application is designed around practical lab problems such as repeated calculations, resistor colour-code reading, recording observations, and comparing measured values with theoretical results.

## Core Features

### Ohm's Law Calculator

Calculate:

```text
V = I × R
I = V / R
R = V / I
```

Support:

- Voltage
- Current
- Resistance
- Unit conversion
- Formula and substitution steps
- Input validation

Supported units include mV, V, kV, μA, mA, A, Ω, kΩ, and MΩ.

### Power & Energy Calculator

Support:

```text
P = VI
P = I²R
P = V²/R
E = Pt
```

Include resistor wattage-rating checks and warnings.

### Resistor Colour Code

Support:

- 4-band resistors
- 5-band resistors
- 6-band resistors
- Colour → resistance
- Resistance → colour
- Tolerance information

### Series & Parallel Calculator

Support:

- Series resistance
- Parallel resistance
- Equivalent resistance
- Voltage divider
- Current divider

### Laboratory Observation Table

Students can enter measured voltage and current.

Automatically calculate:

```text
R = V / I
```

Also provide:

- Average resistance
- Minimum/maximum resistance
- Absolute error
- Percentage error

### V-I Graph & Data Analysis

Plot experimental readings with:

- Data points
- Axis labels
- Units
- Tooltips
- Line of best fit
- Slope
- R² where appropriate

### Error Analysis

Compare theoretical and experimental values.

```text
Absolute Error = |Experimental - Theoretical|

Percentage Error =
|Experimental - Theoretical| / Theoretical × 100
```

### LED Series Resistor Calculator

Calculate:

```text
R = (Vs - Vf) / I
```

Also calculate resistor power where appropriate.

## Virtual Electrical Laboratory

A major goal is an interactive circuit laboratory.

### Circuit Builder

Planned components:

- DC voltage source
- Resistor
- Variable resistor
- Switch
- Ammeter
- Voltmeter
- LED
- Diode
- Wires

Users should eventually be able to:

- Add components
- Move components
- Rotate components
- Delete components
- Edit values
- Connect components
- Start/stop simulation
- Reset the circuit

### Circuit Simulation

Initial simulation scope:

1. Single resistor + DC source
2. Series resistor circuits
3. Basic parallel circuits

The simulation engine must be the **source of truth** for electrical values. UI components should not independently calculate circuit values in multiple places.

### Virtual Multimeter

Planned modes:

- Voltage
- Current
- Resistance

The application should teach:

- Voltmeter → parallel
- Ammeter → series

Incorrect measurement configurations should provide explanations.

### Fault Diagnosis

Planned faults:

- Open circuit
- Short circuit
- Wrong resistor
- Incorrect meter connection
- Excessive current
- Reversed LED
- Missing wire
- Component overload

The app should explain what went wrong, where, why, and how to correct it.

## Experiments

Initial guided experiment:

### Verification of Ohm's Law

Workflow:

1. Aim
2. Theory
3. Required components
4. Circuit diagram
5. Procedure
6. Observation table
7. V-I graph
8. Calculations
9. Error analysis
10. Result
11. Conclusion
12. Viva questions

Future experiments may include:

- Series resistance
- Parallel resistance
- Voltage divider
- Power measurement
- Diode V-I characteristics

## Challenge Lab

Future practical challenges may ask students to:

- Achieve a target current
- Select an appropriate resistor
- Stay below a power rating
- Achieve a target voltage
- Diagnose a faulty circuit

The purpose is engineering problem-solving, not excessive gamification.

## Practice & Quiz

Question types:

- Numerical
- MCQ
- True/False
- Circuit interpretation
- Graph interpretation
- Fault diagnosis

Difficulty:

- Beginner
- Intermediate
- Advanced

After submission, show the answer, formula, and explanation.

## Viva Preparation

Questions will cover:

- Ohm's Law
- Voltage
- Current
- Resistance
- Series/parallel circuits
- Multimeter
- Power
- Measurement error
- Resistor colour codes
- LED circuits

## Lab Report Generation

Planned report sections:

1. Title
2. Student information
3. Aim
4. Theory
5. Components
6. Circuit diagram
7. Procedure
8. Observation table
9. Graph
10. Calculations
11. Error analysis
12. Result
13. Conclusion
14. Viva section

Planned export formats:

- PDF
- Excel

Reports must use actual student experiment data.

## Offline Support

Core functionality should work offline where practical:

- Calculator
- Resistor colour decoder
- Series/parallel calculator
- Observation table
- Graphing
- Basic circuit simulation
- Experiment content
- Quiz

AI features may require internet access.

A PWA approach may be used.

## Dark Mode

Support:

- Light mode
- Dark mode

Use a centralized theme system.

# Development Roadmap

Development is intentionally phase-based.

### Phase 0 — Project Audit

Before writing code:

- Inspect repository
- Identify existing stack
- Inspect package.json
- Inspect project structure
- Identify reusable components
- Identify missing dependencies

Do not make major modifications yet.

### Phase 1 — Foundation

Build:

- Application shell
- Navigation
- Theme system
- Responsive layout
- Home page
- Basic routing
- Shared UI components

### Phase 2 — Calculation Engine

Build and test:

- Ohm's Law
- Power
- Energy
- Unit conversion
- Input validation

Then connect the calculator UI.

### Phase 3 — Resistor & Circuit Tools

Build:

- Resistor colour-code decoder
- Resistance → colour
- Series resistance
- Parallel resistance
- Voltage divider
- Current divider
- LED resistor calculator

### Phase 4 — Laboratory Analysis

Build:

- Observation table
- R = V/I
- Average resistance
- Error analysis
- V-I graph
- Slope
- R²
- Data validation

### Phase 5 — Experiment Module

Start with Verification of Ohm's Law.

Build:

- Experiment page
- Theory
- Procedure
- Circuit diagram
- Observation workflow
- Viva questions
- Experiment completion

### Phase 6 — Circuit Builder

Build:

- Circuit workspace
- Component palette
- Components
- Wires
- Nodes
- Move/rotate/delete
- Component properties

### Phase 7 — Basic Circuit Simulation

Implement:

- Circuit validation
- Single-resistor circuit
- Series circuits
- Basic parallel circuits
- Voltage/current calculation
- Simulation state

### Phase 8 — Virtual Multimeter

Implement:

- Voltage measurement
- Current measurement
- Resistance measurement
- Probe interaction
- Incorrect connection detection
- Educational explanations

### Phase 9 — Fault Diagnosis & Challenges

Implement:

- Fault injection
- Fault detection
- Fault explanations
- Challenge circuits
- Target-value challenges

### Phase 10 — Reports & Export

Implement:

- Lab report generation
- PDF export
- Excel export
- Circuit diagram export
- Graph export

### Phase 11 — Offline & Polish

Implement:

- PWA/offline support
- Dark mode
- Loading states
- Empty states
- Error states
- Accessibility improvements
- Mobile optimization

### Phase 12 — Advanced Features

Only after the core application is stable:

- AI tutor
- Camera-based resistor colour detection
- Oscilloscope
- Temperature simulation
- Non-ohmic components
- Bluetooth multimeter integration
- Kirchhoff's laws
- RC/RL/RLC circuits

## Architecture

Recommended React-style structure:

```text
src/
├── components/
├── pages/
├── features/
│   ├── calculator/
│   ├── resistor/
│   ├── circuit/
│   ├── simulation/
│   ├── instruments/
│   ├── experiments/
│   ├── analysis/
│   ├── practice/
│   └── quiz/
├── engine/
│   ├── circuit/
│   ├── physics/
│   ├── units/
│   ├── measurements/
│   └── validation/
├── data/
├── hooks/
├── services/
├── utils/
├── types/
└── styles/
```

Adjust this to the actual project stack rather than replacing a working architecture unnecessarily.

## Development Principles

### Build incrementally

Each phase should be:

1. Implemented
2. Tested
3. Verified
4. Integrated
5. Followed by the next phase

### Keep domain logic separate

Separate:

- UI
- Calculation engine
- Simulation engine
- Unit conversion
- Measurement logic
- Experiment logic
- Data analysis

### Avoid unnecessary complexity

Do not:

- Add unnecessary dependencies
- Add authentication without a need
- Add a backend for purely local functionality
- Create giant components
- Duplicate calculation logic
- Hard-code experiment results
- Build advanced simulation before simple circuits work

## Educational Accuracy

Ohm's Law:

```text
V = IR
```

It describes ohmic behaviour when resistance remains approximately constant under the relevant conditions.

Real components may behave nonlinearly, and temperature can affect resistance.

Simulation results are not the same as measurements from physical laboratory equipment.

Simplified physical models should be clearly identified as educational models.

## Safety

OhmLab is an educational simulator.

The application must not encourage experimentation with household mains electricity.

Safety guidance should emphasize:

- Low-voltage educational sources
- Avoiding short circuits
- Component ratings
- Correct measurement methods
- Supervised laboratory work

## Testing

Test every major feature with:

- Valid input
- Empty input
- Invalid input
- Boundary values
- Unit conversion
- Error handling

Example:

```text
10 V / 2 Ω = 5 A
```

Circuit tests should include:

- Valid series circuit
- Valid parallel circuit
- Open circuit
- Short circuit
- Missing component
- Incorrect meter placement

## Project Status

**Status:** Development

**Strategy:** Phase-by-phase implementation

**Starting point:** Phase 0 — Project Audit

See [`CLAUDE.md`](./CLAUDE.md) for detailed development instructions.
