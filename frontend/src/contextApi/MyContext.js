import { getValue } from "@testing-library/user-event/dist/utils";
import React, { createContext, useContext, useEffect, useState} from "react";
// import * as d3 from 'd3'

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [connectedDots, setConnectedDots] = useState([]);
  const [lines, setLines] = useState([]); // State variable to track lines
  const [selectedLine, setSelectedLine] = useState();
  const [selectedComponent, setSelectedComponent] = useState('W')
  const [valMap, setValMap] = useState(new Map())
  

  const [selectedNodes, setSelectedNodes] = useState(new Map()); // to select nodes that are part of the schematics

  // console.log(selectedNodes)

  const [updatedNodes, setUpdatedNodes] = useState(new Map())
 

  const [runSim, setRunSim] = useState(false);

  const [simData, setSimData] = useState("");

  const [analysisType, setAnalysisType] = useState("dc"); // New state for analysis type

  const [frequency, setFrequency] = useState(0);

  useEffect(()=>{
    const handleUpdateNodes = ()=>{
      const newMap = new Map()
      let i = 1;
      for(const [key] of selectedNodes)
      {
        newMap.set(key, i);
        i++;
      }
      setUpdatedNodes(newMap);
    }
    return handleUpdateNodes();
  }, [selectedNodes])

  // console.log(updatedNodes)
//  const sendSimulationData = () => {
//   let netstring = `Circuit("""\n`;
//   let acSourceCounter = 1;
//   let rcounter = 1;
//   let lcounter = 1; // Adjusted for consistency

//   valMap.forEach((value, key) => {
//     const node1 = updatedNodes.get(key.split('_')[1]);
//     const node2 = updatedNodes.get(key.split('_')[2]);

//     if(key.charAt(0) === "W") {
//       // For Lcapy, explicit wires are not needed as connections are implied
//       // Hence, we're not adding anything for 'W'
//     } else if (key.charAt(0) === "A") {
//       // Lcapy does not use the 'sin' prefix, specify AC sources differently
//       netstring += `V${acSourceCounter} ${node1} ${node2} ${value}V;\\n`;
//       acSourceCounter++;
//     } else if(key.charAt(0) === "L") {
//       netstring += `L${lcounter} ${node1} ${node2} ${value}H;\\n`;
//       lcounter++;
//     } else if(key.charAt(0) === "R") {
//       netstring += `R${rcounter} ${node1} ${node2} ${value}ohm;\\n`;
//       rcounter++;
//     } else {
//       // For other components, adjust accordingly. Example:
//       netstring += `${key} ${node1} ${node2} ${value};\\n`;
//     }
//   });

//   netstring += `""")\n`;
const sendSimulationData = () => {
  const components = [];

  valMap.forEach((value, key) => {
    const node1 = updatedNodes.get(key.split('_')[1]);
    const node2 = updatedNodes.get(key.split('_')[2]);
    const type = key.charAt(0); // First character indicates the component type

    let component = {
      type: '',
      id: '',
      node1: node1,
      node2: node2,
      value: ''
    };

    if (type === "A") {
      const acSourceId = components.filter(comp => comp.type === 'AC Source').length + 1;
      component.type = 'AC Source';
      component.id = `V${acSourceId}`;
      // Assuming 'value' contains the frequency for the AC source
      component.value = `{${value}*sin(2*pi*${frequency}*t)}`;
    } else if (type === "L") {
      component.type = 'Inductor';
      component.id = `L${components.filter(comp => comp.type === 'Inductor').length + 1}`;
      component.value = `${value}`;
    } else if (type === "R") {
      component.type = 'Resistor';
      component.id = `R${components.filter(comp => comp.type === 'Resistor').length + 1}`;
      component.value = `${value}`;
    } else if(type==="W")
    {
      component.type="Wire";
      component.id=`W${components.filter(comp=>comp.type==='Wire').length+1}`;
    }
     else {
      // Generic component or handle other specific cases
      component.type = 'Generic';
      component.id = key;
      component.value = value.toString(); // Ensure the value is a string
    }

    components.push(component);
  });

  // Convert the components array into a JSON string
  // Now including the nodes and value in a specific format for each component
  const netstring = JSON.stringify({components: components}, null, 2); // Pretty print JSON

  // Send the JSON string to your backend


  console.log(netstring);
  console.log(updatedNodes);

  const body = { 
    netList: netstring, 
    numberNodes: updatedNodes.size,
    analysisType: analysisType,
    frequency: frequency
  };

fetch('http://localhost:5000/', {
  method: 'POST', // or 'GET' or any other HTTP method you need
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
    setSimData(data);
  })
  .catch(error => console.error('Error: ', error));
}

  const [circuit, setCircuit] = useState([
    {
      id: 0,
      component: '',
      label: '',
      value: '',
      
      st_node: '',
      end_node: ''
    }
  ])

  useEffect(()=>{

  }, [runSim])

  return (
    <MyContext.Provider
      value={{
        connectedDots,
        setConnectedDots,
        lines,
        setLines,
        selectedLine,
        setSelectedLine,
        selectedComponent,
        setSelectedComponent,
        circuit,
        setCircuit,
        selectedNodes, 
        setSelectedNodes,
        runSim, 
        setRunSim,
        updatedNodes, 
        setUpdatedNodes,
        sendSimulationData, // Updated to use the new function name
        analysisType,
        setAnalysisType, // Allowing components to update the analysis type
        frequency,
        setFrequency,
        simData,
        valMap,
        setValMap
        
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = ()=>{
    return useContext(MyContext);
    
}

