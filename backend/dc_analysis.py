from lcapy import *
from sympy import *

def run_dc_analysis(netlist_filename='netlist.txt'):
    # Read the netlist string from the file
    with open(netlist_filename, 'r') as file:
        netlist_string = file.read()

    # Define the circuit with the read netlist
    cct = Circuit(netlist_string)
    
    # Perform DC analysis
    cct_dc = cct.dc()  # Get operating point using dc method
    v = []
    v_labels = []

    i=[]
    i_labels=[]

    # Initialize dictionaries to hold voltage and current results
    dc_voltages = {}
    dc_currents = {}

    def evaluate(expression):
        try:
            result = eval(expression, {"__builtins__": None})
        except Exception as e:
            print(f"Error evaluating expression: {e}")
            return None  # or raise an exception, or handle it as you see fit
        return result

    # Helper function to extract and store phasors
    def add_comp(component):
        # Voltage
        v_each = str(cct_dc[component].v)
        v_val=evaluate(v_each)
        
        if v_val is not None:
            v.append(v_val)
            v_labels.append(f'V_{component}')
        
        # Current
        i_each = str(cct_dc[component].i)
        i_val=evaluate(i_each)
        
        if i_val is not None:
            i.append(i_val)
            i_labels.append(f'I_{component}')
    
    # Automatically detect components based on common naming conventions
    component_count=0
    for component_type_prefix in ['A', 'V', 'R', 'L', 'C']: 
        component_count+=1
        index = 1
        while True:
            component_name = f"{component_type_prefix}{index}"
            if component_name not in cct_dc.elements:
                break
            add_comp(component_name)
            index += 1
    
    for v_each, label in zip(v, v_labels):
        dc_voltages[label]=v_each
    
    for i_each, label in zip(i, i_labels):
        dc_currents[label]=i_each

    return dc_voltages, dc_currents
