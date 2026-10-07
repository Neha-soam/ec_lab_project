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

Support voltage, current, resistance, unit conversion, formula steps, and input validation.

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

A major part of OhmLab is an interactive circuit laboratory.

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

Users should eventually be able to add, move, rotate, delete, edit, connect, simulate, stop, and reset components.

### Circuit Simulation

Initial simulation scope:

1. Single resistor + DC source
2. Series resistor circuits
3. Basic parallel circuits

The simulation engine is the source of truth for electrical values.

### Virtual Multimeter

Planned modes:

- Voltage
- Current
- Resistance

The application should teach:

- Voltmeter → parallel
- Ammeter → series

### Fault Diagnosis

Possible faults:

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

Practical challenges may ask students to:

- Achieve a target current
- Select an appropriate resistor
- Stay below a power rating
- Achieve a target voltage
- Diagnose a faulty circuit

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

## Viva Preparation

Questions cover:

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

## Dark Mode

Support:

- Light theme
- Dark theme

## Future Extensions

Possible future features:

- AI tutor
- Camera-based resistor colour detection
- Oscilloscope
- Temperature simulation
- Non-ohmic components
- Bluetooth multimeter integration
- Kirchhoff's laws
- RC/RL/RLC circuits

## Educational Accuracy

Ohm's Law:

```text
V = IR
```

It describes ohmic behaviour when resistance remains approximately constant under the relevant conditions.

Real components may behave nonlinearly, and temperature can affect resistance.

Simulation results are not the same as measurements from physical laboratory equipment.

## Safety

OhmLab is an educational simulator.

The application should promote:

- Low-voltage educational sources
- Avoiding short circuits
- Respecting component ratings
- Correct measurement methods
- Supervised laboratory work

The application is not a replacement for supervised physical electrical laboratory work.

## Project Status

**Status:** Development

**Goal:** Interactive virtual electrical laboratory for learning and performing Ohm's Law experiments.
