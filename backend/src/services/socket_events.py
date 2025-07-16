from flask_socketio import emit, disconnect
from src.services.agent_service import AgentService
import asyncio

# Global agent service instance
agent_service = AgentService()

def register_socket_events(socketio):
    """Register all socket events"""
    
    @socketio.on('connect')
    def handle_connect():
        """Handle client connection"""
        print('Client connected')
        emit('connected', {'status': 'Connected to Dyor AI'})
        
        # Send current agent status
        status = agent_service.get_status()
        emit('agent_status', status)
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle client disconnection"""
        print('Client disconnected')
    
    @socketio.on('send_message')
    def handle_message(data):
        """Handle incoming message from client"""
        try:
            message = data.get('message', '')
            if not message:
                emit('error', {'message': 'Empty message received'})
                return
            
            # Emit thinking status
            emit('agent_status_update', {'status': 'thinking'})
            
            # Process message
            response = agent_service.process_message(message)
            
            # Emit response
            emit('message_response', response)
            
            # Emit updated status
            status = agent_service.get_status()
            emit('agent_status_update', status)
            
        except Exception as e:
            emit('error', {'message': str(e)})
    
    @socketio.on('get_history')
    def handle_get_history():
        """Handle request for chat history"""
        try:
            history = agent_service.get_chat_history()
            emit('chat_history', {'history': history})
        except Exception as e:
            emit('error', {'message': str(e)})
    
    @socketio.on('get_status')
    def handle_get_status():
        """Handle request for agent status"""
        try:
            status = agent_service.get_status()
            emit('agent_status', status)
        except Exception as e:
            emit('error', {'message': str(e)})
    
    @socketio.on('clear_history')
    def handle_clear_history():
        """Handle request to clear chat history"""
        try:
            agent_service.clear_history()
            emit('history_cleared', {'success': True})
            
            # Send updated status
            status = agent_service.get_status()
            emit('agent_status', status)
        except Exception as e:
            emit('error', {'message': str(e)})
    
    @socketio.on('agent_action')
    def handle_agent_action(data):
        """Handle agent action updates (for real-time feedback)"""
        action_type = data.get('type', '')
        action_data = data.get('data', {})
        
        # Broadcast action to all connected clients
        emit('agent_action_update', {
            'type': action_type,
            'data': action_data,
            'timestamp': agent_service.get_status()['last_activity']
        }, broadcast=True)

