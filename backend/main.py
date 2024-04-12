from flask import Flask, request, jsonify, send_file
import json  # Import the json module
import numpy as np  # For numerical operations
from flask_cors import CORS
from lcapy import Circuit, j, omega, s, t, sin
import sympy as sp  # For more control over symbolic expressions
import re
from transient_analysis import run_transient_analysis
from ac_analysis import run_ac_analysis

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Use Flask's application context to store the image file name instead of a global variable
app.config['IMG_FILE_NAME'] = ""

@app.route('/', methods=['POST'])
def simulate():
    try:
        ckt_data = request.get_json()
        app.logger.info("Received JSON data: %s", ckt_data)

        netlist_str = ckt_data.get("netList", "")
        if netlist_str:
            netlist = json.loads(netlist_str)
        else:
            raise ValueError("Netlist is empty")

        components = netlist.get("components", [])
        if not components:
            raise ValueError("Components are empty")

        cctt = """"""

        numberOfNodes = ckt_data.get("numberNodes", 0)
        analysisType = ckt_data.get("analysisType", "dc").lower()

        for comp in components:
            type_prefix = comp.get('type', '')
            id_ = comp.get('id', '')
            node1 = comp.get('node1', '')
            node2 = comp.get('node2', '')
            value = comp.get('value', '')

            if type_prefix in ['AC Source', 'Inductor', 'Resistor', 'Wire', 'Capacitor', 'Generic']:
                line = f"{id_} {node1} {node2} {value}\n"
                cctt += line

        # Dummy Circuit processing. Implement your Circuit class logic here
        # cct = Circuit(cctt)
        # print(cct)

        netlist_filename = 'netlist.txt'
        with open(netlist_filename, 'w') as file:
            file.write(cctt)

        if analysisType == "dc":
            # Placeholder for DC Analysis
            node_voltages = {f"Node {i}": "0 V" for i in range(1, numberOfNodes+1)}
        elif analysisType == "ac":
            run_ac_analysis()
            app.config['IMG_FILE_NAME'] = "ac_analysis_phasor.png"
            node_voltages = {}
        elif analysisType == "transient":
            # Placeholder for Transient Analysis
            app.config['IMG_FILE_NAME'] = "transient_analysis-voltage.png"
            node_voltages = {}
        else:
            raise ValueError("Unsupported analysis type")

        return jsonify({"node_voltages": node_voltages})

    except Exception as e:
        app.logger.error("Error during simulation: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/get-image', methods=['GET'])
def get_image():
    img_file_name = app.config.get('IMG_FILE_NAME', "")
    if img_file_name:
        return send_file(img_file_name, mimetype='image/png')
    else:
        return jsonify({"error": "Image file not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
