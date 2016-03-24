var app = angular.module('Shopkare', ['ui.router','courier_medicine']);

    app.config(function($stateProvider, $urlRouterProvider) {
         $urlRouterProvider.otherwise('/main/home');

         $stateProvider
         .state('app',{
          url:'/app',
          templateUrl:'templates/index1.html'
         })
        .state('/courier',{
          url:'/courier',
          templateUrl:'templates/courier.html',
	  controller:'courierCtrl'	 
	 })
        .state('/medicines',{
          url:'/medicines',
          templateUrl:'templates/medicine.html',
      	 controller:'courierCtrl'
           })
         .state('main',{
          url:'/main',
          templateUrl:'templates/main.html'
         })
         .state('main.slider',{
          url:'/slider',
          views:{
            'slider':{
            templateUrl:'templates/slider.html'
              }
            }
           })
       
         .state('main.leftAdd',{
          url:'/adds',
          views:{
            'leftAdd':{
              templateUrl:'templates/leftAdds.html'    
            }
          }
         })
         .state('main.indexProd',{
          url:'/productsIndex',
          views:{
            'indexProducts':{
              templateUrl:'templates/indexProduct.html'    
            }
          }
         })
         .state('main.home',{
          url:'/home',
          views:{
            'leftAdd':{
              templateUrl:'templates/leftAdds.html'    
            },
            'slider':{
                templateUrl:'templates/sliderPrev.html'    
            },
            'indexProducts':{
              templateUrl:'templates/indexProduct.html'    
            }
          }
         })
         .state('main.products',{
          url:'/products',
          views:{
            'slider':{
              templateUrl:'templates/shop.html'
            },
            'menuOtherOption':{
              templateUrl:'templates/menuBottom.html'
            }
          }
         })

	  .state('main.search',{
          url:'/search',
          views:{
            'slider':{
              templateUrl:'templates/shop.html'
         	   }
              }
       	   })

	 .state('main.pdetails',{
            url:'/pdetails/:pID',
            views:{
              'slider':{
                templateUrl:'templates/productdetails.html'
              }
            },
           
	   controller: function($scope, $stateParams) {
            var p = $stateParams.pID;
            $scope.ProductDT=JSON.parse(p);

              $scope.addCart=function(id,k){
                var pic=$scope.ProductDT.images[0].replace(/%/g,"/");
                for(var po=0;po<pic.length;po++){      
                  if(pic[po]=='/'){
                    pic=pic.slice(0,po+1)+pic.slice(po+3);    
                  }
              }
               
                var picCart=Array();
                picCart.push(pic);
                console.log(pic);
                console.log(id);
                var z=[ picCart , id.product_name , id.Qwt[k] , id.Qrs[k], id.description,1 ]; 
                console.log(z);
                var Quantities=id.Quantity[0].Quantities;
                var selectedQunatity=id.Quantity[0].Quantities[k];
                var productindex=Quantities.indexOf(selectedQunatity);
                console.log(productindex);
                var y=[];
                var storedData = localStorage.getItem("product");
                if (JSON.parse(storedData)){
                  y= JSON.parse(storedData);
                }
                y.push(z);
                localStorage.setItem("product",  JSON.stringify(y));
                $scope.ProductDT.cart[k]="Added in Your Cart";
                
                if(localStorage.setItem("product",  JSON.stringify(y))){
                  $scope.message="Item Added SuccessFully";
                  
                }
                };


            }
             
          })
/*         .state('main.menu.home',{
          url:'/home',
          views:{
            'hotdeals':{
                templateUrl:'templates/hotdeals.html'    
            },
            'categorywise':{
              templateUrl:'templates/bestcategoryProducts.html'
            },
            'featured':{
              templateUrl:'templates/featured.html'
            },
            'recommended':{
              templateUrl:'templates/recommended.html'
            }
          }
        })  */
         .state('checkout',{
          url:'/checkout',
          templateUrl:'templates/checkout.html'
         })
         .state('cart',{
          url:'/cart',
          templateUrl:'templates/cart.html'
         })
         .state('contactus',{
          url:'/contactus',
          templateUrl:'templates/contact-us.html'
         })
         /* .state('product',{
          url:'/product',
          templateUrl:'templates/shop.html'
         })
          .state('product.menu',{
          url:'/a',
          templateUrl:'templates/rightmenu.html'
         }) */
       });

