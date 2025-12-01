// model view pattern

// Storage controller
const StorageCtrl =(function(){

    return {

        storeItem: function(item){

            let items;

            if(localStorage.getItem("items") === null){

                items = [];

                items.push(item);

                localStorage.setItem("items",JSON.stringify(items));

            }
            else{

                items = JSON.parse(localStorage.getItem("items"));

                items.push(item);

                localStorage.setItem("items",JSON.stringify(items));

            }
        },

        getItems: function(){

            let items;

            if(localStorage.getItem("items") === null){

                items = [];
            }
            else{

                items = JSON.parse(localStorage.getItem("items"));
            }

            return items;
        },

        deleteItemsLS: function(id){

            let items = this.getItems();
            
            items.forEach((item,index)=>{
                
                if(id === item.id){

                    items.splice(index,1);
                }
            });

            localStorage.setItem("items",JSON.stringify(items));
        },

        updateItemsLS: function(updateItem){

            let items = this.getItems();

            items.forEach((item,index)=>{

                if(updateItem.id === item.id){

                    items.splice(index,1,updateItem);
                }
            });

            localStorage.setItem("items",JSON.stringify(items));
        },

        clearItemsLS: function(){

            localStorage.removeItem("items");
        }
    }
})();


//Item controller
const ItemCtrl = (function() {

    // constructor
    const Items = function(id, name, money) {

        this.id = id;
        this.name = name;
        this.money = money;
    }


    // Data structure
    const data = {

        items: StorageCtrl.getItems(),
        currentItem: null,
        totalMoney: 0
    }

    

    return {

        getItem: function () {
            return data.items
        },

        addItem: function(name, money) {

            //create ID
            let ID;

            if (data.items.length > 0) {

                ID = data.items[data.items.length - 1].id + 1;

            }
            else {
                ID = 0;
            }

            money = parseInt(money);

            const newItem = new Items(ID, name, money);

            data.items.push(newItem);

            return newItem;
        },

        getTotalMoney: function(){

            let total = 0;

            if(data.items.length > 0){

                data.items.forEach(function(item){

                    total += item.money
                });
            }
            else{
                
                return data.totalMoney = 0;
            }
            
            return total;
            
        },

        getItemByid: function(id){

            let found = null;

            data.items.forEach(item=>{

                if(item.id === id){

                    found = item;
                }

            })
            
            return found;
        },

        setCurrenItem: function(item){

            data.currentItem = item;
        },

        getCurrentItem: function(){

            return data.currentItem;
        },

        delteItem: function(id){

            const ids = data.items.map(item=>{

                return item.id;
            });

            const index = ids.indexOf(id);
            
            data.items.splice(index,1);

        },

        clearAllList: function(){

            data.items = [];
        },

        updateListItem(id){

           const updateItem = {
                id: id,
                name: UICtrl.getItemInput().name,
                money: UICtrl.getItemInput().money            
           }
           
            const ids = data.items.map(item=>{

                return item.id;
            });

            const index = ids.indexOf(id);
            
            data.items.splice(index,1,updateItem);

            updateItem.money = parseInt(updateItem.money);

            return updateItem;
        
        }
    }

})();



//UI controler
const UICtrl = (function() {


    return {

        populateItems: function(items) {

            let html = "";

            items.forEach((item) => {

                html += `
                <li class="collection-item" id=item-${item.id}><strong>${item.name} : </strong>
                            <em>rs.${item.money}</em>
                            <a href="#" class="secondary-content">
                                <i class="fa-solid fa-pencil edit-item"></i>
                            </a>
                </li>`

            });

            document.querySelector('#item-list').innerHTML = html;
        },

        clearEditState: function() {

            document.querySelector(".add-btn").style.display = "inline"
            document.querySelector(".update-btn").style.display = "none"
            document.querySelector(".delete-btn").style.display = "none"
            document.querySelector(".back-btn").style.display = "none"
        },

        showEditState: function() {

            document.querySelector(".add-btn").style.display = "none"
            document.querySelector(".update-btn").style.display = "inline"
            document.querySelector(".delete-btn").style.display = "inline"
            document.querySelector(".back-btn").style.display = "inline"
        },

        getItemInput: function() {

            return {

                name: document.querySelector("#item-name").value,
                money: document.querySelector("#item-money").value
            }
        },

        addListItem: function(newItem) {

            const li = document.createElement("li");

            li.className = "collection-item";

            li.id = `item-${newItem.id}`

            li.innerHTML = `<strong>${newItem.name} : </strong>
                <em>rs.${newItem.money}</em>
                <a href="#" class="secondary-content">
                    <i class="fa-solid fa-pencil edit-item"></i>
                </a>`

            document.querySelector("#item-list").appendChild(li);
            
        },

        clearInputState: function(){

            document.querySelector("#item-name").value = "";
            document.querySelector("#item-money").value = "";
        },

        showTotalMoney(totalMoney){

            document.querySelector(".total-money").innerText = totalMoney;            

        },

        addItemToForm: function(){

            document.querySelector("#item-name").value = ItemCtrl.getCurrentItem().name;
            document.querySelector("#item-money").value = ItemCtrl.getCurrentItem().money;
        },

        deletListItem: function(id){

            const itemId = `#item-${id}`;

            const item = document.querySelector(itemId);

            item.remove();
            
        },

        ItemsClearAll: function(){

            const list = document.querySelectorAll(".collection-item");

            list.forEach(li=>{

                li.remove();
            });
        },

        showUpdateItem: function(updateItem){

            const itemId = `#item-${updateItem.id}`;

            const item = document.querySelector(itemId);
            
            item.innerHTML = `<strong>${updateItem.name} : </strong>
                <em>rs.${updateItem.money}</em>
                <a href="#" class="secondary-content">
                    <i class="fa-solid fa-pencil edit-item"></i>
                </a>`
        },

        showAlert: function(type,message){

            this.clearAlert();

            const div = document.createElement("div");

            div.className = `alert alert-${type}`;

            div.innerText = message;

            document.querySelector(".show-alert").appendChild(div);

            setTimeout(()=>{
                div.remove();
            },2500);

        },

        clearAlert: function(){

            const currentAlert = document.querySelector(".alert");

            if(currentAlert){

                currentAlert.remove();
            }
        }
   
    }


})();

