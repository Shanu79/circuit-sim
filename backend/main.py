from flask import Flask, request, jsonify
from flask_cors import CORS

from lcapy import Circuit
from lcapy import TimeDomainVoltage
from lcapy import LoopAnalysis


import re
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for simplicity

@app.route('/', methods=['POST'])
def simulate():
    try:
        # Get the netlist from the JSON request
        ckt_data = request.get_json()
        app.logger.info("Received JSON data: %s", ckt_data)
        netstring = ckt_data.get("netList", "")
        numberOfNodes = ckt_data.get("numberNodes","")
        
        


        # Check if the netstring is not empty
        if not netstring:
            raise ValueError("Netlist is empty")
            
        # Create an lcapy Circuit object and solve the circuit
        a = Circuit(netstring)
        
        print(a.dc())
        la = LoopAnalysis(a)
        
        la.matrix_equations()

        
        print("mc")
        print(a.transient())
        print("mc")
        
        node_voltages_dict = {}
        for i in range(numberOfNodes):
         key = "Node "+str(i)  # Create a key based on the loop variable
         
         value = str(-a[i].v)
         
    
         # Assign the value to the key in the dictionary
         node_voltages_dict[key] = value + " V"

        print(node_voltages_dict)
        return jsonify(str(node_voltages_dict)+"\n"+str(la.mesh_equations())+"\n"+str(la.matrix_equations()))
        
    except Exception as e:
        # Handle exceptions properly and return an error response
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
