import React from "react";
import styled from "styled-components";
import * as d3 from "d3";
import { components } from "../assets/componentsLibrary";
import { useMyContext } from "../contextApi/MyContext";
// import { updatedNodes } from "../contextApi/MyContext";
import { useState } from "react";

//STYLED COMPONENTS
const Container = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Menu = styled.section`
  margin-bottom: 20px;
`;

const CircuitBoard  = styled.section``;

const RemoveComponent = styled.div``;

const ComponentList = styled.div``;

const Select = styled.select``;

const Button = styled.button``;

const Circle = styled.circle`
  transition: all 100ms;
  &:hover {
    cursor: pointer;
  }
`;
// const Text = styled.text
// let netstring = "";
const tempnetList = [];

const CircuitCanvas = () => {
  const {
    connectedDots,
    setConnectedDots,
    lines,
    setLines,
    selectedLine,
    setSelectedLine,
    selectedComponent,
    setSelectedComponent,
    selectedNodes,
    setSelectedNodes,
    updatedNodes,
    setUpdatedNodes,
    sendSimulationData, // Updated to use the new function name
    viewSimulation,
    analysisType,
    setAnalysisType, // Allowing components to update the analysis type
    frequency,
    setFrequency,
    simData,
    valMap,
    setValMap,
    temp
  } = useMyContext();

  const [NodeVoltagePosition, setNodeVoltagePosition] = useState({ x: 0, y: 0 });
  const [isNodeVoltageVisible, setNodeVoltageVisible] = useState(false);
  const [NodeVoltageDotId, setNodeVoltageDotId] = useState("");

  const [lineCurrentPos, setLineCurrentPos] = useState({ x: 0, y: 0 });
  const [isLineCurrentVisible, setLineCurrentVisible] = useState(false);
  const [LineCurrentId, setLineCurrentDotId] = useState("");
  // const [lineCurrentValue, setLineCurrentValue] = useState("");

  const svgRef = React.createRef();
  const numRows = 6;
  const numCols = 10;
  const dotRadius = 5;
  const gap = 100; // Gap between dots

  const handleDotClick = (dotId) => {
    if (connectedDots?.length === 0) {
      // First dot clicked, store its ID
      setConnectedDots([dotId]);
    } else if (connectedDots.length === 1 && connectedDots[0] !== dotId) {
      const [row1, col1] = connectedDots[0].split("-");
      const [row2, col2] = dotId.split("-");

      if (row1 === row2 || col1 === col2) {
        // Second dot clicked in the same row or column, connect the dots
        const lineId = connectDots(connectedDots[0], dotId);
         // Get the unique line ID
        setLines([...lines, lineId]);
        // if(lineId.charAt(0)==="W")
        setValMap((valMap)=> {
          const newMap = new Map(valMap)
          newMap.set(lineId,1);
          return newMap
        })
        // Add line ID to state

        setConnectedDots([]);
      }
    } else if (connectedDots.length === 1 && connectedDots[0] === dotId) {
      // Clicked on the same dot, disconnect it
      setConnectedDots([]);
      // Remove the line (not shown in this example, you'll need to manage lines separately)
    }

    if(dotId in updatedNodes)
    {

    }
  };

  const handleLineClick = (lineId) => {
    setSelectedLine(lineId);
  };

  const showNodeVoltage = (event, dotId) => {
    setNodeVoltagePosition({ x: event.clientX, y: event.clientY });
    setNodeVoltageVisible(true);
    setNodeVoltageDotId(dotId);

    
  };

  const hideNodeVoltage = () => {
    setNodeVoltageVisible(false);
  };

  const showLineCurrent = (e, lineId) =>{
    setLineCurrentPos({x: e.clientX , y: e.clientY});
    setLineCurrentVisible(true);
    setLineCurrentDotId(lineId);
    // console.log(lineId)
  }
  
  // console.log(lineCurrentValue)

  const hideLineCurrent = ()=>{
    setLineCurrentVisible(false);
  }


  const connectDots = (dotId1, dotId2) => {
    // Use D3.js to draw a line between the two dots
    const svg = d3.select(svgRef.current);
    const dot1 = svg.select(`#dot-${dotId1}`);
    const dot2 = svg.select(`#dot-${dotId2}`);

    const x1 = +dot1.attr("cx");
    const y1 = +dot1.attr("cy");
    const x2 = +dot2.attr("cx");
    const y2 = +dot2.attr("cy");
    
    const lineId = `${selectedComponent}_${dotId1}_${dotId2}`; // Generate a unique line ID

    components[selectedComponent].component(
      svg,
      lineId,
      handleLineClick,
      handleLineDoubleClick,
      showLineCurrent,
      hideLineCurrent,
      x1,
      x2,
      y1,
      y2
    );

    const dot1Value = selectedNodes.has(dotId1) ? selectedNodes.get(dotId1) : 0;
    const dot2Value = selectedNodes.has(dotId2) ? selectedNodes.get(dotId2) : 0;

    const newMap = new Map(selectedNodes);
    newMap.set(dotId1, dot1Value + 1);
    newMap.set(dotId2, dot2Value + 1);

    setSelectedNodes(newMap);
    
    // handleUpdateNodes();

    return lineId; // Return the line's unique ID
  };
  
  // Function to remove a line by its ID
  const removeLine = (lineId) => {
    const svg = d3.select(svgRef.current);
    svg.select(`#${lineId}`).remove(); // Remove the line from the SVG
    setLines(lines.filter((id) => id !== lineId));

    const dotId1 = lineId.split("_")[1];
    const dotId2 = lineId.split("_")[2];

    console.log(dotId1, dotId2);

    const dot1 = selectedNodes.get(dotId1);
    const dot2 = selectedNodes.get(dotId2);

    const newMap = new Map(selectedNodes);

    
    dot1 > 1 ? newMap.set(dotId1, dot1 - 1) : newMap.delete(dotId1);
    dot2 > 1 ? newMap.set(dotId2, dot2 - 1) : newMap.delete(dotId2);

    setSelectedNodes(newMap);
    // window.valMap.delete(lineId);

    setValMap((valMap)=>{
      const newMap = new Map(valMap);
      newMap.delete(lineId)
      return newMap;
    })
  };

  const setGroundNode = (nodeId) => {
    // Check if nodeId is already in updatedNodes, then simply update its value to 0
    updatedNodes.set(nodeId, 0);

    console.log(`Node ${nodeId} set as ground.`);
    console.log(updatedNodes);
}

  // Calculate the total width and height of the grid
  const totalWidth = numCols * (2 * dotRadius + gap);
  const totalHeight = numRows * (2 * dotRadius + gap);

  const handleLineDoubleClick = (lineId, value) => {
    const newValue = prompt(`Update the value for the component ${lineId} to:`, value);
    if (newValue !== null) {
      // Handle the updated value as needed
      // window.valMap.set(lineId, newValue);
      setValMap((valMap)=> {
        const newMap = new Map(valMap)
        newMap.set(lineId,newValue);
        return newMap
      })
    }
  };
  function evaluateString(input) {
    // Check if the string contains a fraction
    if (input.includes('/')) {
      const [numerator, denominator] = input.split('/').map(Number);
    const result = (numerator / denominator);

    // Round to exactly two decimal places
    return result;
    } else {
      // If it's not a fraction, convert it to a number
      return parseFloat(input);
    }
  }
 const getCurrent = (lineId) =>{
  
  return 0

 }

  return (
    <Container>
      <Menu>
        <RemoveComponent>
          <p>{selectedLine || "No Component selected"}</p>
          <Button
            onClick={() => {
              if (lines.length > 0) {
                selectedLine && removeLine(selectedLine);
                setSelectedLine();
              }
            }}
          >
            Remove {selectedLine?.split("-")[0] || "Component"}
          </Button>
          <Button
            onClick={() => {
              if (connectedDots && connectedDots[0]) {
                  setGroundNode(connectedDots[0]);
              } else {
                  console.log("No node selected to set as ground.");
              }
          }}>
            add Ground
          </Button>
          <Button
            onClick={() => {
              console.log("New Netlist:");
              for (let i = 0; i < tempnetList.length; i++) {
                console.log(tempnetList[i]);
              }
            }}
          >
            netlist at console
          </Button>
          <Select
          value={analysisType}
          onChange={(e) => setAnalysisType(e.target.value)}
          aria-label="Select analysis type"
        >
          <option value="dc">DC Analysis</option>
          <option value="ac">AC Analysis</option>
          <option value="transient">Transient Analysis</option>
          {/* Add other analysis types as needed */}
        </Select>
        <input type="text" id="frequency" name="frequency" placeholder="Frequency" value={frequency} onChange={(e)=>setFrequency(e.target.value)}/>
          <Button onClick={sendSimulationData}>Run Simulation</Button>
          <Button onClick={viewSimulation}>View simulation</Button>
          <Button onClick={() => valMap.forEach((value, key) => {
    console.log(`${key} => ${value}`) ;
  })}>Lock Circuit</Button>
          
        </RemoveComponent>

        <ComponentList>
          <Select
            value={selectedComponent || ""}
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            {Object.keys(components).map((item) => (
              <option value={components[item].name} key={item}>
                {components[item].name.toUpperCase()}
              </option>
            ))}
          </Select>
        </ComponentList>
      </Menu>

      {/* {console.log(selectedNodes)} */}

      <CircuitBoard >
        <div>
        <svg ref={svgRef} width={totalWidth} height={totalHeight}>
          {/* Render dots and text in a grid */}
          {Array.from({ length: numRows }).map((_, row) =>
            Array.from({ length: numCols }).map((_, col) => (
              <g key={`group-${row}-${col}`}>
                <Circle
                  key={`dot-${row}-${col}`}
                  id={`dot-${row}-${col}`}
                  cx={col * (2 * dotRadius + gap) + dotRadius}
                  cy={row * (2 * dotRadius + gap) + dotRadius}
                  r={dotRadius}
                  fill={
                    connectedDots?.includes(`${row}-${col}`) ? "red" : "lightblue"
                  }
                  onClick={() => handleDotClick(`${row}-${col}`)}
                  onMouseOver={(e) => {
                    e.target.setAttribute("r", dotRadius + 2);
                    showNodeVoltage(e, `${row}-${col}`);
                  }}
                  onMouseOut={(e) => {
                    e.target.setAttribute("r", dotRadius);
                    hideNodeVoltage();
                  }}
                />
                <text
                  x={col * (2 * dotRadius + gap) + dotRadius +7} // Adjust the x-coordinate as needed
                  y={row * (2 * dotRadius + gap) + dotRadius + 10} // Adjust the y-coordinate as needed
                  fill="grey" // Adjust the text color as needed
                  fontSize="9" // Adjust the font size as needed
                >
                  {updatedNodes.get(`${row}-${col}`)}
                </text>
              </g>
            ))
          )}
           
        </svg>
        {/* Render NodeVoltage conditionally */}
        {isNodeVoltageVisible && (
            <div
            style={{
              position: "absolute",
              left: `${NodeVoltagePosition.x + 20}px`,
              top: `${NodeVoltagePosition.y + 20}px`,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "5px",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.5)",
            }}
          >
            {(simData["voltages"] && simData["voltages"][`Node ${updatedNodes.has(NodeVoltageDotId) ? updatedNodes.get(NodeVoltageDotId) : 'not in circuit'}`]) || 'NODE' }
          </div>
          )}
            <div
             style={{
              position: "absolute",
              left: `${lineCurrentPos.x - 10}px`,
              top: `${lineCurrentPos.y - 40 }px`,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "5px",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.5)",
             }}
            >
            <span>{temp[LineCurrentId.slice(0)]}: {valMap.get(LineCurrentId) || "no value"} V</span>
            <br></br>
            { // Check if simData is available before attempting to access its properties
              simData && (
                <>
                  <span> V: {simData["voltages"][`V_${temp[LineCurrentId.slice(0)]}`]} V</span>
                  <br></br>
                  <span> I: {simData["current"][`I_${temp[LineCurrentId.slice(0)]}`]} A</span>
                </>
              )
            }
          </div>
          )
        </div>
      </CircuitBoard >

      {/* Button to remove lines */}
    </Container>
  );
};


export default CircuitCanvas;
