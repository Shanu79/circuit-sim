from flask import Flask, request, jsonify, url_for
import json  # Import the json module
import numpy as np  # For numerical operations
from flask_cors import CORS
from lcapy import Circuit, j, omega, s, t, sin
import sympy as sp  # For more control over symbolic expressions
import re
from transient_analysis import run_transient_analysis
from ac_analysis import run_ac_analysis
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Set the default port to 8000 if not specified in the environment
port = int(os.environ.get('PORT', 8000))

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

            if type_prefix in ['AC Source','DC Source', 'Inductor', 'Resistor', 'Wire', 'Capacitor', 'Generic']:
                if type_prefix=='AC Source' or type_prefix=='DC Source':
                    line=f"{id_} {node2} {node1} {value}\n"
                else: line = f"{id_} {node1} {node2} {value}\n"
                cctt += line

        # Dummy Circuit processing. Implement your Circuit class logic here
        # cct = Circuit(cctt)
        # print(cct)

        netlist_filename = 'netlist.txt'
        with open(netlist_filename, 'w') as file:
            file.write(cctt)

        image_files = {
            'ac': [
                ("ac_analysis_voltage_phasor.png", "Voltage Phasor"),
                ("ac_analysis_current_phasor.png", "Current Phasor")
            ],
            'transient': [
                ("transient_analysis-voltage.png", "Transient Voltage"),
                ("transient_analysis-current.png", "Transient Current")
            ]
        }.get(analysisType, [])

        if analysisType == "dc":
            # Placeholder for DC Analysis
            a = Circuit(cctt)
            node_voltages_dict = {}
            for i in range(numberOfNodes):
                key = "Node "+str(i)  # Create a key based on the loop variable
            
                #  value = str(a[i].V(s)) #For Ac analysis
                value = str(-a[i].v)
                print(value)
            
                # Assign the value to the key in the dictionary
                node_voltages_dict[key] = value + " V"

                print(node_voltages_dict)
                node_voltages=node_voltages_dict
        elif analysisType == "ac":
            node_voltages, current = run_ac_analysis()
            app.config['IMAGES'] = image_files
        elif analysisType == "transient":
            run_transient_analysis()
            node_voltages = {}
            current = {}
            app.config['IMAGES'] = image_files
        else:
            raise ValueError("Unsupported analysis type")

        return jsonify({
            "voltages": node_voltages,
            "current": current
        })

    except Exception as e:
        app.logger.error("Error during simulation: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/get-images/<analysis_type>', methods=['GET'])
def get_images(analysis_type):
    image_files = app.config.get('IMAGES', [])

    if image_files:
        response = []
        for filename, description in image_files:
            image_url = url_for('static', filename=filename)
            print("Generated URL:", image_url) 
            response.append({'url': image_url, 'description': description})
        return jsonify(response)
    else:
        return jsonify({"error": "No image files found for the given analysis type"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=port)
