import { useMyContext } from "../contextApi/MyContext"


export const components = {
    wire:{
        id: 1,
        name: 'wire',
        component: (svg, setSelectedLine, lineId, x1, x2, y1, y2) => (
            svg
            .append("line")
            .attr("id", lineId) // Set the line's ID
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", "grey")
            .attr("stroke-width", "3")
            .on("click", () => setSelectedLine(lineId))
        )
    },
    resistor:{
        id: 2,
        name: 'resistor',
        component: (svg, setSelectedLine, lineId, x1, x2, y1, y2) => (
            svg.append("path")
            .attr("id", lineId)
            .attr("d", "M " + x1 +" "+y1 + "l"+ Math.sign((x2-x1)?(x2-x1):(y2-y1))*40+ " 0 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*2.5 +"-5 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5+" 10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5+" -10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5+" 10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5 +" -10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*5+" 10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*2.5+ " -5 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*40+ " 0")
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("stroke-linejoin", "bevel")
            .attr("fill", "none")
            .attr("transform", "rotate("+(y2===y1?0:Math.sign(y2<y1?y1-y2:y2-y1))*90+" "+x1+" "+y1+")")
            .on("click", () => setSelectedLine(lineId))
        )
    },
    capacitor:{
        id: 3,
        name: 'capacitor',
        component: (svg, setSelectedLine, lineId, x1, x2, y1, y2) => (
            svg.append("path")
            .attr("id", lineId)                 
            .attr("d", "M " + x1 +" "+y1 + "l"+ Math.sign((x2-x1)?(x2-x1):(y2-y1))*50+ " 0 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*0 +"-10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*0+" 20 m "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*10 +"-10 l 0 -10 l 0 20 l 0 -10 l"+Math.sign((x2-x1)?(x2-x1):(y2-y1))*50+ " 0")
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("stroke-linejoin", "bevel")
            .attr("fill", "none")
            .attr("transform", "rotate("+(y2===y1?0:Math.sign(y2<y1?y1-y2:y2-y1))*90+" "+x1+" "+y1+")")
            .on("click", () => setSelectedLine(lineId))
        )
    },
    inductor: {
        id: 4,
        name: 'inductor',
        component: (svg, setSelectedLine, lineId, x1, x2, y1, y2) => (
            svg.append("path")
            .attr("id", lineId)
            .attr("d", "M -35,0 L 5.5,0 C 5.5,0 5.5,-4 9.5,-4 C 13.5,-4 13.5,0 13.5,0 C 13.5,0 13.5,-4 17.5,-4 C 21.5,-4 21.5,0 21.5,0 C 21.5,0 21.5,-4 25.5,-4 C 29.5,-4 29.5,0 29.5,0 C 29.5,0 29.5,-4 33.5,-4 C 37.5,-4 37.5,0 37.5,0 L 75,0")
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("stroke-linejoin", "bevel")
            .attr("fill", "none")
            .attr("transform", " rotate("+(x1==x2?Math.sign(y2-y1):(x2>x1?0:-2))*90+" "+x1+" "+y1+") "+`translate(${x1+35},${y1})`)
            .on("click", () => setSelectedLine(lineId))
        )
    },
    DCsource: {
        id: 5,
        name: 'DCsource',
        component: (svg, setSelectedLine, lineId, x1, x2, y1, y2) => (
                    svg.append("path")
                        .attr("id", lineId)
                        .attr("d", "M " + x1 +" "+y1 + "l"+ Math.sign((x2-x1)?(x2-x1):(y2-y1))*50+ " 0 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*0 +"-10 l "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*0+" 20 m "+Math.sign((x2-x1)?(x2-x1):(y2-y1))*10 +"-10 l 0 -25 l 0 50 l 0 -25 l"+Math.sign((x2-x1)?(x2-x1):(y2-y1))*50+ " 0")
                        .attr("stroke", "black")
                        .attr("stroke-width", "3")
                        .attr("stroke-linejoin", "bevel")
                        .attr("fill", "none")
                        .attr("transform", "rotate("+(y2==y1?0:Math.sign(y2<y1?y1-y2:y2-y1))*90+" "+x1+" "+y1+")")
                        .on("click", () => setSelectedLine(lineId))
        )
    },
    
}