app.controller('HEADctrl',['$scope','$state','$http','$window',function($scope,$state,$http,$window){
console.log("Controller HEader");
$scope.ldata={};
$scope.rdata={};
$scope.messageLogin="";
//   var base = 'http://127.0.0.1:5000';
var base = 'http://shopkare.com';
$scope.login=false;
$scope.CartProductsCheck=true;


var cartDATA=localStorage.getItem("product");
cartDATA=JSON.parse(cartDATA);
$scope.COUNTcartItems=cartDATA.length;
var userData = localStorage.getItem("SHOPKAREuser");
if (JSON.parse(userData)){
  y= JSON.parse(userData);
  $scope.login=true;
}
$scope.level1Categories=[];
var categories = [];
var level1keys= [];
$scope.level2CategoriesWTF=[];
$scope.level2Categories=[];
$scope.level3Categories=[];   
  
    

    $http.post(base+'/api/Admin/reteriveCategories/')
    .success(function(data){
              categories = data;
              level1keys = Object.keys(data)
              for (key in level1keys)
              {
                level1keys[key] = data[key]._id;
                if(data[key]._id=='Grocery'){
                   $scope.level1Categories.push(data[key]._id); 
                   var obj=data[key].Categories;
                  for(x in obj){
                       result = Object.keys(obj[x]); 
                       var z=obj[x];
                       for(var t in z){
                           $scope.level3Categories.push(z[t]);
                       }
                       $scope.level2Categories.push(result[0]);
                  }         
                }
              }
              for (var z in $scope.level2Categories){
                $scope.level2CategoriesWTF.push(($scope.level2Categories[z].replace(/\s/g,'')));
              }
             $scope.categories = categories;
      })
  .error(function(err){
      console.log(err);
  });



    $http.get(base+'/api/Product/getNewProducts/?level1Category=Grocery&MainCategory=Cereals&SubCategory=othercereals')
    .success(function(data){
              console.log(data);
             /* categories = data;
              level1keys = Object.keys(data)
              for (key in level1keys)
              {
                level1keys[key] = data[key]._id;
                if(data[key]._id=='Grocery'){
                   $scope.level1Categories.push(data[key]._id); 
                   var obj=data[key].Categories;
                  for(x in obj){
                       result = Object.keys(obj[x]); 
                       var z=obj[x];
                       for(var t in z){
                           $scope.level3Categories.push(z[t]);
                       }
                       $scope.level2Categories.push(result[0]);
                  }         
                }
              }
              for (var z in $scope.level2Categories){
                $scope.level2CategoriesWTF.push(($scope.level2Categories[z].replace(/\s/g,'')));
              }
             $scope.categories = categories;
      */})
  .error(function(err){
      console.log(err);
  });

	$http.get(base+'/api/Product/getRandomProducts/?level1category=Grocery').	success(function(response){
	console.log(response);
	})
	.error(function(response){
	console.log(response);
	});



      $scope.searchOperation=function(){
        console.log($scope.searchKey);
	$http.post(base+'Url?pid='+$scope.searchKey)
	.success(function(data){
		console.log(data);
	})
	.error(function(response){
	console.log(response);
	});


      }







        $scope.postldata=function(){
       
        $scope.ldata['Mobile']="";
        console.log(JSON.stringify($scope.ldata));
        $http.post(base+'/api/Customer/login/?user='+JSON.stringify($scope.ldata))
        .success(function(response){
          console.log(response);
          console.log($scope.ldata);
          $scope.messageLogin=response; 
          if(response=='Login Success'){
            $scope.login=true;
            localStorage.setItem("SHOPKAREuser",  JSON.stringify($scope.ldata));
            if(localStorage.setItem("SHOPKAREuser",  JSON.stringify($scope.ldata))){
            $window.location.href = 'home.html';
          return true;
          }         
        }
        })
        .error(function(response){
          console.log(response);
        });
      };



      $scope.postrdata=function(){
        $scope.messageSignUP="";
         $scope.messagePASSWORD="";
        if($scope.rdata.Password != $scope.password2){
          $scope.messagePASSWORD="Password Doesnt match..!! Try Again";
          return false;
        }
        $http.post(base+'/api/Customer/signup/?user='+JSON.stringify($scope.rdata))
        .success(function(response){
          console.log(response);
          $scope.messageSignUP=response;
          $scope.login=true;
        })
        .error(function(response){
          console.log(response);
        });
      };



      $scope.logOUT=function(){
        $http.get(base+'/api/Customer/logout')
        .success(function(response){
          console.log(response);
          $scope.messageLOGOUT=response;
          localStorage.removeItem("SHOPKAREuser");
          alert(response);
          $scope.login=false;
          $scope.ldata={};
          $scope.rdata={};
          $scope.messageLogin="";
          $scope.messageSignUP="";
            
         })
        .error(function(response){
          console.log(response);
        });

      };





        $scope.GETProducts=function(c1,c2){
          var category1=c1;
          var category2=c2;
          $scope.products=[];
          
         var storedData = localStorage.getItem("product");
              if (JSON.parse(storedData)){
                  storedData= JSON.parse(storedData);
                  console.log(storedData);
                  if(storedData.length>0){
                    $scope.CartProductsCheck=false;  
                  }
                  
              }

        $http.get("http://shopkare.com/api/Product/getCategoryProducts/?level1Category=Grocery&MainCategory="+category1+"&SubCategory="+category2)
        .success(function(response){
          $scope.Pindex=0;  
          $scope.prodt=response;
          for(var i in $scope.prodt){
              $scope.prodt[i]['Qwt']=[];
              $scope.prodt[i]['Qrs']=[];
              $scope.prodt[i]['cart']=[];
	      $scope.prodt[i]['Availablity']=[];
	$scope.prodt[i]['orgPrice']=[];
	$scope.prodt[i]['discount']=[];
              var QArray=JSON.parse(JSON.stringify($scope.prodt[i].Quantity[0].Quantities));
	console.log(QArray);            
  for(var z in QArray) {
                $scope.prodt[i]['Qwt'].push(QArray[z].Quantity[0]);
                $scope.prodt[i]['Qrs'].push(QArray[z].Quantity[1]);
		$scope.prodt[i]['Availablity'].push(QArray[z].Quantity[4]);
 		$scope.prodt[i]['orgPrice'].push(QArray[z].Quantity[2]);
		$scope.prodt[i]['discount'].push(QArray[z].Quantity[3]);
                $scope.prodt[i]['cart'].push("Add to Cart"); 
              }


            $scope.products.push($scope.prodt[i]);  
            
         
          }
          if(storedData.length>0){
          for(var z in storedData){
                for(var i in $scope.products){
                     if($scope.products[i].product_name==storedData[z][1]){
                               for(var x in $scope.products[i].Qwt){
                                   if($scope.products[i].Qwt[x]==storedData[z][2]){
                                      $scope.products[i]['cart'][x]="Already in Cart";
                                   }
                                   
                               }
                        }
                     }
                }
          }
        
              
          if(response.length=0){
            $scope.message="No items Found";
          }
            if($scope.products.length>0){
              $scope.NO_PAGES=[];
              var x=$scope.products.length/18;
              if(x % 1 != 0){
                x=parseInt(x);
                x++;
                  console.log(x); 
                for(var z=0; z<x; z++){
                 $scope.NO_PAGES.push(z);   
                }
              }
            }
       
        })
        .error(function(response){
          console.log(response);
        });
      };



 $scope.pdetail=function(id){
        console.log(id);
        $state.go('main.pdetails',{pID:JSON.stringify(id)});
      }



        $scope.setIndexp=function(id){

            console.log(id);
            $scope.Pindex=id*18;
            console.log($scope.Productsindex);
        }

$scope.addCart=function(id,k){        
        for(var i in $scope.products){
            if (id.product_name == $scope.products[i].product_name) {
            $scope.products[i].cart[k]="Added in Your Cart";
          }
        }
        var z=[ id.images , id.product_name , id.Qwt[k] , id.Qrs[k], id.description,1 ]; 
        var Quantities=id.Quantity[0].Quantities;
        var selectedQunatity=id.Quantity[0].Quantities[k];
        var productindex=Quantities.indexOf(selectedQunatity);
        console.log(productindex);
        var y=[];
        var storedData = localStorage.getItem("product");
        if (JSON.parse(storedData)){
          y= JSON.parse(storedData);
        }
        y.push(z);
        localStorage.setItem("product",  JSON.stringify(y));
        if(localStorage.setItem("product",  JSON.stringify(y))){
          $scope.message="Item Added SuccessFully";
        }
	$scope.COUNTcartItems=$scope.COUNTcartItems+1;
        };


}]);


