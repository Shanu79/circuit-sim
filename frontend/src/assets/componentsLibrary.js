


export const components = {
    W:{
        id: 1,
        name: 'W',
        component: (svg, lineId, setSelectedLine, showLineCurrent, hideLineCurrent, handleLineDoubleClick, x1, x2, y1, y2) => (
            svg
            .append("line")
            .attr("id", lineId) // Set the line's ID
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .on("click", () => setSelectedLine(lineId))
            
        )
    },
    R:{
        id: 2,
        name: 'R',
        component: (svg, lineId, setSelectedLine,handleLineDoubleClick, showLineCurrent, hideLineCurrent, x1, x2, y1, y2) => (
            svg.append("path")
            .attr("id", lineId)
            .attr("d", "M " + x1 +" "+y1 + "l"+ Math.sign((x2-x1)?(x2-x1):(y2-y1))*40+ " 0 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*2.5 +"-5 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5+" 10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5+" -10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5+" 10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5 +" -10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5+" 10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*2.5+ " -5 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*40+ " 0")
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("stroke-linejoin", "bevel")
            .attr("fill", "none")
            .attr("transform", "rotate("+(y2===y1?0:Math.sign(y2<y1?y1-y2:y2-y1))*90+" "+x1+" "+y1+")")
            .on("click", () => setSelectedLine(lineId))
            .on("dblclick", () => handleLineDoubleClick(lineId, 0))
            .on("mouseover", (e)=> showLineCurrent(e, lineId)) )
            .on("mouseout", ()=> hideLineCurrent())
            
            
        
    },
    C:{
        id: 3,
        name: 'C',
        component: (svg, lineId, setSelectedLine,handleLineDoubleClick, showLineCurrent, hideLineCurrent, x1, x2, y1, y2) => (
            svg.append("path")
            .attr("id", lineId)                 
            .attr("d", "M " + x1 +" "+y1 + "l"+ Math.sign((x2-x1)?(x2-x1):(y2-y1))*50+ " 0 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*0 +"-10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*0+" 20 m "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*10 +"-10 l 0 -10 l 0 20 l 0 -10 l"+Math.sign((x2-x1)?(x2-x1):(y2-y1))*50+ " 0")
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("stroke-linejoin", "bevel")
            .attr("fill", "none")
            .attr("transform", "rotate("+(y2===y1?0:Math.sign(y2<y1?y1-y2:y2-y1))*90+" "+x1+" "+y1+")")
            .on("click", () => setSelectedLine(lineId))
            .on("dblclick", () => handleLineDoubleClick(lineId, 0))
            .on("mouseover", (e)=> showLineCurrent(e, lineId)) )
            .on("mouseout", ()=> hideLineCurrent())
            
        
    },
    L: {
        id: 4,
        name: 'L',
        component: (svg, lineId, setSelectedLine,handleLineDoubleClick, showLineCurrent, hideLineCurrent, x1, x2, y1, y2) => (
            svg.append("path")
            .attr("id", lineId)
            .attr("d", "M -35,0 L 5.5,0 C 5.5,0 5.5,-4 9.5,-4 C 13.5,-4 13.5,0 13.5,0 C 13.5,0 13.5,-4 17.5,-4 C 21.5,-4 21.5,0 21.5,0 C 21.5,0 21.5,-4 25.5,-4 C 29.5,-4 29.5,0 29.5,0 C 29.5,0 29.5,-4 33.5,-4 C 37.5,-4 37.5,0 37.5,0 L 75,0")
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("stroke-linejoin", "bevel")
            .attr("fill", "none")
            .attr("transform", " rotate("+(x1===x2?Math.sign(y2-y1):(x2>x1?0:-2))*90+" "+x1+" "+y1+") "+`translate(${x1+35},${y1})`)
            .on("click", () => setSelectedLine(lineId))
            .on("dblclick", () => handleLineDoubleClick(lineId, 0))
            .on("mouseover", (e)=> showLineCurrent(e, lineId)) )
            .on("mouseout", ()=> hideLineCurrent())
            
        
    },
    V: {
        id: 5,
        name: 'V',
        component: (svg, lineId, setSelectedLine,handleLineDoubleClick, showLineCurrent, hideLineCurrent, x1, x2, y1, y2) => (
                    svg.append("path")
                        .attr("id", lineId)
                        .attr("d", "M " + x1 +" "+y1 + "l"+ Math.sign((x2-x1)?(x2-x1):(y2-y1))*50+ " 0 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*0 +"-10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*0+" 20 m "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*10 +"-10 l 0 -25 l 0 50 l 0 -25 l"+Math.sign((x2-x1)?(x2-x1):(y2-y1))*50+ " 0")
                        .attr("stroke", "black")
                        .attr("stroke-width", "3")
                        .attr("stroke-linejoin", "bevel")
                        .attr("fill", "none")
                        .attr("transform", "rotate("+(y2===y1?0:Math.sign(y2<y1?y1-y2:y2-y1))*90+" "+x1+" "+y1+")")
                        .on("click", () => setSelectedLine(lineId))
                        .on("dblclick", () => handleLineDoubleClick(lineId, 0))
                        .on("mouseover", (e)=> showLineCurrent(e, lineId)) )
                        .on("mouseout", ()=> hideLineCurrent())
            
    },

    ACSource: {
        id: 6,
        name: 'ACSource',
        component: (svg, lineId, setSelectedLine,handleLineDoubleClick,showLineCurrent, hideLineCurrent, x1, x2, y1, y2) => (
            svg.append("path")
            .attr("id", lineId)
            .attr("d", "M -50,25.000005 L 0,25.000005 C 0,25.000005 1.5,20.000004 4.5,20.000004 C 7.5,20.000004 10.5,30.000006 13.5,30.000006 C 16.5,30.000006 18,25.000005 18,25.000005 L 60,25.000005")
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("stroke-linejoin", "bevel")
            .attr("fill", "none")
             
            .attr("transform", " rotate("+(x1===x2?Math.sign(y2-y1):(x2>x1?0:-2))*90+" "+x1+" "+y1+") "+`translate(${x1+50},${y1-25})`)
            .on("click", () => setSelectedLine(lineId))
            .on("dblclick", () => handleLineDoubleClick(lineId, 0))
            
        )
    }

}

