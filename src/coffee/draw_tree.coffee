class window.MyTree
  constructor: (r) ->
    @root = r
    m = [
      20
      120
      20
      120
    ]
    w = 1280 - m[1] - m[3]
    h = 800 - m[0] - m[2]
    @i = 0

    @tree = d3.layout.tree().nodeSize([
      100, 20
    ]).separation(->
      1.1
    )
    @diagonal = (d, i) ->
      return "M" + d.source.x + "," + d.source.y + "V" + (d.source.y + (d.target.y - d.source.y)/2) + "H" + d.target.x + "V" + d.target.y

    @vis = d3.select("svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + (w/2 + m[1]) + "," + m[0] + ")")
    @root.x0 = 0
    @root.y0 = 0
    @update(@root)

  # Initialize the display to show a few nodes.
  update: (source) =>
    duration = (if d3.event and d3.event.altKey then 5000 else 500)

    # Compute the new tree layout.
    nodes = @tree.nodes(@root).reverse()

    # Normalize for fixed-depth.
    nodes.forEach (d) ->
      d.y = d.depth * 180
      return


    # Update the nodes…
    node = @vis.selectAll("g.node").data(nodes, (d) =>
      d.id or (d.id = ++@i)
    )

    # Enter any new nodes at the parent's previous position.
    nodeEnter = node.enter().append("svg:g").attr("class", "node").attr("transform", (d) ->
      "translate(" + source.x0 + "," + source.y0 + ")"
    ).on("click", (d) =>
      @toggle d
      @update d
      return
    )
    nodeEnter.append("svg:rect").attr("width", 1).attr("height", 1).style "fill", (d) ->
      (if d._children then "lightsteelblue" else "#fff")

    nodeEnter.append("svg:text").attr("y", 10).attr("dy", ".35em").attr("text-anchor", (d) ->
      "middle"
    ).text((d) ->
      d.name
    ).style "fill-opacity", 1e-6

    # Transition nodes to their new position.
    nodeUpdate = node.transition().duration(duration).attr("transform", (d) ->
      "translate(" + d.x + "," + d.y + ")"
    )
    nodeUpdate.select("rect").attr("width", 100).attr("height", 20).attr("x", -50).style "fill", (d) ->
      (if d._children then "lightsteelblue" else "#fff")

    nodeUpdate.select("text").style "fill-opacity", 1

    # Transition exiting nodes to the parent's new position.
    nodeExit = node.exit().transition().duration(duration).attr("transform", (d) ->
      "translate(" + source.x + "," + source.y + ")"
    ).remove()
    nodeExit.select("rect").attr("width", 1).attr("height", 1)
    nodeExit.select("text").style "fill-opacity", 1e-6

    # Update the links…
    link = @vis.selectAll("path.link").data(@tree.links(nodes), (d) ->
      d.target.id
    )

    # Enter any new links at the parent's previous position.
    link.enter().insert("svg:path", "g").attr("class", "link").attr("d", (d) =>
      o =
        x: source.x0
        y: source.y0

      @diagonal
        source: o
        target: o

    ).transition().duration(duration).attr "d", @diagonal

    # Transition links to their new position.
    link.transition().duration(duration).attr "d", @diagonal

    # Transition exiting nodes to the parent's new position.
    link.exit().transition().duration(duration).attr("d", (d) =>
      o =
        x: source.x
        y: source.y

      @diagonal
        source: o
        target: o

    ).remove()

    # Stash the old positions for transition.
    nodes.forEach (d) ->
      d.x0 = d.x
      d.y0 = d.y
      return

    return

  # Toggle children.
  toggle: (d) ->
    if d.children
      d._children = d.children
      d.children = null
    else
      d.children = d._children
      d._children = null
    return

