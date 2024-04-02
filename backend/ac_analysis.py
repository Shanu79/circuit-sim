from matplotlib.pyplot import figure, show, xlabel, ylabel, legend
from lcapy import *
from sympy import *
import cmath
from numpy import pi

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

# # Define an AC circuit
# cct = Circuit("""
# V1 0 1 {100 * sin(2 * pi * 50 * t)};
# R1 1 2 5;
# C1 2 3 400e-6;
# L1 3 0 20e-3;
# """)

# Perform AC analysis by substituting source voltage and converting to frequency domain
cct_ac = cct.ac()

# Correctly calling the phasor method to obtain the phasors for voltages across components
VR_phasor = cct_ac.R1.v.phasor()
VL_phasor = cct_ac.L1.v.phasor()
VC_phasor = cct_ac.C1.v.phasor()
# print(VL_phasor)

e1=str(VR_phasor)
e2=str(VC_phasor)
e3=str(VL_phasor)

# Evaluate the expression
VR = evaluate_complex_expression(e1)
VC = evaluate_complex_expression(e2)
VL = evaluate_complex_expression(e3)

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

# # Create a new figure for plotting
# fig = figure()
# ax = fig.add_subplot(1, 1, 1)

# # Function to plot a phasor with arrowhead
# def plot_phasor_with_arrow(ax, phasor, color, label):
#     ax.quiver(0, 0, phasor.real, phasor.imag, angles='xy', scale_units='xy', scale=100, color=color, label=label)
#     ax.text(phasor.real, phasor.imag, f'  {label}', verticalalignment='bottom')

# # Plotting the phasors with arrowheads
# plot_phasor_with_arrow(ax, r1, 'r', 'V_R')
# plot_phasor_with_arrow(ax, r2, 'b', 'V_L')
# plot_phasor_with_arrow(ax, r3, 'g', 'V_C')

# # Adding features to the plot
# ax.axhline(0, color='black', linewidth=0.5)
# ax.axvline(0, color='black', linewidth=0.5)
# ax.grid(color='gray', linestyle='--', linewidth=0.5)
# xlabel('Real')
# ylabel('Imaginary')
# legend()

# # Set the aspect of the plot to be equal, so circles appear as circles (important for phasor diagrams)
# ax.set_aspect('equal')

# # Display the plot
# show()

# # Create a new figure for plotting
# fig = figure()
# ax = fig.add_subplot(1, 1, 1)

# # Plotting the phasors
# # For VR
# ax.plot(r1.real, r1.imag, 'ro', label='V_R')
# # For VL
# ax.plot(r2.real, r2.imag, 'bo', label='V_L')
# # For VC
# ax.plot(r3.real, r3.imag, 'go', label='V_C')

# # Annotate the points
# ax.text(r1.real, r1.imag, '  V_R', verticalalignment='bottom')
# ax.text(r2.real, r2.imag, '  V_L', verticalalignment='bottom')
# ax.text(r3.real, r3.imag, '  V_C', verticalalignment='bottom')

# # Adding features to the plot
# ax.axhline(0, color='black',linewidth=0.5)
# ax.axvline(0, color='black',linewidth=0.5)
# ax.grid(color = 'gray', linestyle = '--', linewidth = 0.5)
# xlabel('Real')
# ylabel('Imaginary')
# legend()

# # Display the plot
# show()

# Output the result
print(f"Vr: {VR}")
print(f"Vr: {VL}")
print(f"Vr: {VC}")
# phasor(VR).plot()