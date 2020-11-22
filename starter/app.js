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
            if (data.totals.all < 0) {
                data.totals.all = 0;
            }
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
                newItem = new Eexpens(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            calculateTotals(type);
            budgetControler.test();
            return newItem;   
        },
        getBudget: function() {
            return{
                budget: data.totals.all,
                totalInc: data.totals.inc,
                totalexp: data.totals.exp,
                percentage: data.totals.percentage    
            }
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
        budgetIcon:'.budget__value',
        incomeIcon: '.budget__income--value',
        expensIcon: '.budget__expenses--value',
        percentageIcon: '.budget__expenses--percentage'
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

        clearFialds: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ' ,' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(element) {
                element.value = "";
            })
            fieldsArr[0].focus();
        },

        didplayBudget: function(obj) {
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
        
        if (input.description === '' || isNaN(input.value)) {
            window.alert('enter a valid input')
        } else {
            newItem = budgetControler.addItem(input.type, input.description, input.value);
        
            uiControler.addListItem(newItem, input.type);

            uiControler.clearFialds();

            var budget = budgetControler.getBudget();

            uiControler.didplayBudget(budget);
        }
    }
        
    return {
        init: function() {
            setupEventListener()
        }
    }
      
    

})(budgetControler, uiControler)

controler.init();