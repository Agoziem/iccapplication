import React, { useEffect } from "react";
import * as echarts from "echarts";

function WebTrafficChart() {
  useEffect(() => {
    echarts.init(document.querySelector("#trafficChart")).setOption({
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: 1048,
              name: "Search Engine",
            },
            {
              value: 735,
              name: "Direct",
            },
            {
              value: 580,
              name: "Email",
            },
            {
              value: 484,
              name: "Union Ads",
            },
            {
              value: 300,
              name: "Video Ads",
            },
          ],
        },
      ],
      color: ["#27011d", "#e88504", "#2cc94b", "#a11927", "#343a40"],
      textStyle: {
        fontFamily: "jost",
      },
    });
  }, []);

  return (
    <div
      id="trafficChart"
      style={{ minHeight: "400px" }}
      className="echart"
    ></div>
  );
}

export default WebTrafficChart;
