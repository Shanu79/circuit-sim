import numpy as np
import matplotlib.pyplot as plt
from lcapy import Circuit

# Read the netlist string from the file
netlist_filename = 'netlist.txt'
with open(netlist_filename, 'r') as file:
    netlist_string = file.read()

# Define the circuit with the read netlist
cct = Circuit(netlist_string)

# Use time variable for plotting
t = np.linspace(0, 0.04, 1000)  # 0 to 40ms, which gives us a couple of cycles at 50Hz

# Plot the voltage across the resistor
v_R1 = cct.R1.v.evaluate(t)
plt.figure()
plt.plot(t, v_R1, label="Voltage across R1")
plt.xlabel('Time (s)')
plt.ylabel('Voltage (V)')
plt.title('Voltage Across the Resistor R1')
plt.legend()
plt.grid(True)
plt.show()