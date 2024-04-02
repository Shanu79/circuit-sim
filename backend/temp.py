import pyspice
from pyspice.spice import Simulation

def transient_analysis(netlist_file, voltage_source_name, voltage_source_node, output_node, start_time=0, end_time=100e-9, step_time=1e-9):
  """
  Performs transient analysis on a SPICE netlist.

  Args:
      netlist_file (str): Path to the SPICE netlist file.
      voltage_source_name (str): Name of the voltage source in the netlist.
      voltage_source_node (str): Node connected to the positive terminal of the voltage source.
      output_node (str): Node for which the transient response will be obtained.
      start_time (float, optional): Start time of the simulation (default: 0s).
      end_time (float, optional): End time of the simulation (default: 100ns).
      step_time (float, optional): Time step for the simulation (default: 1ns).

  Returns:
      tuple: A tuple containing the time (x-axis) and voltage (y-axis) data for the transient response.
  """

  # Create a circuit object from the netlist
  circuit = pyspice.Spice.Circuit(SpiceNetlist=netlist_file)

  # Configure transient analysis
  transient = Simulation(circuit=circuit, node=output_node, sweep=voltage_source_name,
                          start_time=start_time, end_time=end_time, step_time=step_time)

  # Run the simulation
  transient.run()

  # Extract time and voltage data
  time = transient.time()
  voltage = transient[output_node]

  return time, voltage

# Example usage (replace with your actual netlist file and parameters)
netlist_file = "my_circuit.net"
voltage_source_name = "Vin"
voltage_source_node = "1"
output_node = "2"

time, voltage = transient_analysis(netlist_file, voltage_source_name, voltage_source_node, output_node)

# Plot the transient response (using matplotlib or other plotting library)
import matplotlib.pyplot as plt

plt.plot(time, voltage)
plt.xlabel("Time (s)")
plt.ylabel("Voltage (V)")
plt.title("Transient Response of Node " + output_node)
plt.grid(True)
plt.show()

