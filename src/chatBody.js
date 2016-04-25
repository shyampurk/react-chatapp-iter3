$ = Jquery = require('jquery');

var React = require('react');
var ReactDOM  = require('react-dom');

var ChatBody = React.createClass({
	render:function(){
		
			var messageList = this.props.data.map(function(message,index){
				return(

				     <li className="collection-item avatar" key={index} >
				       <img src={message.avatar_url} className="circle" />
				       <span className="title">Anonymous robot #{message.uid}</span>
				       <p><i className="prefix mdi-action-alarm"></i>
				       <span className="message-date">{message.createdTime}</span><br />{message.message}
				       </p>
				     </li>		     
    );
			});

		return (
				<ul className="collection" ref="msglist">			
    				{messageList}  
    			</ul>	 	
			);
	},
  getdiv:function(){
    return ReactDOM.findDOMNode(this);
  }
});

module.exports = ChatBody;
