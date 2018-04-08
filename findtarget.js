var numbers = new Array(5);
var twoDigitsNumber;
var targetNumber;

for(var i = 0;i<numbers.length;i++)
{
    numbers[i] = Math.floor((Math.random() * 9) + 1);
}

twoDigitsNumber = Math.floor((Math.random() * 9) + 1)*10;
targetNumber = Math.floor((Math.random() * 899) + 100);

numbers.push(twoDigitsNumber);

document.getElementById("Numbers").innerHTML = "Given Numbers = {"+numbers.sort(function(a, b){return a-b}).valueOf()+"}";

document.getElementById("Target").innerHTML = "Target Number: "+ targetNumber;

var solutions = SolveTrees(numbers,targetNumber);

solutions.forEach(solution => {

    document.getElementById("Result").innerHTML += "<br>"+ solution;

});

function SolveTrees(numbers,targetNumber){
    var output = [];
    var nodes = [];
    numbers.forEach(numberInOperation => {
        nodes.push(new Node(numberInOperation));
    });

    var allTrees = CreateTrees(nodes);

    var bestTrees = [];
    var minDifference = 999;
    allTrees.forEach(nodeInOperation => {
        var e = nodeInOperation.evaluate();
        var difference = Math.abs(e - targetNumber);
        if(difference < minDifference)
        {
            bestTrees.splice(0,bestTrees.length);
            minDifference = difference;
            bestTrees.push(nodeInOperation);
        }
        else if(difference == minDifference){
            bestTrees.push(nodeInOperation);
        }
    });
    bestTrees.forEach(nodeInOperation => {

        if(output.indexOf(nodeInOperation+ " = " +nodeInOperation.evaluate()) == -1)
        {
            output.push(nodeInOperation+" = "+nodeInOperation.evaluate());
        }
    });
    return output;
}

function CreateTrees(nodes) {
    if (nodes.length === 1) {
        return nodes;
    }
    var result = nodes.slice(0);

    nodes.forEach(node => {

        var copy = nodes.slice(0);
        copy.splice(copy.indexOf(node),1);

        var others = CreateTrees(copy);

        others.forEach(other => {

            result.push(new Node(null,node, '+', other));
            result.push(new Node(null,node, '*', other));
            result.push(new Node(null,node, '-', other));
            result.push(new Node(null,other, '-', node));

            var vNode = node.evaluate();
            var vOther = other.evaluate();

            if (vOther !== 0 && vNode % vOther === 0) {
                result.push(new Node(null,node, '/', other));
            }
            if (vNode !== 0 && vOther % vNode === 0) {
                result.push(new Node(null,other, '/', node));
            }
        });
    });
    return result;
};

function Node(value,left,op,right){
   this.value = value;
   this.left = left;
   this.op = op;
   this.right = right;
   this.evaluate = function(){
        if(this.op != null)
        {
            var lv = this.left.evaluate();
            var rv = this.right.evaluate();
            if(this.op == '+'){
                return lv + rv;
            }
            else if(this.op == '-'){
                return lv - rv;
            }
            else if(this.op == '*'){
                return lv * rv;
            }
            else if(this.op == '/'){
                return lv / rv;
            }
        }
        return this.value;
    }
    this.toString = function(){
        if(this.op == null){
            return this.value;
        }
        return "(" + this.left.toString() + this.op + this.right.toString() + ")";
    }
}
