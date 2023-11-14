import React from "react";
import styled from "styled-components";
import * as d3 from "d3";
import { components } from "../assets/componentsLibrary";
import { useMyContext } from "../contextApi/MyContext";

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

const CircuitBoaard = styled.section``;

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
    runSim,
    setRunSim,
    selectedNodes,
    setSelectedNodes,
    updatedNodes,
    setUpdatedNodes
  } = useMyContext();
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
        const lineId = connectDots(connectedDots[0], dotId); // Get the unique line ID
        setLines([...lines, lineId]);
        // Add line ID to state

        setConnectedDots([]);
      }
    } else if (connectedDots.length === 1 && connectedDots[0] === dotId) {
      // Clicked on the same dot, disconnect it
      setConnectedDots([]);
      // Remove the line (not shown in this example, you'll need to manage lines separately)
    }
  };

  const handleLineClick = (lineId) => {
    setSelectedLine(lineId);
  };

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
    // Remove the line's ID from state
  };

  // Calculate the total width and height of the grid
  const totalWidth = numCols * (2 * dotRadius + gap);
  const totalHeight = numRows * (2 * dotRadius + gap);



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
              console.log("New Netlist:");
              for (let i = 0; i < tempnetList.length; i++) {
                console.log(tempnetList[i]);
              }
            }}
          >
            netlist at console
          </Button>

          <Button onClick={() => setRunSim(!runSim)}>Run Simulation</Button>
          
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

      <CircuitBoaard>
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
            onMouseOver={(e) => e.target.setAttribute("r", dotRadius + 2)}
            onMouseOut={(e) => e.target.setAttribute("r", dotRadius)}
          />
          {/* Add text in the center of the circle */}
          <text
            x={col * (2 * dotRadius + gap) + dotRadius}
            y={row * (2 * dotRadius + gap) + dotRadius}
            
            fill="black" // Set the color of the text
          >
            {selectedNodes.get(`${row}-${col}`)}
          </text>
        </g>
      ))
    )}
  </svg>
</CircuitBoaard>

      {/* Button to remove lines */}
    </Container>
  );
};

export default CircuitCanvas;
