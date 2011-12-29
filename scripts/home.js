/**
 * Created by JetBrains WebStorm.
 * User: IE User
 * Date: 12/29/11
 * Time: 1:32 PM
 * To change this template use File | Settings | File Templates.
 */

<!--TODO: Somehow iterate through setting up spinners (by class?)-->
<!--TODO: Wire this shit up to nowjs to communicate between sessions-->
<!--TODO: Update cart section of banner, build lil' mouseover thingie-->
<!--TODO: Implement jGrowl in sendmessage-->
jQuery().ready(function($) {
    $('#spinner1').spinner({ min: 0, max: 99 });
    $('#spinner2').spinner({ min: 0, max: 99 });
    $('#spinner3').spinner({ min: 0, max: 99 });
    $('#spinner4').spinner({ min: 0, max: 99 });
    $('#spinner5').spinner({ min: 0, max: 99 });
    $('#spinner6').spinner({ min: 0, max: 99 });

    /*Liono*/
    $('#addLiono').click(function(){
        var quantity=parseInt($('#spinner1').val());
        addtocart(quantity,liono);
        return false;
    });
    $('#removeLiono').click(function(){
        var quantity=parseInt($('#spinner1').val());
        removefromcart(quantity,liono);
        return false;
    });

    /*Tygra*/
    $('#addTygra').click(function(){
        var quantity=parseInt($('#spinner2').val());
        addtocart(quantity,tygra);
        return false;
    });
    $('#removeTygra').click(function(){
        var quantity=parseInt($('#spinner2').val());
        removefromcart(quantity,tygra);
        return false;
    });

    /*Asst4*/
    $('#addAsst4').click(function(){
        var quantity=parseInt($('#spinner3').val());
        addtocart(quantity,asst4);
        return false;
    });
    $('#removeAsst4').click(function(){
        var quantity=parseInt($('#spinner3').val());
        removefromcart(quantity,asst4);
        return false;
    });

    /*Asst1*/
    $('#addAsst1').click(function(){
        var quantity=parseInt($('#spinner4').val());
        addtocart(quantity,asst1);
        return false;
    });
    $('#removeAsst1').click(function(){
        var quantity=parseInt($('#spinner4').val());
        removefromcart(quantity,asst1);
        return false;
    });

    /*Asst2*/
    $('#addAsst2').click(function(){
        var quantity=parseInt($('#spinner5').val());
        addtocart(quantity,asst2);
        return false;
    });
    $('#removeAsst2').click(function(){
        var quantity=parseInt($('#spinner5').val());
        removefromcart(quantity,asst2);
        return false;
    });

    /*Asst3*/
    $('#addAsst3').click(function(){
        var quantity=parseInt($('#spinner6').val());
        addtocart(quantity,asst3);
        return false;
    });
    $('#removeAsst3').click(function(){
        var quantity=parseInt($('#spinner6').val());
        removefromcart(quantity,asst3);
        return false;
    });
});

var liono = {displayname:'Liono - Limited Edition', itemcode:'liono',price:75};
var tygra = {displayname:'Tygra - Limited Edition', itemcode:'tygra',price:75};
var asst4 = {displayname:'Liono & Tygra Bundle', itemcode:'asst4',price:145};
var asst1 = {displayname:'Collectors Set 1', itemcode:'asst1',price:75};
var asst2 = {displayname:'Collectors Set 2', itemcode:'asst2',price:75};
var asst3 = {displayname:'Collectors Set 3', itemcode:'asst3',price:75};

var cart ={items:[],totalitems:0,totalprice:0};

function addtocart(quantity,item)
{
    if (quantity > 0)
    {
        if (cart !== null && cart !== undefined)
        {
            var existingitem = itemincart(item.itemcode);
            if  (!existingitem)
            {
                cart.items.push({quantity: quantity, item:item});
            }
            else
            {
                existingitem.quantity += quantity;
            }
            adjusttotals(quantity,item.price);
            sendmessage(quantity + " of " + item.displayname + " added to your cart.","info");
        }
        else
        {
            cart ={items:[],totalitems:0,totalprice:0};
            sendmessage("Something happened to your cart. We\'re sorry, and we got a new one for you. Please try again.","error");
        }
    }
}

function removefromcart(quantity,item)
{
    if (quantity > 0)
    {
        if (cart !== null && cart !== undefined)
        {
            var existingitem = itemincart(item.itemcode);
            if  (!existingitem)
            {
                sendmessage("There are no " + item.displayname +  "s in your cart.", "warn");
            }
            else if (existingitem.quantity < quantity)
            {
                sendmessage("You don't have that many of the " + item.displayname + " in your cart.", "warn" );
            }
            else
            {
                if (existingitem.quantity === quantity)
                {
                    var index = itemindex(item.itemcode);
                    if (index >= 0)
                    {
                        cart.items.splice(index,1);
                        sendmessage("We've removed all remaining " + item.displayname + "s from your cart.","info");
                    }
                }
                else
                {
                    existingitem.quantity -= quantity;
                    sendmessage(quantity + " of " + item.displayname + " removed from your cart.","info");
                }
                adjusttotals(-quantity,-item.price);
            }
        }
        else
        {
            cart ={items:[],totalitems:0,totalprice:0};
            sendmessage('Something happened to your cart. We\'re sorry, and we got a new one for you. Please try again.', "error");
        }
    }
}

function adjusttotals(quantity,price)
{
    cart.totalitems += quantity;
    cart.totalprice += quantity * price;
}

function itemincart(itemcode)
{
    var index = itemindex(itemcode);
    if (index === -1)
    {
        return null;
    }
    else
    {
        return cart.items[index];
    }
}

function itemindex(itemcode)
{
    for (i=0;i<cart.items.length;i++)
    {
        if (cart.items[i].item.itemcode === itemcode)
        {
            return i;
        }
    }
    return -1;
}

function sendmessage(message, style)
{
    alert(style + ": " + message);
}