import React, { createContext, useContext, useEffect, useState} from "react";
// import * as d3 from 'd3'

const MyContext = createContext();
let netstring ="";
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

  

  useEffect(()=>{
    const handleUpdateNodes = ()=>{
      const newMap = new Map()
      let i = 0;
      for(const [key] of selectedNodes)
      {
        newMap.set(key, i);
        i++;
      }

      
  
      setUpdatedNodes(newMap);
    }
    return handleUpdateNodes();
  }, [selectedNodes])

  //console.log(updatedNodes)

 
 const netStringFunc = () => {
   netstring = ""; // Define netstring variable
    valMap.forEach((value, key) => {
    if(key.charAt(0)==="W"){netstring += (key + " " + updatedNodes.get(key.split('_')[1]) + " " + updatedNodes.get(key.split('_')[2]) + "\n")}
    else if(key.charAt(0)==="A")
    { 
      netstring += ("V"+key + " " + updatedNodes.get(key.split('_')[1]) + " " + updatedNodes.get(key.split('_')[2]) + ` {${value}* sin(3*t)}` +"\n")}
    else if(key.charAt(0)==="L")
    {netstring += (key + " " + updatedNodes.get(key.split('_')[1]) + " " + updatedNodes.get(key.split('_')[2]) + " " + value +' 0'+ "\n");}
    else
    {netstring += (key + " " + updatedNodes.get(key.split('_')[1]) + " " + updatedNodes.get(key.split('_')[2]) + " " + value + "\n");}
  });
  
  console.log(netstring);
  console.log(updatedNodes);

  const body = { netList: netstring , numberNodes: updatedNodes.size,};

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
        netStringFunc,
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

