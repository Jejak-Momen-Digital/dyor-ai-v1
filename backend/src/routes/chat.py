from flask import Blueprint, request, jsonify
from src.services.agent_service import AgentService

chat_bp = Blueprint('chat', __name__)
agent_service = AgentService()

@chat_bp.route('/chat/send', methods=['POST'])
def send_message():
    """Send a message to the AI agent"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Process message with agent service
        response = agent_service.process_message(message)
        
        return jsonify({
            'success': True,
            'response': response
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/chat/history', methods=['GET'])
def get_chat_history():
    """Get chat history"""
    try:
        history = agent_service.get_chat_history()
        return jsonify({
            'success': True,
            'history': history
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/agent/status', methods=['GET'])
def get_agent_status():
    """Get current agent status"""
    try:
        status = agent_service.get_status()
        return jsonify({
            'success': True,
            'status': status
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

