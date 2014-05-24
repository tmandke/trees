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
      children: null
    unless depthLeft == 1
      if randomInt(2) >= 1
        head.children = []
        for i in [0..randomInt(11)]
          head.children[i] = createTree(depthLeft-1)

    head
  createTree(depth)


$ ->
  window.treee = new MyTree(randomTree(4))
