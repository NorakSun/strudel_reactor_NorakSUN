import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function EventFrequencyBarChart({ logs, width = 800, height = 300 }) {
    const svgRef = useRef();

    useEffect(() => {
        if (!logs || logs.length === 0) return;

        // --- Extract event names ---
        const eventNames = logs.map(log => {
            try {
                const obj = JSON.parse(log);
                return obj.event || "unknown";
            } catch {
                return "unknown";
            }
        });

        // --- Count frequencies ---
        const frequencyMap = {};
        eventNames.forEach(name => {
            frequencyMap[name] = (frequencyMap[name] || 0) + 1;
        });
        const data = Object.entries(frequencyMap).map(([event, count]) => ({ event, count }));

        // --- Setup SVG ---
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        svg.style("background-color", "#000"); // black background

        const margin = { top: 20, right: 20, bottom: 50, left: 50 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // --- X and Y scales ---
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.event))
            .range([0, chartWidth])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .nice()
            .range([chartHeight, 0]);

        // --- Draw bars ---
        const bars = chartGroup.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.event))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => chartHeight - yScale(d.count))
            .style("fill", (d, i) => d3.interpolateRainbow(i / data.length));

        // --- Animate rainbow bars ---
        const animateRainbow = () => {
            bars.transition()
                .duration(2000)
                .styleTween("fill", function(d, i) {
                    // interpolateRainbow returns a color string, we wrap it in a function of t
                    return t => d3.interpolateRainbow(Math.random());
                })
                .on("end", animateRainbow); // repeat
        };
        animateRainbow();

        // --- X axis ---
        chartGroup.append("g")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end")
            .style("fill", "#fff");

        // --- Y axis ---
        chartGroup.append("g")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .style("fill", "#fff");

        // Y-axis label
        chartGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -margin.left + 15)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .text("Frequency");

    }, [logs, width, height]);

    return <svg ref={svgRef} width={width} height={height} />;
}
