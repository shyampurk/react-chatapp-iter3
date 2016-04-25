$ = Jquery = require('jquery');

var React = require('react');
var ReactDOM  = require('react-dom');

var ChatForm = React.createClass({
	
	handleSubmit:function(e)
	{
		e.preventDefault();
		var message = this.refs.Message.value.trim();
		var time = new Date().getTime(),
		date = new Date(time),
		datestring = date.toUTCString().slice(0, -4);
		var avatar_url = "http://robohash.org/" + this.props.user + "?set=set2&bgset=bg2&size=70x70";
		var UUID = this.props.user;
		if(!message){
			return;
		}
		this.props.onMessageSubmit({message: message,createdTime:datestring,avatar_url:avatar_url,uid:UUID});
        this.refs.Message.value='';
        return;	
	},
	
	render:function(){
			var UUID = this.props.user;
			var avatar_url = "http://robohash.org/" + this.props.user + "?set=set2&bgset=bg2&size=70x70";
		return (
				<footer className="teal">
					<form  className="container" onSubmit= {this.handleSubmit}>
			       <div className="row">
			         <div className="input-field col s10">
			           <i className="prefix mdi-communication-chat"></i>
			           <input type="text" placeholder="Type your message" ref="Message
			           "/>
			           <span className="chip left">
			             <img src={avatar_url} />
			            Anonymous robot #{UUID}
			           </span>
			         </div>
			         <div className="input-field col s2">
			           <button  id="btn" type="submit" className="waves-effect waves-light btn-floating btn-large">
			             <i className="mdi-content-send"></i>
			           </button>
			         </div>
			       </div>
			      </form>
				</footer>
			);
	}
});

module.exports = ChatForm;
