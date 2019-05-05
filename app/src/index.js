import Web3 from "web3";
import $ from "./jquery.min.js";
import createDegreeJson from "../../build/contracts/createDegree.json";
import degreeJson from "../../build/contracts/degree.json";


const App = {
  web3: null,
  account: null,
  degreer: null,
  creater: null,
  accounts:null,
  info: ["school","major","name","date","year","type"],
  blockNetwork:null,
  list:["null"],

  start: async function() {

    const { web3 } = this;

    try {
      
      // console.log(now);
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const createrNetWork = createDegreeJson.networks[networkId];
      this.creater = new web3.eth.Contract(
        createDegreeJson.abi,
        createrNetWork.address,
      ); 
      this.blockNetwork = createrNetWork.address;
      // web3.eth.getBlock("latest", false, (error, result) => {this.gasMax = result.gasLimit});
      // alert(this.gasMax);
      
      $("#address").html("Localhost:8545");

      // get accounts
      this.accounts = await web3.eth.getAccounts();
      if(document.cookie=="0"){
        $("#login").text("Log Out");
        $("#pass").hide();
        $("#createDiv").show();
        this.account = this.accounts[0];
        $("#status").html("ADMIN");
        this.readEvent();
        $("#content").hide();
      }
      else{
        this.account="GUESS";
        $("#status").html("GUESS");
      }
      this.showTableDegree();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }

  },
  addressHover: function(){
    $("#address").html(this.blockNetwork);
    $("#status").html(this.account);
  },
  addressOut: function(){
    $("#address").html("Localhost:8545");
    if(this.account!=="GUESS"){
      $("#status").html("ADMIN");  
    }
    else $("#status").html("GUESS");
  },

  login: async function(){
    const { adminpass } = this.creater.methods;
    const passwd = await adminpass().call();
    // var passwd ="admin";
    var pass = $("#pass");
    if(document.cookie=="0"){
      document.cookie = "0; expires= Thu, 21 Aug 2014 20:00:00 UTC"
      location.reload();

    }
    if(pass.css("display")=="none" &&document.cookie!="0"){
      pass.show();
      $("#login").html("Login");
    }
    else{
      if(pass.val() ===passwd){
        document.cookie ="0";
        location.reload();
      }
      else {
        location.reload();
        alert("PassWord is not pair!!");
      }
    }
    
  },

  searchFunction: async function(){
    var table = $('#searchResult');
    table.show();
    var search = $('#Search');
    search.html("");
    var selectValue = $("#selectValue").val();
    var textValue = $("#textValue").val();
    
    switch(selectValue){
      case "2":var n = 2;break;
      case "3":var n = 3;break;
      case "4":var n = 4;break;
      case "6":var n = 6;break;
    }
    for(var i=1;i<this.list.length;i++){
      if(this.list[i][n]==textValue){
        var Template = "<tr onClick='App.getInfo("+i+",2)'><td>"+this.list[i][2]+"</td><td>" + this.list[i][3] + "</td><td>" + this.list[i][4] + "</td><td>" + this.list[i][6] + "</td><td>"+ this.list[i][7] +"</td></tr>"
        search.append(Template);
      };
    };


  },

  getInfo: function(i,placeClick){
    // alert(placeClick);
    if(placeClick=="1"){
      $("#moreInfo").show();
      $("#content").hide();
    }
    else{
      $("#moreInfo").show();
      $("#searchResult").hide();
    }
    $(placeClick).show();
    $(placeClick).hide();
    $("#2").text(this.list[i][2]);
    $("#3").text(this.list[i][3]);
    $("#4").text(this.list[i][4]);
    $("#5").text(this.list[i][5]);
    $("#6").text(this.list[i][6]);
    $("#7").text(this.list[i][7]);
  },

  exitClick: function(){
    if(this.account==="GUESS"){
      $("#moreInfo").hide();
      $("#content").show();
    }
    else{
      $("#moreInfo").hide();
      $("#searchResult").show();
    }
    // $("#moreInfo").hide();
    // location.reload();
  },


  showTableDegree: async function() {
      var table = $('#Results');
      const { degreeCount } = this.creater.methods;
      const { degrees } = this.creater.methods;
      const count = await degreeCount().call();
      
      for (var i = 1; i <= count; i++) {
        var degree = await degrees(i).call();
        this.list.push(degree);
        var school = degree[2];var major = degree[3];
        var name = degree[4];
        var birthday = degree[5];var year = degree[6];;var type = degree[7];
        var Template = "<tr onClick='App.getInfo("+i+",1)'><th>"+i+"</th><td>" + school + "</td><td>" + major + "</td><td>" + name + "</td><td>"+ year +"</td></tr>"
        table.append(Template);
      }
  },


  createDegree: async function() {
    this.info[0] = $("#school").val();
    this.info[1] = $("#major").val();
    this.info[2] = $("#name").val();
    this.info[3] = $("#date").val();
    this.info[4] = $("#year").val();
    this.info[5] = $("#typep").val();

    var d = new Date();
    var now = d.getUTCDate()+"/"+d.getUTCMonth()+"/"+d.getFullYear()+" "+d.getUTCHours()+":"+d.getUTCMinutes()+":"+d.getUTCSeconds();

    const { newDegree } = this.creater.methods;
    // console.log(this.account,this.info[0],this.info[1],this.info[2],this.info[3],this.info[4],this.info[5]);
    const a = await newDegree(this.account,this.info[0],this.info[1],this.info[2],this.info[3],this.info[4],this.info[5],now).send({from:this.account, gas:1000000});
    location.reload();

  },

  readEvent: async function(){
    const { createLog } = this.creater.events;
    var log =  createLog({},{
      fromBlock: 0, toBlock: 'latest' },
      function(error, event){
        var fee =1000000-event.returnValues[1];
        $("#log").append("<tr><td>"+event.returnValues[2]+"</td><td>"+event.returnValues[0]+"</td><td>"+fee+"</td>"+"<td>"+event.returnValues[3]+"</td></tr><br>");
      })
      $("#transactionLog").show();
  },

};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use createrMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/5990c3f61e694c5c8028e6004657598f"),
    );
  }

  App.start();
});
