// const express = require("express");

 var budgetControler = (function () {

    var Eexpens = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = 0
    }
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    Eexpens.prototype.calcPercentage = function(totalInc) {
        if (totalInc > 0) {
                this.percentage = Math.round((this.value / totalInc) * 100);
            } else {
                this.percentage = 0;
            }
    }

    Eexpens.prototype.getPercentage = function() {
        return this.percentage;
    }

    var calculateTotals = function(type) {
        var sum = 0;
            for(var i = 0; i < data.allItems[type].length; i++) {
                sum = sum + data.allItems[type][i].value;
            }
            data.totals[type] = sum;
            data.totals.all = data.totals.inc - data.totals.exp;
            if (data.totals.all < 0) {
                data.totals.all = 0;
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
                newItem = new Eexpens(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            
  
            return newItem;   
        },

        calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotals('exp');
            calculateTotals('inc');
            
            // Calculate the budget: income - expenses
            
            data.totals.all = data.totals.inc - data.totals.exp;
            if (data.totals.all < 0) {
                data.totals.all = 0;
            }
            if (data.totals.inc > 0) {
                data.totals.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            
        },

        calculatePercentage: function() {
            data.allItems.exp.forEach (function(cur) {
                cur.calcPercentage(data.totals.inc)
            })
        },
        
        getPercentages: function() {
            
            let allPerc = data.allItems.exp.map(function(cur) {
                
                return cur.getPercentage();
            })
            return allPerc;
        },

        deleteItem: function(type, id) {
            let ids;

            ids = data.allItems[type].map(function(current){
                return current.id;
            })

            let index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }

        },

        getBudget: function() {
            return{
                budget: data.totals.all,
                totalInc: data.totals.inc,
                totalexp: data.totals.exp,
                percentage: data.totals.percentage    
            }
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
        budgetIcon:'.budget__value',
        incomeIcon: '.budget__income--value',
        expensIcon: '.budget__expenses--value',
        percentageIcon: '.budget__expenses--percentage',
        container: '.container',
        percentageExp: '.item__percentage'
    }

    
    
    
    return {
        getInput: function() {
            return {
             type: document.querySelector(DOMstrings.inputType).value, //inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            };
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                 html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml)
            
        },

        removeListItem: function(selectorID) {
            let el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFialds: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ' ,' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(element) {
                element.value = "";
            })
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetIcon).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeIcon).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensIcon).textContent = obj.totalexp;
            if (obj.percentage > 0 && obj.totalexp <= obj.totalInc) {
               document.querySelector(DOMstrings.percentageIcon).textContent = obj.percentage + '%';
            } else if (obj.totalexp > obj.totalInc && obj.totalInc > 0) {
                document.querySelector(DOMstrings.percentageIcon).textContent = '100%'
            } else {
                document.querySelector(DOMstrings.percentageIcon).textContent = '0%'
            }
            
        },

        displayPercentage: function(percentages) {
            let fields = document.querySelectorAll(DOMstrings.percentageExp);
            
            let nodeListForEach = function(list, callback) {
                    for (var i = 0; i < list.length; i++) {
                        callback(list[i], i);
                    }
                };
            nodeListForEach(fields, function(current, index) {

                current.textContent = percentages[index] + '%';
            }) 

            
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

        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);
    };
   
    var updateBudget = function() {
        
        budgetControler.calculateBudget();
        
        var budget = budgetControler.getBudget();
        
        uiControler.displayBudget(budget);
    };

    var updatePercentages = function() {
        
        budgetControler.calculatePercentage();

        var percentages = budgetControler.getPercentages();

        uiControler.displayPercentage(percentages);
    }
    
    var ctrlAddItem = function() {
        var input, newItem;

        input = uiControler.getInput();
        
        if (input.description === '' || isNaN(input.value)) {
            window.alert('enter a valid input')
        } else {
            newItem = budgetControler.addItem(input.type, input.description, input.value);
        
            uiControler.addListItem(newItem, input.type);

            uiControler.clearFialds();

            updateBudget()

            updatePercentages()

        }
    }

    var ctrlDeleteItem = function(event) {
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            let splitID, type, id;
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            budgetControler.deleteItem(type, id);

            uiControler.removeListItem(itemID);

            updateBudget()

            updatePercentages()
        }
    }
        
    return {
        init: function() {
            setupEventListener()
        }
    }
      
    

})(budgetControler, uiControler)

controler.init();