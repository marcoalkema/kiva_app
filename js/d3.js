import * as d3 from 'd3'
import * as R from 'ramda'
import { totalAmountPerSector } from './api.js'

export const renderTotalPerSector = (data) => {
  R.compose(
    renderBarGraph,
    R.sortBy(R.prop('sector')),
    convertToD3Data,
    totalAmountPerSector
  )(data)
}

const convertToD3Data = (data) => {
  return R.compose(
    R.map(key => ({
      sector: key,
      amount: data[key]
    })),
    R.keys()
  )(data)
}

export const renderBarGraph = (data) => {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 900 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom

  var formatYAxis = d3.format('.0f');

  var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
  var y = d3.scaleLinear()
      .range([height, 0])

  var svg = d3.select(".chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

  data.forEach(function(d) {
    d.amount = +d.amount
  })

  x.domain(data.map(function(d) { return d.sector }))
  y.domain([0, d3.max(data, function(d) { return d.amount })])

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.sector) })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.amount) })
    .attr("height", function(d) { return height - y(d.amount) })

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  svg.append("g")
    .call(d3.axisLeft(y))
}
