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
            result = j*eval(expression, {"__builtins__": None}, safe_dict)
        except Exception as e:
            print(f"Error evaluating expression: {e}")
            return None  # or raise an exception, or handle it as you see fit
        return complex(result)
    
    # Lists for storing phasor data and component labels
    v_phasors = []
    v_labels = []

    i_phasors=[]
    i_labels=[]

    # Helper function to extract and store phasors
    def add_phasors(component):
        # Voltage phasor
        v_phasor_expr = str(cct_ac[component].v.phasor())
        v_phasor = evaluate_complex_expression(v_phasor_expr)
        if v_phasor is not None:
            magnitude, angle = polar(v_phasor)
            v_phasors.append((magnitude, angle))
            v_labels.append(f'V_{component}')
        
        # Current phasor
        i_phasor_expr = str(cct_ac[component].i.phasor())
        i_phasor = evaluate_complex_expression(i_phasor_expr)
        if i_phasor is not None:
            magnitude, angle = polar(i_phasor)
            i_phasors.append((magnitude, angle))
            i_labels.append(f'I_{component}')

    # Automatically detect components based on common naming conventions
    component_count=0
    for component_type_prefix in ['A', 'V', 'R', 'L', 'C']: 
        component_count+=1
        index = 1
        while True:
            component_name = f"{component_type_prefix}{index}"
            if component_name not in cct_ac.elements:
                break
            add_phasors(component_name)
            index += 1

    # Plotting on polar projection
    fig=plt.figure()
    ax = fig.add_subplot(111, polar=True)
    
    res_voltages={};
    res_current={};
    #ax.arrow(0,0,LV.theta[1],LV.mag[1], length_includes_head=True)
    for (magnitude, angle), label in zip(v_phasors, v_labels):
        # Optional: Print phasor data to the console for debugging or overview
        annotation = f'{label}: {magnitude:.2f}∠{np.degrees(angle):.0f}°'
        print(annotation)
        res_voltages[label] = f'{magnitude:.2f}∠{np.degrees(angle):.0f}°'
        
        ax.plot([0, angle], [0, magnitude], label=annotation)

    # Enhance the plot
    ax.set_yticklabels([])
    ax.legend(bbox_to_anchor=(0,0,1,1), bbox_transform=fig.transFigure)
    plt.savefig('static/ac_analysis_voltage_phasor.png')


    # Plotting on polar projection
    fig=plt.figure()
    ay = fig.add_subplot(111, polar=True)
   
    #ax.arrow(0,0,LV.theta[1],LV.mag[1], length_includes_head=True)
    for (magnitude, angle), label in zip(i_phasors, i_labels):
        # Optional: Print phasor data to the console for debugging or overview
        annotation = f'{label}: {magnitude:.2f}∠{np.degrees(angle):.0f}°'
        print(annotation)
        res_current[label]=f'{magnitude:.2f}∠{np.degrees(angle):.0f}°'
        
        # Plot a visible line for legend purposes (make it very short and outside the normal view)
        ay.plot([0, angle], [0, magnitude], label=annotation)

    # Enhance the plot
    ay.set_yticklabels([])
    ay.legend(bbox_to_anchor=(0,0,1,1), bbox_transform=fig.transFigure)

    plt.savefig('static/ac_analysis_current_phasor.png')

    return res_voltages, res_current