app.controller('cartItems',['$scope','$http',function($scope,$http){
$scope.message=false;
$scope.Products=[];
var storedData = localStorage.getItem("product");

if(JSON.parse(storedData)){
  $scope.CartProducts = JSON.parse(storedData);
  for(var i in $scope.CartProducts){
    console.log($scope.CartProducts[i]);
    $scope.Products.push($scope.CartProducts[i]);  
  }

  console.log($scope.Products);
  if($scope.CartProducts.length!=0){
    $scope.message=true;
  }  
}


$scope.removeFromcart=function(id,index){

var storedData = localStorage.getItem("product");
console.log(JSON.parse(storedData));
$scope.CartProducts = JSON.parse(storedData);
$scope.CartProducts.splice(index,1);
localStorage.setItem("product",  JSON.stringify($scope.CartProducts));
$scope.Products.splice(index,1);
console.log($scope.Products.length);
if($scope.Products.length==0){
  $scope.message=false;
}
$scope.COUNTcartItems=$scope.COUNTcartItems-1;
console.log($scope.COUNTcartItems);

};
$scope.addQuantity=function(id,index){
  $scope.Products[index][5]=id+1;
  localStorage.setItem("product",  JSON.stringify($scope.Products));  
}
$scope.subQuantity=function(id,index){
  $scope.Products[index][5]=id-1;
  localStorage.setItem("product",  JSON.stringify($scope.Products));  
 }
}]);



