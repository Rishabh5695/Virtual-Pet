var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed,lastFed,feedTime;
//create feed and lastFed variable here


function preload(){
sadDog=loadImage("sadrabbit.jpg");
happyDog=loadImage("happyrabbit.jpg");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.11;

  //create feed the dog button here
  feed=createButton("Feed The Rabbit");
  feed.position(680,95);
  feed.mousePressed(feedDog);


  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(255);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedTime = database.ref("FeedTime")
  feedTime.on("value",function(data){
    lastFed=data.val()
  })
 
  //write code to display text lastFed time here
fill("red")
textSize(15)
if(lastFed>=12){
  text("Last Fed " + lastFed%12 + "PM",350,30)
}
else if(lastFed===0){
  text("Last Fed 12 AM",350,30)
}
else{
  text("Last Fed " + lastFed + "AM",350,30)
}
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
dog.scale = 1
  //write code here to update food stock and last fed time
  var foodstockvalue = foodObj.getFoodStock()
  if(foodstockvalue<=0){
    foodObj.updateFoodStock(foodstockvalue*0)
  }
  else{
    foodObj.updateFoodStock(foodstockvalue-1)

  }
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour() //will read the ime i.e the hour from your computer
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
