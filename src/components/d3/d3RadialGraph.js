import * as d3 from 'd3'
export function drawRadialGraph (
  svgRef,
  datas,
  {
    keys = [],
    pathColor = d3.schemePastel1,
    circleColor = ['transparent'],
    max = 130,
    fill = false,
    size = { width: 100, height: 100 }
  } = {}
) {
  const svg = d3.select(svgRef)

  svg.attr('width', size.width).attr('height', size.height)
  var root = svg.selectAll('.root').data([null])
  var rootEnter = root
    .enter()
    .append('g')
    .attr('class', 'root')
  root = root.merge(rootEnter)

  const transformData = d => keys.map(key => ({ key, value: d[key] || 0 }))
  // SCALES
  const rScale = d3
    .scaleLinear()
    .range([0, Math.min(size.width / 2, size.height / 2) - 20])
    .domain([0, max])
  const alphaScale = d3
    .scaleBand()
    .range([0, Math.PI * 2])
    .domain(keys)
  const colorScale = d3
    .scaleLinear()
    .domain([0, max])
    .range(circleColor)
  const pathColorScale = d3.scaleOrdinal(pathColor)
  const angle = -Math.PI / 2
  const xCart = (r, key) => rScale(r) * Math.cos(angle + alphaScale(key))
  const yCart = (r, key) => rScale(r) * Math.sin(angle + alphaScale(key))

  // LINE
  const line = d3
    .radialLine()
    .angle(d => alphaScale(d.key))
    .radius(d => rScale(d.value))
    //.curve(d3.curveCardinalClosed);
    .curve(d3.curveLinearClosed)

  const centerTransform = d3.zoomIdentity.translate(
    size.width / 2,
    size.height / 2
  )

  // DRAW Circle
  const circles = rootEnter.append('g').attr('class', 'circles')
  const createCircle = (g, r) => {
    var circle = g
      .append('circle')
      .attr('r', rScale(r))
      .attr('stroke', '#fff')
    if (fill) circle.attr('fill', colorScale(r))
    else circle.attr('fill-opacity', 0)
    return g
  }
  circles
    .call(createCircle, max)
    .call(createCircle, (max * 4) / 5)
    .call(createCircle, (max * 3) / 5)
    .call(createCircle, (max * 2) / 5)
    .call(createCircle, max / 5)
    .style('opacity', 0.9)

  root.select('.circles').attr('transform', centerTransform)

  // DRAW LINES
  var lines = root
    .select('.circles')
    .selectAll('.line')
    .data(keys)

  const linesEnter = lines
    .enter()
    .append('line')
    .attr('class', 'line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', d => 0)
    .attr('y2', d => 0)
    .attr('stroke', '#fff')
    .attr(
      'transform',
      d => `rotate(${((angle + alphaScale(d)) * 180) / Math.PI})`
    )

  lines
    .exit()
    .transition()
    .attr('x2', 0)
    .attr('y2', 0)
    .style('opacity', 0)
    .remove()
  lines = lines.merge(linesEnter)
  lines
    .transition()
    .duration(1000)
    .attr('x2', d => rScale(max))

  // DRAW TEXT
  var texts = root
    .select('.circles')
    .selectAll('.text')
    .data(keys, k => k)
  const textsEnter = texts
    .enter()
    .append('text')
    .attr('class', 'text')
    .attr('opacity', 0)
    .text(d => d)

  texts
    .exit()
    .transition()
    .style('opacity', 0)
    .remove()
  texts = texts.merge(textsEnter)
  texts
    .attr('transform', d => `translate(${xCart(max, d)},${yCart(max, d)})`)
    .transition()
    .attr('opacity', 1)

  // DRAW PATH
  var path = root.selectAll('.path').data(datas)
  const pathEnter = path
    .enter()
    .append('path')
    .attr('class', 'path')
    .attr('opacity', 0)
  path
    .exit()
    .transition()
    .duration(1000)
    .style('opacity', 0)
    .remove()
  path = path.merge(pathEnter)
  path
    .attr('transform', centerTransform)
    .transition()
    .style('opacity', 0.8)
    .attr('d', d => line(transformData(d)))
    .attr('fill', (_, i) => pathColorScale(i))

  // MOUSE
  path.on('mouseout', mouseleave)
  path.on('mouseover', mouseenter)

  function mouseleave (event) {
    path.transition().style('opacity', 0.8)
  }
  function mouseenter (event) {
    path.transition().style('opacity', 0.2)
    d3.select(this)
      .transition()
      .style('opacity', 1)
  }
}
