# Jupyter Notebook (Client)
import requests
from lcapy import Circuit
import numpy as np
from matplotlib.pyplot import subplots, savefig


# # Define the Flask server URL
# flask_url = "http://127.0.0.1:5000"

# Check if the request was successful (status code 200)
# if response.status_code == 200:
    # Extract the circuit definition from the JSON response
# circuit_data = response.json()
# ircuit_definition = circuit_data.get("circuit", "")

#     # Create an lcapy Circuit object with the received circuit definition
cct = Circuit("""
V1 0 2 101
R1 2 3 50
""")

# Simulate and plot the circuit response
t = np.linspace(0, 0.01, 1000)
vc = cct.C.v.evaluate(t)

fig, ax = subplots(1)
ax.plot(t, vc, linewidth=2)
ax.set_xlabel('Time (s)')
ax.set_ylabel('Capacitor voltage (V)')
ax.grid(True)

savefig('circuit-VRC1-vc.png')
# else:
#     print(f"Error: {response.status_code}")
