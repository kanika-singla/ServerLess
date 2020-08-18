const appId = "imageupload-bhrep"; // Set Realm app ID here.
    const appConfig = {
      id: appId,
      timeout: 1000,
    };
    async function run() {
    //  $('#loader').css("display","block");
      $('#images').css("display","none");
      let user;
      try {
        const app = new Realm.App(appConfig);
        const credentials = Realm.Credentials.anonymous(); // create an anonymous credential
        user = await app.logIn(credentials);
       
        const mongo = app.services.mongodb("mongodb-atlas"); // mongodb-atlas is the name of the cluster service
        const coll = mongo.db("lego-products").collection("images");
        
        var e = document.getElementById("img_cat");
        var selected_category = e.options[e.selectedIndex].value;

        items = await coll.find({category: selected_category}); // find a document where `name` == "test"
        document.getElementById("LEGO_IMAGES").innerHTML = "";
        var counter = 0; var flag=0;
        for (var i = 0; i < items.length; i++) {
          if(counter == 0) {
            $("#LEGO_IMAGES").append("<tr>");
          }
          $("#LEGO_IMAGES").append("<td><img src='"+items[i]['poster']+"' width=100% ></td>");
          counter++;
          if(counter > 2) {
            $("#LEGO_IMAGES").append("</tr>");
            counter = 0;
          }
        //  console.log(items[1]['poster']); height=100px; width=100px;
        }
       //  $('#loader').css("display","none");
         $('#images').css("display","block");
     //   $("#LEGO_IMAGES").append("<img src='https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SY1000_SX677_AL_.jpg' height='64px' width='64px'>");
       // console.dir(items);
      } finally {
        if (user) {
          user.logOut();
        }
      }
    }
   // run().catch(console.dir);
    
    function previewFile() {
        const preview = document.querySelector('img');
        const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader();

        reader.addEventListener("load", function () {
          // convert image file to base64 string
          preview.src = reader.result;
        }.bind(this), false);

        if (file) {
          reader.readAsDataURL(file);
        }
    }
    function uploadToS3() {
      console.log("calling uploadToS3");
      readFile();
      $(".file-upload-class").hide();
     // location.reload();
      //var image_data = document.getElementById("b64").innerHTML; //preview
     // console.log(image_data);
  }

     function readFile() {

      const app1 = new Realm.App(appConfig);
        const credentials1 = Realm.Credentials.anonymous(); // create an anonymous credential
        user =  app1.logIn(credentials1);

      var file    = document.querySelector('input[type=file]');
        if (file && file.files[0]) {
            
            var FR= new FileReader();
            
            FR.addEventListener("load", function(e) {
              //document.getElementById("img").src       = e.target.result; //preview
              var file_new = document.querySelector('input[type=file]').files[0];
              var fileName = file_new["name"];
              var fileType = file_new["type"];
              var bucket = 'lego-products';
              const regex = /data:image\/.*;base64,/gi;
              var base64Image = e.target.result.replace(regex,"");

               app1.functions.uploadImage(base64Image, bucket, fileName, fileType);
            }); 
            
            FR.readAsDataURL( file.files[0] );
          }
    }

    function showHide() {
      $(".file-upload-class").show();
    }
