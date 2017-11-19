import * as d3 from 'd3'
import * as R from 'ramda'
import { totalAmountPerSector, groupTotalAmountBy } from './api.js'

export const renderTotalPerSector = data => {
  R.compose(
    renderBarGraph('sector', 'amount'),
    R.sortBy(R.prop('sector')),
    convertToD3Data,
    groupTotalAmountBy(['sector'])
  )(data)
}

export const renderTotalPerCountry = data => {
  R.compose(
    renderBarGraph('country', 'amount'),
    R.sortBy(R.prop('country')),
    convertToD3Data,
    groupTotalAmountBy(['location', 'country'])
  )(data)
}

export const renderTotalPerCategory = category => data => {
  const categoryName = R.takeLast(1, category)
  R.compose(
    renderBarGraph(categoryName, 'amount'),
    R.sortBy(R.prop(categoryName)),
    convertToD3Data,
    groupTotalAmountBy(category)
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

export const renderBarGraph = (xName, yName) => (data) => {

  console.log(xName, yName)

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
    d[yName] = +d[yName]
  })

  x.domain(data.map(function(d) { return d[xName] }))
  y.domain([0, d3.max(data, function(d) { return d[yName] })])

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d[xName]) })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d[yName]) })
    .attr("height", function(d) { return height - y(d[yName]) })

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  svg.append("g")
    .call(d3.axisLeft(y))
}
