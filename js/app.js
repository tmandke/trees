(function() {
  var $, randomInt, randomTree;

  $ = jQuery;

  randomInt = function(i) {
    return Math.floor(Math.random() * i);
  };

  randomTree = function(depth) {
    var createTree, index,
      _this = this;
    index = 0;
    createTree = function(depthLeft) {
      var head, i, _i, _ref;
      head = {
        name: "Test String " + index++,
        _children: null
      };
      if (depthLeft !== 1) {
        if (randomInt(2) >= 1) {
          head._children = [];
          for (i = _i = 0, _ref = randomInt(11); 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            head._children[i] = createTree(depthLeft - 1);
          }
        }
      }
      return head;
    };
    return createTree(depth);
  };

  $(function() {
    window.current_tree = randomTree(4);
    $("#treejson").val(JSON.stringify(current_tree, null, 2));
    $("#apply").on("click", function() {
      window.current_tree = jQuery.parseJSON($("#treejson").val());
      window.treee = new MyTree(current_tree);
    });
    window.treee = new MyTree(current_tree);
  });

}).call(this);
