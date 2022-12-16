import * as d3 from 'd3'

export default function d3LinkSimulation (
  svgref,
  nodes,
  links,
  selected,
  onClick = (e, d) => {},
  size = { width: 900, height: 900 }
) {
  console.log('draw')
  // const r = 15
  const color = ['red', 'green']
  const svg = d3.select(svgref)
  const someLink = [
    ...new Set(links.map(l => l.source).concat(links.map(l => l.target)))
  ]
  const hasLink = tem =>
    tem.number === selected || someLink.includes(tem.number)
  // Scales
  let numberLinks = d3.group(links, l => l.target)

  const scaleRadio = d3
    .scaleLinear()
    .range([15, 30])
    .domain([
      d3.min(numberLinks, ([_, value]) => value.length) || 0,
      d3.max(numberLinks, ([_, value]) => value.length) || 1
    ])
    .clamp(true)
  const scaleRadioFromTem = temtem => {
    return scaleRadio(numberLinks.get(temtem.number)?.length || 0)
  }

  // Selects
  svg.attr('width', size.width).attr('height', size.height)
  var root = svg.selectAll('.root').data([null])
  root = root.merge(
    root
      .enter()
      .append('g')
      .attr('class', 'root')
  )
  root.attr('transform', `translate(${size.width / 2},${size.height / 2})`)
  var defs = root.selectAll('.defs-wrapper').data([null])
  defs = defs.merge(
    defs
      .enter()
      .append('defs')
      .attr('class', 'defs-wrapper')
  )
  var lines = root.selectAll('.lines-wrapper').data([null])
  lines = lines.merge(
    lines
      .enter()
      .append('g')
      .attr('class', 'lines-wrapper')
  )
  var circles = root.selectAll('.circles-wrapper').data([null])
  circles = circles.merge(
    circles
      .enter()
      .append('g')
      .attr('class', 'circles-wrapper')
  )

  // definition clip path
  const clipPath = defs.selectAll('.clipPath').data(nodes, d => d.number)
  const clipPathEnter = clipPath
    .enter()
    .append('clipPath')
    .attr('class', 'clipPath')
    .attr('id', d => 'clip-' + d.number)

  const clipPathUpdate = clipPath.merge(clipPathEnter)
  // definition images
  const items = circles.selectAll('.temtem').data(nodes, d => d.number)
  const itemsEnter = items
    .enter()
    .append('g')
    .attr('class', 'temtem')
  const itemsExit = items.exit()
  const itemsUpddate = items.merge(itemsEnter)
  // definition links
  const link = lines
    .selectAll('.link')
    .data(links, d => d.source.number + '-' + d.target.number)
  const linkEnter = link
    .enter()
    .append('line')
    .attr('class', 'link')
  const linkExit = link.exit()
  const linkUpdate = link.merge(linkEnter)

  // ON ENTER
  clipPathEnter.append('circle').attr('r', 0)

  linkEnter
    .attr('opacity', 0)
    .attr('stroke', d => {
      console.log(d.deep, color[d.deep % 2])
      return color[d.deep % 2]
    })
    .transition()
    .attr('opacity', 1)

  itemsEnter
    .append('image')
    .attr('xlink:href', d => d.portraitWikiUrl)
    .attr('clip-path', d => `url(#clip-${d.number})`)

  //ON UPDATE
  clipPathUpdate
    .select('circle')
    .transition()
    .attr('r', function (t, e) {
      if (scaleRadioFromTem(t) === 40)
        console.log(t.name, scaleRadioFromTem(t), this)
      return scaleRadioFromTem(t)
    })

  itemsUpddate.on('click', (...args) => {
    simulation.alpha(0.4).restart()
    onClick(...args)
  })
  itemsUpddate
    .transition()
    .attr('opacity', d => (selected ? (hasLink(d) ? 1 : 0.2) : 1))
  itemsUpddate
    .select('image')
    .transition()
    .attr('width', t => scaleRadioFromTem(t) * 2)
    .attr('height', t => scaleRadioFromTem(t) * 2)
    .attr('x', t => -scaleRadioFromTem(t))
    .attr('y', t => -scaleRadioFromTem(t))
  // ON EXIT
  itemsExit
    .select('circle')
    .transition()
    .attr('r', 0)
    .remove()
  linkExit
    .transition()
    .attr('opacity', 0)
    .remove()

  const simulation = svgref.simulation || d3.forceSimulation()
  simulation
    .nodes(nodes)
    .force(
      'links',
      d3
        .forceLink(links)
        .id(d => d.number)
        .distance(90)
      // .distance(50)
    )
    .force('center', d3.forceCenter(0, 0))
    .force(
      'collide',
      d3.forceCollide(t => scaleRadioFromTem(t) + 1).iterations(4)
    )
    .force('manybody', d3.forceManyBody())
    .force(
      'radial',
      d3
        .forceRadial(
          d =>
            d.number === selected ? 0 : Math.min(size.width, size.height) / 6,
          0,
          0
        )
        .strength(d => (d.number === selected ? 0.5 : 0.1))
    )
  svgref.simulation = simulation
  simulation.alphaDecay(0.005)
  simulation.on('tick', () => {
    linkUpdate
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
    itemsUpddate.attr('transform', d => `translate(${d.x},${d.y})`)
  })
  const drag = simulation => {
    function dragstarted (event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged (event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended (event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }
  itemsUpddate.call(drag(simulation))
}
