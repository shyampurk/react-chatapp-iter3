var React = require('react');
$=jQuery = require('jquery');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var NotificationSystem = require('react-notification-system');
var ChatBody = require('./chatBody');
var ChatForm = require('./chatForm');
 var UUID = Math.floor(Math.random()*90000) + 10000;

var Onlineuser = React.createClass({
    render:function(){
      
      var avtarList = this.props.userslist.map(function(url,index){
        return (<li key={index} >
                 <img src={url} className="circle" />
                </li>
          );
      });

      return ( 
            <div className="online-user-list">
  <div className="online-users-number valign-wrapper">
    <i className="material-icons">people</i><span className="valign">{this.props.occupancy}online </span>    
  </div>
  <ul>
   {avtarList}
  </ul> 
</div>

        );
    }
});




var Notify = React.createClass({

    render:function(){
      return (
        <div className="" >
        { this.props.showResults ? <Results text={this.props.text} /> : null }
        </div>
      );
    }
});

var Results = React.createClass({
    render: function() {
        var notif;
         if (this.props.text === "Loading"){
              notif = <div id="results" className="ngn ngn-success">
               Loading New Mesages .......
            </div>
          }
            else if(this.props.text === "AllMessagesFetched"){
            notif = 
                        
            <div id="results" className="ngn ngn-info">

               No More Messages To Fetch....
            </div>           
             }  
             else if (this.props.text === "ItDis"){
              notif = <div id="results" className="ngn ngn-warning">
               Internet Disconnected Trying to Reconnect
            </div>
             }
             else 
              notif = <div id="results" className="ngn ngn-info">
               Internet Connected..
            </div>
             

        return (
        <div>
            {notif}
            </div>
        );
    }
});

var Main = React.createClass({
pubnub:function(){
return PUBNUB.init({                         
    publish_key   : `pub-c-655bcfed-5800-4602-8eca-e0a4668b5252`,
    subscribe_key : 'sub-c-67535ca4-fba2-11e5-8b0b-0619f8945a4f',
    uuid: UUID,
          origin: 'pubsub.pubnub.com',
          ssl: true,
          heartbeat: 40,
          heartbeat_interval: 20
});
},
  _notificationSystem: null,
   scrolling:function (){
      {        var $win = $('.collection');
                var prevScrollHeight = $win.get(0).scrollHeight-$win.innerHeight();
                 if ($win.scrollTop() == 0)
                 {

                    if(this.state.allMessagesFetched)
                    {
                      this.setState({text:'AllMessagesFetched',showResults:true});
                       setTimeout(()=>this.showstate(),2000);

                    }
                    else
                    {    this.setState({text:'Loading',showResults:true})
                        this.his(prevScrollHeight);
                    }
                  } 
             }
    },

    getInitialState: function()
    {
    return {data: [],user:UUID,errors:'',start:'',allMessagesFetched:false, text:'' ,showResults: false,occupancy:'',userslist :[]};
    },
showstate:function(){
this.setState({showResults:false});
},
	scrollDown:function(time)
  { 
    
	 var element = $('.collection');
        element.animate({
            scrollTop: element.get(0).scrollHeight
        }, time);
    },  
  scrollmiddle:function(time,scrollheight)
  { 
   var element = $('.collection');
        element.animate({
            scrollTop:scrollheight
        }, time);
    },  
online:function(){
 this.pubnub().here_now({
                channel: 'chat_channel',
                state: true,
                callback: function(msg) {
                  console.log(msg,"here_now data");
                }.bind(this)
            } );
}, 

	 sub:function(){
    this.setState({text:'',showResults:false});
	 	this.pubnub().subscribe({
		  channel: 'chat_channel', 
      triggerEvents: true,
      noheresync: true,
       presence: function(m){
        if(m.action === 'join'){
          var users = this.state.userslist;
          this.setState({occupancy:m.occupancy});
          var avatar_string =  "http://robohash.org/" + m.uuid + "?set=set2&bgset=bg2&size=70x70";

          if (!(users.indexOf(avatar_string) > -1)) {
                 var newusers = users.concat(avatar_string);
                 this.setState({userslist:newusers});
                 console.log(this.state.userslist,"before ");
              }
      }
       else if( m.action === 'timeout' || m.action === 'leave' ){
         var users = this.state.userslist;
         this.setState({occupancy:m.occupancy});
          var avatar_string =  "http://robohash.org/" + m.uuid + "?set=set2&bgset=bg2&size=70x70";
          var index = users.indexOf(avatar_string);
              var op = users.splice(index, 1);
              console.log(op,"after removing");
          }
}.bind(this), 
      disconnect : function() {   
         // this.setState({text:'ItDis',showResults:true});
         this.refs.notificationSystem.addNotification({
      message: 'Internet Disconnected ',
      position:'tc',
      dismissible:false,
      uid:20,
      level: 'error'
    });
    }.bind(this),
    reconnect  : function()
    {  
       this.refs.notificationSystem.addNotification({
      message: 'Internet Connected',
      position:'tc',
      dismissible:false,
      uid:20,
      level: 'info'
    });
        // this.setState({text:'Connected',showResults:true});
    }.bind(this),
		  message : function (message, channel) {
		  	var messages = this.state.data;
    			var newMessages = messages.concat([message]);
     		 	this.setState({data:newMessages});
     		 	this.scrollDown(400);
   			 }.bind(this),
		    error: function (error) {
		      console.log(JSON.stringify(error));
		    }.bind(this),
 		});
	 },

   his:function(scrollheight){
    var defaultMessagesNumber = 20;
    var starttime= this.state.start;
    this.pubnub().history({
    channel : 'chat_channel',
    count : defaultMessagesNumber,
    reverse: false,
    start:starttime,
    callback : function(m){

          var messages = this.state.data;
          var another = m[0].concat(messages);
          this.setState({data:another,start:m[1],showResults:false});
          if(m[0].length < defaultMessagesNumber)
        {
          this.setState({allMessagesFetched:true});
        }
        if(scrollheight)
        {
          this.scrollmiddle(400,scrollheight)
        }
        else
        {
          this.scrollDown(400);
        }
        }.bind(this),
        error: function(m){
        deferred.reject(m)
     },
  });
   },

	 pub:function(message){
		this.pubnub().publish({
    		channel: 'chat_channel',        
    		message: message,
    		callback : function(m){
    			 // console.log(m);
    		}.bind(this)
		});
	 },

	handleMessageSubmit :function(message){
	var messages = this.state.data;
    var newMessages = messages.concat([message]);
     this.pub(message);
	},

componentDidMount: function()
  {
    this.sub();
    this.his();
    this.online();
     this.refs.chatbody.getdiv().addEventListener("scroll",_.debounce(this.scrolling,250));
  },

  componentWillUnmount: function()
  {
 this.refs.chatbody.getdiv().removeEventListener("scroll",_.debounce(this.scrolling,250));
  },

 render:function(){
   
		return (
				<div >
        <Onlineuser occupancy={this.state.occupancy} userslist={this.state.userslist}/>
        <NotificationSystem ref="notificationSystem" />
        <Notify text={this.state.text}  showResults={this.state.showResults}/>
				<ChatBody data ={this.state.data} ref="chatbody"/>
				<ChatForm onMessageSubmit={this.handleMessageSubmit} user = {this.state.user}  />
				</div>
			);
	}
});

module.exports = Main;
/*

             var newusers = users.concat(avatar_string);
          this.setState({userslist:newusers});
          console.log(this.state.userslist,"before ");
*/