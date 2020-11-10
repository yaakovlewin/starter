 var budgetControler = (function () {

    var Eexpens = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotals = function(type) {
        var sum = 0;
            for(var i = 0; i < data.allItems[type].length; i++) {
                sum = sum + data.allItems[type][i].value;
            }
            data.totals[type] = sum;
            data.totals.all = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.totals.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            
    }
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0,
            all: 0,
            percentage: 0
        }
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            if (!data.allItems[type].length) {
                 ID = 100;
            }else if (data.allItems[type].length > 0 ) {
                ID = data.allItems[type][data.allItems[type].length -1].id +1;
            }
            
            if(type === 'exp') {
                newItem = new Eexpens(ID, des, val)
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            data.allItems[type].push(newItem)
            calculateTotals(type)
            budgetControler.test()
            return newItem;   
        },
        test: function() {
            console.log(data);
        }
    }

})()




var uiControler = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        submit: '.submit',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetTotal:'.budget__value'
    }
    
    return {
        getInput: function() {
            return {
             type: document.querySelector(DOMstrings.inputType).value, //inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                 html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml)
            
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})()



var controler = (function(budgetControler, uiControler) {
    var setupEventListener = function() {
        var dom = uiControler.getDOMstrings();
        document.querySelector(dom.submit).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 63557 || event.keyCode === 13){
                ctrlAddItem()
            }
        })
    }
   
    
    var ctrlAddItem = function() {
        var input, newItem;

        input = uiControler.getInput();
        console.log(input);

        newItem = budgetControler.addItem(input.type, input.description, input.value);

        uiControler.addListItem(newItem, input.type);

        budgetControler.calculateTotals(input.type)
    }
        
    return {
        init: function() {
            setupEventListener()
        }
    }
      
    

})(budgetControler, uiControler)

controler.init();