//  App controler
const App = (function() {

    const loadEventListeners = function() {

        document.querySelector("#item-list").addEventListener("click", itemClick);
        document.querySelector(".add-btn").addEventListener("click", itemAddSubmit);
        document.querySelector(".delete-btn").addEventListener("click",itemDeleteSubmit);
        document.querySelector(".back-btn").addEventListener("click",itemBack);
        document.querySelector("#clear-all").addEventListener("click",clearAll);
        document.querySelector(".update-btn").addEventListener("click",itemUpdate);
    }

    const itemAddSubmit = function (e) {

        e.preventDefault();

        // get input from form
        const input = UICtrl.getItemInput();

        if (input.name === "" || input.money === "") {

            UICtrl.showAlert("danger","Please fill the fields");
        }
        else {

            const newItem = ItemCtrl.addItem(input.name, input.money);

            // add list to item 
            UICtrl.addListItem(newItem);

            const totalMoney = ItemCtrl.getTotalMoney();

            UICtrl.showTotalMoney(totalMoney);

            //add items to storage
            StorageCtrl.storeItem(newItem);

            UICtrl.clearInputState();

            UICtrl.showAlert("success","Item Added sucessfuly");

        }

    }

    
    const itemClick = function(e) {

        if (e.target.classList.contains("edit-item")) {

            UICtrl.showEditState();

            const listId = e.target.parentElement.parentElement.id;

            const listArr = listId.split("-");
            
            const id = parseInt(listArr[1]);
           
            const itemEdit = ItemCtrl.getItemByid(id);
            
            ItemCtrl.setCurrenItem(itemEdit);

            UICtrl.addItemToForm();
            
        }
 
    }

    const itemDeleteSubmit = function(){

        const currentItemId = ItemCtrl.getCurrentItem().id;
        
        ItemCtrl.delteItem(currentItemId);

        UICtrl.deletListItem(currentItemId);

        StorageCtrl.deleteItemsLS(currentItemId);

        const totalMoney = ItemCtrl.getTotalMoney();

        UICtrl.showTotalMoney(totalMoney);

        UICtrl.clearEditState();
        
        UICtrl.clearInputState();

        UICtrl.showAlert("success","Item Deleted successfuly")

    }

    const itemBack = function(){

        UICtrl.clearEditState();
        UICtrl.clearInputState();
    }

    const clearAll = function(){

        const items = ItemCtrl.getItem();

        if(items.length > 0){

            ItemCtrl.clearAllList();
            UICtrl.ItemsClearAll();

            const totalMoney = ItemCtrl.getTotalMoney();
            UICtrl.showTotalMoney(totalMoney);

            UICtrl.clearEditState();
            UICtrl.clearInputState();

            StorageCtrl.clearItemsLS();

            UICtrl.showAlert("success","All Items were cleared successfuly");
        }
        else{

            UICtrl.showAlert("danger","No Items are in list");
        }
    
    }

    const itemUpdate = function(){

        const currentItemId = ItemCtrl.getCurrentItem().id;
        
        const updateItem = ItemCtrl.updateListItem(currentItemId);
        
        UICtrl.showUpdateItem(updateItem);

        StorageCtrl.updateItemsLS(updateItem);

        const totalMoney = ItemCtrl.getTotalMoney();

        UICtrl.showTotalMoney(totalMoney);

        UICtrl.clearInputState();

        UICtrl.clearEditState();

        UICtrl.showAlert("success","Item updated successfuly")

    }

    return {

        start: function () {

            UICtrl.clearEditState();

            const totalMoney = ItemCtrl.getTotalMoney();

            const items = ItemCtrl.getItem();

            if (items.length > 0) {

                UICtrl.populateItems(items);

                UICtrl.showTotalMoney(totalMoney);
            }

            loadEventListeners();
        }

    }

})();

App.start();


