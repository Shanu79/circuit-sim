import matplotlib
matplotlib.use('Agg')  # Set the backend before importing pyplot

from lcapy import Circuit
import numpy as np
from matplotlib.pyplot import subplots, savefig, tight_layout

def run_transient_analysis(netlist_filename='netlist.txt'):
    t = np.linspace(0, 0.05, 1000)  # Time range for the analysis

    # Read the netlist string from the file
    with open(netlist_filename, 'r') as file:
        netlist_string = file.read()

    # Define the circuit with the read netlist
    cct = Circuit(netlist_string)
  
    fig, ax=subplots(1)

    # Handle arbitrary numbers of resistors, capacitors, and inductors
    for component_type in ['R', 'L', 'C']:
        index = 1
        while True:
            component_name = f"{component_type}{index}"
            if component_name not in cct.elements:
                break

            # Transient response of voltage
            V = getattr(cct, component_name).V
            v_response = V.transient_response(t)
            # print(v_response)
            linestyle = '--' if component_type == 'L' else ':' if component_type == 'C' else '-'
            ax.plot(t, v_response, label=f'V{component_name} ({component_type})', linewidth=2, linestyle=linestyle)

            index += 1
    # Plot settings for Voltage
    ax.set_xlabel('Time (s)')
    ax.set_ylabel('Voltage (V)')
    ax.grid(True)
    ax.legend()
    tight_layout()
    savefig('static/transient_analysis-voltage.png')
    
    # Clear the voltage plot before plotting currents
    ax.cla()

    # Handle arbitrary numbers of resistors, capacitors, and inductors
    for component_type in ['R', 'L', 'C']:
        index = 1
        while True:
            component_name = f"{component_type}{index}"
            if component_name not in cct.elements:
                break
            
            # Transient response of current
            I = getattr(cct, component_name).I
            i_response = I.transient_response(t)
            # print(i_response)
            linestyle = '--' if component_type == 'L' else ':' if component_type == 'C' else '-'
            ax.plot(t, i_response, label=f'I{component_name} ({component_type})', linewidth=2, linestyle=linestyle)

            index += 1

    # Plot settings for Current
    ax.set_xlabel('Time (s)')
    ax.set_ylabel('Current (A)')
    ax.grid(True)
    ax.legend()
    tight_layout()
    savefig('static/transient_analysis-current.png')
