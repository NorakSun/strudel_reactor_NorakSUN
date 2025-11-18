import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

export default function EventFrequencyBarChart({ logs, width = 800, height = 300 }) {
    const svgRef = useRef();
    const barsRef = useRef();

    // --- Process logs ---
    const { eventCounts, allLabels } = useMemo(() => {
        const counts = {};
        const labelSet = new Set();

        logs.forEach(log => {
            try {
                const obj = JSON.parse(log);
                let label = obj.event || "unknown";

                // Separate HUSH into ON/OFF
                if (label === "HUSH") {
                    label = obj.hush ? "HUSH ON" : "HUSH OFF";
                }

                counts[label] = (counts[label] || 0) + 1;
                labelSet.add(label);
            } catch {
                counts["unknown"] = (counts["unknown"] || 0) + 1;
                labelSet.add("unknown");
            }
        });

        return {
            eventCounts: counts,
            allLabels: Array.from(labelSet)
        };
    }, [logs]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        svg.style("background-color", "#000");

        const margin = { top: 20, right: 20, bottom: 70, left: 50 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // --- X and Y scales ---
        const xScale = d3.scaleBand()
            .domain(allLabels)
            .range([0, chartWidth])
            .padding(0.2);

        const maxCount = Math.max(...Object.values(eventCounts), 1);

        const yScale = d3.scaleLinear()
            .domain([0, maxCount])
            .range([chartHeight, 0])
            .nice();

        // --- Draw bars ---
        chartGroup.selectAll(".bar")
            .data(allLabels)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d))
            .attr("y", d => yScale(eventCounts[d] || 0))
            .attr("width", xScale.bandwidth())
            .attr("height", d => chartHeight - yScale(eventCounts[d] || 0))
            .style("fill", d => {
                if (d === "HUSH ON") return "orange";
                if (d === "HUSH OFF") return "steelblue";
                return "grey";
            });

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

        // --- Y-axis label ---
        chartGroup.append("text")
            .attr("x", -chartHeight / 2)
            .attr("y", -margin.left + 15)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .text("Frequency");

        // --- Rainbow animation for non-HUSH bars ---
        barsRef.current = chartGroup.selectAll(".bar")
            .filter(d => d !== "HUSH ON" && d !== "HUSH OFF");

        const animateRainbow = () => {
            barsRef.current.transition()
                .duration(2000)
                .styleTween("fill", () => t => d3.interpolateRainbow(Math.random()))
                .on("end", animateRainbow);
        };

        animateRainbow();

    }, [eventCounts, allLabels, width, height]);

    return <svg ref={svgRef} width={width} height={height} />;
}
