import matplotlib
matplotlib.use('Agg')  # Set the backend before importing pyplot

from lcapy import Circuit
import numpy as np
from matplotlib.pyplot import subplots, savefig

def run_transient_analysis(netlist_filename='netlist.txt'):
    t = np.linspace(0, 0.05, 1000)

    # Read the netlist string from the file
    with open(netlist_filename, 'r') as file:
        netlist_string = file.read()

    # Define the circuit with the read netlist
    cct = Circuit(netlist_string)

    # Calculate the transient responses
    Vr = cct.R1.V
    Vl = cct.L1.V  # Voltage across the inductor
    Vc = cct.C1.V  # Voltage across the capacitor

    vr = Vr.transient_response(t)
    vl = Vl.transient_response(t)
    vc = Vc.transient_response(t)

    Ir = cct.R1.I
    Il = cct.L1.I
    Ic = cct.C1.I

    ir = Ir.transient_response(t)
    il = Il.transient_response(t)
    ic = Ic.transient_response(t)

    # Plotting
    fig, ax = subplots(1)
    ax.plot(t, vr, label='VR (Resistor)', linewidth=2)
    ax.plot(t, vl, label='VL (Inductor)', linewidth=2, linestyle='--')
    ax.plot(t, vc, label='VC (Capacitor)', linewidth=2, linestyle=':')
    ax.set_xlabel('Time (s)')
    ax.set_ylabel('Voltage (V)')
    ax.grid(True)
    ax.legend()

    savefig('transient_analysis-voltage.png')

    fig, ax = subplots(1)
    ax.plot(t, ir, label='IR (Resistor)', linewidth=2)
    ax.plot(t, il, label='IL (Inductor)', linewidth=2, linestyle='--')
    ax.plot(t, ic, label='IC (Capacitor)', linewidth=2, linestyle=':')
    ax.set_xlabel('Time (s)')
    ax.set_ylabel('Current (A)')
    ax.grid(True)
    ax.legend()

    savefig('transient_analysis-current.png')
