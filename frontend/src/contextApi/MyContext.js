import React, { createContext, useContext, useEffect, useState} from "react";
// import * as d3 from 'd3'

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [connectedDots, setConnectedDots] = useState([]);
  const [lines, setLines] = useState([]); // State variable to track lines
  const [selectedLine, setSelectedLine] = useState();
  const [selectedComponent, setSelectedComponent] = useState('wire')

  const [selectedNodes, setSelectedNodes] = useState(new Map()); // to select nodes that are part of the schematics

  // console.log(selectedNodes)

  const [updatedNodes, setUpdatedNodes] = useState(new Map())
 

  const [runSim, setRunSim] = useState(false);

  useEffect(()=>{

    const convertToNetlist = ()=>{

      let netList = ""

      lines.forEach(line=>{
        netList += (line + " " + updatedNodes.get(line.split('_')[1]) + " " + updatedNodes.get(line.split('_')[2]) + " 2 " + "\n" )
      })

      return netList
    }

    if(runSim){
       //CALL API HERE
    }
  },[runSim, lines, updatedNodes])

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
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = ()=>{
    return useContext(MyContext);
}