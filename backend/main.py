from flask import Flask, request, jsonify
import json  # Import the json module
import numpy as np  # For numerical operations
from flask_cors import CORS
from lcapy import Circuit, j, omega, s, t, sin
import sympy as sp  # For more control over symbolic expressions

import re

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/', methods=['POST'])
def simulate():
    try:
        ckt_data = request.get_json()
        app.logger.info("Received JSON data: %s", ckt_data)

        # The 'netList' field contains a JSON string, so parse it to get the actual object
        netlist_str = ckt_data.get("netList", "")
        if netlist_str:
            netlist = json.loads(netlist_str)  # Parse the nested JSON string
        else:
            raise ValueError("Netlist is empty")

        # Extract components from the parsed netlist
        components = netlist.get("components", [])
        if not components:
            raise ValueError("Components are empty")

        # Initialize an empty netlist string
        cctt = """"""""

        numberOfNodes = ckt_data.get("numberNodes", 0)
        analysisType = ckt_data.get("analysisType", "dc").lower()  # Default to DC analysis

        # Loop through each component to construct the netlist string
        for comp in components:
            type_prefix = comp.get('type', '')
            id_ = comp.get('id', '')
            node1 = comp.get('node1', '')
            node2 = comp.get('node2', '')
            value = comp.get('value', '')

            # You may need to adjust the format depending on your exact netlist format requirements
            if type_prefix in ['AC Source', 'Inductor', 'Resistor', 'Wire','Generic']:
                line = f"{id_} {node1} {node2} {value}\n"
                cctt += line

        # Assuming you have a Circuit class or similar that can parse the netlist string
        cct=Circuit(cctt)
        print(cct)  # Or process the netlist as needed
                
        netlist_filename = 'netlist.txt'
        with open(netlist_filename, 'w') as file:
                file.write(cctt)

        if analysisType == "dc":
            # DC Analysis
            node_voltages = {f"Node {i}": str(-cct[i].V.dc) + " V" for i in range(numberOfNodes)}
        elif analysisType == "ac":
            pass
        elif analysisType == "transient":
            # Define the simulation time span
            t_stop = 0.1  # Stop time in seconds, adjust as needed
            t_step = 0.001  # Time step in seconds, adjust as needed
            t_vector = np.linspace(0, t_stop, int(t_stop / t_step) + 1)
            
            # Perform transient analysis
            node_voltages = {}
            for node in range(0, numberOfNodes):  # Assuming node indexing starts at 0
                # Assuming nodes are named as 'n1', 'n2', ..., adjust as necessary
                v_t = cct[f'n{node}'].v(t)
                v_t_vals = [float(v_t.subs(t, ts).evalf()) for ts in t_vector]
                node_voltages[f"Node {node}"] = v_t_vals
        else:
            raise ValueError("Unsupported analysis type")

        return jsonify({"node_voltages": node_voltages})

    except Exception as e:
        app.logger.error("Error during simulation: %s", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
