#require draw_tree
$ = jQuery

#$ ->
#    # document ready code in here
#
#    # silly sample code to change background color on click
#    colors = ['#f99', '#9f9', '#99f', '#ff9', '#f9f', '#9ff']
#    counter = parseInt(Math.random() * colors.length)
#    getBg = ->
#        counter = if counter < colors.length - 1 then counter + 1 else 0
#        colors[counter]
#
#    $('body').on 'click', ->
#        $('html,body').css 'background-color', getBg()
#    .click()
randomInt = (i) ->
  Math.floor(Math.random() * i)

randomTree = (depth) ->
  index = 0
  createTree = (depthLeft) =>
    head =
      name: "Test String " + index++
      _children: null
    unless depthLeft == 1
      if randomInt(2) >= 1
        head._children = []
        for i in [0..randomInt(11)]
          head._children[i] = createTree(depthLeft-1)

    head
  createTree(depth)


$ ->
  window.current_tree = randomTree(4)
  $("#treejson").val(JSON.stringify(current_tree, null, 2))
  $("#apply").on("click", () ->
    window.current_tree = jQuery.parseJSON( $("#treejson").val())
    window.treee = new MyTree(current_tree)
  )
  window.treee = new MyTree(current_tree)