app.controller('checkout',['$scope','$http','$window',function($scope,$http,$window){
      $scope.messageEmptyCart=false;
      $scope.checkoutMessage=false;
      if(!$scope.login){
           $window.location.href = 'home.html';
      }
      $scope.order={};
      var storedData =localStorage.getItem("product");

        if(storedData){
          $scope.order.CartProducts=[];
          $scope.order.CartProducts.push(JSON.parse(storedData));
          $scope.messageEmptyCart=false;
           $scope.acTiveButton=true;
           $scope.TotalPrice=0;
          for(var i in $scope.order.CartProducts){
           for(var x in $scope.order.CartProducts[i]){             
              $scope.TotalPrice=$scope.TotalPrice+($scope.order.CartProducts[i][x][3] * $scope.order.CartProducts[i][x][5]);        
              }
           }
        }

        else{
         $scope.messageEmptyCart=true; 
        }

      $scope.checkOutFunction=function(){
        console.log("function called");
           localStorage.removeItem("product");
        $scope.checkoutMessage=true;
      }

}]);


app.controller('HOT_DEALS',['$scope','$http',function($scope,$http){

}]);

app.controller('NEW_RELEASES',['$scope','$http',function($scope,$http){

}]);




app.controller('productBycategory',['$scope','$http', function($scope,$http){ 
var cart_Items=[];
$scope.getProducts=function(id){
  console.log(id);
 /* $http.post("url?category="+$scope.tab)
  .success(function(data){
    $scope.products=data;
    console.log("Data Available");
  })
  .error(function(response){
    console.log(response);
  });*/
};

}]);





    
    
   
 
 
   
  
   
   






 

          

 

