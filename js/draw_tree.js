(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.MyTree = (function() {
    function MyTree(r) {
      this.update = __bind(this.update, this);
      this.adjustTree = __bind(this.adjustTree, this);
      var m,
        _this = this;
      this.root = r;
      m = [20, 120, 20, 120];
      this.w = 1280 - m[1] - m[3];
      this.h = 800 - m[0] - m[2];
      this.i = 0;
      this.nodeWidth = 100;
      this.nodeSeparation = 10;
      this.nodeSeparationRel = (this.nodeSeparation + this.nodeWidth) / this.nodeWidth;
      this.tree = d3.layout.tree().nodeSize([this.nodeWidth, 20]).separation(function() {
        return _this.nodeSeparationRel;
      });
      this.diagonal = function(d, i) {
        return "M" + d.source.x + "," + d.source.y + "V" + (d.source.y + (d.target.y - d.source.y) / 2) + "H" + d.target.x + "V" + d.target.y;
      };
      $("svg").html("");
      this.vis = d3.select("svg").attr("width", this.w + m[1] + m[3]).attr("height", this.h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + (this.w / 2 + m[1]) + "," + m[0] + ")");
      this.root.x0 = 0;
      this.root.y0 = 0;
      this.update(this.root);
    }

    MyTree.prototype.adjustTree = function(nodes) {
      var desired_position, nodeLayers, possible_position,
        _this = this;
      desired_position = function(node) {
        if (node.children) {
          node.x = 0;
          node.children.forEach(function(child) {
            return node.x += child.x;
          });
          return node.x /= node.children.length;
        }
      };
      possible_position = function(nodes) {
        var adjust_max, adjust_min;
        adjust_min = function() {
          var minX;
          minX = -_this.w / 2;
          return nodes.forEach(function(node) {
            if (node.x < minX) {
              node.x = minX;
              minX += _this.nodeWidth + _this.nodeSeparation;
            } else {
              minX = node.x + _this.nodeWidth + _this.nodeSeparation;
            }
          });
        };
        adjust_max = function() {
          var maxX;
          maxX = _this.w / 2 - _this.nodeWidth;
          return nodes.forEach(function(node) {
            if (node.x > maxX) {
              node.x = maxX;
              maxX -= _this.nodeWidth + _this.nodeSeparation;
            } else {
              maxX = node.x - (_this.nodeWidth + _this.nodeSeparation);
            }
          });
        };
        nodes = nodes.sort(function(a, b) {
          return a.x - b.x;
        });
        nodes.forEach(desired_position);
        nodes = nodes.sort(function(a, b) {
          if (a.parent === b.parent) {
            return a.x - b.x;
          } else {
            return a.parent.x - b.parent.x;
          }
        });
        adjust_min();
        nodes = nodes.reverse();
        adjust_max();
        nodes = nodes.reverse();
        return adjust_min();
      };
      nodeLayers = [];
      nodes.forEach(function(d) {
        var _name;
        if (nodeLayers[_name = d.depth] == null) {
          nodeLayers[_name] = [];
        }
        return nodeLayers[d.depth].push(d);
      });
      return nodeLayers.reverse().forEach(function(layer) {
        return possible_position(layer);
      });
    };

    MyTree.prototype.update = function(source) {
      var duration, link, node, nodeEnter, nodeExit, nodeUpdate, nodes,
        _this = this;
      duration = (d3.event && d3.event.altKey ? 5000 : 500);
      nodes = this.tree.nodes(this.root).reverse();
      nodes.forEach(function(d) {
        d.y = d.depth * 100;
      });
      node = this.vis.selectAll("g.node").data(nodes, function(d) {
        return d.id || (d.id = ++_this.i);
      });
      this.adjustTree(nodes);
      nodeEnter = node.enter().append("svg:g").attr("class", "node").attr("transform", function(d) {
        return "translate(" + source.x0 + "," + source.y0 + ")";
      }).on("click", function(d) {
        _this.toggle(d);
        _this.update(d);
      });
      nodeEnter.append("svg:rect").attr("width", 1).attr("height", 1).style("fill", function(d) {
        if (d._children) {
          return "lightsteelblue";
        } else {
          return "#fff";
        }
      });
      nodeEnter.append("svg:text").attr("y", 10).attr("dy", ".35em").attr("text-anchor", function(d) {
        return "middle";
      }).text(function(d) {
        return d.name;
      }).style("fill-opacity", 1e-6);
      nodeUpdate = node.transition().duration(duration).attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      nodeUpdate.select("rect").attr("width", 100).attr("height", 20).attr("x", -50).style("fill", function(d) {
        if (d._children) {
          return "lightsteelblue";
        } else {
          return "#fff";
        }
      });
      nodeUpdate.select("text").style("fill-opacity", 1);
      nodeExit = node.exit().transition().duration(duration).attr("transform", function(d) {
        return "translate(" + source.x + "," + source.y + ")";
      }).remove();
      nodeExit.select("rect").attr("width", 1).attr("height", 1);
      nodeExit.select("text").style("fill-opacity", 1e-6);
      link = this.vis.selectAll("path.link").data(this.tree.links(nodes), function(d) {
        return d.target.id;
      });
      link.enter().insert("svg:path", "g").attr("class", "link").attr("d", function(d) {
        var o;
        o = {
          x: source.x0,
          y: source.y0
        };
        return _this.diagonal({
          source: o,
          target: o
        });
      }).transition().duration(duration).attr("d", this.diagonal);
      link.transition().duration(duration).attr("d", this.diagonal);
      link.exit().transition().duration(duration).attr("d", function(d) {
        var o;
        o = {
          x: source.x,
          y: source.y
        };
        return _this.diagonal({
          source: o,
          target: o
        });
      }).remove();
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };

    MyTree.prototype.toggle = function(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    };

    return MyTree;

  })();

}).call(this);
