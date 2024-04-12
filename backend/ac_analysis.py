from matplotlib import pyplot as plt
from matplotlib.pyplot import figure, show, xlabel, ylabel, legend, subplots, savefig
from lcapy import *
from sympy import *
import cmath
from cmath import polar
import numpy as np

def run_ac_analysis(netlist_filename='netlist.txt'):
    # Read the netlist string from the file
    with open(netlist_filename, 'r') as file:
        netlist_string = file.read()

    # Define the circuit with the read netlist
    cct = Circuit(netlist_string)

    # Perform AC analysis
    cct_ac = cct.ac()

    # Helper function to evaluate complex expressions
    def evaluate_complex_expression(expression):
        safe_dict = {
            'sqrt': cmath.sqrt,
            'exp': cmath.exp,
            'atan': cmath.atan,
            'pi': cmath.pi,
            'j': 1j,  # Imaginary unit
        }
        try:
            result = -1j * eval(expression, {"__builtins__": None}, safe_dict)
        except Exception as e:
            print(f"Error evaluating expression: {e}")
            return None  # or raise an exception, or handle it as you see fit
        return complex(result)

    # Lists for storing phasor data and component labels
    v_phasors = []
    labels = []
    colors = []  # We can use a cycle of colors or define a large list manually
    color_cycle = plt.cm.viridis(np.linspace(0, 1, 20))  # More colors than expected components

    # Helper function to extract and store phasors
    def add_phasors(component, label_prefix):
        if component in cct_ac.elements:
            v_phasor_expr = str(cct_ac[component].v.phasor())
            v_phasor = evaluate_complex_expression(v_phasor_expr)
            magnitude, angle = polar(v_phasor)
            v_phasors.append((magnitude, angle))
            labels.append(f'V_{component}')
            colors.append(component_color[label_prefix])

    # Component type to color mapping
    component_color = {
        'R': 'red',    # Resistors are red
        'L': 'yellow', # Inductors are yellow
        'C': 'blue'    # Capacitors are blue
    }

    # Automatically detect components based on common naming conventions
    for component_type_prefix in ['R', 'L', 'C']:  # Resistors, Inductors, Capacitors
        index = 1
        while True:
            component_name = f"{component_type_prefix}{index}"
            if component_name not in cct_ac.elements:
                break
            add_phasors(component_name, component_type_prefix)
            index += 1

    # Plotting on polar projection
    fig, ax = plt.subplots(subplot_kw={'projection': 'polar'})
    for (magnitude, angle), label, color in zip(v_phasors, labels, colors):
        ax.plot([0, angle], [0, magnitude], label=label, color=color)
        annotation = f'{label}: {magnitude:.2f}∠{np.degrees(angle):.0f}°'
        print(annotation)
        ax.annotate(annotation, xy=(angle, magnitude), xytext=(angle + 0.1, magnitude + 0.1),
                    textcoords='data', arrowprops=dict(arrowstyle="->", connectionstyle="arc3", color=color),
                    bbox=dict(boxstyle="round,pad=0.3", facecolor='white', edgecolor=color, alpha=0.5), color=color)

    # Enhance the plot
    ax.set_thetagrids(range(0, 360, 45))
    ax.legend(loc='upper right', bbox_to_anchor=(1.1, 1.1))

    plt.savefig('ac_analysis_phasor.png')

# To run the analysis, call the function with an appropriate netlist file
# run_ac_analysis('netlist.txt')