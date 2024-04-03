from matplotlib import pyplot as plt
from matplotlib.pyplot import figure, show, xlabel, ylabel, legend
from lcapy import *
from sympy import *
import cmath
from cmath import polar
import numpy as np

def evaluate_complex_expression(expression):
    # Define a safe list of functions and constants
    safe_dict = {
        'sqrt': cmath.sqrt,
        'exp': cmath.exp,
        'atan': cmath.atan,
        'pi': cmath.pi,
        'j': 1j,  # Imaginary unit
    }

    # Evaluate the expression safely
    try:
        result = -j*eval(expression, {"__builtins__": None}, safe_dict)
    except Exception as e:
        # Handle error (here we just print it, but you might want to handle it differently)
        print(f"Error evaluating expression: {e}")
        return None  # or raise an exception, or handle it as you see fit

    # Ensure the result is treated as a complex number
    return complex(result)

# Read the netlist string from the file
netlist_filename = 'netlist.txt'
with open(netlist_filename, 'r') as file:
    netlist_string = file.read()

# Define the circuit with the read netlist
cct = Circuit(netlist_string)

# Perform AC analysis by substituting source voltage and converting to frequency domain
cct_ac = cct.ac()

# Correctly calling the phasor method to obtain the phasors for voltages across components
VR_phasor = cct_ac.R1.v.phasor()
VL_phasor = cct_ac.L1.v.phasor()
VC_phasor = cct_ac.C1.v.phasor()

e1=str(VR_phasor)
e2=str(VC_phasor)
e3=str(VL_phasor)

# Evaluate the expression
VR = evaluate_complex_expression(e1)
VC = evaluate_complex_expression(e2)
VL = evaluate_complex_expression(e3)

# Output the result
print(f"Vr: {VR}")
print(f"Vl: {VL}")
print(f"Vc: {VC}")

# List of the complex numbers for iteration
phasors = [VR, VC, VL]
labels = ['V_R', 'V_C', 'V_L']
colors = ['red', 'green', 'blue']  # Different color for each phasor

# Plotting on polar projection
fig, ax = plt.subplots(subplot_kw={'projection': 'polar'})

# Iterate over each phasor to plot
for phasor, label, color in zip(phasors, labels, colors):
    magnitude, angle = polar(phasor)
    ax.plot([0, angle], [0, magnitude], color=color, label=label)
    mag = magnitude
    angle_deg = np.degrees(angle)  # Convert angle to degrees
    annotation = f'{label}: {mag:.2f}∠{angle_deg:.0f}°'
    ax.annotate(annotation, xy=(angle, magnitude), xytext=(angle + 0.2, magnitude + magnitude*0.2),
                textcoords='data', arrowprops=dict(arrowstyle="->", connectionstyle="arc3", color=color),
                bbox=dict(boxstyle="round,pad=0.3", facecolor='white', edgecolor=color, alpha=0.5), color=color)

# Enhance the plot
ax.set_thetagrids(range(0, 360, 90), labels=['0°', '90°', '180°', '270°'])
ax.legend(loc='upper right', bbox_to_anchor=(1.1, 1.1))

plt.show()